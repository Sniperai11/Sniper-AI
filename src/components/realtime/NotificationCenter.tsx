import React, { useState } from 'react';
import { useNotifications } from '../../hooks/realtime';
import { Bell, Check, Trash2, X, ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export const NotificationCenter = () => {
  const notifications = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter(n => !readIds.has(n.id) && !n.read).length;

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)));
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('critical') || title.toLowerCase().includes('attack')) return <ShieldAlert className="h-4 w-4 text-red-400" />;
    if (title.toLowerCase().includes('warning')) return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    return <Info className="h-4 w-4 text-cyan-400" />;
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-slate-400 hover:text-slate-200 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-[#030712]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-[#0a0f1c] shadow-2xl z-50 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#050811]">
              <h3 className="font-semibold text-slate-200">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-slate-800 p-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                  <Bell className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map(notification => {
                    const isRead = readIds.has(notification.id) || notification.read;
                    return (
                      <div 
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg transition-colors group relative",
                          isRead ? "opacity-70 hover:bg-slate-800/30" : "bg-slate-800/40 hover:bg-slate-800/60"
                        )}
                      >
                        <div className="mt-1 shrink-0">
                          {getIcon(notification.title)}
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <p className={cn("text-sm font-medium truncate", isRead ? "text-slate-300" : "text-white")}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        
                        {!isRead && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white bg-slate-700/50 rounded"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="border-t border-slate-800 p-2 bg-[#050811]">
              <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
                Close Center
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
