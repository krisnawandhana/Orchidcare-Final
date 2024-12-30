import React from 'react';
import { Pressable, Text } from 'react-native';
import { Link } from 'expo-router';

const CustomButton = ({ onPress, title, style }) => {
  return (
      <Pressable
        style={{ width: 150 }}
        onPress={onPress}
        className='bg-purple-500 rounded-full py-2 px-4'
      >
        <Text
          className='text-white text-center font-bold text-lg'
        >
          {title}
        </Text>
      </Pressable>
  );
};

export default CustomButton;
