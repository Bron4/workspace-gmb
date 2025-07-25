import api from './api';

export interface Settings {
  googleApiKey: string;
  openaiApiKey: string;
  weatherEnabled: boolean;
  seasonalContentEnabled: boolean;
  contentVariationLevel: number;
  defaultCallToActions: string[];
  emailNotifications: boolean;
  errorNotifications: boolean;
  notificationEmail: string;
}

// Description: Get application settings
// Endpoint: GET /api/settings
// Request: {}
// Response: { settings: Settings }
export const getSettings = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        settings: {
          googleApiKey: '••••••••••••••••••••••••••••••••',
          openaiApiKey: '••••••••••••••••••••••••••••••••',
          weatherEnabled: true,
          seasonalContentEnabled: true,
          contentVariationLevel: 75,
          defaultCallToActions: [
            'Call us today for a free estimate!',
            'Contact our certified electricians now!',
            'Schedule your electrical inspection today!',
            'Get professional electrical service!'
          ],
          emailNotifications: true,
          errorNotifications: true,
          notificationEmail: 'admin@bateselectric.com'
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/settings');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Update application settings
// Endpoint: PUT /api/settings
// Request: { settings: Partial<Settings> }
// Response: { message: string, settings: Settings }
export const updateSettings = async (settings: Partial<Settings>) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Settings updated successfully',
        settings: {
          ...settings,
          updatedAt: new Date().toISOString()
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/api/settings', { settings });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Test API connection
// Endpoint: POST /api/settings/test-connection
// Request: { apiType: 'google' | 'openai', apiKey: string }
// Response: { success: boolean, message: string }
export const testApiConnection = async (apiType: 'google' | 'openai', apiKey: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: Math.random() > 0.3, // 70% success rate for demo
        message: Math.random() > 0.3 ? 'Connection successful!' : 'Connection failed. Please check your API key.'
      });
    }, 1500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/settings/test-connection', { apiType, apiKey });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}