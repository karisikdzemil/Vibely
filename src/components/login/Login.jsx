import { Form } from "react-router-dom";
export default function Login({ type }) {
  return (
    <Form method="post" className="w-112 h-auto p-5 flex flex-col items-center">
      <h1 className="text-4xl text-[#f5f5f5] font-bold p-5">Log In</h1>
      <input type="hidden" name="typeForm" value="login" />

      <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
        <label className="text-xl text-[#f5f5f5]" htmlFor="">
          Email
        </label>
        <input
          name="email"
          required
          type="email"
          className="w-10/12 h-10 rounded-md border-1  border-gray-600 text-gray-600 pl-3"
          placeholder="Email"
        />
      </div>
      <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
        <label className="text-xl text-[#f5f5f5]" htmlFor="">
          Password
        </label>
        <input
          name="password"
          required
          type="password"
          className="w-10/12 h-10 rounded-md border-1  border-gray-600 text-gray-600 pl-3"
          placeholder="Password"
        />
      </div>
      <button
        type="submit"
        className="w-9/12 h-10 mr-5 mt-5 bg-[#00bcd4] cursor-pointer hover:bg-[#4ae7ff] rounded-md font-bold"
      >
        Log In
      </button>
      <p className=" mt-3 text-[#f5f5f5]">You don't have an account?</p>
      <button
        type="button"
        onClick={() => type()}
        className="text-xl text-[#00bcd4] font-bold cursor-pointer"
      >
        Sign Up
      </button>
    </Form>
  );
}
