import { NavLink, Outlet } from 'react-router-dom'

const navItems: Array<{ to: string; label: string }> = [
  { to: '/books', label: 'Shop' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/cart', label: 'Cart' },
  { to: '/customers', label: 'Customers' },
  { to: '/orders', label: 'Orders' },
  { to: '/payments', label: 'Payments' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/comments', label: 'Comments/Ratings' },
  { to: '/recommender', label: 'Recommender' },
  { to: '/staff', label: 'Staff' },
  { to: '/manager', label: 'Manager' },
  { to: '/gateway', label: 'API Gateway' },
]

export function Layout() {
  return (
    <div className="appShell">
      <header className="topbar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div>
            <div className="brandTitle">Bookstore Microservices</div>
            <div className="brandSubtitle">Frontend dashboard + service pages</div>
          </div>
        </div>
      </header>

      <div className="contentGrid">
        <aside className="sidebar">
          <nav className="nav">
            {navItems.map((item) => (
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
          </nav>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

