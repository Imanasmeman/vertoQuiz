import React, { useEffect, useState } from "react";

import OrgHeader from "./OrgHeader";
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function OrgProfile() {
  const { accessToken } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return;
      setLoading(true);
      try {
        const res = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [accessToken]);

  if (loading) {
    return (
      <>
     <OrgHeader/>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
         <OrgHeader/>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-md shadow">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
           <OrgHeader/>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Avatar Circle */}
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-6">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            {user.name}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{user.email}</p>

          {/* Elegant role badge */}
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-pink-400 to-indigo-600 text-white text-sm font-semibold uppercase tracking-wide shadow">
            {user.role}
          </span>
        </div>
      </div>
      
    </>
  );
}
