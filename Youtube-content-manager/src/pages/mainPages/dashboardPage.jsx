import React, { useState } from 'react'
import './dashboardPage.css'
import Header from '../../layouts/header'
import Addcontent from './addContent'

const DashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [viewClicked, setViewClicked] = useState(false);
    
    const handleEdit = (item, view = false) => {
        setEditItem(item);
        setViewClicked(view); // Set view mode based on parameter
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditItem(null); // Reset edit item when closing
        setViewClicked(false); // Reset view mode when closing
    }

    const handleAddContent = () => {
        setEditItem(null); // Ensure no edit item when adding new
        setViewClicked(false); // Ensure not in view mode when adding new
        setIsModalOpen(true);
    }

    const data = [
        {
          id: 1,
          title: "Iran–Israel War Explained in 60 Seconds",
          description: "Short video explaining the conflict in a simple way",
          type: "Short", // Short | Long
          category: "News",
          uploaded: false, // true = already uploaded, false = not yet
          script: "",
          hashtags: ["#worldnews", "#iran", "#israel", "#shorts"],
          thumbnailUrl: "",
          publishDate: "2026-01-25",
          publishTime: "18:30",
          platform: "YouTube",
          videoUrl: "",
          createdBy: "Nuthan"
        },
        {
          id: 2,
          title: "Why People Are Losing Jobs During War",
          description: "Office and border war scenes showing economic impact",
          type: "Long",
          category: "Storytelling",
          uploaded: false,
          script: "Scene 1: Empty office...\nScene 2: War border visuals...",
          hashtags: ["#warimpact", "#jobs", "#aivideo"],
          thumbnailUrl: "https://example.com/thumbnails/job-loss-war.jpg",
          publishDate: "2026-01-27",
          publishTime: "20:00",
          platform: "YouTube",
          videoUrl: "",
          createdBy: "Nuthan"
        },
        {
          id: 3,
          title: "Calendar Time Rewinding – Cinematic Shot",
          description: "Clock rewinding fast with dramatic cinematic feel",
          type: "Short",
          category: "Cinematic",
          uploaded: true,
          script: "",
          hashtags: ["#cinematic", "#timerewind", "#shortfilm"],
          thumbnailUrl: "https://example.com/thumbnails/clock-rewind.jpg",
          publishDate: "2026-01-20",
          publishTime: "19:00",
          platform: "YouTube",
          videoUrl: "https://youtube.com/shorts/xxxxx",
          createdBy: "Nuthan"
        }
      ];
      
    return (
        <>
        <Header />
        <div className='dashboard-page'>
            
            <div className='dashboard-grid'>
            {data.map(item => {
               return( <div key={item.id} className='dashboard-card'>
                <div className='card-badge'>
                    <span className={`pill ${item.type === "Short" ? 'pill-short' : 'pill-long'}`}>{item.type}</span>
                    <span className={`pill ${item.uploaded ? 'pill-live' : 'pill-draft'}`}>{item.uploaded ? 'Uploaded' : 'Draft'}</span>
                </div>
                <div className='card-content'>
                    <h3>{item.title}</h3>
                    <p className='muted'>{item.description}</p>
                    <div className='meta'>
                        
                        <p><strong>Platform:</strong> {item.platform}</p>
                        {item.uploaded && (<p><strong>Published:</strong>{item.publishDate} at {item.publishTime}</p>)}
                        {!item.uploaded && (<p><strong>Scheduled:</strong> {item.publishDate} at {item.publishTime ? item.publishTime : ''}</p>)}
                        
                    </div>
                    
                    {item.hashtags?.length > 0 && (
                        <div className='tags'>
                            {item.hashtags.map(tag => <span key={tag}>{tag}</span>)}
                        </div>
                    )}
                    {item.uploaded && item.videoUrl && (
                        <a className='link' href={item.videoUrl} target='_blank' rel='noreferrer'>View on YouTube →</a>
                    )}
                </div>
                <div className='card-actions'>
                    {!item.uploaded && <button className='ghost danger'>
                        Delete
                    </button> }
                    <button className='ghost' onClick={() => handleEdit(item)}>
                        Edit
                    </button>
                    
                    <button className='primary' onClick={() => handleEdit(item,true)}>
                        View
                    </button>
                </div>
            </div>)
            })}
            </div>
        </div>
        <div className="add-content-button-container">
            <button className="add-content-button" onClick={handleAddContent}>
                <span className="add-content-icon">+</span>
                Add Content
            </button>
        </div>

        {isModalOpen && <Addcontent onClose={handleCloseModal} editItem={editItem} view ={viewClicked} />}

        </>
    )
}
export default DashboardPage