import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, Megaphone, BookOpen, CloudUpload, Pill, X, Shield, FileCheck, UserX } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/agents', icon: Bot, label: 'WhatsApp Agents' },
  { to: '/broadcast', icon: Megaphone, label: 'Broadcast' },
  { to: '/knowledge', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/upload', icon: CloudUpload, label: 'Upload Data' },
  { to: '/privacy-policy', icon: Shield, label: 'Privacy Policy' },
  { to: '/terms-of-service', icon: FileCheck, label: 'Terms of Service' },
  { to: '/user-data-deletion', icon: UserX, label: 'Data Deletion' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[272px] bg-sidebar flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/25">
              <Pill className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none tracking-tight">MedStore</h1>
              <p className="text-gray-500 text-[11px] mt-0.5 font-medium tracking-wide uppercase">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-600/15 text-primary-400 nav-glow'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'
                }`
              }
            >
              <item.icon size={18} className="shrink-0 group-hover:scale-105 transition-transform duration-200" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center">
              <Bot size={14} className="text-primary-400" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Powered by</p>
              <p className="text-[12px] text-gray-400 font-semibold">n8n AI Agents</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
