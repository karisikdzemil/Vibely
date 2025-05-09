import Sidebar from "../components/home/sidebar";

export default function Home() {
  return (
    <section className="w-[100%] min-h-[90vh] p-5 bg-[#121212]">
      <div className="w-[100%] h-12 bg-gray-900"></div>

      <div className="w-[100%] min-h-[90vh] flex gap-5 pt-5">
           <Sidebar />
        <div className="w-[60%] min-h-[90vh] bg-gray-900"></div>
        <div className="w-[20%] h-[90vh] bg-gray-900"></div>
      </div>

    </section>
  );
}
