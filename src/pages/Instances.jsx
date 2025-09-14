import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Database, 
  Plus, 
  Search, 
  Filter,
  Play,
  Square,
  Trash2,
  Settings,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

const Instances = () => {
  const [instances, setInstances] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchInstances()
  }, [])

  const fetchInstances = async () => {
    try {
      const response = await axios.get('/api/ec2/list')
      setInstances(response.data.instances || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch instances:', error)
      toast.error('Failed to load instances')
      setLoading(false)
    }
  }

  const handleInstanceAction = async (instanceId, action) => {
    setActionLoading(prev => ({ ...prev, [instanceId]: action }))
    
    try {
      let response
      switch (action) {
        case 'start':
          response = await axios.post(`/api/ec2/${instanceId}/start`)
          toast.success('Instance started successfully')
          break
        case 'stop':
          response = await axios.post(`/api/ec2/${instanceId}/stop`)
          toast.success('Instance stopped successfully')
          break
        case 'terminate':
          if (window.confirm('Are you sure you want to terminate this instance? This action cannot be undone.')) {
            response = await axios.delete(`/api/ec2/${instanceId}`)
            toast.success('Instance terminated successfully')
          } else {
            setActionLoading(prev => ({ ...prev, [instanceId]: null }))
            return
          }
          break
        default:
          break
      }
      
      // Refresh instances list
      fetchInstances()
    } catch (error) {
      console.error(`Failed to ${action} instance:`, error)
      toast.error(`Failed to ${action} instance`)
    } finally {
      setActionLoading(prev => ({ ...prev, [instanceId]: null }))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'stopped':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800'
      case 'stopped':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInstances = instances.filter(instance => {
    const matchesSearch = instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instance.databaseType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || instance.status === statusFilter
    const matchesType = typeFilter === 'all' || instance.databaseType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Database Instances</h1>
          <p className="text-gray-300 mt-2">Manage your database instances</p>
        </div>
        <Link
          to="/instances/create"
          className="btn-primary inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Instance
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search instances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
            <option value="pending">Pending</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-300">
            <Filter className="h-4 w-4 mr-2" />
            {filteredInstances.length} of {instances.length} instances
          </div>
        </div>
      </motion.div>

      {/* Instances List */}
      {filteredInstances.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-12 text-center"
        >
          <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {instances.length === 0 ? 'No instances yet' : 'No matching instances'}
          </h3>
          <p className="text-gray-300 mb-6">
            {instances.length === 0 
              ? 'Get started by creating your first database instance.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {instances.length === 0 && (
            <Link
              to="/instances/create"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Instance
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredInstances.map((instance, index) => (
            <motion.div
              key={instance.instanceId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:border-primary-500 cursor-pointer"
              onClick={() => window.location.href = `/instances/${instance.instanceId}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Database className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{instance.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                        <span>{instance.databaseType} {instance.databaseVersion}</span>
                        <span>•</span>
                        <span>{instance.instanceType}</span>
                        <span>•</span>
                        <span>Created {new Date(instance.createdAt).toLocaleDateString()}</span>
                        {instance.networkConfig?.publicIp && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">Public IP Available</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(instance.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(instance.status)}`}>
                        {instance.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      {instance.status === 'stopped' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleInstanceAction(instance.instanceId, 'start')
                          }}
                          disabled={actionLoading[instance.instanceId] === 'start'}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Start instance"
                        >
                          {actionLoading[instance.instanceId] === 'start' ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      {instance.status === 'running' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleInstanceAction(instance.instanceId, 'stop')
                          }}
                          disabled={actionLoading[instance.instanceId] === 'stop'}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Stop instance"
                        >
                          {actionLoading[instance.instanceId] === 'stop' ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleInstanceAction(instance.instanceId, 'terminate')
                        }}
                        disabled={actionLoading[instance.instanceId] === 'terminate'}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Terminate instance"
                      >
                        {actionLoading[instance.instanceId] === 'terminate' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instance Details */}
              <div className="mt-4 pt-4 border-t border-dark-600">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Public IP:</span>
                    <p className="font-medium text-white truncate">
                      {instance.networkConfig?.publicIp || 'Not assigned'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Private IP:</span>
                    <p className="font-medium text-white truncate">
                      {instance.networkConfig?.privateIp || 'Not assigned'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Port:</span>
                    <p className="font-medium text-white">{instance.databasePort || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Region:</span>
                    <p className="font-medium text-white">{instance.region || 'ap-south-1'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Instances 