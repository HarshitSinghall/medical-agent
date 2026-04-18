import { Menu, Bell, User, Search } from 'lucide-react';

export default function Header({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5 hidden sm:block">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all relative cursor-pointer">
            <Search size={18} />
          </button>
          <button className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all relative cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2.5 pl-3 ml-1.5 border-l border-gray-200">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center ring-2 ring-primary-100">
              <User size={16} className="text-primary-700" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-none">Admin</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
