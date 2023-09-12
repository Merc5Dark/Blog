import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

// Create an entity adapter for managing user data
const usersAdapter = createEntityAdapter()

// Initialize the initial state for the user entity adapter
const initialState = usersAdapter.getInitialState()

// Create an API slice for users and inject endpoints
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            // Define the query function to fetch users from the API
            query: () => '/users',
            // Transform the API response data using the entity adapter to set all users
            transformResponse: responseData => {
                return usersAdapter.setAll(initialState, responseData)
            },
            // Provide tags for caching and invalidation purposes
            providesTags: (result, error, arg) => [
                { type: 'User', id: "LIST" }, // Tag for the entire user list
                ...result.ids.map(id => ({ type: 'User', id })) // Tags for individual user entries
            ]
        })
    })
})

// Export the generated query hooks for use in components
export const {
    useGetUsersQuery
} = usersApiSlice
