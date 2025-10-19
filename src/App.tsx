import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Toaster position="top-center" />
      
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'admin-login' && <AdminLogin onLogin={() => setCurrentPage('admin')} />}
      {currentPage === 'admin' && <AdminDashboard />}
      
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}