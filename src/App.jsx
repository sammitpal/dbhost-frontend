import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Instances from './pages/Instances'
import CreateInstance from './pages/CreateInstance'
import InstanceDetails from './pages/InstanceDetails'
import DatabaseManagement from './pages/DatabaseManagement'
import Logs from './pages/Logs'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/instances" element={
              <ProtectedRoute>
                <Instances />
              </ProtectedRoute>
            } />
            <Route path="/instances/create" element={
              <ProtectedRoute>
                <CreateInstance />
              </ProtectedRoute>
            } />
            <Route path="/instances/:instanceId" element={
              <ProtectedRoute>
                <InstanceDetails />
              </ProtectedRoute>
            } />
            <Route path="/instances/:instanceId/database" element={
              <ProtectedRoute>
                <DatabaseManagement />
              </ProtectedRoute>
            } />
            <Route path="/instances/:instanceId/logs" element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App
