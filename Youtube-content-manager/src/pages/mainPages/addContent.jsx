import React, { useEffect } from "react";
import './addContent.css';
import { useForm } from "react-hook-form";
import * as apiCallSerive from '../../services/apiCallSerive';
import { toast } from "react-toastify";

const Addcontent = ({ onClose ,refresh,editItem, view }) => {
    const {
        register: contentForm,
        handleSubmit: addContent,
        watch: watchContent,
        reset: resetAddContent,
        formState: { errors, isValid, touchedFields }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: '',
            type: 'Short',
            script: '',
            publishDate: '',
            publishTime: null,
            platform: 'YouTube',
            uploaded: false
        }
    });

    useEffect(() => {
        if (editItem) {
            resetAddContent(editItem);
        } else {
            resetAddContent({
                title: '',
                type: 'Short',
                script: '',
                publishDate: '',
                publishTime: null,
                platform: 'YouTube',
                uploaded: false
            });
        }
    }, [editItem, resetAddContent]);

    const onSubmit = async(data) => {
        if (view) return;
        let endPoint='';
        if (editItem) {
           endPoint = 'updateContent';

        }else{
             endPoint = 'setContent';

        }
        await apiCallSerive.postData(endPoint, data);
        if(editItem){
            toast.success('Content updated successfully');
        }
        else{
            toast.success('Content added successfully');
        }
        
        refresh();
        onClose();
        
    };

    const handleCancel = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="add-content-modal-overlay" onClick={handleCancel}>
            <div className="add-content-modal" onClick={(e) => e.stopPropagation()}>
                <div className="add-content-container">
                    <div className="form-header">
                        <p className="eyebrow">
                            {view ? 'View content' : editItem ? 'Edit content' : 'Create new content'}
                        </p>
                        <h1>{view ? 'View Content' : editItem ? 'Edit Content' : 'Add Content'}</h1>
                        <p className="subtext">
                            {view ? 'View the details of your video content entry.' : editItem ? 'Update the details of your video content entry.' : 'Fill in the details to create your video content entry.'}
                        </p>
                    </div>

                    <form onSubmit={addContent(onSubmit)} className="content-form">
                        {/* Title Field */}
                        <div className="form-group">
                            <label htmlFor="title">Title <span className="required">*</span></label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Enter video title"
                                {...contentForm('title', {
                                    required: 'Please Enter the Title',
                                    minLength: {
                                        value: 3,
                                        message: 'At least 3 characters are required for the title!'
                                    }
                                })}
                                disabled={view}
                            />
                            {touchedFields.title && errors.title && (
                            <span className="error-message">{errors.title.message}</span>
                        )}
                        </div>
                        

                        {/* Type Selection */}
                        <div className="form-group">
                            <label>Content Type <span className="required">*</span></label>
                            <div className="type-selector">
                                <label className={`type-option type-short ${watchContent('type') === 'Short' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        value="Short"
                                        disabled={view}
                                        {...contentForm('type', { required: 'Please select Type of content' })}
                                    />
                                    <span>Short</span>
                                </label>
                                <label className={`type-option type-long ${watchContent('type') === 'Long' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        value="Long"
                                        disabled={view}
                                        {...contentForm('type')}
                                    />
                                    <span>Long</span>
                                </label>
                                {touchedFields.type && errors.type && (
                                    <span className="error-message">{errors.type.message}</span>
                                )}
                            </div>
                        </div>

                        {/* Script Textarea */}
                        <div className="form-group">
                            <label htmlFor="script">Script</label>
                            <textarea
                                id="script"
                                placeholder="Enter your video script here..."
                                {...contentForm('script')}
                                rows="8"
                                disabled={view}
                            />
                        </div>

                        {/* Date and Time Row */}
                        <div className="form-row">
                            <div className="form-group">
                               
                                <label htmlFor="publishDate">Publish Date <span className="required">*</span></label>
                                <input
                                    type="date"
                                    id="publishDate"
                                    {...contentForm('publishDate',{
                                        required: 'Please select a publish date',
                                        min: new Date().toISOString().split('T')[0] // Disable past dates
                                    })}
                                    disabled={view}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="publishTime">Publish Time</label>
                                <input
                                    type="time"
                                    id="publishTime"
                                    {...contentForm('publishTime')}
                                    disabled={view}
                                />
                            </div>
                        </div>

                        {/* Platform Field */}
                        <div className="form-group">
                            <label htmlFor="platform">Platform <span className="required">*</span></label>
                            <select
                                id="platform"
                                {...contentForm('platform', { required: 'Please select a platform' })}
                                disabled={view}
                            >
                                <option value="YouTube">YouTube</option>
                                <option value="Instagram">Instagram</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Facebook">Facebook</option>
                            </select>
                            {touchedFields.platform && errors.platform && (
                                <span className="error-message">{errors.platform.message}</span>
                            )}
                        </div>

                        {/* Uploaded Checkbox */}
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    {...contentForm('uploaded')}
                                    disabled={view}
                                />
                                <span className="checkmark"></span>
                                <span className="checkbox-text">Mark as uploaded</span>
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                           <button type="button" className="ghost" onClick={handleCancel}>
                               {view ? 'Close' : 'Cancel'}
                           </button>
                           {!view && (
                               <button
                                   type="submit"
                                   className="primary"
                                   disabled={ !isValid}
                               >
                                   {editItem ? 'Update Content' : 'Create Content'}
                               </button>
                           )}
                        </div>
                    </form>
                </div>
                <button className="modal-close-button" onClick={handleCancel} aria-label="Close">
                    ×
                </button>
            </div>
        </div>
    );
}

export default Addcontent