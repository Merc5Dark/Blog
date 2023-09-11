// Import necessary dependencies from Redux Toolkit Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Create an API slice using createApi
export const apiSlice = createApi({
    // Specify a unique name for the slice, which will be used as a reducer path
    reducerPath: 'api',
    
    // Define the baseQuery, which sets the base URL for all API requests
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    
    // Define tag types to categorize entities in the API
    tagTypes: ['Post', 'User'],
    
    // Define API endpoints using the builder function
    endpoints: builder => ({})
})
