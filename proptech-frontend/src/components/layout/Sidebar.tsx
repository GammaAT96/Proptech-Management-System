import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/user.types';

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

const getMenuItems = (role?: UserRole | null): MenuItem[] => {
  const baseItems: MenuItem[] = [{ id: 'dashboard', label: 'Dashboard', path: '/dashboard' }];

  if (role === 'TENANT') {
    return [
      ...baseItems,
      { id: 'my-tickets', label: 'My Tickets', path: '/tickets' },
      { id: 'notifications', label: 'Notifications', path: '/notifications' },
    ];
  }

  if (role === 'TECHNICIAN') {
    return [
      ...baseItems,
      { id: 'my-tasks', label: 'My Tasks', path: '/my-tasks' },
      { id: 'notifications', label: 'Notifications', path: '/notifications' },
    ];
  }

  if (role === 'MANAGER' || role === 'ADMIN') {
    return [
      ...baseItems,
      { id: 'tickets', label: 'All Tickets', path: '/tickets' },
      { id: 'properties', label: 'Properties', path: '/properties' },
      { id: 'users', label: 'Users', path: '/users' },
      { id: 'activity', label: 'Activity Logs', path: '/activity' },
      { id: 'notifications', label: 'Notifications', path: '/notifications' },
    ];
  }

  return baseItems;
};

/** Inline SVG icons to avoid lucide-react forwardRef/children issues in layout */
const IconSvg = ({
  name,
  className = 'h-5 w-5',
}: {
  name: 'dashboard' | 'ticket' | 'building' | 'users' | 'file' | 'bell' | 'wrench' | 'logout';
  className?: string;
}) => {
  const c = className;
  switch (name) {
    case 'dashboard':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      );
    case 'ticket':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
      );
    case 'building':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 6h.01" />
          <path d="M12 10h.01" />
          <path d="M12 14h.01" />
          <path d="M16 10h.01" />
          <path d="M16 14h.01" />
          <path d="M8 10h.01" />
          <path d="M8 14h.01" />
        </svg>
      );
    case 'users':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'file':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
      );
    case 'bell':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case 'wrench':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'logout':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      );
    default:
      return null;
  }
};

const sidebarIconName = (id: string): 'dashboard' | 'ticket' | 'building' | 'users' | 'file' | 'bell' | 'wrench' => {
  switch (id) {
    case 'dashboard': return 'dashboard';
    case 'my-tickets':
    case 'tickets': return 'ticket';
    case 'properties': return 'building';
    case 'users': return 'users';
    case 'activity': return 'file';
    case 'notifications': return 'bell';
    case 'my-tasks': return 'wrench';
    default: return 'dashboard';
  }
};

interface SidebarProps {
  onNavigate?: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = getMenuItems(user?.role);

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.(path);
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2">
            <IconSvg name="building" className="h-6 w-6 text-primary-foreground shrink-0" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">PropMaint</h2>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <IconSvg name={sidebarIconName(item.id)} className="h-5 w-5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user?.username?.charAt(0) ?? ''}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <IconSvg name="logout" className="mr-2 h-4 w-4 shrink-0" />
          Logout
        </Button>
      </div>
    </div>
  );
};
