import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Send, Calendar, Edit, Clock } from "lucide-react"
import { getApprovedPosts, publishPost, schedulePost, Post } from "@/api/posts"
import { useToast } from "@/hooks/useToast"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageWithFallback } from "@/components/ImageWithFallback"

export function ApprovedPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [schedulingPost, setSchedulingPost] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchApprovedPosts()
  }, [])

  const fetchApprovedPosts = async () => {
    try {
      console.log("Fetching approved posts")
      const response = await getApprovedPosts() as any
      setPosts(response.posts)
    } catch (error) {
      console.error("Error fetching approved posts:", error)
      toast({
        title: "Error",
        description: "Failed to load approved posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePostNow = async (postId: string) => {
    try {
      console.log("Publishing post immediately:", postId)
      await publishPost(postId)
      toast({
        title: "Success",
        description: "Post published successfully!",
      })
      fetchApprovedPosts()
    } catch (error) {
      console.error("Error publishing post:", error)
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive",
      })
    }
  }

  const handleSchedulePost = async () => {
    if (!schedulingPost || !scheduleDate || !scheduleTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      })
      return
    }

    try {
      const scheduledFor = `${scheduleDate}T${scheduleTime}:00.000Z`
      console.log("Scheduling post:", schedulingPost, "for:", scheduledFor)
      await schedulePost(schedulingPost, scheduledFor)
      toast({
        title: "Success",
        description: "Post scheduled successfully!",
      })
      setSchedulingPost(null)
      setScheduleDate('')
      setScheduleTime('')
      fetchApprovedPosts()
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive",
      })
    }
  }

  const handlePostSelected = async () => {
    if (selectedPosts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one post",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("Publishing selected posts:", selectedPosts)
      await Promise.all(selectedPosts.map(postId => publishPost(postId)))
      toast({
        title: "Success",
        description: `${selectedPosts.length} posts published successfully!`,
      })
      setSelectedPosts([])
      fetchApprovedPosts()
    } catch (error) {
      console.error("Error publishing selected posts:", error)
      toast({
        title: "Error",
        description: "Failed to publish selected posts",
        variant: "destructive",
      })
    }
  }

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId])
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId))
    }
  }

  const handleSelectAll = () => {
    setSelectedPosts(posts.map(post => post._id))
  }

  const handleClearAll = () => {
    setSelectedPosts([])
  }

  const truncateContent = (content: string, maxLength: number = 120) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
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
            Approved Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Posts ready to be published to your Google Business Profile locations.
          </p>
        </div>

        {selectedPosts.length > 0 && (
          <div className="flex gap-2">
            <Button onClick={handlePostSelected} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Send className="h-4 w-4 mr-2" />
              Post Selected Now ({selectedPosts.length})
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Selected
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-900">
                <DialogHeader>
                  <DialogTitle>Schedule Selected Posts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setScheduleDate('')
                      setScheduleTime('')
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSchedulePost}>
                      Schedule Posts
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Posts Queue ({posts.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post._id} className="bg-gray-50 dark:bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedPosts.includes(post._id)}
                        onCheckedChange={(checked) => handleSelectPost(post._id, checked as boolean)}
                      />

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{post.locationName}</Badge>
                            <Badge variant="secondary">{post.postType}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {format(new Date(post.createdAt), 'MMM dd, HH:mm')}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {truncateContent(post.content)}
                            </p>
                          </div>
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            <ImageWithFallback
                              src={post.imageUrl}
                              alt="Post preview"
                              className="w-full h-full object-cover"
                              fallbackClassName="w-20 h-20 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Approved: {format(new Date(post.updatedAt), 'MMM dd, HH:mm')}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSchedulingPost(post._id)}>
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Schedule
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white dark:bg-gray-900">
                                <DialogHeader>
                                  <DialogTitle>Schedule Post</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                      id="date"
                                      type="date"
                                      value={scheduleDate}
                                      onChange={(e) => setScheduleDate(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                      id="time"
                                      type="time"
                                      value={scheduleTime}
                                      onChange={(e) => setScheduleTime(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => {
                                      setSchedulingPost(null)
                                      setScheduleDate('')
                                      setScheduleTime('')
                                    }}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleSchedulePost}>
                                      Schedule Post
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              onClick={() => handlePostNow(post._id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Post Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && posts.length === 0 && (
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              No approved posts waiting
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Create and approve some posts to see them here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}