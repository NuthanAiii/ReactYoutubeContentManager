import React, { useEffect } from "react";
import './addContent.css';
import { useForm, Controller } from "react-hook-form";
import * as apiCallSerive from '../../services/apiCallSerive';
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const parseDate = (str) => {
    if (!str) return null;
    const d = new Date(str + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
};

const parseTime = (str) => {
    if (!str) return null;
    const [h, m] = str.split(':');
    const d = new Date();
    d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
    return d;
};

const formatDate = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const formatTime = (date) => {
    if (!date) return null;
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
};

const Addcontent = ({ onClose, refresh, editItem, view }) => {
    const {
        register: contentForm,
        handleSubmit: addContent,
        watch: watchContent,
        reset: resetAddContent,
        control,
        formState: { errors, isValid, touchedFields }
    } = useForm({
        mode: 'all',
        defaultValues: {
            title: '',
            type: 'Short',
            script: '',
            publishDate: null,
            publishTime: null,
            platform: 'YouTube',
            uploaded: false
        }
    });

    useEffect(() => {
        if (editItem) {
            resetAddContent({
                ...editItem,
                publishDate: parseDate(editItem.publishDate),
                publishTime: parseTime(editItem.publishTime),
            });
        } else {
            resetAddContent({
                title: '',
                type: 'Short',
                script: '',
                publishDate: null,
                publishTime: null,
                platform: 'YouTube',
                uploaded: false
            });
        }
    }, [editItem, resetAddContent]);

    const onSubmit = async (data) => {
        if (view) return;
        const payload = {
            ...data,
            publishDate: formatDate(data.publishDate),
            publishTime: formatTime(data.publishTime),
        };
        const endPoint = editItem ? 'updateContent' : 'setContent';
        await apiCallSerive.postData(endPoint, payload);
        toast.success(editItem ? 'Content updated successfully' : 'Content added successfully');
        refresh();
        onClose();
    };

    const handleCancel = () => {
        if (onClose) onClose();
    };

    const [scriptFullscreen, setScriptFullscreen] = React.useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
                            {view
                                ? 'View the details of your video content entry.'
                                : editItem
                                ? 'Update the details of your video content entry.'
                                : 'Fill in the details to create your video content entry.'}
                        </p>
                    </div>

                    <form onSubmit={addContent(onSubmit)} className="content-form">
                        {/* Title */}
                        <div className="form-group">
                            <label htmlFor="title">Title <span className="required">*</span></label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Enter video title"
                                {...contentForm('title', {
                                    required: 'Please enter the title',
                                    minLength: { value: 3, message: 'At least 3 characters required' }
                                })}
                                disabled={view}
                            />
                            {touchedFields.title && errors.title && (
                                <span className="error-message">{errors.title.message}</span>
                            )}
                        </div>

                        {/* Type */}
                        <div className="form-group">
                            <label>Content Type <span className="required">*</span></label>
                            <div className="type-selector">
                                <label className={`type-option type-short ${watchContent('type') === 'Short' ? 'active' : ''}`}>
                                    <input type="radio" value="Short" disabled={view}
                                        {...contentForm('type', { required: 'Please select content type' })} />
                                    <span>Short</span>
                                </label>
                                <label className={`type-option type-long ${watchContent('type') === 'Long' ? 'active' : ''}`}>
                                    <input type="radio" value="Long" disabled={view}
                                        {...contentForm('type')} />
                                    <span>Long</span>
                                </label>
                            </div>
                        </div>

                        {/* Script */}
                        <div className="form-group">
                            <div className="script-label-row">
                                <label htmlFor="script">Script</label>
                                <button
                                    type="button"
                                    className="script-fullscreen-btn"
                                    onClick={() => setScriptFullscreen(true)}
                                    title="Expand to fullscreen"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                                        <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                                    </svg>
                                    Expand
                                </button>
                            </div>
                            <textarea
                                id="script"
                                placeholder="Enter your video script here..."
                                {...contentForm('script')}
                                rows="8"
                                disabled={view}
                            />
                        </div>

                        {/* Script fullscreen overlay */}
                        {scriptFullscreen && (
                            <div className="script-fullscreen-overlay" onClick={() => setScriptFullscreen(false)}>
                                <div className="script-fullscreen-panel" onClick={(e) => e.stopPropagation()}>
                                    <div className="script-fullscreen-header">
                                        <span className="script-fullscreen-title">Script</span>
                                        <button
                                            type="button"
                                            className="script-fullscreen-close"
                                            onClick={() => setScriptFullscreen(false)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 9 3 3 3 9"/><polyline points="15 15 21 21 21 15"/>
                                                <line x1="3" y1="3" x2="10" y2="10"/><line x1="21" y1="21" x2="14" y2="14"/>
                                            </svg>
                                            Close
                                        </button>
                                    </div>
                                    <textarea
                                        className="script-fullscreen-textarea"
                                        placeholder="Enter your video script here..."
                                        {...contentForm('script')}
                                        disabled={view}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Date & Time */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Publish Date <span className="required">*</span></label>
                                <Controller
                                    control={control}
                                    name="publishDate"
                                    rules={{ required: 'Please select a publish date' }}
                                    render={({ field }) => (
                                        <DatePicker
                                            placeholderText="Select date"
                                            selected={field.value}
                                            onChange={field.onChange}
                                            minDate={today}
                                            dateFormat="dd MMM yyyy"
                                            disabled={view}
                                            portalId="root"
                                            className="datepicker-input"
                                            isClearable={!view}
                                        />
                                    )}
                                />
                                {errors.publishDate && (
                                    <span className="error-message">{errors.publishDate.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Publish Time</label>
                                <Controller
                                    control={control}
                                    name="publishTime"
                                    render={({ field }) => (
                                        <DatePicker
                                            placeholderText="Select time"
                                            selected={field.value}
                                            onChange={field.onChange}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="HH:mm"
                                            disabled={view}
                                            portalId="root"
                                            className="datepicker-input"
                                            isClearable={!view}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Platform */}
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

                        {/* Uploaded */}
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input type="checkbox" {...contentForm('uploaded')} disabled={view} />
                                <span className="checkmark"></span>
                                <span className="checkbox-text">Mark as uploaded</span>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <button type="button" className="ghost" onClick={handleCancel}>
                                {view ? 'Close' : 'Cancel'}
                            </button>
                            {!view && (
                                <button type="submit" className="primary" disabled={!isValid}>
                                    {editItem ? 'Update Content' : 'Create Content'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <button className="modal-close-button" onClick={handleCancel} aria-label="Close">×</button>
            </div>
        </div>
    );
};

export default Addcontent;
