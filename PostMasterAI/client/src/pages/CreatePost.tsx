import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { PlusCircle, MapPin, Settings, Image, Loader2 } from "lucide-react"
import { getLocations, Location } from "@/api/locations"
import { generatePosts, CreatePostData } from "@/api/posts"
import { useToast } from "@/hooks/useToast"
import { useNavigate } from "react-router-dom"

const POST_TYPES = [
  'Educational Content',
  'Promotional Content',
  'Emergency Services',
  'Seasonal Maintenance',
  'Weather-Related Safety',
  'Holiday/Seasonal'
]

const CONTENT_FOCUS = [
  'Safety Tips',
  'Maintenance Reminders',
  'Service Highlights',
  'Storm Preparation',
  'Energy Efficiency',
  'Custom Topic'
]

const IMAGE_STYLES = [
  'Professional Photography',
  'Clean Infographic',
  'Illustration Style',
  'Before/After Comparison',
  'Safety/Educational Diagram',
  'Seasonal/Holiday Themed'
]

export function CreatePost() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [locationType, setLocationType] = useState<'single' | 'multiple'>('single')
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([])
  const [postType, setPostType] = useState('')
  const [contentFocus, setContentFocus] = useState('')
  const [imageStyle, setImageStyle] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      console.log("Fetching locations for post creation")
      const response = await getLocations() as any
      setLocations(response.locations)
    } catch (error) {
      console.error("Error fetching locations:", error)
      toast({
        title: "Error",
        description: "Failed to load locations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLocationToggle = (locationId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocationIds([...selectedLocationIds, locationId])
    } else {
      setSelectedLocationIds(selectedLocationIds.filter(id => id !== locationId))
    }
  }

  const handleSelectAll = () => {
    setSelectedLocationIds(locations.map(loc => loc._id))
  }

  const handleClearAll = () => {
    setSelectedLocationIds([])
  }

  const handleGenerate = async () => {
    if (!postType || !contentFocus || !imageStyle) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const locationIds = locationType === 'single'
      ? [selectedLocationId]
      : selectedLocationIds

    if (locationIds.length === 0 || (locationType === 'single' && !selectedLocationId)) {
      toast({
        title: "Error",
        description: "Please select at least one location",
        variant: "destructive",
      })
      return
    }

    if (contentFocus === 'Custom Topic' && !customTopic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom topic",
        variant: "destructive",
      })
      return
    }

    const postData: CreatePostData = {
      locationIds,
      postType,
      contentFocus,
      imageStyle,
      customTopic: contentFocus === 'Custom Topic' ? customTopic : undefined
    }

    try {
      setGenerating(true)
      console.log("Generating posts with data:", postData)
      const response = await generatePosts(postData) as any

      toast({
        title: "Success",
        description: "Posts generated successfully!",
      })

      // Navigate to review page with session ID
      navigate(`/review/${response.sessionId}`, {
        state: {
          posts: response.posts,
          sessionId: response.sessionId
        }
      })
    } catch (error) {
      console.error("Error generating posts:", error)
      toast({
        title: "Error",
        description: "Failed to generate posts",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate AI-powered content for your Google Business Profile locations.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Step 1: Location Selection */}
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Step 1: Location Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={locationType} onValueChange={(value: 'single' | 'multiple') => setLocationType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single Location</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple">Multiple Locations</Label>
              </div>
            </RadioGroup>

            {locationType === 'single' ? (
              <div>
                <Label>Select Location</Label>
                <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900">
                    {locations.map((location) => (
                      <SelectItem key={location._id} value={location._id}>
                        {location.city}, {location.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Select Locations ({selectedLocationIds.length} selected)</Label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClearAll}>
                      Clear All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {locations.map((location) => (
                    <div key={location._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={location._id}
                        checked={selectedLocationIds.includes(location._id)}
                        onCheckedChange={(checked) => handleLocationToggle(location._id, checked as boolean)}
                      />
                      <Label htmlFor={location._id} className="text-sm">
                        {location.city}, {location.state}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Content Settings */}
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Step 2: Content Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Post Type</Label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900">
                  {POST_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Content Focus</Label>
              <Select value={contentFocus} onValueChange={setContentFocus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content focus" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900">
                  {CONTENT_FOCUS.map((focus) => (
                    <SelectItem key={focus} value={focus}>
                      {focus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {contentFocus === 'Custom Topic' && (
              <div>
                <Label>Custom Topic</Label>
                <Input
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter your custom topic"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Image Style Selection */}
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Step 3: Image Style Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Image Style</Label>
              <Select value={imageStyle} onValueChange={setImageStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select image style" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900">
                  {IMAGE_STYLES.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Generate Content */}
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Step 4: Generate Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 h-12 text-lg"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating content and images...
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Generate Posts
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}