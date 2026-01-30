import React, { useEffect, useRef, useState } from 'react'
import './header.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector,useDispatch } from 'react-redux'
import { logOut } from '../slices/authSlice'

const Header = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.login.userDetails)
  const ref = useRef(null)
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('authToken')
    dispatch(logOut())

    toast.success('Logged out')
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-logo">Youtube Content Manager {user ? (user.username || user.name || user) : ''}</h1>

        <div className="profile" ref={ref}>
          <button
            className="profile-button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="avatar" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h2c0-2.761 2.239-5 5-5s5 2.239 5 5h2c0-3.866-3.134-7-7-7z"/>
            </svg>
          </button>

          {open && (
            <div className="profile-dropdown" role="menu">
              <button className="dropdown-item" role="menuitem" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header