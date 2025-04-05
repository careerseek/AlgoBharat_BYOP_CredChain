/* eslint-disable no-console */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../interfaces/User';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in:", email, password);
  
    const users: User[] = JSON.parse(localStorage.getItem("cred_users") || "[]");

    const user = users.find((u: User) => u.email === email && u.password === password);
  
    if (!user) {
      alert("Invalid credentials. Please try again.");
      return;
    }
  
    localStorage.setItem(
      "cred_user",
      JSON.stringify({ ...user, token: "fake-jwt-token-123" })
    );
  
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-blue-100">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 pr-10 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 text-center font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <LogIn size={20} />
            Sign In
          </button>
          
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </div>
        </form>
      </div>

      {/* Footer */}
      {/* <footer className="bg-gray-900 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          © 2025 CredChain. All rights reserved.
        </div>
      </footer> */}
    </div>
  )
}