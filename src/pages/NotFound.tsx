import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
    <div className="text-center space-y-2">
      <h1 className="text-6xl font-black text-slate-800">404</h1>
      <h2 className="text-xl font-bold text-slate-300">Module Not Found</h2>
      <p className="text-slate-500">The requested intelligence module does not exist or has been relocated.</p>
    </div>
    <Link 
      to="/command-center" 
      className="px-4 py-2 bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20 border border-cyan-500/20 rounded-lg transition-colors"
    >
      Return to Command Center
    </Link>
  </div>
);
