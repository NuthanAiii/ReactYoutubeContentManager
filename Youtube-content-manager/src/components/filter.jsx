import React, { useEffect } from 'react'
import { set, useForm } from 'react-hook-form'
import './filter.css'

const ContentFilter = ({ onApply }) => {

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            search: '',
            startDate: '',
            endDate: '',
            type: '',
            status: ''
        }
    })

    const onSubmit = (data) => {
        onApply(data)
    }
const startDate = watch('startDate');

useEffect(() => {
    if (startDate) {
        setValue('endDate', '');
    }
}, [startDate]);

    const onReset = () => {
        const empty = {
            search: '',
            startDate: '',
            endDate: '',
            type: '',
            status: ''
        }

        reset(empty)
        onApply(empty)
    }
    useEffect(() => {
        if (watch('search').length >= 3 || watch('search').length === 0) {
            const timer = setTimeout(() => {
                onApply({ search: watch('search') });

            }, 1000);

            return () => clearTimeout(timer);
        }




    }, [watch('search')])

    return (
        <form
            className="content-filter"
            onSubmit={handleSubmit(onSubmit)}
        >

            {/* Search */}
            <div className="filter-search">
                <input
                    type="text"
                    placeholder="Search by title…"
                    {...register('search')}
                />
            </div>

            <div className="filter-divider" />

            {/* Date range */}
            <div className="filter-date-group">
                <span className="filter-date-label">From</span>
                <input
                    type="date"
                    {...register('startDate')}
                />
            </div>

            <div className="filter-date-group">
                <span className="filter-date-label">To</span>
                <input
                    type="date"
                    {...register('endDate')}
                    min={watch('startDate') || ''}
                />
            </div>

            <div className="filter-divider" />

            {/* Type */}
            <select {...register('type')}>
                <option value="">All types</option>
                <option value="Short">Short</option>
                <option value="Long">Long</option>
            </select>

            <div className="filter-divider" />

            {/* Status radio buttons */}
            <div className="filter-radio-group">
                <label>
                    <input
                        type="radio"
                        value="uploaded"
                        {...register("status")}
                    />
                    <span>Uploaded</span>
                </label>

                <label>
                    <input
                        type="radio"
                        value="scheduled"
                        {...register("status")}
                    />
                    <span>Scheduled</span>
                </label>

                <label>
                    <input
                        type="radio"
                        value="overDue"
                        {...register("status")}
                    />
                    <span>Overdue</span>
                </label>
            </div>

            <div className="filter-divider" />

            {/* Action buttons */}
            <div className="filter-actions">
                {watch('search').length > 0 && (
                    <button type="button" className="filter-clear" onClick={() => {
                        reset({ ...watch(), search: "" });
                        onApply({ ...watch(), search: "" });
                    }}>
                        Clear
                    </button>
                )}
                <button type="submit" className="filter-apply">Apply</button>
                <button type="button" className="filter-reset" onClick={onReset}>Reset</button>
            </div>

        </form>
    )
}

export default ContentFilter
