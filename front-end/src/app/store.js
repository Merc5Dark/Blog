// Import necessary dependencies
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from '../features/api/apiSlice';

// Create a Redux store using configureStore from Redux Toolkit
export const store = configureStore({
    // Define the reducers for the store.
    // In this case, we're using the apiSlice.reducer and associating it with a specific path.
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    
    // Middleware configuration: 
    // Redux Toolkit provides getDefaultMiddleware, which returns a list of default middleware.
    // We concatenate the middleware from the apiSlice with the default middleware.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    
    // Enable Redux DevTools for debugging and inspecting the store's state changes.
    devTools: true
})
