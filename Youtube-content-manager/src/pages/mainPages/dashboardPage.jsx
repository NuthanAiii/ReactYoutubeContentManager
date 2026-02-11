import React, { useState, useEffect } from 'react'
import './dashboardPage.css'
import Header from '../../layouts/header'
import Addcontent from './addContent'
import DeleteAlert from '../../components/deleteAlert'
import { toast } from 'react-toastify'
import { fetchData } from '../../services/apiCallSerive'
import * as apiCallSerive from '../../services/apiCallSerive';
import Pagination from '../../components/pagination';
import ContentFilter from '../../components/filter';
import { get, set } from 'react-hook-form'
import Loader from '../../components/loader'
const DashboardPage = ({ setLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [viewClicked, setViewClicked] = useState(false);
    let [data, setData] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setotalPages] = useState(1);
    
    

    // Prevent back navigation into login/welcome while user is authenticated
    useEffect(() => {
        const onPopState = () => {
            if (sessionStorage.getItem('authToken')) {
                // Keep user on the same dashboard entry
                window.history.pushState(null, '', window.location.href);
            }
        };

        // Seed the history state so the first Back triggers popstate
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);
    useEffect(() => {
        getContentData();
    }, [pageNo]);

    const handleEdit = (item, view = false) => {
        setEditItem(item);
        setViewClicked(view); // Set view mode based on parameter
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsDeleteOpen(false);
        setEditItem(null); // Reset edit item when closing
        setViewClicked(false); // Reset view mode when closing
        setDeleteItem(null);
        // Refresh content data after closing modal
        
    }

    const handleAddContent = () => {
        setEditItem(null); // Ensure no edit item when adding new
        setViewClicked(false); // Ensure not in view mode when adding new
        setIsModalOpen(true);
    }

    const handleDelete = (item) => {
       
        setIsDeleteOpen(true);
        setDeleteItem(item);
    }
   const filter = async(data) =>{
        
        getContentData(data);

   }


  

    
    const getContentData = async (reqdata) => {
        setLoading(true);
        let numberOfitemsPerPage = 8;
        let skip = (pageNo - 1) * numberOfitemsPerPage;
        let limit = numberOfitemsPerPage;
        let params = {
            skip: skip,
            limit: limit
        }; 
        
        if(reqdata){
        var data ={from_date: reqdata.startDate || null, to_date: reqdata.endDate || null, type: reqdata.type || null, status: reqdata.status || null, search: reqdata.search || null};

        }
        try {

            let res = await apiCallSerive.fetchDataWithreq('getContent',data,params );
            setData(res.data || []);
            setLoading(false);
            setotalPages(Math.ceil(res.total / numberOfitemsPerPage));

            console.log('Fetched content data:', res);

        } catch (error) {
                setLoading(false);
            console.error('Error fetching content data:', error);
        }


    }


    return (
        <>
            <Header />
            <div className='dashboard-page'>
                <ContentFilter onApply={(data)=> filter(data) } />

                {data.length === 0 ? (
              <div className="no-data-fullpage">
                <div className="no-data">
                  <div className="no-data-illustration" aria-hidden>
                    <svg width="160" height="100" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="20" width="108" height="52" rx="6" fill="rgba(15,23,42,0.6)" stroke="rgba(148,163,184,0.08)" />
                      <path d="M24 36H96" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M24 44H72" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="38" cy="54" r="6" fill="#22d3ee" />
                    </svg>
                  </div>
                  <h3>No content yet</h3>
                  <p className="muted">You don't have any content. Click below to add your first idea.</p>
                  <button className="primary" onClick={handleAddContent}>Add your first content</button>
                </div>
              </div>
            ) : (
                <>
             
              <div className='dashboard-grid'>
                
                {data.map(item => {
                  return (<div key={item.id} className='dashboard-card'>
                      <div className='card-badge'>
                          <span className={`pill ${item.type === "Short" ? 'pill-short' : 'pill-long'}`}>{item.type}</span>
                          <span className={`pill ${item.uploaded ? 'pill-live' : 'pill-draft'}`}>{item.uploaded ? 'Uploaded' : 'Draft'}</span>
                      </div>
                      <div className='card-content'>
                          <h3>{item.title}</h3>
                          <p className='muted'>{item.description}</p>
                          <div className='meta'>

                              <p><strong>Platform:</strong> {item.platform}</p>
                              {item.uploaded && (<p><strong>Published:</strong>{item.publishDate} {item.publishTime ? "at " + item.publishTime : ''}</p>)}
                              {!item.uploaded && (<p><strong>Scheduled:</strong> {item.publishDate} {item.publishTime ? "at " + item.publishTime : ''}</p>)}

                          </div>

                          {Array.isArray(item.hashtags) && item.hashtags.length > 0 && (
                              <div className="tags">
                                  {item.hashtags.map((tag, i) => (
                                      <span key={i}>{tag}</span>
                                  ))}
                              </div>
                          )}
                          {item.uploaded && item.videoUrl && (
                              <a className='link' href={item.videoUrl} target='_blank' rel='noreferrer'>View on YouTube →</a>
                          )}
                      </div>
                      <div className='card-actions'>
                          {!item.uploaded && (
                              <button className='ghost danger' onClick={() => handleDelete(item)}>
                                  Delete
                              </button>
                          )}
                          <button className='ghost' onClick={() => handleEdit(item)}>
                              Edit
                          </button>

                          <button className='primary' onClick={() => handleEdit(item, true)}>
                              View
                          </button>
                      </div>
                  </div>)
                })}
              </div>
              </>
            )}
            <Pagination
    currentPage={pageNo}
    totalPages={totalPages}
    onPageChange={(p) => setPageNo(p)}
/>
            </div>
           {data.length > 0 && (<div className="add-content-button-container">
                <button className="add-content-button" onClick={handleAddContent}>
                    <span className="add-content-icon">+</span>
                    Add Content
                </button>

            </div>)} 

            {isModalOpen && <Addcontent onClose={handleCloseModal}  refresh={getContentData} editItem={editItem} view={viewClicked} />}
            {isDeleteOpen && <DeleteAlert
                
                title="Delete content"
                message={deleteItem ? `Are you sure you want to delete \"${deleteItem.title}\"?` : 'Are you sure you want to delete this item?'}
                onClose={handleCloseModal}
                item = {deleteItem}
                refresh={getContentData}
                
                
            />}
            

        </>
    )
}
export default DashboardPage