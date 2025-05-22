import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";

export default function ProfileActionInfo () {
    const [posts, setPosts] = useState([]);
    
    const user = useSelector(state => state.user.user);


    useEffect(() => {
        async function getPostData() {
                  const cleanedUserId = user.uid.replace(/^:/, "");
            
                  const postsRef = collection(db, "PostsMeta");
                  const q = query(postsRef, where("userId", "==", cleanedUserId));
                  const snapshot = await getDocs(q);
                  const postsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                  setPosts(postsData);

                  
        }
        getPostData();
    }, [user.uid]);
    console.log(posts)
    return (
        <div className="w-[80%] h-[10vh] flex ">
        <div className="w-1/3 h-full flex items-center justify-center flex-col">
            <h1 className="text-xl font-bold">{posts.length}</h1>
            <p>Posts</p>
        </div>
        <div className="w-1/3 h-full flex items-center justify-center flex-col">
            <h1 className="text-xl font-bold">0</h1>
            <p>Followers</p>
        </div>
        <div className="w-1/3 h-full flex items-center justify-center flex-col">
            <h1 className="text-xl font-bold">0</h1>
            <p>Following</p>
        </div>
      </div>
    )
}