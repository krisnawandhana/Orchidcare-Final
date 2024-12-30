import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Image, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import SplashscreenData from '../constants/SplashscreenData';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton'; // Import the button

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const flatListRef = useRef(null);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const buttonOpacity = useSharedValue(1);
  const router = useRouter(); // Initialize navigation

  const onMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (flatListRef.current && currentIndex < SplashscreenData.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current.scrollToOffset({ offset: newIndex * width, animated: true });
      setCurrentIndex(newIndex);
    } else {
      // When 'GET STARTED' is clicked, navigate to the Tabs screen
      router.push(("(tabs)/Homepage"));
    }
  };

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 200 }, () => {
      opacity.value = withTiming(1, { duration: 300 });
    });
    translateY.value = withTiming(-10, { duration: 200 }, () => {
      translateY.value = withTiming(0, { duration: 300 });
    });
    buttonOpacity.value = withTiming(1, { duration: 300 });
  }, [currentIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 300 }),
    transform: [{ translateY: withTiming(0, { duration: 300 }) }],
  }));

  const imageWidth = width * 1;
  const imageHeight = height * 0.4;

  return (
    <View className="bg-purple-200 flex-1 items-center justify-center ">
      <FlatList
        className=''
        ref={flatListRef}
        data={SplashscreenData}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width }} className=" bg-purple-200 max-w-sm mx-auto text-center">
            <Animated.View style={animatedStyle}>
              <Image
                className="mt-16"
                style={{
                  alignSelf: 'center',
                  width: imageWidth,
                  height: imageHeight,
                }}
                resizeMode="contain"
                source={item.image}
              />
            </Animated.View>
            <Animated.View style={animatedStyle}>
              <Text className="text-purple-800 py-2 px-4 font-black text-3xl">{item.title}</Text>
              <Text className="text-purple-800 py-2 px-4 text-xl font-semibold opacity-70">{item.content}</Text>
            </Animated.View>
          </View>
        )}
      />
      <View className="my-10 ">
        <View className="flex flex-row justify-center py-4">
          {SplashscreenData.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-12 rounded-full mx-1 ${
                index === currentIndex ? 'bg-purple-500' : 'bg-purple-300'
              }`}
            />
          ))}
        </View>
          <Animated.View style={buttonStyle}>
            <CustomButton
              onPress={handleNext}
              title={currentIndex < SplashscreenData.length - 1 ? 'NEXT' : 'GET STARTED'}
              style={{ width: width * 0.5 }}
              className="text-white"
            />
          </Animated.View>
      </View>
    </View>
  );
};

export default HomeScreen;
