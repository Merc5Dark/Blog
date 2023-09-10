import PostsExcerpt from "./PostsExcerpt";
import { useGetPostsQuery } from './postsSlice';

const PostsList = () => {
    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery('getPosts')

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = posts.ids.map(postId => <PostsExcerpt key={postId} postId={postId} />)
    } else if (isError) {
        content = <p>{error}</p>;
    }

    return (
        <section>
            {content.length > 0 ? content : <p>No posts !!!</p> }
        </section>
    )
}
export default PostsList