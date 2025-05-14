import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { timeAgo } from "../../timeAgo";
import { useNavigate } from "react-router-dom";
export default function Post({ post }) {
  const navigate = useNavigate()

      function showUserPostsHandler () {
        navigate(`/user-profile/:${post.userId}`)
      }

  return (
    <li className="w-4/5 max-h-140 bg-gray-800 px-5 py-2 rounded-md">
      <div className="w-full flex gap-3 h-12 items-center m-2">
        <FontAwesomeIcon
          icon={faCircleUser}
          className="text-4xl text-gray-500"
        />
        <h1 onClick={showUserPostsHandler} className="text-xl text-white font-bold cursor-pointer">{post.username}</h1>
        <p className="text-gray-500">{timeAgo(post.time)}</p>
      </div>
      {post.imageUrl === '' ? '' : <img className="w-12/12 h-2/3 max-h-96 object-cover" src={post.imageUrl} alt="" />}
      <div className="w-full min-h-10 p-3 flex items-center gap-2 ">
      {/* <h1 className="text-xl text-white font-bold">{post.username}:</h1> */}
        <p className="text-gray-400">{post.postContent}</p>
      </div>
      <div className="w-full h-15 flex items-center gap-3">
        <p className="text-white text-center"><FontAwesomeIcon className="text-xl cursor-pointer" icon={faHeart} /> <span className="mx-1">{post.likesCount}</span> Like</p>
        <p className="text-white"><FontAwesomeIcon className="text-xl cursor-pointer" icon={faComment} /> <span className="mx-1">{post.commentsCount}</span> Comment</p>
      </div>
    </li>
  );
}
