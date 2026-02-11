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
            <input
                type="text"
                placeholder="Search by title"
                {...register('search')}
            />


            {/* Start date */}
            <input
                type="date"
                {...register('startDate')}
            />
            {watch('search').length > 0 && (<button type="button" onClick={() => {
                reset({ ...watch(), search: "" });
                onApply({ ...watch(), search: "" });
            }}>
                Clear Search
            </button>)}


            {/* End date */}
                            <input
                                type="date"
                                {...register('endDate')}
                                min={watch('startDate') || ''}
                                
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
