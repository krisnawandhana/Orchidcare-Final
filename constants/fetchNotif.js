// fetchNotif.js
import { supabase } from "../lib/supabase"; // Path sesuai konfigurasi Anda

export const fetchNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("id, message, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
};

const getLastNotificationId = async () => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching last notification ID:", error);
      return null;
    }
    return data.length > 0 ? data[0].id : 0; // Jika tabel kosong, mulai dari 0
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

// Fungsi untuk mengirim data ke tabel notifications
const sendNotification = async (message) => {
  try {
    const lastId = await getLastNotificationId();
    console.log("Last ID fetched:", lastId);

    if (lastId === null) {
      console.error("Failed to fetch last ID");
      return null;
    }

    const newId = lastId + 1;
    console.log("New ID generated:", newId);

    const { data, error } = await supabase
      .from("notifications")
      .insert([{ id: newId, message }]);

    console.log("Insert response:", { data, error });

    if (error) {
      console.error("Error sending notification:", error);
      return null;
    }

    console.log("Notification sent successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

