import NewPost from "./NewPost";
import RenderPosts from "../components/post/RenderPosts";
import Story from "../components/home/Story";



export default function Home() {

  return (
    <section className="w-[60%] min-h-[90vh] bg-gray-900">
      {/* <div className="w-[100%] min-h-[90vh] flex gap-5"> */}
        <div className="w-[100%] min-h-[90vh] bg-gray-900 flex flex-col items-center p-5">
      <Story />
          <RenderPosts/>
        </div>
      {/* </div> */}
    </section>
  );
}