import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Broadcast from './pages/Broadcast';
import KnowledgeBase from './pages/KnowledgeBase';
import UploadData from './pages/UploadData';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import UserDataDeletion from './pages/UserDataDeletion';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '14px',
              padding: '14px 20px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
            },
            success: {
              iconTheme: { primary: '#0d9488', secondary: '#f0fdfa' },
            },
          }}
        />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes wrapped in Layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/agents" element={<Agents />} />
                    <Route path="/broadcast" element={<Broadcast />} />
                    <Route path="/knowledge" element={<KnowledgeBase />} />
                    <Route path="/upload" element={<UploadData />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/user-data-deletion" element={<UserDataDeletion />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
