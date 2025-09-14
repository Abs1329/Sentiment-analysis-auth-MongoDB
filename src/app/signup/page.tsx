"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { AxiosError } from "axios";


export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignup = async (e: React.FormEvent) => {
  e.preventDefault(); // stop page reload
  try {
    console.log("Submitting signup:", { username: name, email, password });

    const res = await axios.post("/api/user/signup", {
      username: name, // ✅ must match backend
      email,
      password,
    });
      alert("Signup successful!");
    console.log("Signup success:", res.data);
    router.push("/login"); // redirect on success
  } catch (err) {
    const error = err as any;
    console.error(
      "Signup failed:",
      error?.response?.data || error?.message || error
    );
    alert(error?.response?.data?.error || "Signup failed. Check console.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-center text-xl font-light text-gray-800 mb-6">
          Signup
        </h2>

        <form onSubmit={onSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Name Here"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-xl shadow-md transition duration-100"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
