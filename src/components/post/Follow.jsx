import { useSelector } from "react-redux";


export default function Follow({post}) {
    const user = useSelector(state => state.user.user)


 async function followHandler(  ) {
    console.log(post.userId)
    console.log(user.uid)
}

  return (
    <button onClick={followHandler} className="w-30 h-10 bg-black opacity-40 text-white cursor-pointer rounded-md hover:opacity-60 mr-3">
      Follow
    </button>
  );
}
