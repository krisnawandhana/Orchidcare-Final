import React, { useRef, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import * as Notifications from 'expo-notifications';

import { initializeNotifications } from '../../lib/notification';

// Inisialisasi notifikasi (pastikan ini dipanggil hanya sekali di aplikasi Anda)
initializeNotifications();

const LocalNotification = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const notificationIdentifierRef = useRef(null); // Tidak perlu tipe spesifik dalam JSX

  // Fungsi untuk menjadwalkan notifikasi
  const scheduleNotification = async (seconds = 1) => {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds },
    });
    return identifier;
  };

  // Menampilkan notifikasi langsung
  const handleShowNotification = () => {
    scheduleNotification();
  };

  // Menjadwalkan notifikasi 15 detik ke depan
  const handleScheduleNotification = async () => {
    const id = await scheduleNotification(15);
    notificationIdentifierRef.current = id;
  };

  // Membatalkan notifikasi yang telah dijadwalkan
  const handleCancelScheduledNotification = () => {
    const identifier = notificationIdentifierRef.current;
    if (!identifier) return;
    Notifications.cancelScheduledNotificationAsync(identifier);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title..."
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Body..."
        value={body}
        onChangeText={setBody}
        style={styles.input}
      />
      <Button title="Show notification" onPress={handleShowNotification} />
      <Button
        title="Schedule notification"
        onPress={handleScheduleNotification}
      />
      <Button
        title="Cancel scheduled notification"
        onPress={handleCancelScheduledNotification}
      />
    </View>
  );
};

export default LocalNotification;
