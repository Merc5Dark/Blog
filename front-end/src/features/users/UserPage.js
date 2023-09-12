import { Link, useParams } from 'react-router-dom'
import { useGetPostsByUserIdQuery } from '../posts/postsSlice'
import { useGetUsersQuery } from '../users/usersSlice'

const UserPage = () => {
    // Get the 'userId' parameter from the URL using React Router's 'useParams' hook
    const { userId } = useParams()

    // Query to get user data
    const { user,
        isLoading: isLoadingUser,
        isSuccess: isSuccessUser,
        isError: isErrorUser,
        error: errorUser
    } = useGetUsersQuery('getUsers', {
        // Select and map data from the query result
        selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
            user: data?.entities[userId], // Extract the user data for the given userId
            isLoading,
            isSuccess,
            isError,
            error
        }),
    })

    // Query to get posts by the user
    const {
        data: postsForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsByUserIdQuery(userId);

    let content;
    // Check if either of the queries is in a loading state
    if (isLoading || isLoadingUser) {
        content = <p>Loading...</p>
    } 
    // Check if both queries were successful
    else if (isSuccess && isSuccessUser) {
        const { ids, entities } = postsForUser
        content = (
            <section>
                <h2>{user?.name}</h2>
                <ol>
                    {/* Map through the post IDs and display them as links */}
                    {ids.map(id => (
                        <li key={id}>
                            <Link to={`/post/${id}`}>{entities[id].title}</Link>
                        </li>
                    ))}
                </ol>
            </section>
        )
    } 
    // Check if there was an error in either of the queries
    else if (isError || isErrorUser) {
        content = <p>{error || errorUser}</p>;
    }

    return content
}

export default UserPage
