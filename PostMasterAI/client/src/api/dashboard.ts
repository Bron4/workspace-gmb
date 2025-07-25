import api from './api';

export interface DashboardStats {
  totalLocations: number;
  postsThisMonth: number;
  pendingApprovals: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  _id: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'created' | 'approved' | 'published';
}

// Description: Get dashboard statistics and recent activity
// Endpoint: GET /api/dashboard/stats
// Request: {}
// Response: { stats: DashboardStats }
export const getDashboardStats = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          totalLocations: 12,
          postsThisMonth: 45,
          pendingApprovals: 3,
          recentActivity: [
            {
              _id: '1',
              action: 'Post Created',
              description: 'Created safety tips post for Atlanta, GA',
              timestamp: '2024-01-20T14:30:00Z',
              type: 'created'
            },
            {
              _id: '2',
              action: 'Post Published',
              description: 'Published storm preparation post for Miami, FL',
              timestamp: '2024-01-20T13:15:00Z',
              type: 'published'
            },
            {
              _id: '3',
              action: 'Post Approved',
              description: 'Approved maintenance reminder for Charlotte, NC',
              timestamp: '2024-01-20T12:00:00Z',
              type: 'approved'
            },
            {
              _id: '4',
              action: 'Location Added',
              description: 'Added new location: Birmingham, AL',
              timestamp: '2024-01-20T10:45:00Z',
              type: 'created'
            },
            {
              _id: '5',
              action: 'Post Published',
              description: 'Published energy efficiency tips for Nashville, TN',
              timestamp: '2024-01-20T09:30:00Z',
              type: 'published'
            }
          ]
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/dashboard/stats');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}