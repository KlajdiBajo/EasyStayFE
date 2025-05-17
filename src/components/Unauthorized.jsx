import React from "react";
import { Link } from "react-router-dom";
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">403</h1>
        <h2 className="text-xl font-semibold text-black mb-2">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
