import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Settings as SettingsIcon, Key, Bell, Palette, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { getSettings, updateSettings, testApiConnection, Settings as SettingsType } from "@/api/settings"
import { useToast } from "@/hooks/useToast"

export function Settings() {
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingGoogle, setTestingGoogle] = useState(false)
  const [testingOpenAI, setTestingOpenAI] = useState(false)
  const [googleStatus, setGoogleStatus] = useState<'success' | 'error' | null>(null)
  const [openaiStatus, setOpenaiStatus] = useState<'success' | 'error' | null>(null)
  const [callToActionsText, setCallToActionsText] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      console.log("Fetching settings")
      const response = await getSettings() as any
      setSettings(response.settings)
      setCallToActionsText(response.settings.defaultCallToActions.join('\n'))
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    try {
      setSaving(true)
      console.log("Saving settings")

      const callToActions = callToActionsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)

      const updatedSettings = {
        ...settings,
        defaultCallToActions: callToActions
      }

      await updateSettings(updatedSettings)
      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async (apiType: 'google' | 'openai') => {
    if (!settings) return

    const apiKey = apiType === 'google' ? settings.googleApiKey : settings.openaiApiKey
    const setTesting = apiType === 'google' ? setTestingGoogle : setTestingOpenAI
    const setStatus = apiType === 'google' ? setGoogleStatus : setOpenaiStatus

    try {
      setTesting(true)
      console.log(`Testing ${apiType} API connection`)
      const response = await testApiConnection(apiType, apiKey) as any

      setStatus(response.success ? 'success' : 'error')
      toast({
        title: response.success ? "Success" : "Error",
        description: response.message,
        variant: response.success ? "default" : "destructive",
      })
    } catch (error) {
      console.error(`Error testing ${apiType} connection:`, error)
      setStatus('error')
      toast({
        title: "Error",
        description: "Failed to test connection",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = (status: 'success' | 'error' | null) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure your API keys, content preferences, and notification settings.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>

      {/* API Configuration */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="googleApiKey">Google Business Profile API Key</Label>
            <div className="flex gap-2">
              <Input
                id="googleApiKey"
                type="password"
                value={settings.googleApiKey}
                onChange={(e) => setSettings({ ...settings, googleApiKey: e.target.value })}
                placeholder="Enter your Google API key"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => handleTestConnection('google')}
                disabled={testingGoogle}
              >
                {testingGoogle ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Test Connection
                    {getStatusIcon(googleStatus)}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
            <div className="flex gap-2">
              <Input
                id="openaiApiKey"
                type="password"
                value={settings.openaiApiKey}
                onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                placeholder="Enter your OpenAI API key"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => handleTestConnection('openai')}
                disabled={testingOpenAI}
              >
                {testingOpenAI ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Test Connection
                    {getStatusIcon(openaiStatus)}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Preferences */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Content Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include weather-triggered suggestions</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically suggest weather-related electrical safety content
              </p>
            </div>
            <Switch
              checked={settings.weatherEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, weatherEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-generate seasonal content</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create seasonal maintenance and holiday-themed posts automatically
              </p>
            </div>
            <Switch
              checked={settings.seasonalContentEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, seasonalContentEnabled: checked })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Content variation level</Label>
              <Badge variant="outline">{settings.contentVariationLevel}%</Badge>
            </div>
            <Slider
              value={[settings.contentVariationLevel]}
              onValueChange={(value) => setSettings({ ...settings, contentVariationLevel: value[0] })}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low variation</span>
              <span>High variation</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="callToActions">Default call-to-action phrases</Label>
            <Textarea
              id="callToActions"
              value={callToActionsText}
              onChange={(e) => setCallToActionsText(e.target.value)}
              placeholder="Enter one call-to-action per line"
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Enter one call-to-action phrase per line. These will be randomly selected for posts.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email notifications for successful posts</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when posts are successfully published
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email notifications for errors</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when posts fail to publish or other errors occur
              </p>
            </div>
            <Switch
              checked={settings.errorNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, errorNotifications: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationEmail">Notification email address</Label>
            <Input
              id="notificationEmail"
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              placeholder="Enter email address for notifications"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}