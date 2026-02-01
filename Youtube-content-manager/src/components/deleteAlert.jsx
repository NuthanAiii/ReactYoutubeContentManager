import React from 'react'
import './deleteAlert.css'
// import * as apiCallSerive from '../../services/apiCallSerive';
import * as apiCallSerive from '../services/apiCallSerive';
import { toast } from 'react-toastify';

const DeleteAlert = ({ title = 'Confirm delete', message = 'Are you sure you want to delete this item?', onClose,item , refresh }) => {
  
    const handleDelete = async () => {
        if (!item || !item.id) return;
        try {
            await apiCallSerive.postData('deleteContent', { id: item.id });
            toast.success('Item deleted successfully');
            if (refresh) refresh();
            onClose();
        } catch (error) {
            toast.error('Failed to delete item');
            console.error('Error deleting item:', error);
        }
    }

  return (

    
    <div className="da-overlay" role="dialog" aria-modal="true">
      <div className="da-modal">
        <h3 className="da-title">{title}</h3>
        <p className="da-message">{message}</p>
        <div className="da-actions">
          <button className="ghost" onClick={onClose} >Cancel</button>
          <button className="primary" onClick={handleDelete} >Delete</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAlert
