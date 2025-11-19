'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { UserStatus } from '@/lib/types/user';

interface UserActionsMenuProps {
  userId: string;
  userStatus: UserStatus;
  onCreateLoan?: (userId: string) => void;
}

export function UserActionsMenu({ userId, userStatus, onCreateLoan }: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateLoan = () => {
    setIsOpen(false);
    if (onCreateLoan) {
      onCreateLoan(userId);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <Link
            href={`/admin/users/${userId}`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Eye className="h-4 w-4 text-gray-500" />
            View Details
          </Link>
          
          {userStatus === UserStatus.APPROVED && (
            <button
              onClick={handleCreateLoan}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gray-500" />
              Create Loan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
