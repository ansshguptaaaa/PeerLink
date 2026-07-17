'use client';

import { useState } from 'react';
import { FiDownload, FiKey, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface FileDownloadProps {
  onDownload: (port: number) => Promise<void>;
  isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: FileDownloadProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const port = parseInt(inviteCode.trim(), 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      setError('Please enter a valid port number (1-65535)');
      return;
    }
    
    try {
      await onDownload(port);
    } catch (err) {
      setError('Failed to download the file. Please check the invite code and try again.');
    }
  };
  
  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-xl pointer-events-none" />
      
      <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
        <span>Receive a File</span>
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Enter the invite code (port number) shared with you to connect and download the file.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        <div className="text-left">
          <label htmlFor="inviteCode" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Invite Code / Port
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <FiKey className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="inviteCode"
              name="peerlink_invite_code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter the invite code (e.g. 9091)"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-850 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm font-semibold"
              disabled={isDownloading}
              required
            />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 flex items-center space-x-1.5 text-xs text-red-400 font-medium"
            >
              <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-purple-500/10 active:scale-98"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Downloading stream...</span>
            </div>
          ) : (
            <>
              <FiDownload className="mr-2 w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download File</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}


