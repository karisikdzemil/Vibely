export default function Signup () {

    return (
        <section className="w-[100%] min-h-[100vh] bg-[#121212] flex justify-center items-center">
            <form className="w-112 h-112 p-5 flex flex-col items-center">
                <h1 className="text-4xl text-[#f5f5f5] font-bold p-5">Sing Up</h1>
                 <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
                <label className="text-xl text-[#f5f5f5]" htmlFor="">Username</label>
                <input className="w-10/12 h-10 rounded-md border-1  border-gray-600 text-gray-600 pl-3" type="text" placeholder="Username" />
                </div>
                <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
                <label className="text-xl text-[#f5f5f5]" htmlFor="">Email</label>
                <input className="w-10/12 h-10 rounded-md border-1  border-gray-600 text-gray-600 pl-3" type="text" placeholder="Email" />
                </div>
                <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
                <label className="text-xl text-[#f5f5f5]" htmlFor="">Password</label>
                <input className="w-10/12 h-10 rounded-md border-1  border-gray-600 text-gray-600 pl-3" type="text" placeholder="Password" />
                </div>
               
                <button className="w-9/12 h-10 mr-5 mt-5 bg-[#00bcd4] rounded-md font-bold">Sign Up</button>
            </form>
        </section>  
    )
}