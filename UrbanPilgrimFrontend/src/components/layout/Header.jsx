// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    function handleClickOutside(event) {
      // Simple click outside detection
      const dropdown = document.querySelector('[data-dropdown="user-dropdown"]');
      if (dropdown && !dropdown.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    
    if (showUserDropdown) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserDropdown]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    setShowUserDropdown(false);
    window.location.href = '/';
  };

  return (
    <header>
      {/* Animated underline styles and responsive styles */}
      <style>{`
        .nav-link-animated {
          position: relative;
          color: #222;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .nav-link-animated::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background: #133A5E;
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          transform-origin: left;
        }
        .nav-link-animated:hover::after,
        .nav-link-animated.active::after {
          transform: scaleX(1);
        }
        @media (max-width: 900px) {
          .header-main {
            padding: 0.7rem 1rem !important;
            min-height: 80px !important;
          }
          .header-logo-img {
            height: 60px !important;
          }
        }
        @media (max-width: 700px) {
          .header-main {
            min-height: 70px !important;
            padding: 0.5rem 1rem !important;
            display: grid !important;
            grid-template-columns: 1fr auto 1fr !important;
            align-items: center !important;
            gap: 1rem !important;
          }
          .header-logo-img {
            height: 45px !important;
          }
          .header-desktop-nav, .header-desktop-icons {
            display: none !important;
          }
          .header-mobile-menu-btn {
            display: flex !important;
            justify-self: start !important;
          }
          .header-mobile-logo {
            justify-self: center !important;
          }
          .header-mobile-icons {
            display: flex !important;
            gap: 1rem !important;
            justify-self: end !important;
          }
        }
        .header-mobile-icons {
          display: none;
        }
        .header-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          padding: 0 0.5rem;
        }
        .header-mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(255,255,255,0.98);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 90px;
        }
        .header-mobile-menu .nav-link-animated {
          font-size: 1.2rem;
          margin: 1.2rem 0;
        }
        .header-mobile-menu .header-mobile-icons {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
        }
        /* Dropdown hover styles */
        .header-dropdown-item:hover {
          background-color: #f3f4f6 !important;
        }
        .header-dropdown-item {
          transition: background-color 0.2s ease;
        }
      `}</style>
      {/* Main Header */}
      <div className="header-main" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '1rem 2rem', 
        background: 'white', 
        minHeight: '90px',
        maxHeight: '90px',
        boxSizing: 'border-box'
      }}>
        {/* Mobile Hamburger Button */}
        <button className="header-mobile-menu-btn" onClick={() => setMobileMenuOpen((prev) => !prev)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#133A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="header-mobile-logo" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none',
          height: '70px',
          flexShrink: 0
        }}>
          <img 
            src="/logo.webp" 
            alt="Urban Pilgrim" 
            className="header-logo-img" 
            style={{ 
              height: '70px', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
        </Link>

        {/* Mobile Icons */}
        <div className="header-mobile-icons">
          {/* Search Icon */}
          <button style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
            width: '40px'
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#222">
              <circle cx="11" cy="11" r="7" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          {/* User Icon with Dropdown */}
          <div 
            data-dropdown="user-dropdown"
            style={{ 
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <button
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '40px',
                width: '40px'
              }}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#222">
                <circle cx="12" cy="8" r="4" strokeWidth="2"/>
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" strokeWidth="2"/>
              </svg>
            </button>
            
            {showUserDropdown && (
              <div 
                style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: '100%', 
                  background: 'white', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                  borderRadius: 8, 
                  minWidth: 180, 
                  zIndex: 9999, 
                  marginTop: '8px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden'
                }}
              >
                {token && user ? (
                  <div>
                    <div 
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = '/profile';
                      }}
                      style={{ 
                        padding: '12px 16px', 
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        color: '#333',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      Profile
                    </div>
                    <div 
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = '/my-bookings';
                      }}
                      style={{ 
                        padding: '12px 16px', 
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        color: '#333',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      My Bookings
                    </div>
                    <div 
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      style={{ 
                        padding: '12px 16px', 
                        cursor: 'pointer',
                        color: '#dc2626',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      Logout
                    </div>
                  </div>
                ) : (
                  <div>
                    <div 
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = '/login';
                      }}
                      style={{ 
                        padding: '12px 16px', 
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        color: '#333',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      Login
                    </div>
                    <div 
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = '/signup';
                      }}
                      style={{ 
                        padding: '12px 16px', 
                        cursor: 'pointer',
                        color: '#333',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      Sign Up
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="header-desktop-nav" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2.2rem', 
          flex: 1, 
          justifyContent: 'center',
          height: '70px'
        }}>
          <Link 
            to="/" 
            className="nav-link-animated" 
            style={{ 
              color: isActive('/') ? '#133A5E' : '#222', 
              fontWeight: 400, 
              fontSize: '16px',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Home
          </Link>
          <Link 
            to="/pilgrim-retreats" 
            className={`nav-link-animated${isActive('/pilgrim-retreats') ? ' active' : ''}`} 
            style={{ 
              color: isActive('/pilgrim-retreats') ? '#133A5E' : '#222', 
              fontWeight: 400, 
              fontSize: '16px',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Pilgrim Retreats
          </Link>
          <Link 
            to="/pilgrim-sessions" 
            className={`nav-link-animated${isActive('/pilgrim-sessions') ? ' active' : ''}`} 
            style={{ 
              color: isActive('/pilgrim-sessions') ? '#133A5E' : '#222', 
              fontWeight: 400, 
              fontSize: '16px',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Pilgrim Sessions
          </Link>
          
          <Link 
            to="/wellness-guide-classes" 
            className={`nav-link-animated${isActive('/wellness-guide-classes') ? ' active' : ''}`} 
            style={{ 
              color: isActive('/wellness-guide-classes') ? '#133A5E' : '#222', 
              fontWeight: 400, 
              fontSize: '16px',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Pilgrim Guides
          </Link>
          
          <Link 
            to="/pilgrim-bazaar" 
            className={`nav-link-animated${isActive('/pilgrim-bazaar') ? ' active' : ''}`} 
            style={{ 
              color: isActive('/pilgrim-bazaar') ? '#133A5E' : '#222', 
              fontWeight: 400, 
              fontSize: '16px',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Pilgrim Bazaar
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link-animated${isActive('/contact') ? ' active' : ''}`} 
            style={{ 
              color: isActive('/contact') ? '#133A5E' : '#222', 
              fontWeight: 400, 
              fontSize: '16px',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Contact
          </Link>
        </nav>
        
        {/* Desktop Icons */}
        <div className="header-desktop-icons" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2.2rem',
          height: '70px',
          flexShrink: 0
        }}>
          {/* Search Icon */}
          <button style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '44px',
            width: '44px'
          }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#222">
              <circle cx="11" cy="11" r="7" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          {/* User Icon with Dropdown */}
          <div style={{ 
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }} ref={userDropdownRef}>
            <button
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '44px',
                width: '44px'
              }}
              aria-haspopup="true"
              aria-expanded={showUserDropdown}
              onClick={() => setShowUserDropdown((prev) => !prev)}
              tabIndex={0}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#222">
                <circle cx="12" cy="8" r="4" strokeWidth="2"/>
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" strokeWidth="2"/>
              </svg>
            </button>
            {showUserDropdown && (
              <div style={{ 
                position: 'absolute', 
                right: 0, 
                top: '100%', 
                background: 'white', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
                borderRadius: 6, 
                minWidth: 160, 
                zIndex: 1001, 
                padding: '0.7rem 0',
                marginTop: '8px',
                border: '1px solid #e5e7eb',
                pointerEvents: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}>
                {token && user ? (
                  <>
                    <Link 
                      to="/profile"
                      className="header-dropdown-item" 
                      style={{ 
                        display: 'block', 
                        padding: '0.6rem 1.2rem', 
                        color: '#222', 
                        fontSize: 15, 
                        textDecoration: 'none', 
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Dropdown clicked!');
                        console.log('Dropdown item clicked');
                        setShowUserDropdown(false);
                      }}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/my-bookings"
                      className="header-dropdown-item" 
                      style={{ 
                        display: 'block', 
                        padding: '0.6rem 1.2rem', 
                        color: '#222', 
                        fontSize: 15, 
                        textDecoration: 'none', 
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Dropdown clicked!');
                        console.log('Dropdown item clicked');
                        setShowUserDropdown(false);
                      }}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Logout button clicked');
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="header-dropdown-item"
                      style={{ 
                        display: 'block', 
                        width: '100%', 
                        textAlign: 'left', 
                        padding: '0.6rem 1.2rem', 
                        color: '#b91c1c', 
                        fontSize: 15, 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        whiteSpace: 'nowrap',
                        pointerEvents: 'auto'
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      className="header-dropdown-item" 
                      style={{ 
                        display: 'block', 
                        padding: '0.6rem 1.2rem', 
                        color: '#222', 
                        fontSize: 15, 
                        textDecoration: 'none', 
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Dropdown clicked!');
                        console.log('Dropdown item clicked');
                        setShowUserDropdown(false);
                      }}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup"
                      className="header-dropdown-item" 
                      style={{ 
                        display: 'block', 
                        padding: '0.6rem 1.2rem', 
                        color: '#222', 
                        fontSize: 15, 
                        textDecoration: 'none', 
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Dropdown clicked!');
                        console.log('Dropdown item clicked');
                        setShowUserDropdown(false);
                      }}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Bag Icon */}
          <button style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '44px',
            width: '44px'
          }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#222">
              <path d="M6 7V6a6 6 0 1112 0v1" strokeWidth="2"/>
              <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2"/>
            </svg>
          </button>
        </div>

      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="header-mobile-menu">
          <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <Link to="/" className="nav-link-animated" style={{ color: isActive('/') ? '#133A5E' : '#222', fontWeight: 400 }} onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/pilgrim-retreats" className="nav-link-animated" style={{ color: isActive('/pilgrim-retreats') ? '#133A5E' : '#222', fontWeight: 400 }} onClick={() => setMobileMenuOpen(false)}>Pilgrim Retreats</Link>
          <Link to="/pilgrim-sessions" className="nav-link-animated" style={{ color: isActive('/pilgrim-sessions') ? '#133A5E' : '#222', fontWeight: 400 }} onClick={() => setMobileMenuOpen(false)}>Pilgrim Sessions</Link>
          <Link to="/wellness-guide-classes" className="nav-link-animated" style={{ color: isActive('/wellness-guide-classes') ? '#133A5E' : '#222', fontWeight: 400 }} onClick={() => setMobileMenuOpen(false)}>Pilgrim Guides</Link>
          <Link to="/pilgrim-bazaar" className="nav-link-animated" style={{ color: isActive('/pilgrim-bazaar') ? '#133A5E' : '#222', fontWeight: 400 }} onClick={() => setMobileMenuOpen(false)}>Pilgrim Bazaar</Link>
          <Link to="/contact" className="nav-link-animated" style={{ color: isActive('/contact') ? '#133A5E' : '#222', fontWeight: 400 }} onClick={() => setMobileMenuOpen(false)}>Contact</Link>

        </div>
      )}
    </header>
  );
};

export default Header;