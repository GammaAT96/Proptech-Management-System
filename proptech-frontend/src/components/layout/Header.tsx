import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDateTime } from '@/utils/formatDate';
import { Loader } from '@/components/common/Loader';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

/** Inline SVG icons to avoid lucide-react forwardRef/children issues */
const MenuIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const BellIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { notifications, loading, setNotifications } = useNotifications();
  const [openNotifications, setOpenNotifications] = React.useState(false);

  const markAsReadLocal = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="border-b border-border bg-card px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <MenuIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu open={openNotifications} onOpenChange={setOpenNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-80 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-xl p-0 max-h-96 overflow-y-auto"
            >
              <div className="border-b border-gray-200 px-4 py-3 font-semibold">Notifications</div>
              {loading ? (
                <Loader className="py-4" />
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
              ) : (
                <div className="p-2">
                  {notifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className="flex cursor-pointer flex-col items-start py-3 text-gray-900"
                      onClick={() => markAsReadLocal(notif.id)}
                    >
                      <div className="flex w-full items-start gap-2">
                        {!notif.isRead && <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />}
                        <div className="flex-1">
                          <p className={`text-sm ${!notif.isRead ? 'font-semibold' : ''}`}>{notif.message}</p>
                          <p className="mt-1 text-xs text-gray-500">{formatDateTime(notif.createdAt)}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
