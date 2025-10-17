import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {/* O Outlet renderiza o componente da rota filha aqui */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 