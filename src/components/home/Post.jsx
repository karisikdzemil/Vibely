import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
export default function Post({ post }) {
    function timeAgo(timestamp) {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);
      
        const intervals = [
          { label: "year", seconds: 31536000 },
          { label: "month", seconds: 2592000 },
          { label: "week", seconds: 604800 },
          { label: "day", seconds: 86400 },
          { label: "hour", seconds: 3600 },
          { label: "minute", seconds: 60 },
          { label: "second", seconds: 1 },
        ];
      
        for (const interval of intervals) {
          const count = Math.floor(seconds / interval.seconds);
          if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
          }
        }
      
        return "just now";
      }
  return (
    <li className="w-11/12 h-140 bg-gray-800 px-5 py-2 rounded-md">
      <div className="w-full flex gap-3 h-12 items-center m-2">
        <FontAwesomeIcon
          icon={faCircleUser}
          className="text-4xl text-gray-500"
        />
        <h1 className="text-xl text-white font-bold">{post.username}</h1>
        <p className="text-gray-500">{timeAgo(post.time)}</p>
      </div>
      <img className="w-12/12 h-2/3 object-cover" src={post.imageUrl} alt="" />
      <div className="w-full min-h-10 p-3 flex items-center gap-2 ">
      <h1 className="text-xl text-white font-bold">{post.username}:</h1>
        <p className="text-gray-400">{post.postContent}</p>
      </div>
      <div className="w-full h-15 flex items-center gap-3">
        <p className="text-white text-center"><FontAwesomeIcon className="text-xl cursor-pointer" icon={faHeart} /> <span className="mx-1">{post.likesCount}</span> Like</p>
        <p className="text-white"><FontAwesomeIcon className="text-xl cursor-pointer" icon={faComment} /> <span className="mx-1">{post.commentsCount}</span> Comment</p>
      </div>
    </li>
  );
}
