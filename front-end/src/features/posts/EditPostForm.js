import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetPostsQuery } from './postsSlice';
import { useUpdatePostMutation, useDeletePostMutation } from "./postsSlice";
import { useGetUsersQuery } from '../users/usersSlice';

const EditPostForm = () => {
    // Get the postId from the URL using React Router's useParams hook
    const { postId } = useParams()
    
    // Initialize the navigation function from React Router
    const navigate = useNavigate()

    // Initialize the updatePost mutation function and isLoading flag
    const [updatePost, { isLoading }] = useUpdatePostMutation()
    
    // Initialize the deletePost mutation function
    const [deletePost] = useDeletePostMutation()

    // Fetch the post data, loading state, and success state using useGetPostsQuery
    const { post, isLoading: isLoadingPosts, isSuccess } = useGetPostsQuery('getPosts', {
        selectFromResult: ({ data, isLoading, isSuccess }) => ({
            post: data?.entities[postId],
            isLoading,
            isSuccess
        }),
    })

    // Fetch user data using useGetUsersQuery
    const { data: users, isSuccess: isSuccessUsers } = useGetUsersQuery('getUsers')

    // Initialize state variables for the post title, content, and selected user ID
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')

    // Populate form fields with post data when the data is successfully fetched
    useEffect(() => {
        if (isSuccess) {
            setTitle(post.title)
            setContent(post.body)
            setUserId(post.userId)
        }
    }, [isSuccess, post?.title, post?.body, post?.userId])

    // If the post data is still loading, display a loading message
    if (isLoadingPosts) return <p>Loading...</p>

    // If the post data doesn't exist, display a "Post not found!" message
    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    // Event handler functions to update state when user inputs change
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(Number(e.target.value))

    // Check if all required fields are filled and not in the process of loading
    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    // Event handler for saving the post
    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                // Execute the updatePost mutation and unwrap the result
                await updatePost({ id: post?.id, title, body: content, userId }).unwrap()

                // Clear input fields and navigate to the post detail page
                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${postId}`)
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    // Initialize an empty variable to hold user options for the dropdown
    let usersOptions

    // If the users data has been successfully fetched, map user IDs to options
    if (isSuccessUsers) {
        usersOptions = users.ids.map(id => (
            <option
                key={id}
                value={id}
            >{users.entities[id].name}</option>
        ))
    }

    // Event handler for deleting the post
    const onDeletePostClicked = async () => {
        try {
            // Execute the deletePost mutation and unwrap the result
            await deletePost({ id: post?.id }).unwrap()

            // Clear input fields and navigate to the home page
            setTitle('')
            setContent('')
            setUserId('')
            navigate('/')
        } catch (err) {
            console.error('Failed to delete the post', err)
        }
    }

    // Render the edit post form
    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
                <button
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    )
}

export default EditPostForm;
