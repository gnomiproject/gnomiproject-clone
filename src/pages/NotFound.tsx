
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you are looking for doesn't exist.</p>
      <Link to="/" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
