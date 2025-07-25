import api from './api';

export interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  postType: string;
  status: 'draft' | 'approved' | 'published' | 'scheduled';
  location: {
    _id: string;
    businessName: string;
    city: string;
    state: string;
  };
  publishedAt?: string;
  scheduledFor?: string;
  performance?: {
    views: number;
    clicks: number;
    engagement: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePostRequest {
  locations: string[];
  postType: string;
  contentFocus: string;
  imageStyle: string;
}

export interface GeneratedPost {
  locationId: string;
  content: string;
  imageUrl: string;
}

// Description: Generate posts for selected locations
// Endpoint: POST /api/posts/generate
// Request: { locations: string[], postType: string, contentFocus: string, imageStyle: string }
// Response: { posts: GeneratedPost[] }
export const generatePosts = async (data: GeneratePostRequest) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        posts: data.locations.map(locationId => ({
          locationId,
          content: `Sample ${data.postType} content for ${data.contentFocus}. This is a mock post generated for testing purposes.`,
          imageUrl: 'https://via.placeholder.com/400x300?text=Sample+Image'
        }))
      });
    }, 2000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/posts/generate', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get all posts
// Endpoint: GET /api/posts
// Request: {}
// Response: { posts: Post[] }
export const getPosts = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        posts: [
          {
            _id: '1',
            title: 'Electrical Safety Tips',
            content: 'Here are some important electrical safety tips for your home...',
            imageUrl: 'https://via.placeholder.com/400x300?text=Safety+Tips',
            postType: 'educational',
            status: 'published',
            location: {
              _id: 'loc1',
              businessName: 'Bates Electric',
              city: 'Houston',
              state: 'TX'
            },
            publishedAt: '2024-01-15T10:00:00Z',
            performance: {
              views: 150,
              clicks: 25,
              engagement: 16.7
            },
            createdAt: '2024-01-15T09:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            _id: '2',
            title: 'Storm Preparation',
            content: 'Prepare your electrical systems for the upcoming storm season...',
            imageUrl: 'https://via.placeholder.com/400x300?text=Storm+Prep',
            postType: 'weather',
            status: 'published',
            location: {
              _id: 'loc2',
              businessName: 'S.E. Bates Electric',
              city: 'Miami',
              state: 'FL'
            },
            publishedAt: '2024-01-14T14:30:00Z',
            performance: {
              views: 200,
              clicks: 35,
              engagement: 17.5
            },
            createdAt: '2024-01-14T13:30:00Z',
            updatedAt: '2024-01-14T14:30:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/posts');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Approve a single post
// Endpoint: PUT /api/posts/:id/approve
// Request: {}
// Response: { success: boolean, message: string }
export const approvePost = async (postId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Post approved successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/posts/${postId}/approve`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Approve multiple posts
// Endpoint: PUT /api/posts/approve-multiple
// Request: { postIds: string[] }
// Response: { success: boolean, message: string }
export const approvePosts = async (postIds: string[]) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `${postIds.length} posts approved successfully`
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/api/posts/approve-multiple', { postIds });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Publish a post
// Endpoint: PUT /api/posts/:id/publish
// Request: {}
// Response: { success: boolean, message: string }
export const publishPost = async (postId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Post published successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/posts/${postId}/publish`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Schedule a post
// Endpoint: PUT /api/posts/:id/schedule
// Request: { scheduledFor: string }
// Response: { success: boolean, message: string }
export const schedulePost = async (postId: string, scheduledFor: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Post scheduled successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/posts/${postId}/schedule`, { scheduledFor });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get approved posts
// Endpoint: GET /api/posts/approved
// Request: {}
// Response: { posts: Post[] }
export const getApprovedPosts = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        posts: [
          {
            _id: '3',
            title: 'Holiday Lighting Safety',
            content: 'Keep your holiday decorations safe with these electrical tips...',
            imageUrl: 'https://via.placeholder.com/400x300?text=Holiday+Safety',
            postType: 'holiday',
            status: 'approved',
            location: {
              _id: 'loc1',
              businessName: 'Bates Electric',
              city: 'Houston',
              state: 'TX'
            },
            createdAt: '2024-01-16T10:00:00Z',
            updatedAt: '2024-01-16T10:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/posts/approved');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};