import React from 'react'
import './pagination.css'

// Simple pagination component
// Props:
// - currentPage (number)
// - totalPages (number)
// - onPageChange (function(page))
// - siblingCount (how many page numbers to show on each side of current, default 1)
const Pagination = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
  if (totalPages <= 1) return null

  const createPageArray = () => {
    const totalNumbers = siblingCount * 2 + 5 // first, last, current, two ellipses
    const totalBlocks = totalNumbers

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount)
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount)

      const pages = []

      // left ellipsis
      if (startPage > 2) pages.push('LEFT_ELLIPSIS')

      for (let i = startPage; i <= endPage; i++) pages.push(i)

      // right ellipsis
      if (endPage < totalPages - 1) pages.push('RIGHT_ELLIPSIS')

      return [1, ...pages, totalPages]
    }

    // less pages than blocks => show all
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = createPageArray()

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="page-btn" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>
        Prev
      </button>

      {pages.map((p, idx) => {
        if (p === 'LEFT_ELLIPSIS' || p === 'RIGHT_ELLIPSIS') {
          return (
            <span key={p + idx} className="page-ellipsis">…</span>
          )
        }
        return (
          <button
            key={p}
            className={`page-number ${p === currentPage ? 'active' : ''}`}
            onClick={() => goTo(p)}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      })}

      <button className="page-btn" onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>

      <div className="page-info">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></div>
    </nav>
  )
}

export default Pagination
