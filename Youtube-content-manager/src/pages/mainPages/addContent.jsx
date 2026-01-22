import React, { useState, useEffect } from "react";
import './addContent.css';

const Addcontent = ({ onClose, editItem, view }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Short',
        script: '',
        publishDate: '',
        publishTime: '',
        platform: 'YouTube',
        uploaded: false
    });

    // Use useEffect to populate form when editItem changes
    useEffect(() => {
        if (editItem) {
            setFormData({
                ...formData, ...editItem
            });
        } else {
            // Reset form when not editing
            setFormData({
                title: '',
                type: 'Short',
                script: '',
                publishDate: '',
                publishTime: '',
                platform: 'YouTube',
                uploaded: false
            });
        }
    }, [editItem]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (view) return; // Don't submit in view mode
        console.log('Form submitted:', formData);
        // Handle form submission here
        // After successful submission, you might want to close the modal
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

                    <form onSubmit={handleSubmit} className="content-form">
                        {/* Title Field */}
                        <div className="form-group">
                            <label htmlFor="title">Title <span className="required">*</span></label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter video title"
                                value={formData.title}
                                onChange={handleChange}
                                disabled={view}
                                required
                            />
                        </div>

                        {/* Type Selection */}
                        <div className="form-group">
                            <label>Content Type <span className="required">*</span></label>
                            <div className="type-selector">
                                <label className={`type-option type-short ${formData.type === 'Short' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="Short"
                                        disabled={view}
                                        checked={formData.type === 'Short'}
                                        onChange={handleChange}
                                    />
                                    <span>Short</span>
                                </label>
                                <label className={`type-option type-long ${formData.type === 'Long' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="Long"
                                        disabled={view}
                                        checked={formData.type === 'Long'}
                                        onChange={handleChange}
                                    />
                                    <span>Long</span>
                                </label>
                            </div>
                        </div>

                        {/* Script Textarea */}
                        <div className="form-group">
                            <label htmlFor="script">Script</label>
                            <textarea
                                id="script"
                                name="script"
                                placeholder="Enter your video script here..."
                                value={formData.script}
                                onChange={handleChange}
                                rows="8"
                                disabled={view}
                            />
                        </div>

                        {/* Date and Time Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="publishDate">Publish Date</label>
                                <input
                                    type="date"
                                    id="publishDate"
                                    name="publishDate"
                                    value={formData.publishDate}
                                    disabled={view}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="publishTime">Publish Time</label>
                                <input
                                    type="time"
                                    id="publishTime"
                                    name="publishTime"
                                    value={formData.publishTime}
                                    disabled={view}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Platform Field */}
                        <div className="form-group">
                            <label htmlFor="platform">Platform <span className="required">*</span></label>
                            <select
                                id="platform"
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                                disabled={view}
                                required
                            >
                                <option value="YouTube">YouTube</option>
                                <option value="Instagram">Instagram</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Facebook">Facebook</option>
                            </select>
                        </div>

                        {/* Uploaded Checkbox */}
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="uploaded"
                                    disabled={view}
                                    checked={formData.uploaded}
                                    onChange={handleChange}
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
                               <button type="submit" className="primary">
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