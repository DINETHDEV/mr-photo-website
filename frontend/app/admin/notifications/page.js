'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Trash2, CheckCircle, Package, Star, Info, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAdminData, putAdminData, deleteAdminData } from '@/utils/adminApi';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await fetchAdminData('notifications');
      setNotifications(data || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await putAdminData(`notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await putAdminData('notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      await deleteAdminData(`notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL notifications?')) return;
    try {
      await deleteAdminData('notifications/all');
      setNotifications([]);
      toast.success('All notifications deleted');
    } catch (error) {
      toast.error('Failed to delete notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <Package className="text-blue-500" size={24} />;
      case 'review': return <Star className="text-yellow-500" size={24} />;
      default: return <Info className="text-gray-400" size={24} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Bell className="text-primary" size={32} />
            Notifications
          </h1>
          <p className="text-gray-400 mt-1">Manage all your system alerts and updates.</p>
        </div>

        <div className="flex gap-3">
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-secondary px-4 py-2 rounded-xl text-sm flex items-center gap-2"
            >
              <CheckCircle size={16} /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={16} /> Delete All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center border-white/5">
            <Bell size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">You have no notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`glass p-5 rounded-2xl border transition-all flex flex-col sm:flex-row gap-4 sm:items-center justify-between ${
                notification.read ? 'border-white/5 opacity-70' : 'border-primary/30 bg-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div>
                  <h3 className={`font-bold ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                    {notification.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle size={20} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
