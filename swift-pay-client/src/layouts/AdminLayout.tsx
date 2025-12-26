import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-dashboard">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;