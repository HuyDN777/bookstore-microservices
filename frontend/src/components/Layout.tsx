import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Layout() {
  const { user, logout } = useAuth()

  const mainNav: Array<{ to: string; label: string }> = [
    { to: '/books', label: 'Shop' },
    { to: '/cart', label: 'Cart' },
    { to: '/my-orders', label: 'My Orders' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  const adminNav: Array<{ to: string; label: string }> = [
    { to: '/orders', label: 'Orders (Admin)' },
    { to: '/admin-books', label: 'Books (Admin)' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/customers', label: 'Customers' },
    { to: '/payments', label: 'Payments' },
    { to: '/shipping', label: 'Shipping' },
    { to: '/comments', label: 'Comments/Ratings' },
    { to: '/recommender', label: 'Recommender' },
    { to: '/staff', label: 'Staff' },
    { to: '/manager', label: 'Manager' },
    { to: '/gateway', label: 'API Gateway' },
  ]

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div>
            <div className="brandTitle">Bookstore Microservices</div>
            <div className="brandSubtitle">Shop + dashboard + admin</div>
          </div>
        </div>
        <div className="topbarRight">
          {user ? (
            <>
              <span className="topbarUser">Hi, {user.username}</span>
              <button className="btn btnGhost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="topbarLink">
                Login
              </NavLink>
              <NavLink to="/register" className="topbarLink">
                Register
              </NavLink>
              <NavLink to="/staff-login" className="topbarLink">
                Staff
              </NavLink>
            </>
          )}
        </div>
      </header>

      <div className="contentGrid">
        <aside className="sidebar">
          <nav className="nav">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `navItem ${isActive ? 'navItemActive' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}

            {user && user.is_staff && (
              <>
                <div className="navSectionLabel">Admin</div>
                {adminNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `navItem ${isActive ? 'navItemActive' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </>
            )}
          </nav>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

