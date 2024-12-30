import React from 'react';
import { View, Text } from 'react-native';
import { tw } from 'nativewind';

const NotFound = () => {
    return (
        <View style={tw`flex-1 justify-center items-center bg-white`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>404</Text>
            <Text style={tw`text-lg text-gray-600`}>Page Not Found</Text>
        </View>
    );
};

export default NotFound;