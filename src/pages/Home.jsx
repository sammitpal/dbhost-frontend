import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Database, 
  Zap, 
  Shield, 
  Clock, 
  Server, 
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  Cpu,
  HardDrive,
  Wifi,
  HeadphonesIcon,
  Mail,
  Phone
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: <Database className="h-8 w-8" />,
      title: "Multiple Database Types",
      description: "Support for PostgreSQL, MySQL, and more database engines"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Setup",
      description: "Deploy your database instance in minutes, not hours"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Advanced security features and encrypted connections"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Monitoring",
      description: "Real-time monitoring and automated backups"
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "Scalable Infrastructure",
      description: "Scale up or down based on your needs"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Availability",
      description: "Deploy in multiple AWS regions worldwide"
    }
  ]

  const plans = [
    {
      name: "Starter",
      ram: "2 GB RAM",
      price: "$9.99",
      description: "Perfect for small projects and development",
      icon: <Database className="h-8 w-8" />,
      features: [
        { text: "2 GB RAM", icon: <Cpu className="h-4 w-4" /> },
        { text: "20 GB SSD Storage", icon: <HardDrive className="h-4 w-4" /> },
        { text: "Basic monitoring", icon: <Clock className="h-4 w-4" /> },
        { text: "Email support", icon: <Mail className="h-4 w-4" /> }
      ]
    },
    {
      name: "Professional",
      ram: "4 GB RAM",
      price: "$19.99",
      description: "Ideal for production applications",
      icon: <Server className="h-8 w-8" />,
      features: [
        { text: "4 GB RAM", icon: <Cpu className="h-4 w-4" /> },
        { text: "50 GB SSD Storage", icon: <HardDrive className="h-4 w-4" /> },
        { text: "Advanced monitoring", icon: <Clock className="h-4 w-4" /> },
        { text: "Priority support", icon: <HeadphonesIcon className="h-4 w-4" /> },
        { text: "Automated backups", icon: <Shield className="h-4 w-4" /> }
      ],
      popular: true
    },
    {
      name: "Enterprise",
      ram: "8 GB RAM",
      price: "$39.99",
      description: "For high-performance applications",
      icon: <Globe className="h-8 w-8" />,
      features: [
        { text: "8 GB RAM", icon: <Cpu className="h-4 w-4" /> },
        { text: "100 GB SSD Storage", icon: <HardDrive className="h-4 w-4" /> },
        { text: "Real-time monitoring", icon: <Clock className="h-4 w-4" /> },
        { text: "24/7 phone support", icon: <Phone className="h-4 w-4" /> },
        { text: "Automated backups", icon: <Shield className="h-4 w-4" /> },
        { text: "Multi-region deployment", icon: <Wifi className="h-4 w-4" /> }
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Database Hosting
              <span className="block text-primary-400">Made Easy!</span>
            </h1>
                          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Deploy and manage your databases in the cloud with just a few clicks. 
              Powered by AWS infrastructure for maximum reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Link
                  to="/register"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-primary-500 text-primary-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-600 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Database className="h-16 w-16 animate-pulse-slow" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Server className="h-20 w-20 animate-pulse-slow" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose DBHost?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We provide enterprise-grade database hosting with the simplicity you need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-dark-700 border border-dark-600 p-8 rounded-xl hover:shadow-lg hover:border-primary-500 transition-all duration-300"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your database hosting needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-dark-800 border border-dark-600 rounded-xl p-8 shadow-lg relative ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105 border-primary-500' : 'hover:border-primary-600'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary-600 p-3 rounded-lg text-white">
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-300 mb-4">{plan.ram}</p>
                  <div className="text-4xl font-bold text-primary-400 mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-400 font-normal">/mo</span>
                  </div>
                  <p className="text-gray-300">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="text-primary-400 mr-3">
                        {feature.icon}
                      </div>
                      <span className="text-gray-300">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-center block transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-dark-700 text-gray-200 hover:bg-dark-600 border border-dark-600'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of developers who trust DBHost for their database hosting needs
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 