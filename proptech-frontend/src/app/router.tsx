import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { TicketsPage } from '@/modules/tickets/TicketsPage';
import { MyTasksPage } from '@/modules/tasks/MyTasksPage';
import { PropertiesPage } from '@/modules/properties/PropertiesPage';
import { UsersPage } from '@/modules/users/UsersPage';
import { NotificationsPage } from '@/modules/notifications/NotificationsPage';
import { ActivityLogsPage } from '@/modules/activity/ActivityLogsPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/my-tasks" element={<MyTasksPage />} />
      <Route
        path="/properties"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <PropertiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route
        path="/activity"
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <ActivityLogsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

