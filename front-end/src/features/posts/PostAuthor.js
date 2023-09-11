import React from "react";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../users/usersSlice";

// This component displays the author of a post with a link to the author's profile
const PostAuthor = ({ userId }) => {
    // Fetch user data for the given userId using useGetUsersQuery
    const { user: author } = useGetUsersQuery('getUsers', {
        // Extract the 'user' property from the query result
        selectFromResult: ({ data, isLoading }) => ({
            user: data?.entities[userId]
        }),
    })

    // Render the author's name with a link to the author's profile if available,
    // or display "Unknown author" if the author data is not available
    return (
        <span>
            by {author ? (
                // If author data is available, display a link to the author's profile
                <Link to={`/user/${userId}`}>{author.name}</Link>
            ) : (
                // If author data is not available, display "Unknown author"
                'Unknown author'
            )}
        </span>
    );
};

export default PostAuthor;
