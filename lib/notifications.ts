"use client";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'fail';
  timestamp: number;
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return "denied";
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error("Error requesting notification permission:", e);
    return "default";
  }
}

export function getNotificationPermissionStatus(): NotificationPermission {
  if (!isNotificationSupported()) {
    return "denied";
  }
  return Notification.permission;
}

export function sendBrowserNotification(title: string, body: string, icon = "/globe.svg") {
  if (!isNotificationSupported()) return false;
  
  if (Notification.permission === "granted") {
    try {
      const options = {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200],
      };
      const notification = new Notification(title, options);
      
      notification.onclick = () => {
        window.focus();
      };
      return true;
    } catch (e) {
      console.error("Failed to trigger browser Notification", e);
    }
  }
  return false;
}

export function addNotificationToHistory(title: string, message: string, type: 'success' | 'info' | 'fail' = 'info') {
  if (typeof window === "undefined") return;
  
  const newItem: NotificationItem = {
    id: "NOTIF-" + Math.floor(100000 + Math.random() * 900000),
    title,
    message,
    time: "Just now",
    type,
    timestamp: Date.now(),
  };

  try {
    const saved = localStorage.getItem("datasub_notification_history");
    let list: NotificationItem[] = [];
    if (saved) {
      list = JSON.parse(saved);
    }
    list = [newItem, ...list];
    localStorage.setItem("datasub_notification_history", JSON.stringify(list));
  } catch (e) {
    console.error("Error saving notification history", e);
  }
}
