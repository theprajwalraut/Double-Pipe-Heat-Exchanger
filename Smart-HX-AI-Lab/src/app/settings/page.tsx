'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell,
  RefreshCw,
  Globe,
  Save,
  User,
  Shield
} from 'lucide-react'

export default function SettingsPage() {
  const { settings, updateSettings, user, notifications, clearNotifications } = useAppStore()

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value })
  }

  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode
    updateSettings({ darkMode: newDarkMode })
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and account settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for system events
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Unread Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  {notifications.filter(n => !n.read).length} unread
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={clearNotifications}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Refresh Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Data Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update dashboard data
                </p>
              </div>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
              <Select 
                value={settings.refreshInterval.toString()} 
                onValueChange={(value) => handleSettingChange('refreshInterval', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">5 seconds</SelectItem>
                  <SelectItem value="10000">10 seconds</SelectItem>
                  <SelectItem value="30000">30 seconds</SelectItem>
                  <SelectItem value="60000">1 minute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                value={user?.name || 'Guest User'}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                value={user?.email || 'guest@example.com'}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <Input
                id="userRole"
                value={user?.role || 'user'}
                readOnly
                className="bg-muted"
              />
            </div>

            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Application</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Version: 1.0.0</p>
                  <p>Build: 2024.01.15</p>
                  <p>Environment: Development</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Performance</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Uptime: 2h 34m</p>
                  <p>Memory Usage: 45.2 MB</p>
                  <p>Cache Size: 12.8 MB</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Storage</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Local Storage: 2.1 MB</p>
                  <p>Session Data: 0.8 MB</p>
                  <p>Cached Files: 5.3 MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                Export Settings
              </Button>
              <Button variant="outline">
                Import Settings
              </Button>
              <Button variant="outline">
                Reset to Defaults
              </Button>
              <Button variant="outline">
                Clear Cache
              </Button>
              <Button variant="destructive">
                Reset Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}