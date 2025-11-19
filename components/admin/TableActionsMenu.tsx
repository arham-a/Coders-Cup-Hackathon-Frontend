'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface Action {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  show?: boolean;
}

interface TableActionsMenuProps {
  actions: Action[];
}

export function TableActionsMenu({ actions }: TableActionsMenuProps) {
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

  const visibleActions = actions.filter(action => action.show !== false);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && visibleActions.length > 0 && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          {visibleActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Icon className="h-4 w-4 text-gray-500" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
