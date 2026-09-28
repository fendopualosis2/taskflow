import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#080B14] border-t border-gray-200 dark:border-white/[0.06] pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                TaskFlow
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Plan better. Focus deeper. Get things done. The premium task management experience.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#features" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Features</a></li>
              <li><a href="/analytics" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Analytics</a></li>
              <li><a href="/focus" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Focus Mode</a></li>
              <li><a href="/settings" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Settings</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">About</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li>Built as a JNTU SDC Project</li>
              <li>Designed with React & Tailwind</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 dark:border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} TaskFlow. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            JNTU SDC Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
