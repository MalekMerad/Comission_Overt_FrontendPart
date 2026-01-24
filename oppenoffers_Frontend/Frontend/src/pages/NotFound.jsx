import React from 'react';

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded shadow text-center border border-gray-200">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page non trouvée</h2>
        <p className="text-gray-600 mb-6">
          Oups ! La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retour à l’accueil
        </a>
      </div>
    </div>
  );
}

export default NotFound;