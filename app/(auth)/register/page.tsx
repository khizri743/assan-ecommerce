"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  Store,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building2,
  User,
} from "lucide-react";
import { register } from "../actions";

const initialState = {
  error: "",
};

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(register, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
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
            Create your store
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start selling in minutes. No credit card required.
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

          <div className="space-y-4">
            {/* Business Section */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Business Details
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  name="businessName"
                  type="text"
                  required
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Store Name (e.g. Ali's Pizza)"
                />
              </div>
            </div>

            {/* User Section */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Owner Details
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    required
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email Address"
                />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password (min 6 chars)"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Store...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1 mt-2"
            >
              Log in here <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
