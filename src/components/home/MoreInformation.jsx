export default function MoreInformation () {
    return( 
        <div className="w-[20%] h-[90vh] bg-gray-900 sticky top-20 flex flex-col gap-5 p-4 rounded-l-2xl text-white">
        <div className="bg-gray-800 p-3 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
            Suggested Friends
          </h3>
          <ul className="text-sm space-y-1">
            <li>
              👤 Marko Petrović{" "}
              <button className="text-[#00bcd4] ml-2">Follow</button>
            </li>
            <li>
              👤 Ana Jovanović{" "}
              <button className="text-[#00bcd4] ml-2">Follow</button>
            </li>
            <li>
              👤 Luka Milenković{" "}
              <button className="text-[#00bcd4] ml-2">Follow</button>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800 p-3 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
            Trending
          </h3>
          <ul className="text-sm space-y-1">
            <li>#React2025</li>
            <li>#WebDesign</li>
            <li>#CryptoNews</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-3 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
            Notifications
          </h3>
          <ul className="text-sm space-y-1">
            <li>🔔 Djemsy liked your post</li>
            <li>💬 New comment from Lara</li>
            <li>👤 You have 2 new followers</li>
          </ul>
        </div>
      </div>
    )
}