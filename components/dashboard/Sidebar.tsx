'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  CreditCard, 
  Receipt, 
  User, 
  Shield, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: CreditCard, label: 'My Loan', href: '/dashboard/loan' },
  { icon: Receipt, label: 'Installments', href: '/dashboard/installments' },
  { icon: Shield, label: 'Risk Profile', href: '/dashboard/risk-profile' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="h-screen bg-white border-r border-gray-200 w-64 flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">MLMS</h1>
              <p className="text-xs text-gray-500">Microfinance</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-green-50 text-green-700 font-medium shadow-sm border border-green-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-green-600' : ''}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full
              text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
  );
}
