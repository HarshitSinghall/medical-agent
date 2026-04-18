import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const titles = {
  '/': 'Dashboard',
  '/agents': 'WhatsApp Agents',
  '/broadcast': 'Broadcast',
  '/knowledge': 'Knowledge Base',
  '/upload': 'Upload Data',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || 'MedStore';

  return (
    <div className="min-h-screen bg-gray-50/80">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[272px] min-h-screen flex flex-col">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="fade-slide-in" key={location.pathname}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
