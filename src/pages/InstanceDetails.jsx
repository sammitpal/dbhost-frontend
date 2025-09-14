import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Database, 
  ArrowLeft,
  Play,
  Square,
  Trash2,
  Settings,
  Users,
  FileText,
  Network,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

const InstanceDetails = () => {
  const { instanceId } = useParams()
  const navigate = useNavigate()
  const [instance, setInstance] = useState(null)
  const [connectionInfo, setConnectionInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetchInstanceDetails()
    fetchConnectionInfo()
  }, [instanceId])

  const fetchInstanceDetails = async () => {
    try {
      const response = await axios.get(`/api/ec2/${instanceId}`)
      setInstance(response.data.instance)
    } catch (error) {
      console.error('Failed to fetch instance details:', error)
      toast.error('Failed to load instance details')
      navigate('/instances')
    }
  }

  const fetchConnectionInfo = async () => {
    try {
      const response = await axios.get(`/api/database/${instanceId}/connection`)
      setConnectionInfo(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch connection info:', error)
      setLoading(false)
    }
  }

  const handleInstanceAction = async (action) => {
    setActionLoading(action)
    
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
            navigate('/instances')
            return
          } else {
            setActionLoading(null)
            return
          }
        default:
          break
      }
      
      fetchInstanceDetails()
    } catch (error) {
      console.error(`Failed to ${action} instance:`, error)
      toast.error(`Failed to ${action} instance`)
    } finally {
      setActionLoading(null)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!instance) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Instance not found</h1>
          <Link to="/instances" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Back to Instances
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/instances')}
          className="flex items-center text-gray-400 hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Instances
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{instance.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              {getStatusIcon(instance.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(instance.status)}`}>
                {instance.status}
              </span>
              <span className="text-gray-300">
                {instance.databaseType} {instance.databaseVersion} • {instance.instanceType}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                fetchInstanceDetails()
                fetchConnectionInfo()
              }}
              className="btn-secondary flex items-center"
              title="Refresh instance data"
            >
              <Settings className="h-4 w-4 mr-2" />
              Refresh
            </button>

            {instance.status === 'stopped' && (
              <button
                onClick={() => handleInstanceAction('start')}
                disabled={actionLoading === 'start'}
                className="btn-primary flex items-center"
              >
                {actionLoading === 'start' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Start
              </button>
            )}

            {instance.status === 'running' && (
              <button
                onClick={() => handleInstanceAction('stop')}
                disabled={actionLoading === 'stop'}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                {actionLoading === 'stop' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Square className="h-4 w-4 mr-2" />
                )}
                Stop
              </button>
            )}

            <button
              onClick={() => handleInstanceAction('terminate')}
              disabled={actionLoading === 'terminate'}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              {actionLoading === 'terminate' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Terminate
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Connection Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Connection Information</h2>
            
            {connectionInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Public IP Address</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={instance.networkConfig?.publicIp || connectionInfo.host || 'Not assigned'}
                        readOnly
                        className="input-field flex-1"
                      />
                      <button
                        onClick={() => copyToClipboard(instance.networkConfig?.publicIp || connectionInfo.host)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                        disabled={!instance.networkConfig?.publicIp && !connectionInfo.host}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                    <input
                      type="text"
                      value={connectionInfo.port || 'N/A'}
                      readOnly
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={instance.masterUsername}
                      readOnly
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value="••••••••••••"
                        readOnly
                        className="input-field flex-1"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Connection String</h3>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white p-2 rounded border text-sm">
                      {instance.databaseType}://{instance.masterUsername}:password@{instance.networkConfig?.publicIp || connectionInfo.host || 'IP_ADDRESS'}:{connectionInfo.port || instance.databasePort}/postgres
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${instance.databaseType}://${instance.masterUsername}:password@${instance.networkConfig?.publicIp || connectionInfo.host || 'IP_ADDRESS'}:${connectionInfo.port || instance.databasePort}/postgres`)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Connection information not available</p>
            )}
          </motion.div>

          {/* Instance Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Instance Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Database Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engine:</span>
                    <span className="font-medium">{instance.databaseType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">{instance.databaseVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Instance Class:</span>
                    <span className="font-medium">{instance.instanceType}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Network & Instance Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Public IP:</span>
                    <span className="font-medium font-mono text-xs">{instance.networkConfig?.publicIp || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Private IP:</span>
                    <span className="font-medium font-mono text-xs">{instance.networkConfig?.privateIp || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium">{instance.region || 'ap-south-1'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{new Date(instance.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Instance ID:</span>
                    <span className="font-medium font-mono text-xs">{instance.instanceId}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                to={`/instances/${instanceId}/database`}
                className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">Create and manage database users</p>
                </div>
              </Link>
              
              <Link
                to={`/instances/${instanceId}/logs`}
                className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">View Logs</p>
                  <p className="text-sm text-gray-600">Monitor instance logs</p>
                </div>
              </Link>
              
              <button className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Network className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Network Settings</p>
                  <p className="text-sm text-gray-600">Configure security groups</p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Monitoring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monitoring</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="text-sm font-medium">34%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Storage Usage</span>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default InstanceDetails 