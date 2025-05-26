import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Story({ posts }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(null); 
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const showPostArray = posts.filter(el => el.imageUrl !== '');

  // if(!showPostArray){
  //     return (
  //       <div className="flex gap-4 px-4 py-2 overflow-x-auto">
  //         {[...Array(5)].map((_, i) => (
  //           <div key={i} className="flex flex-col items-center gap-2">
  //             <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
  //             <div className="w-12 h-3 bg-gray-300 rounded animate-pulse"></div>
  //           </div>
  //         ))}
  //       </div>
  //     );
  // }

  const handleStoryClick = (index) => {
    setCurrentIndex(index);
    setProgress(0);
    setShowModal(true);
  };

  const closeStory = () => {
    setShowModal(false);
    setCurrentIndex(null);
    setProgress(0);
  };

  useEffect(() => {
    if (showModal && currentIndex !== null) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            goToNext();
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [showModal, currentIndex]);

  const goToNext = () => {
    if (currentIndex < showPostArray.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      closeStory(); 
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const showUserPostsHandler = (post) => {
    navigate(`/user-profile/:${post.userId}`);
  };

  return (
    <>
      <ul className="w-full h-[35vh] dark:bg-gray-800 bg-white flex items-center p-5 gap-5 rounded-md overflow-x-auto flex-nowrap">
        {showPostArray.map((el, index) => (
          <li key={el.postId} className="min-w-40 h-[30vh] relative rounded-md">
            <img
              onClick={() => handleStoryClick(index)}
              className="w-full h-full object-cover rounded-md cursor-pointer"
              src={el.imageUrl}
              alt=""
            />
            <h1
              onClick={() => showUserPostsHandler(el)}
              className="dark:text-white text-gray-900 absolute left-2 bottom-2 cursor-pointer"
            >
              {el.username}
            </h1>
          </li>
        ))}
      </ul>

      {showModal && currentIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div
            onClick={goToPrev}
            className="absolute left-0 top-0 h-full w-1/2 cursor-pointer"
          ></div>
          <div
            onClick={goToNext}
            className="absolute right-0 top-0 h-full w-1/2 cursor-pointer"
          ></div>

          <img
            src={showPostArray[currentIndex].imageUrl}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-md z-10"
          />

          <button
            onClick={closeStory}
            className="absolute top-4 right-4 text-white text-2xl z-20"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
