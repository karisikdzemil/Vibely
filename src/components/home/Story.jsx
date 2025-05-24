import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Story () {
    const navigate = useNavigate();
    const posts = useSelector(state => state.posts);
    let showPostArray = posts.filter(el => el.imageUrl !== '');

    function showUserPostsHandler (post) {
        navigate(`/user-profile/:${post.userId}`)
      }
      console.log(showPostArray)

    return(
        <ul className="w-full h-[35vh] dark:bg-gray-800 bg-white flex items-center p-5 gap-5 rounded-md overflow-x-auto flex-nowrap">
        {showPostArray.map(el => (
          <li key={el.postId} className="min-w-40 h-[30vh] relative rounded-md">
            <img className="w-full h-full object-cover rounded-md" src={el.imageUrl} alt="" />
            <h1
              onClick={() => showUserPostsHandler(el)}
              className="dark:text-white text-gray-900 absolute left-2 bottom-2 cursor-pointer"
            >
              {el.username}
            </h1>
          </li>
        ))}
      </ul>
      
    )
}