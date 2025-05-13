
import { createContext, useContext, useState, ReactNode } from "react";
import { Notification } from "../../types";
import { mockNotifications } from "../../data/mockData";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadNotificationsCount: number;
  sendNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Filter notifications for the current user
  const userNotifications = user ? notifications.filter(notif => notif.to === user.id) : [];
  const unreadNotificationsCount = userNotifications.filter(notif => !notif.read).length;

  const sendNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    setNotifications([...notifications, newNotification]);
    toast.success("Notification sent!");
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const value = {
    notifications,
    unreadNotificationsCount,
    sendNotification,
    markNotificationAsRead,
    deleteNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
