import { useEffect, useState } from "react";
import { getUnreadNotifications, markNotificationAsRead } from "../api/notificationApi";
import "../styles/NotificationToast.css";

export default function NotificationManager() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        console.log("Checking for notifications...");
        const data = await getUnreadNotifications();
        console.log("Notifications received:", data); 
        
        if (data && data.length > 0) {
          const limitedData = data.slice(0, 2);

          limitedData.forEach(note => {
             addToast(note);
             markNotificationAsRead(note.id).catch(err => console.error("Failed to mark read:", err));
          });
        }
      } catch (error) {
        console.error("Notification check failed:", error);
      }
    };

    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  const addToast = (notification) => {
    setToasts((prev) => {
      if (prev.some(t => t.id === notification.id)) return prev;
      
      if (prev.length >= 2) return prev;

      return [...prev, notification];
    });

    setTimeout(() => {
      removeToast(notification.id);
    }, 8000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0)
    return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-message">
          <div className="toast-content">
            <span className="toast-title">Dont forget!</span>
            <span className="toast-body">
              {toast.message.replace("Reminder sent for: ", "")}
            </span>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
