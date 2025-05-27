import { Form, useActionData } from "react-router-dom";
import { useState } from "react";

export default function Login({ type }) {
  const actionData = useActionData();
  const [errors, setErrors] = useState({});

  const validateForm = (e) => {
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is not valid.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      e.preventDefault();
    }
  };

  return (
    <Form method="post" className="sm:w-112 w-full h-auto p-5 flex flex-col items-center" onSubmit={validateForm}>
      <h1 className="text-4xl dark:text-[#f5f5f5] text-gray-900 font-bold p-5">Log In</h1>
      <input type="hidden" name="typeForm" value="login" />

      <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900">
          Email
        </label>
        <input
          name="email"
          type="email"
          className="w-10/12 h-10 rounded-md border-1 dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="w-full h-25 flex flex-col gap-2 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="w-10/12 h-10 rounded-md border-1 dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <button
        type="submit"
        className="w-9/12 h-10 mr-5 mt-5 bg-[#00bcd4] cursor-pointer hover:bg-[#4ae7ff] rounded-md font-bold"
      >
        Log In
      </button>

      {actionData?.error && <p className="text-red-500 mt-3">{actionData.error}</p>}

      <p className="mt-3 dark:text-[#f5f5f5] text-gray-900">You don't have an account?</p>
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
