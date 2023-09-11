import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import { apiSlice } from "../api/apiSlice";

// Create an entity adapter to manage posts with custom sorting
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

// Initialize the initial state for the posts using the adapter
const initialState = postsAdapter.getInitialState()

// Extend the existing API slice by injecting new endpoints
export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // Define a query endpoint to fetch all posts
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: responseData => {
                // Initialize a minute counter for setting default dates
                let min = 1;
                // Transform the response data, setting default values if missing
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                // Use the entity adapter to set all loaded posts
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                { type: 'Post', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),

        // Define a query endpoint to fetch posts by a specific user ID
        getPostsByUserId: builder.query({
            query: id => `/postsbyuserid/?userId=${id}`,
            transformResponse: responseData => {
                // Initialize a minute counter for setting default dates
                let min = 1;
                // Transform the response data, setting default values if missing
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                // Use the entity adapter to set all loaded posts
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),

        // Define a mutation endpoint to add a new post
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),

        // Define a mutation endpoint to update an existing post
        updatePost: builder.mutation({
            query: initialPost => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),

        // Define a mutation endpoint to delete an existing post
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),

        // Define a mutation endpoint to add a reaction to a post
        addReaction: builder.mutation({
            query: ({ postId, reactions }) => ({
                url: `posts/${postId}`,
                method: 'PATCH',
                body: { reactions }
            }),
            async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
                // Update the query data in the store when adding a reaction
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', 'getPosts', draft => {
                        const post = draft.entities[postId]
                        if (post) post.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    // Undo the patch if there is an error
                    patchResult.undo()
                }
            }
        })
    })
})

// Export hooks generated by the extended API slice for use in components
export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice
