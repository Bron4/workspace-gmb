import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, RefreshCw, Image as ImageIcon } from "lucide-react"
import { approvePosts, GeneratedPost } from "@/api/posts"
import { useToast } from "@/hooks/useToast"

export function ContentReview() {
  const { postId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [posts, setPosts] = useState<GeneratedPost[]>([])
  const [sessionId, setSessionId] = useState('')
  const [editedPosts, setEditedPosts] = useState<{ [key: string]: string }>({})
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    if (location.state?.posts && location.state?.sessionId) {
      console.log("Loading posts for review:", location.state.posts)
      setPosts(location.state.posts)
      setSessionId(location.state.sessionId)
      
      // Initialize edited posts with original content
      const initialEdited: { [key: string]: string } = {}
      location.state.posts.forEach((post: GeneratedPost) => {
        initialEdited[post.locationId] = post.content
      })
      setEditedPosts(initialEdited)
    } else {
      // If no state, redirect back to create post
      navigate('/create-post')
    }
  }, [location.state, navigate])

  const handleContentChange = (locationId: string, content: string) => {
    setEditedPosts(prev => ({
      ...prev,
      [locationId]: content
    }))
  }

  const handleRegenerateText = (locationId: string) => {
    // In a real app, this would call the API to regenerate text
    toast({
      title: "Text Regenerated",
      description: "New content has been generated for this location.",
    })
  }

  const handleRegenerateImage = (locationId: string) => {
    // In a real app, this would call the API to regenerate image
    toast({
      title: "Image Regenerated",
      description: "New image has been generated for this location.",
    })
  }

  const handleApproveAll = async () => {
    try {
      setApproving(true)
      console.log("Approving all posts")
      
      const postsToApprove = posts.map(post => ({
        locationId: post.locationId,
        content: editedPosts[post.locationId] || post.content
      }))

      await approvePosts(sessionId, postsToApprove)
      
      toast({
        title: "Success",
        description: "All posts have been approved successfully!",
      })
      
      navigate('/approved-posts')
    } catch (error) {
      console.error("Error approving posts:", error)
      toast({
        title: "Error",
        description: "Failed to approve posts",
        variant: "destructive",
      })
    } finally {
      setApproving(false)
    }
  }

  const handleApprovePost = async (locationId: string) => {
    try {
      console.log("Approving single post for location:", locationId)
      
      const postToApprove = [{
        locationId,
        content: editedPosts[locationId] || posts.find(p => p.locationId === locationId)?.content || ''
      }]

      await approvePosts(sessionId, postToApprove)
      
      toast({
        title: "Success",
        description: "Post approved successfully!",
      })
      
      navigate('/approved-posts')
    } catch (error) {
      console.error("Error approving post:", error)
      toast({
        title: "Error",
        description: "Failed to approve post",
        variant: "destructive",
      })
    }
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading posts for review...</p>
        </div>
      </div>
    )
  }

  const isSingleLocation = posts.length === 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/create-post')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Content Review
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Review and edit your generated content before approval.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isSingleLocation && (
            <Button
              onClick={handleApproveAll}
              disabled={approving}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve All Posts
            </Button>
          )}
        </div>
      </div>

      {isSingleLocation ? (
        // Single Location View
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{posts[0].locationName}</span>
              <Badge variant="outline">Single Location</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Post Content</label>
                <Button variant="outline" size="sm" onClick={() => handleRegenerateText(posts[0].locationId)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Text
                </Button>
              </div>
              <Textarea
                value={editedPosts[posts[0].locationId] || posts[0].content}
                onChange={(e) => handleContentChange(posts[0].locationId, e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Generated Image</label>
                <Button variant="outline" size="sm" onClick={() => handleRegenerateImage(posts[0].locationId)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Image
                </Button>
              </div>
              <div className="relative">
                <img
                  src={posts[0].imageUrl}
                  alt="Generated content"
                  className="w-full max-w-md rounded-lg shadow-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Website link (automatically appended):</p>
              <p className="text-sm font-mono">https://www.bateselectric.com</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate('/create-post')}>
                Back to Edit
              </Button>
              <Button
                onClick={() => handleApprovePost(posts[0].locationId)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Multiple Locations View
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Multiple Locations Review</span>
              <Badge variant="outline">{posts.length} Locations</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={posts[0]?.locationId} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {posts.map((post) => (
                  <TabsTrigger key={post.locationId} value={post.locationId} className="text-xs">
                    {post.locationName.split(',')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {posts.map((post) => (
                <TabsContent key={post.locationId} value={post.locationId} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Post Content for {post.locationName}</label>
                      <Button variant="outline" size="sm" onClick={() => handleRegenerateText(post.locationId)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate Text
                      </Button>
                    </div>
                    <Textarea
                      value={editedPosts[post.locationId] || post.content}
                      onChange={(e) => handleContentChange(post.locationId, e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Generated Image</label>
                      <Button variant="outline" size="sm" onClick={() => handleRegenerateImage(post.locationId)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate Image
                      </Button>
                    </div>
                    <div className="relative">
                      <ImageWithFallback
                        src={post.imageUrl}
                        alt="Generated content"
                        className="w-full max-w-md rounded-lg shadow-lg"
                        fallbackClassName="w-full max-w-md h-64 rounded-lg shadow-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/50 text-white">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Website link (automatically appended):</p>
                    <p className="text-sm font-mono">https://www.bateselectric.com</p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleApprovePost(post.locationId)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve This Post
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}