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
      uploaded: false,
      scheduled: false
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
      uploaded: false,
      scheduled: false
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
          type="checkbox"
          {...register('uploaded')}
        />
        Uploaded
      </label>

      <label>
        <input
          type="checkbox"
          {...register('scheduled')}
        />
        Scheduled
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
