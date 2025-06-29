import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Settings, 
  LogOut, 
  Home,
  Bell,
  Mail
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const userMetadata = user?.user_metadata || {}
  const firstName = userMetadata.first_name || ''
  const lastName = userMetadata.last_name || ''
  const fullName = userMetadata.full_name || `${firstName} ${lastName}`.trim() || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <a
              href="#"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5 mr-3" />
              Messages
            </a>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, {firstName || 'User'}!</h2>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{fullName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900">{fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-gray-900 text-xs font-mono">{user?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Logins</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Login</span>
                    <span className="font-semibold">Today</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Logged in successfully</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Profile updated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Password changed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Message */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to your Dashboard!
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  This is your personal dashboard where you can manage your account, 
                  view your activity, and access all the features of our platform. 
                  Use the sidebar to navigate between different sections.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button>
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}