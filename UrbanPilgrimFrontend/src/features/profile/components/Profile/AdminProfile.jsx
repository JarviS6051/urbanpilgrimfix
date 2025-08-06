// src/components/Profile/AdminProfile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CogIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function AdminProfile({ user }) {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    console.log("Navigating to admin dashboard...");
    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen bg-amber-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 relative flex flex-col items-center text-center overflow-hidden">
          {/* Decorative gradient ring */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-100 via-white to-white opacity-60 pointer-events-none" />

          {/* Avatar */}
          <div className="relative z-10">
            <div className="relative inline-block">
              <img
                src={
                  user.profilePictures?.[0]?.url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=f59e0b&color=fff`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-amber-200 object-cover mx-auto shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-100 rounded-full p-2 shadow-sm">
                <ShieldCheckIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mt-6 text-gray-900">
              {user.name}
            </h2>
            <p className="text-gray-600 mt-1 mb-4">{user.email}</p>

            <span className="inline-flex items-center px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full border border-amber-200">
              <ShieldCheckIcon className="h-4 w-4 mr-1" /> Platform Administrator
            </span>
          </div>

          {/* Actions */}
          <div className="w-full mt-8 space-y-4 z-10">
            <button
              onClick={handleDashboardClick}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-150 transform hover:scale-[1.02] shadow-md"
            >
              Go to Admin Dashboard
            </button>

            <button
              onClick={() => navigate("/profile/settings")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-8 py-3 rounded-lg transition-colors duration-150 flex items-center justify-center"
            >
              <CogIcon className="h-5 w-5 mr-2" /> Profile Settings
            </button>
          </div>
        </div>

        {/* Admin Info */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center md:text-left">
            Administrator Information
          </h3>
          <div className="space-y-4 divide-y divide-gray-100">
            <div className="flex items-center justify-between pt-0">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-900">Platform Administrator</span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-gray-600">Access Level:</span>
              <span className="font-medium text-green-600">Full Access</span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-medium text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
