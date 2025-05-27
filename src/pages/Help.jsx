import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faCircleQuestion,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function Help() {
  return (
    <div className="min-h-screen  md:pb-0 pb-20 dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl dark:bg-gray-800 bg-white rounded-3xl shadow-2xl p-10 border border-cyan-600">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-3">
            Help & Support Center
          </h1>
          <p className="dark:text-gray-300 text-gray-600 text-lg">
            Everything you need to know about our platform in one place.
          </p>
        </div>

        <div className="space-y-10">
          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="text-cyan-400 text-2xl mt-1"
            />
            <div>
              <h2 className="text-xl font-semibold text-cyan-300">About the platform</h2>
              <p className="dark:text-gray-300 text-gray-600 mt-1">
                Our social media app is a space for users to share thoughts, post images,
                and engage with each other’s content. Designed for simplicity, speed,
                and a modern experience.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faCircleQuestion}
              className="text-cyan-400 text-2xl mt-1"
            />
            <div>
              <h2 className="text-xl font-semibold text-cyan-300">Features</h2>
              <ul className="list-disc list-inside dark:text-gray-300 text-gray-600 space-y-1 mt-2">
                <li>Create and edit posts</li>
                <li>Like and comment on content</li>
                <li>Upload and share images</li>
                <li>User profiles and customization</li>
                <li>View all posts and favorites</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-cyan-400 text-2xl mt-1"
            />
            <div>
              <h2 className="text-xl font-semibold text-cyan-300">Need help?</h2>
              <p className="dark:text-gray-300 text-gray-600 mt-1">
                If you encounter any issues or have questions, feel free to contact us at:
              </p>
              <a
                href="mailto:karisikdzemil@gmail.com"
                className="text-cyan-400 hover:underline mt-1 inline-block"
              >
                karisikdzemil@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
