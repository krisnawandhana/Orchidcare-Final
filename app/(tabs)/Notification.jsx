import React from "react";
import { View, Text } from "react-native";


const Notification = () => {
  const notifications = [
    "New message from John",
    "Water your plants today!",
    "Temperature exceeded the threshold",
  ];


  return (
    <View className="flex-1 bg-[#F7FBFF] justify-center items-center">
      <Text className="text-purple-600 text-2xl font-bold">Notifications</Text>
      {notifications.map((item, index) => (
        <Text key={index} className="text-gray-600 mt-2">
          {item}
        </Text>
      ))}
    </View>
  );
};

export default Notification;
