import React from 'react';

const NotAuthenticated = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded shadow text-center border border-gray-200">
        <h1 className="text-2xl font-semibold mb-4">Non authentifié</h1>
        <p className="text-gray-600 mb-4">
          Vous devez être connecté pour accéder à cette page.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Se connecter
        </a>
      </div>
    </div>
  );
};

export default NotAuthenticated;
