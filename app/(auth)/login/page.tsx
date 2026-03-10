"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Store, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { login } from "../actions";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
          >
            <Store className="h-8 w-8 text-white" />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Assan Ecommerce
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your store
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" action={action}>
          {state?.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {state.error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isPending ? (
                  <Loader2 className="h-5 w-5 text-blue-300 animate-spin" />
                ) : (
                  <Lock className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                )}
              </span>
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have a store yet?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1 mt-2"
            >
              Start your 14-day free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
