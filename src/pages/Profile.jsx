export default function Profile() {
    const user = {
      username: "john_doe",
      email: "john@example.com",
      about: "Frontend developer who loves building React applications.",
      profilePicture:
        "https://images.unsplash.com/photo-1502764613149-7f1d229e2300?auto=format&fit=crop&w=200&q=80",
    };
  
    return (
      <div className="w-full min-h-screen p-8 text-white">
        <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center shadow-lg">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#00bcd4] shadow-md"
          />
          <h2 className="text-2xl font-semibold mt-4">{user.username}</h2>
          <p className="text-gray-400">{user.email}</p>
          <div className="mt-6 text-center w-full">
            <h3 className="text-xl font-medium text-[#00bcd4] mb-2">About</h3>
            <p className="text-gray-300">{user.about}</p>
          </div>
        </div>
      </div>
    );
  }
  