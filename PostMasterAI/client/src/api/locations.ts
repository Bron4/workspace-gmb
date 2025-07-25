import api from './api';

export interface Location {
  _id: string;
  businessName: string;
  city: string;
  state: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationData {
  businessName: string;
  city: string;
  state: string;
  keywords: string[];
}

// Description: Get all business locations
// Endpoint: GET /api/locations
// Request: {}
// Response: { locations: Location[] }
export const getLocations = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        locations: [
          {
            _id: '1',
            businessName: 'Bates Electric',
            city: 'Atlanta',
            state: 'GA',
            keywords: ['electrical repair', 'emergency electrician', 'residential electrical', 'commercial electrical'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            _id: '2',
            businessName: 'S.E. Bates Electric',
            city: 'Miami',
            state: 'FL',
            keywords: ['electrical installation', 'panel upgrade', 'lighting installation', 'electrical inspection'],
            createdAt: '2024-01-16T10:00:00Z',
            updatedAt: '2024-01-16T10:00:00Z'
          },
          {
            _id: '3',
            businessName: 'Bates Electric',
            city: 'Charlotte',
            state: 'NC',
            keywords: ['electrical wiring', 'outlet installation', 'electrical troubleshooting', 'generator installation'],
            createdAt: '2024-01-17T10:00:00Z',
            updatedAt: '2024-01-17T10:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/locations');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Create a new business location
// Endpoint: POST /api/locations
// Request: { businessName: string, city: string, state: string, keywords: string[] }
// Response: { location: Location, message: string }
export const createLocation = async (data: CreateLocationData) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        location: {
          _id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        message: 'Location created successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/locations', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Update a business location
// Endpoint: PUT /api/locations/:id
// Request: { businessName: string, city: string, state: string, keywords: string[] }
// Response: { location: Location, message: string }
export const updateLocation = async (id: string, data: CreateLocationData) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        location: {
          _id: id,
          ...data,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: new Date().toISOString()
        },
        message: 'Location updated successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/locations/${id}`, data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}

// Description: Delete a business location
// Endpoint: DELETE /api/locations/:id
// Request: {}
// Response: { message: string }
export const deleteLocation = async (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Location deleted successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/locations/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
}