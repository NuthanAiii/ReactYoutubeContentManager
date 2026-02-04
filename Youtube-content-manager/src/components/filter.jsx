import React from 'react'
import { useForm } from 'react-hook-form'
import './filter.css'

const ContentFilter = ({ onApply }) => {

    const {
        register,
        handleSubmit,
        reset
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

    return (
        <form
            className="content-filter"
            onSubmit={handleSubmit(onSubmit)}
        >

            {/* Search */}
            <input
                type="text"
                placeholder="Search by title or description"
                {...register('search')}
            />

            {/* Start date */}
            <input
                type="date"
                {...register('startDate')}
            />

            {/* End date */}
            <input
                type="date"
                {...register('endDate')}
            />

            {/* Type */}
            <select {...register('type')}>
                <option value="">All types</option>
                <option value="Short">Short</option>
                <option value="Long">Long</option>
            </select>

            {/* Status */}
            <label>
                <input
                    type="radio"
                    value="uploaded"
                    {...register("status")}
                />
                Uploaded
            </label>

            <label>
                <input
                    type="radio"
                    value="scheduled"
                    {...register("status")}
                />
                Scheduled
            </label>
            <label>
                <input
                    type="radio"
                    value="overDue"
                    {...register("status")}
                />
                Overdue
            </label>


            <button type="submit">
                Apply
            </button>

            <button type="button" onClick={onReset}>
                Reset
            </button>

        </form>
    )
}

export default ContentFilter
