import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
export default function Post({ post }) {
  console.log(post);
  return (
    <li className="w-10/12 h-112 bg-gray-800 px-5 py-2">
      <div className="w-full flex gap-3 h-12 items-center m-2">
        <FontAwesomeIcon
          icon={faCircleUser}
          className="text-4xl text-gray-500"
        />
        <h1 className="text-xl text-white font-bold">{post.username}</h1>
      </div>
      <img className="w-12/12 h-2/3 object-cover" src={post.imageUrl} alt="" />
      <div>
        <h1>{post.username}</h1>
        <p>{post.postContent}</p>
      </div>
    </li>
  );
}
