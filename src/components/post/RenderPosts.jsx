// import { useSelector } from "react-redux"
import Post from "./Post"

export default function RenderPosts ( {posts} ) {
// const posts = useSelector(state => state.posts)
console.log(posts)
    return(
         <ul className="w-full min-h-[30vh] flex flex-col items-center pt-10 gap-5">
                    {posts && posts.map((el) => (
                      <Post key={el.id} post={el} />
                    ))}
                  </ul>
    )
}