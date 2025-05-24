import { Form } from "react-router-dom";
export default function Signup({ type }) {
  return (
    <Form method="post" className="w-112 h-auto p-5 flex flex-col items-center">
      <h1 className="text-4xl dark:text-[#f5f5f5] text-gray-900 font-bold p-5">Sing Up</h1>
      <input type="hidden" name="typeForm" value='signup' />
      <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900" htmlFor="">
          Username
        </label>
        <input
          name="username"
          required
          className="w-10/12 h-10 rounded-md border-1  dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          type="text"
          placeholder="Username"
        />
      </div>
      <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900" htmlFor="">
          Email
        </label>
        <input
          name="email"
          required
          type="email"
          className="w-10/12 h-10 rounded-md border-1  dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          placeholder="Email"
        />
      </div>
      <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900" htmlFor="">
          Password
        </label>
        <input
          name="password"
          required
          type="password"
          className="w-10/12 h-10 rounded-md border-1  dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          placeholder="Password"
        />
      </div>
      <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900" htmlFor="">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          required
          type="password"
          className="w-10/12 h-10 rounded-md border-1  dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          placeholder="Confirm Password"
        />
      </div>
      <button type="submit" className="w-9/12 h-10 mr-5 mt-5 bg-[#00bcd4] cursor-pointer hover:bg-[#4ae7ff] rounded-md font-bold">
        Sign Up
      </button>
      <p className=" mt-3 dark:text-[#f5f5f5] text-gray-900">Already have an account?</p>
      <button
        type="button"
        onClick={() => type()}
        className="text-xl text-[#00bcd4] font-bold cursor-pointer"
      >
        Log In
      </button>
    </Form>
  );
}
