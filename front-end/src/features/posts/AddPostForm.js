import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";

const AddPostForm = () => {
    // Initialize the addNewPost mutation function and isLoading flag
    const [addNewPost, { isLoading }] = useAddNewPostMutation();

    // Initialize the React Router navigation function
    const navigate = useNavigate();

    // Initialize state variables for the post title, content, and selected user ID
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');

    // Fetch a list of users and their data using the useGetUsersQuery hook
    const { data: users, isSuccess } = useGetUsersQuery('getUsers');

    // Event handler functions to update state when user inputs change
    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    // Check if all required fields are filled and not in the process of loading
    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    // Event handler for saving the post
    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                // Execute the addNewPost mutation and unwrap the result
                await addNewPost({ title, body: content, userId }).unwrap();

                // Clear input fields and navigate to the home page
                setTitle('');
                setContent('');
                setUserId('');
                navigate('/');
            } catch (err) {
                console.error('Failed to save the post', err);
            }
        }
    };

    // Initialize an empty variable to hold user options for the dropdown
    let usersOptions;

    // If the users data has been successfully fetched
    if (isSuccess) {
        // Map each user ID to an option element in the dropdown
        usersOptions = users.ids.map(id => (
            <option key={id} value={id}>
                {users.entities[id].name}
            </option>
        ));
    }

    return (
        <section>
            <h2>Add a New Post</h2>
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
                >Save Post</button>
            </form>
        </section>
    );
};

export default AddPostForm;
