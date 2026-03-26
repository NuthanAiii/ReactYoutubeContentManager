import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './filter.css'

const formatDate = (date) => {
    if (!date) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

const ContentFilter = ({ onApply }) => {
    const [isOpen, setIsOpen] = useState(false)

    const { register, handleSubmit, reset, watch, control, setValue } = useForm({
        defaultValues: {
            search: '',
            startDate: null,
            endDate: null,
            type: '',
            status: ''
        }
    })

    const startDate = watch('startDate')
    const endDate = watch('endDate')

    const onSubmit = (data) => {
        onApply({
            ...data,
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
        })
        setIsOpen(false)
    }

    const onReset = () => {
        const empty = { search: '', startDate: null, endDate: null, type: '', status: '' }
        reset(empty)
        onApply({ search: '', startDate: '', endDate: '', type: '', status: '' })
        setIsOpen(false)
    }

    useEffect(() => {
        if (startDate) setValue('endDate', null)
    }, [startDate])

    useEffect(() => {
        const search = watch('search')
        if (search.length >= 3 || search.length === 0) {
            const timer = setTimeout(() => {
                onApply({ search })
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [watch('search')])

    const hasActiveFilters = startDate || endDate || watch('type') || watch('status')

    return (
        <div className="filter-wrapper">
            {/* Top bar */}
            <div className="filter-topbar">
                <div className="filter-search">
                    <input
                        type="text"
                        placeholder="Search by title…"
                        {...register('search')}
                    />
                    {watch('search').length > 0 && (
                        <button
                            type="button"
                            className="filter-search-clear"
                            onClick={() => {
                                reset({ ...watch(), search: '' })
                                onApply({ ...watch(), search: '', startDate: formatDate(startDate), endDate: formatDate(endDate) })
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className={`filter-hamburger ${isOpen ? 'is-open' : ''}`}
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-label="Toggle filters"
                >
                    <span className="hamburger-bar" />
                    <span className="hamburger-bar" />
                    <span className="hamburger-bar" />
                    {hasActiveFilters && <span className="filter-dot" />}
                </button>
            </div>

            {/* Collapsible panel */}
            <div className={`filter-panel ${isOpen ? 'filter-panel--open' : ''}`}>
                <form className="filter-panel-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="filter-panel-row">

                        {/* Date Range */}
                        <div className="filter-group">
                            <span className="filter-group-label">Date Range</span>
                            <div className="filter-date-row">
                                <div className="filter-date-group">
                                    <span className="filter-date-label">From</span>
                                    <Controller
                                        control={control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholderText="Start date"
                                                selected={field.value}
                                                onChange={field.onChange}
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                dateFormat="dd MMM yyyy"
                                                isClearable
                                                popperPlacement="bottom-start"
                                                portalId="root"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="filter-date-group">
                                    <span className="filter-date-label">To</span>
                                    <Controller
                                        control={control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholderText="End date"
                                                selected={field.value}
                                                onChange={field.onChange}
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate}
                                                dateFormat="dd MMM yyyy"
                                                isClearable
                                                popperPlacement="bottom-start"
                                                portalId="root"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Type */}
                        <div className="filter-group">
                            <span className="filter-group-label">Type</span>
                            <select {...register('type')}>
                                <option value="">All types</option>
                                <option value="Short">Short</option>
                                <option value="Long">Long</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="filter-group">
                            <span className="filter-group-label">Status</span>
                            <div className="filter-radio-group">
                                <label>
                                    <input type="radio" value="uploaded" {...register('status')} />
                                    <span>Uploaded</span>
                                </label>
                                <label>
                                    <input type="radio" value="scheduled" {...register('status')} />
                                    <span>Scheduled</span>
                                </label>
                                <label>
                                    <input type="radio" value="overDue" {...register('status')} />
                                    <span>Overdue</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="filter-actions">
                        <button type="submit" className="filter-apply">Apply</button>
                        <button type="button" className="filter-reset" onClick={onReset}>Reset</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContentFilter
