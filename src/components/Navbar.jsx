import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Database, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Monitor,
  Plus
} from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-dark-800 shadow-lg border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DBHost</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-primary-400 bg-primary-900/20'
                      : 'text-gray-300 hover:text-primary-400'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/instances"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/instances')
                      ? 'text-primary-400 bg-primary-900/20'
                      : 'text-gray-300 hover:text-primary-400'
                  }`}
                >
                  Instances
                </Link>
                <Link
                  to="/instances/create"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Instance</span>
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 focus:outline-none"
                  >
                    <div className="bg-primary-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                                          <span className="text-sm font-medium text-white">{user?.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-dark-700">
                        <div className="font-medium text-white">{user?.username}</div>
                        <div className="text-gray-400">{user?.email}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-700 rounded-lg mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/dashboard')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/instances"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/instances')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Instances
                  </Link>
                  <Link
                    to="/instances/create"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Instance
                  </Link>
                  <div className="border-t pt-2">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Signed in as {user?.username}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 