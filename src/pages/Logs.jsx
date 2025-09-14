import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  ArrowLeft,
  FileText,
  Download,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react'

const Logs = () => {
  const { instanceId } = useParams()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [logType, setLogType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const logsEndRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchLogs()
  }, [instanceId, logType])

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 5000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh])

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const fetchLogs = async () => {
    try {
      let endpoint = `/api/logs/${instanceId}`
      
      if (logType === 'database') {
        endpoint = `/api/logs/${instanceId}/database`
      } else if (logType === 'system') {
        endpoint = `/api/logs/${instanceId}/system`
      }

      const response = await axios.get(endpoint, {
        params: {
          lines: 100,
          startTime: dateFilter || undefined
        }
      })
      
      setLogs(response.data.logs || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
      toast.error('Failed to load logs')
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const downloadLogs = async () => {
    try {
      const response = await axios.get(`/api/logs/${instanceId}`, {
        params: { format: 'download' },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `instance-${instanceId}-logs.txt`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Logs downloaded successfully')
    } catch (error) {
      console.error('Failed to download logs:', error)
      toast.error('Failed to download logs')
    }
  }

  const getLogLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
      case 'warn':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'warning':
      case 'warn':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLevel = levelFilter === 'all' || log.level?.toLowerCase() === levelFilter.toLowerCase()
    
    return matchesSearch && matchesLevel
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
            <h1 className="text-3xl font-bold text-white">Instance Logs</h1>
            <p className="text-gray-300 mt-2">Monitor your database instance logs in real-time</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadLogs}
              className="btn-secondary inline-flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              onClick={fetchLogs}
              className="btn-secondary inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Log Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Log Type
            </label>
            <select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Logs</option>
              <option value="database">Database Logs</option>
              <option value="system">System Logs</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Levels</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Since
            </label>
            <input
              type="datetime-local"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Auto Refresh */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
            </label>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-300">
          <Filter className="h-4 w-4 mr-2" />
          Showing {filteredLogs.length} of {logs.length} log entries
        </div>
      </motion.div>

      {/* Logs Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Log Entries</h2>
            </div>
            {autoRefresh && (
              <div className="flex items-center text-sm text-green-600">
                <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Auto-refreshing
              </div>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-600">
                {logs.length === 0 
                  ? 'No logs are available for this instance yet.'
                  : 'No logs match your current filters.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getLogLevelColor(log.level)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getLogLevelIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {log.level && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogLevelColor(log.level)}`}>
                              {log.level.toUpperCase()}
                            </span>
                          )}
                          {log.source && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {log.source}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown time'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-mono whitespace-pre-wrap">
                        {log.message || 'No message'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Log Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {['error', 'warning', 'info', 'debug'].map((level) => {
          const count = logs.filter(log => log.level?.toLowerCase() === level).length
          return (
            <div key={level} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {getLogLevelIcon(level)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 capitalize">{level}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default Logs 