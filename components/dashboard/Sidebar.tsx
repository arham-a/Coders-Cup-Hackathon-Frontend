'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  CreditCard, 
  Receipt, 
  User, 
  Shield, 
  LogOut,
  Users,
  DollarSign,
  AlertCircle,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const userMenuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: CreditCard, label: 'My Loan', href: '/dashboard/loan' },
  { icon: CreditCard, label: 'Loan Request', href: '/dashboard/loan-request' },
  { icon: Receipt, label: 'Installments', href: '/dashboard/installments' },
  { icon: Shield, label: 'Risk Profile', href: '/dashboard/risk-profile' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

const adminMenuItems = [
  { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: AlertCircle, label: 'Pending Users', href: '/admin/users/pending' },
  { icon: DollarSign, label: 'Loans', href: '/admin/loans' },
  { icon: AlertCircle, label: 'Pending Loans', href: '/admin/loans/pending' },
  { icon: Receipt, label: 'Installments', href: '/admin/installments' },
  { icon: AlertCircle, label: 'Overdue', href: '/admin/installments/overdue' },
  { icon: Shield, label: 'Defaults', href: '/admin/installments/defaults' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface SidebarProps {
  onClose?: () => void;
  isAdmin?: boolean;
}

export default function Sidebar({ onClose, isAdmin = false }: SidebarProps) {
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

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const activeColor = isAdmin ? 'bg-orange-500 text-white border-orange-100' : 'bg-green-800 text-white border-green-100';
  const activeIconColor = isAdmin ? 'text-white' : 'text-white';
  const HoverColor = isAdmin ? 'hover:bg-orange-200' : 'hover:bg-green-200';
 
  return (
    <aside className="h-screen bg-white border-r border-gray-200 w-64 flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image
                src="/logo.png"
                alt="LoanPulse Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="font-bold text-lg">
              <span className="text-green-600">LOAN</span>
              <span className="text-orange-500">PULSE</span>
            </h1>
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
                    ? `${activeColor} font-medium shadow-sm border` 
                    : `text-gray-600 ${HoverColor} hover:text-gray-900`
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? activeIconColor : ''}`} />
                <span>{item.label}</span>
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
