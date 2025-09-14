"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/user/login", { email, password });
      console.log("Login success:", res.data);
      alert("Login successful!");
      router.push("/sentiment");
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Login failed. Check console.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-center text-xl font-light text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={onLogin} className="space-y-4">
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
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
