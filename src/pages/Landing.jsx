import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckSquare, FolderKanban, BarChart3, Focus, Clock, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const features = [
  {
    icon: <CheckSquare className="w-6 h-6 text-violet-500" />,
    title: 'Smart Task Management',
    description: 'Create, organize, and track tasks with priorities, deadlines, and statuses.'
  },
  {
    icon: <FolderKanban className="w-6 h-6 text-violet-500" />,
    title: 'Powerful Organization',
    description: 'Projects and categories keep your workflow structured and clean.'
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-violet-500" />,
    title: 'Productivity Analytics',
    description: 'Visual insights into your work patterns and completion rates.'
  },
  {
    icon: <Focus className="w-6 h-6 text-violet-500" />,
    title: 'Focus Mode',
    description: 'Dedicated timer to protect your deep work sessions.'
  },
  {
    icon: <Clock className="w-6 h-6 text-violet-500" />,
    title: 'Deadline Tracking',
    description: 'Never miss an important date with smart reminders and overdue alerts.'
  },
  {
    icon: <Search className="w-6 h-6 text-violet-500" />,
    title: 'Instant Search',
    description: 'Find any task, project, or category in milliseconds.'
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#080B14] text-gray-900 dark:text-white overflow-hidden transition-colors duration-200 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 lg:px-8">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 dark:bg-violet-500/20 blur-[120px] animate-pulse" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 dark:bg-blue-500/20 blur-[120px] animate-pulse delay-700" />
            <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-600/10 dark:bg-purple-500/20 blur-[120px] animate-pulse delay-1000" />
            
            {/* Particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-violet-500/30 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
            >
              Turn your tasks into <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">momentum.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-white/60 mb-10 max-w-2xl mx-auto"
            >
              Organize your work, focus on what matters, and track your progress from one powerful productivity workspace.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
              >
                Start Managing Tasks
              </Link>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-900 dark:text-white font-medium transition-all"
              >
                Explore Features
              </a>
            </motion.div>

            {/* Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-20 relative mx-auto max-w-4xl rounded-2xl overflow-hidden border border-gray-200 dark:border-white/[0.1] bg-white/50 dark:bg-[#0A0F1E]/80 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-black/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-md mb-6" />
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] flex items-center gap-4">
                      <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-white/20" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
                        <div className="h-3 w-1/2 bg-gray-100 dark:bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  <div className="p-5 rounded-xl border border-gray-100 dark:border-white/5 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex flex-col items-center justify-center py-8">
                    <div className="w-24 h-24 rounded-full border-4 border-violet-500/20 border-t-violet-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">75%</span>
                    </div>
                    <div className="mt-4 font-medium text-sm">Productivity Score</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-100 dark:bg-white/5">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs text-gray-500 dark:text-white/40 mt-1">Completed</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-100 dark:bg-white/5">
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-xs text-gray-500 dark:text-white/40 mt-1">Overdue</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 lg:px-8 bg-white dark:bg-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to stay organized</h2>
              <p className="text-gray-600 dark:text-white/60 max-w-2xl mx-auto">Powerful tools designed to help you focus on your work, not on managing your tools.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 lg:px-8 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple yet powerful</h2>
              <p className="text-gray-600 dark:text-white/60 max-w-2xl mx-auto">Get up and running in minutes with a workflow that makes sense.</p>
            </div>
            
            <div className="relative flex flex-col md:flex-row gap-12 md:gap-8 justify-between">
              {/* Connecting line */}
              <div className="absolute top-12 left-12 right-12 h-0.5 bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0 hidden md:block" />
              
              {[
                { step: '01', title: 'Capture', desc: 'Add tasks quickly with our streamlined interface. Set priorities, deadlines, and organize into projects.' },
                { step: '02', title: 'Organize', desc: 'Group tasks by project, filter by priority, and plan your day with smart views.' },
                { step: '03', title: 'Execute', desc: 'Focus on what matters, track your progress, and celebrate completions.' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="relative z-10 flex-1 text-center flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-[#0F1629] border border-gray-200 dark:border-white/[0.1] shadow-xl flex items-center justify-center mb-6 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-500 to-indigo-500">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-white/60 text-sm max-w-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-violet-600 dark:bg-violet-900/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 dark:to-[#080B14]" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10 py-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to take control of your tasks?</h2>
            <p className="text-xl text-white/80 mb-10">Turn scattered to-dos into a workflow that actually works.</p>
            <Link 
              to="/dashboard"
              className="inline-block px-8 py-4 rounded-lg bg-white text-violet-600 font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Start Managing Tasks
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}} />
    </div>
  );
}
