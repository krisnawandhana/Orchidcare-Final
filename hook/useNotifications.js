import { useState, useEffect } from "react";
import { fetchNotifications } from "../constants/fetchNotif";
import { subscribeToNotifications } from "../lib/supabase";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNotifications = async () => {
    setLoading(true);
    const data = await fetchNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    getNotifications();
    const unsubscribe = subscribeToNotifications(getNotifications);

    return () => {
      unsubscribe();
    };
  }, []);

  return { notifications, loading };
};

export default useNotifications;
