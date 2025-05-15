import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { timeAgo } from "../../timeAgo";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
export default function Post({ post }) {
  const navigate = useNavigate()

      function showUserPostsHandler () {
        navigate(`/user-profile/:${post.userId}`)
      }
      const profilePicture =
    post.profilePicture === undefined ? (
      <FontAwesomeIcon icon={faCircleUser} className="text-4xl text-gray-500" />
    ) : (
      <img
        src={post.profilePicture}
        alt="Profile picture"
        className="w-12 h-12 rounded-full object-cover shadow-md"
      />
    );
    console.log(post)

  return (
    <li className="w-4/5 min-h-[140px] p-5  bg-gray-800 px-5 py-2 rounded-md">
      <div className="w-full flex gap-3 h-12 items-center m-2">
        {profilePicture}
        <h1 onClick={showUserPostsHandler} className="text-xl text-white font-bold cursor-pointer">{post.username}</h1>
        <p className="text-gray-500">{timeAgo(post.time)}</p>
      </div>
      {post.imageUrl === '' ? '' : <img className="w-12/12 bg-amber-950 h-2/3 max-h-96 object-cover" src={post.imageUrl} alt="" />}
      <div className="w-full min-h-10  p-3 flex items-center gap-2 ">
      {/* <h1 className="text-xl text-white font-bold">{post.username}:</h1> */}
        <p className="w-[100%] min-h-10 p-3  text-gray-400">{post.postContent}</p>
      </div>
      <div className="w-full min-h-15 p-5 flex items-center gap-3">
        <Comment post={post}/>
      </div>
    </li>
  );
}
