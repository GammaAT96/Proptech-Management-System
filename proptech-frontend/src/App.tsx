import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/modules/auth/LoginPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppRouter } from '@/app/router';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => {}} />;
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <DashboardLayout>
        <AppRouter />
      </DashboardLayout>
    </BrowserRouter>
  );
};

export default App;

