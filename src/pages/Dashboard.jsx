import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { 
  Database, 
  Server, 
  Activity, 
  Users, 
  Plus,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Square,
  MoreVertical,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Zap,
  Globe
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [instances, setInstances] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    stopped: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [instancesRes] = await Promise.all([
        axios.get('/api/ec2/list')
      ])

      const instancesData = instancesRes.data.instances || []
      setInstances(instancesData.slice(0, 5)) // Show only first 5 for dashboard

      // Calculate stats
      const runningCount = instancesData.filter(i => i.status === 'running').length
      const stoppedCount = instancesData.filter(i => i.status === 'stopped').length
      
      setStats({
        total: instancesData.length,
        running: runningCount,
        stopped: stoppedCount,
        totalUsers: instancesData.reduce((acc, instance) => acc + (instance.userCount || 0), 0)
      })

      // Mock recent activity
      setRecentActivity([
        { id: 1, action: 'Instance created', instance: 'prod-db-01', time: '2 minutes ago', type: 'create' },
        { id: 2, action: 'User added', instance: 'dev-db-02', time: '15 minutes ago', type: 'user' },
        { id: 3, action: 'Instance started', instance: 'staging-db', time: '1 hour ago', type: 'start' },
        { id: 4, action: 'Backup completed', instance: 'prod-db-01', time: '2 hours ago', type: 'backup' },
      ])

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setLoading(false)
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

  // Mock data for the chart
  const chartData = [
    { name: 'Mon', instances: 4 },
    { name: 'Tue', instances: 6 },
    { name: 'Wed', instances: 8 },
    { name: 'Thu', instances: 7 },
    { name: 'Fri', instances: 9 },
    { name: 'Sat', instances: 8 },
    { name: 'Sun', instances: 10 },
  ]

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
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300 mt-2">Welcome back! Here's an overview of your database instances.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-6 hover:border-primary-500 transition-colors duration-300"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Database className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Instances</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-6 hover:border-primary-500 transition-colors duration-300"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Running</p>
              <p className="text-2xl font-bold text-white">{stats.running}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-6 hover:border-primary-500 transition-colors duration-300"
        >
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Stopped</p>
              <p className="text-2xl font-bold text-white">{stats.stopped}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-6 hover:border-primary-500 transition-colors duration-300"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Instances */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Instances</h2>
                <Link
                  to="/instances"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {instances.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No instances yet</h3>
                  <p className="text-gray-300 mb-4">Get started by creating your first database instance.</p>
                  <Link
                    to="/instances/create"
                    className="btn-primary inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Instance
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {instances.map((instance) => (
                    <div 
                      key={instance.instanceId} 
                      className="flex items-center justify-between p-4 border border-dark-600 rounded-lg hover:bg-dark-700 hover:border-primary-500 transition-all cursor-pointer"
                      onClick={() => window.location.href = `/instances/${instance.instanceId}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Database className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{instance.name}</h3>
                          <p className="text-sm text-gray-300">
                            {instance.databaseType} • {instance.instanceType}
                            {instance.networkConfig?.publicIp && (
                              <span className="text-green-600 ml-2">• IP: {instance.networkConfig.publicIp}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(instance.status)}`}>
                          {instance.status}
                        </span>
                        <div className="text-primary-600">
                          <MoreVertical className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Activity Feed & Chart */}
        <div className="space-y-8">
          {/* Usage Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Instance Usage</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="instances" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="bg-primary-100 p-1 rounded-full">
                      <Activity className="h-3 w-3 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span> on{' '}
                        <span className="font-medium">{activity.instance}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Ready to deploy?</h2>
            <p className="text-primary-100">Create a new database instance in just a few clicks.</p>
          </div>
          <Link
            to="/instances/create"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Instance
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard 