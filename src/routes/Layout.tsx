import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDisplayName = () => {
    if (user?.givenName) {
      return `${user.givenName} ${user.familyName || ''}`.trim();
    }
    return user?.email || 'User';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-emerald-700">Range</span>
                <span className="text-xl font-light text-gray-700">Management</span>
              </NavLink>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-gray-900 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/agreements"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-gray-900 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  Agreements
                </NavLink>
                <NavLink
                  to="/plans"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-gray-900 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  Plans
                </NavLink>
                <NavLink
                  to="/clients"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-gray-900 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  Clients
                </NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500">Logged in as </span>
                <span className="font-medium text-gray-900">{getDisplayName()}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
