import React from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import useNotifications from "../../hook/useNotifications";

const Notification = () => {
  const { notifications, loading } = useNotifications();

  return (
    <View className="container flex-1 bg-[#F7FBFF]">
      <View className="p-4">
        <Text className="text-2xl font-extrabold text-purple-600 mb-4">Notifications</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#6B46C1" />
        ) : (
          <ScrollView className="mb-10">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <View key={notif.id} className="flex-row items-center p-4 bg-white rounded-lg shadow-md my-4">
                  <Image
                    source={require("../../assets/icon/bot.png")}
                    className="w-12 h-12"
                    alt="Orchid-bot icon"
                  />
                  <View className="flex-1 mx-4">
                    <Text className="text-lg font-semibold">Orchid-bot</Text>
                    <Text className="text-gray-600">{notif.message}</Text>
                    <Text className="text-sm text-gray-500 mt-2">
                      {new Intl.DateTimeFormat('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }).format(new Date(notif.created_at))}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-gray-500">No notifications available</Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default Notification;
