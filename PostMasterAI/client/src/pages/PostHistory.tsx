import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/useToast"
import { getPosts } from "@/api/posts"
import { getLocations } from "@/api/locations"
import { Download, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import { Fragment } from "react"

export function PostHistory() {
  const [posts, setPosts] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    location: "all",
    postType: "all"
  })
  const [expandedRows, setExpandedRows] = useState(new Set())
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log("Fetching post history and locations")
      const [postsData, locationsData] = await Promise.all([
        getPosts(),
        getLocations()
      ])
      console.log("PostHistory: Posts data received:", postsData.posts)
      console.log("PostHistory: Locations data received:", locationsData.locations)
      setPosts(postsData.posts || [])
      setLocations(locationsData.locations || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      // Mock export functionality for now
      toast({
        title: "Success",
        description: "Post history exported successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      })
    }
  }

  const handleRepost = async (postId: string) => {
    try {
      // Mock repost functionality for now
      toast({
        title: "Success",
        description: "Content reposted successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      })
    }
  }

  const toggleRowExpansion = (postId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedRows(newExpanded)
  }

  const postTypes = [
    { value: "educational", label: "Educational Content" },
    { value: "promotional", label: "Promotional Content" },
    { value: "emergency", label: "Emergency Services" },
    { value: "seasonal", label: "Seasonal Maintenance" },
    { value: "weather", label: "Weather-Related Safety" },
    { value: "holiday", label: "Holiday/Seasonal" }
  ]

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  console.log("PostHistory: About to render locations dropdown with:", locations.length, "locations")
  console.log("PostHistory: About to render post types dropdown with:", postTypes.length, "types")
  console.log("PostHistory: About to render posts table with:", posts.length, "posts")

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Post History</h1>
          <p className="text-muted-foreground">
            View and manage your published posts
          </p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export History
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Posts</CardTitle>
          <CardDescription>
            Filter your post history by date, location, and type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-locations" value="all">All Locations</SelectItem>
                  {locations.map((location) => {
                    console.log("PostHistory: Rendering location SelectItem with key:", location._id, "and value:", location._id)
                    return (
                      <SelectItem key={location._id} value={location._id}>
                        {location.businessName} - {location.city}, {location.state}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Post Type</Label>
              <Select value={filters.postType} onValueChange={(value) => setFilters(prev => ({ ...prev, postType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-types" value="all">All Types</SelectItem>
                  {postTypes.map((type) => {
                    console.log("PostHistory: Rendering postType SelectItem with key:", type.value, "and value:", type.value)
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={fetchData}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Post History</CardTitle>
          <CardDescription>
            {posts.length} posts found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Post Type</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => {
                console.log("PostHistory: Rendering post TableRow with key:", post._id)
                return (
                  <Fragment key={post._id}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(post._id)}
                        >
                          {expandedRows.has(post._id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>{new Date(post.publishedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{post.location?.businessName} - {post.location?.city}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post.postType}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {post.performance?.views || 0} views
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRepost(post._id)}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Repost
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(post._id) && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/50">
                          <div className="p-4 space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Full Content</h4>
                              <p className="text-sm">{post.content}</p>
                            </div>
                            {post.imageUrl && (
                              <div>
                                <h4 className="font-semibold mb-2">Image</h4>
                                <img
                                  src={post.imageUrl}
                                  alt="Post image"
                                  className="max-w-md rounded-lg"
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold mb-2">Performance Details</h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>Views: {post.performance?.views || 0}</div>
                                <div>Clicks: {post.performance?.clicks || 0}</div>
                                <div>Engagement: {post.performance?.engagement || 0}%</div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}