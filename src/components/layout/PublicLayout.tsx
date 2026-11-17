// BK-IC Public Layout with Navbar and Footer
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col animated-tech-bg relative overflow-x-clip">
      {/* Soft Ambient Floating Depth Orbs for all public pages */}
      <div className="fixed top-[10%] -left-40 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none -z-10 blur-3xl animate-float-orb-1" />
      <div className="fixed top-[45%] -right-40 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.10),transparent_70%)] pointer-events-none -z-10 blur-3xl animate-float-orb-2" />
      <div className="fixed bottom-[10%] -left-32 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.10),transparent_70%)] pointer-events-none -z-10 blur-3xl animate-float-orb-3" />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
