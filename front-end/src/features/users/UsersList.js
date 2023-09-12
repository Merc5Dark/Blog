import { Link } from 'react-router-dom'
import { useGetUsersQuery } from './usersSlice'

const UsersList = () => {
    // Query to get a list of users
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('getUsers')

    let content;
    // Check if the query is in a loading state
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } 
    // Check if the query was successful
    else if (isSuccess) {
        // Map through the list of user IDs and create links for each user
        const renderedUsers = users.ids.map(userId => (
            <li key={userId}>
                <Link to={`/user/${userId}`}>{users.entities[userId].name}</Link>
            </li>
        ))

        // Display the list of users
        content = (
            <section>
                <h2>Users</h2>
                <ul>{renderedUsers}</ul>
            </section>
        )
    } 
    // Check if there was an error in the query
    else if (isError) {
        content = <p>{error}</p>;
    }

    return content
}

export default UsersList
