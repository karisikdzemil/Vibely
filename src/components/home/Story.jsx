import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Story () {
    const navigate = useNavigate();
    const posts = useSelector(state => state.posts)
    let showPostArray = posts.filter(el => el.imageUrl !== '');
    // showPostArray.length = 5;    

    function showUserPostsHandler (post) {
        navigate(`/user-profile/:${post.userId}`)
      }

    return(
        <ul className="w-full h-[35vh] bg-gray-800 flex items-center p-5 gap-2 rounded-md overflow-x-auto flex-nowrap">
        {showPostArray.map(el => (
          <li key={el.id} className="min-w-40 h-[30vh] relative rounded-md">
            <img className="w-full h-full object-cover rounded-md" src={el.imageUrl} alt="" />
            <h1
              onClick={() => showUserPostsHandler(el)}
              className="text-white absolute left-2 bottom-2 cursor-pointer"
            >
              {el.username}
            </h1>
          </li>
        ))}
      </ul>
      
    )
}