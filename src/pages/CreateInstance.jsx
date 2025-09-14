import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Database, 
  Server, 
  Shield, 
  Settings,
  ArrowLeft,
  CheckCircle,
  Info
} from 'lucide-react'

const CreateInstance = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      databaseType: 'postgresql',
      databaseVersion: '13',
      instanceType: 't3.micro',
      masterUsername: 'dbadmin'
    }
  })

  const databaseType = watch('databaseType')
  const instanceType = watch('instanceType')

  const databaseOptions = {
    postgresql: {
      name: 'PostgreSQL',
      versions: ['13', '14', '15'],
      defaultPort: 5432,
      icon: <Database className="h-6 w-6" />
    },
    mysql: {
      name: 'MySQL',
      versions: ['8.0', '5.7'],
      defaultPort: 3306,
      icon: <Database className="h-6 w-6" />
    }
  }

  const instanceTypes = [
    {
      type: 't3.micro',
      name: 'Micro',
      vcpu: '2 vCPUs',
      memory: '1 GB RAM',
      price: '$9.99/month',
      description: 'Perfect for development and testing'
    },
    {
      type: 't3.small',
      name: 'Small',
      vcpu: '2 vCPUs',
      memory: '2 GB RAM',
      price: '$19.99/month',
      description: 'Good for small production workloads'
    },
    {
      type: 't3.medium',
      name: 'Medium',
      vcpu: '2 vCPUs',
      memory: '4 GB RAM',
      price: '$39.99/month',
      description: 'Ideal for medium-sized applications'
    },
    {
      type: 't3.large',
      name: 'Large',
      vcpu: '2 vCPUs',
      memory: '8 GB RAM',
      price: '$79.99/month',
      description: 'For high-performance applications'
    }
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      const response = await axios.post('/api/ec2/create', data)
      toast.success('Instance creation started! This may take a few minutes.')
      navigate('/instances')
    } catch (error) {
      console.error('Failed to create instance:', error)
      const message = error.response?.data?.error?.message || 'Failed to create instance'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { id: 1, name: 'Database Configuration', icon: <Database className="h-5 w-5" /> },
    { id: 2, name: 'Instance Settings', icon: <Server className="h-5 w-5" /> },
    { id: 3, name: 'Security & Access', icon: <Shield className="h-5 w-5" /> },
    { id: 4, name: 'Review & Create', icon: <CheckCircle className="h-5 w-5" /> }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/instances')}
          className="flex items-center text-gray-400 hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Instances
        </button>
        <h1 className="text-3xl font-bold text-white">Create Database Instance</h1>
        <p className="text-gray-300 mt-2">Deploy a new database instance in the cloud</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-primary-400' : 'text-gray-400'
                }`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-8"
        >
          {/* Step 1: Database Configuration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Database Configuration</h2>
              
              {/* Instance Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instance Name
                </label>
                <input
                  {...register('name', {
                    required: 'Instance name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9-]+$/,
                      message: 'Name can only contain letters, numbers, and hyphens'
                    }
                  })}
                  type="text"
                  className="input-field"
                  placeholder="my-database-server"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Database Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Database Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(databaseOptions).map(([key, db]) => (
                    <label key={key} className="relative">
                      <input
                        {...register('databaseType')}
                        type="radio"
                        value={key}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        databaseType === key
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${
                            databaseType === key ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {db.icon}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-white">{db.name}</p>
                            <p className="text-sm text-gray-400">Port {db.defaultPort}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Database Version */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Database Version
                </label>
                <select {...register('databaseVersion')} className="input-field">
                  {databaseOptions[databaseType]?.versions.map(version => (
                    <option key={version} value={version}>{version}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Instance Settings */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Instance Settings</h2>
              
              {/* Instance Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Instance Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {instanceTypes.map((instance) => (
                    <label key={instance.type} className="relative">
                      <input
                        {...register('instanceType')}
                        type="radio"
                        value={instance.type}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        instanceType === instance.type
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{instance.name}</h3>
                          <span className="text-lg font-bold text-primary-600">{instance.price}</span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>{instance.vcpu}</p>
                          <p>{instance.memory}</p>
                          <p className="text-xs">{instance.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Security & Access */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security & Access</h2>
              
              {/* Master Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Master Username
                </label>
                <input
                  {...register('masterUsername', {
                    required: 'Master username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    }
                  })}
                  type="text"
                  className="input-field"
                  placeholder="dbadmin"
                />
                {errors.masterUsername && (
                  <p className="mt-1 text-sm text-red-600">{errors.masterUsername.message}</p>
                )}
              </div>

              {/* Master Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Master Password
                </label>
                <input
                  {...register('masterPassword', {
                    required: 'Master password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: 'Password must contain uppercase, lowercase, number, and special character'
                    }
                  })}
                  type="password"
                  className="input-field"
                  placeholder="Enter a secure password"
                />
                {errors.masterPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.masterPassword.message}</p>
                )}
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Password Requirements:</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li>At least 8 characters long</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Contains at least one number</li>
                        <li>Contains at least one special character</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Create</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Instance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{watch('name')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Database:</span>
                    <p className="font-medium">
                      {databaseOptions[watch('databaseType')]?.name} {watch('databaseVersion')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Instance Type:</span>
                    <p className="font-medium">{watch('instanceType')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Master Username:</span>
                    <p className="font-medium">{watch('masterUsername')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <Info className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">Important Notes:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Instance creation may take 5-10 minutes</li>
                      <li>You will be charged based on your selected instance type</li>
                      <li>Make sure to save your master password securely</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Instance...
                  </div>
                ) : (
                  'Create Instance'
                )}
              </button>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  )
}

export default CreateInstance 