import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  ArrowLeft,
  Users,
  Plus,
  Trash2,
  Edit,
  Key,
  Shield,
  Database,
  Eye,
  EyeOff
} from 'lucide-react'

const DatabaseManagement = () => {
  const { instanceId } = useParams()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPasswords, setShowPasswords] = useState({})

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    fetchUsers()
  }, [instanceId])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/database/${instanceId}/users`)
      setUsers(response.data.users || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load database users')
      setLoading(false)
    }
  }

  const handleCreateUser = async (data) => {
    try {
      await axios.post(`/api/database/${instanceId}/users`, data)
      toast.success('User created successfully')
      setShowCreateForm(false)
      reset()
      fetchUsers()
    } catch (error) {
      console.error('Failed to create user:', error)
      toast.error('Failed to create user')
    }
  }

  const handleUpdateUser = async (username, data) => {
    try {
      await axios.put(`/api/database/${instanceId}/users/${username}`, data)
      toast.success('User updated successfully')
      setEditingUser(null)
      reset()
      fetchUsers()
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Failed to update user')
    }
  }

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await axios.delete(`/api/database/${instanceId}/users/${username}`)
        toast.success('User deleted successfully')
        fetchUsers()
      } catch (error) {
        console.error('Failed to delete user:', error)
        toast.error('Failed to delete user')
      }
    }
  }

  const togglePasswordVisibility = (username) => {
    setShowPasswords(prev => ({
      ...prev,
      [username]: !prev[username]
    }))
  }

  const privilegeOptions = [
    { value: 'SELECT', label: 'SELECT - Read data' },
    { value: 'INSERT', label: 'INSERT - Add new data' },
    { value: 'UPDATE', label: 'UPDATE - Modify data' },
    { value: 'DELETE', label: 'DELETE - Remove data' },
    { value: 'CREATE', label: 'CREATE - Create tables' },
    { value: 'DROP', label: 'DROP - Delete tables' },
    { value: 'ALTER', label: 'ALTER - Modify structure' },
    { value: 'INDEX', label: 'INDEX - Create indexes' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/instances/${instanceId}`}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Instance Details
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Database Users</h1>
            <p className="text-gray-600 mt-2">Manage database users and their permissions</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </button>
        </div>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Create New User</h2>
            <button
              onClick={() => {
                setShowCreateForm(false)
                reset()
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    }
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  type="password"
                  className="input-field"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privileges
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {privilegeOptions.map((privilege) => (
                  <label key={privilege.value} className="flex items-center">
                    <input
                      {...register('privileges')}
                      type="checkbox"
                      value={privilege.value}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{privilege.value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  reset()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create User
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Database Users</h2>
            <span className="ml-2 text-sm text-gray-500">({users.length} users)</span>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-600 mb-4">Create your first database user to get started.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <motion.div
                key={user.username}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6"
              >
                {editingUser === user.username ? (
                  // Edit Form
                  <form
                    onSubmit={handleSubmit((data) => handleUpdateUser(user.username, data))}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password (optional)
                        </label>
                        <input
                          {...register('password')}
                          type="password"
                          className="input-field"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Privileges
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {privilegeOptions.map((privilege) => (
                          <label key={privilege.value} className="flex items-center">
                            <input
                              {...register('privileges')}
                              type="checkbox"
                              value={privilege.value}
                              defaultChecked={user.privileges?.includes(privilege.value)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{privilege.value}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null)
                          reset()
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Update User
                      </button>
                    </div>
                  </form>
                ) : (
                  // User Display
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <Database className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.username}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {user.privileges?.length || 0} privileges
                          </span>
                          {user.privileges && user.privileges.length > 0 && (
                            <span className="text-sm text-gray-400">
                              ({user.privileges.join(', ')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingUser(user.username)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Connection Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Examples</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Command Line (psql)</h3>
            <code className="block bg-gray-100 p-3 rounded-lg text-sm">
              psql -h your-endpoint -p 5432 -U username -d postgres
            </code>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Connection String</h3>
            <code className="block bg-gray-100 p-3 rounded-lg text-sm">
              postgresql://username:password@your-endpoint:5432/postgres
            </code>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DatabaseManagement 