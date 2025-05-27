import { useState } from "react";
import { Form } from "react-router-dom";
import { useActionData } from "react-router-dom";

export default function Signup({ type }) {
  const actionData = useActionData();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  function validateForm() {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }
    if(formData.username.trim().length < 5){
      newErrors.username = "Username must have at least 5 letters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    if (!validateForm()) {
      e.preventDefault();
    }
  }

  return (
    <Form method="post" onSubmit={handleSubmit} className="w-112 h-auto p-5 flex flex-col items-center">
      <h1 className="text-4xl dark:text-[#f5f5f5] text-gray-900 font-bold p-5">Sign Up</h1>
      <input type="hidden" name="typeForm" value="signup" />

      <div className="w-full h-25 flex flex-col gap-1 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900">Username</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-10/12 h-10 rounded-md border dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          type="text"
          placeholder="Username"
        />
        {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
      </div>

      <div className="w-full h-25 flex flex-col gap-1 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900">Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-10/12 h-10 rounded-md border dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          type="email"
          placeholder="Email"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>

      <div className="w-full h-25 flex flex-col gap-1 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900">Password</label>
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          className="w-10/12 h-10 rounded-md border dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          placeholder="Password"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
      </div>

      <div className="w-full h-25 flex flex-col gap-1 justify-center pl-10">
        <label className="text-xl dark:text-[#f5f5f5] text-gray-900">Confirm Password</label>
        <input
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          type="password"
          className="w-10/12 h-10 rounded-md border dark:border-gray-600 border-gray-300 dark:text-gray-600 text-gray-800 pl-3"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}

      </div>

      <button type="submit" className="w-9/12 h-10 mr-5 mt-5 bg-[#00bcd4] hover:bg-[#4ae7ff] rounded-md font-bold">
        Sign Up
      </button>
        {actionData?.error && <p className="text-red-500 mt-3">{actionData.error}</p>}

      <p className="mt-3 dark:text-[#f5f5f5] text-gray-900">Already have an account?</p>
      <button
        type="button"
        onClick={type}
        className="text-xl text-[#00bcd4] font-bold cursor-pointer"
      >
        Log In
      </button>
    </Form>
  );
}
