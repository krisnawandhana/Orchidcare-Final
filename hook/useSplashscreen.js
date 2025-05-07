import { useState, useRef, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import SplashscreenData from "../constants/SplashscreenData";

export const useSplashscreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const flatListRef = useRef(null);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const buttonOpacity = useSharedValue(1);
  const router = useRouter();

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
      router.push("(tabs)/Homepage");
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

  return {
    currentIndex,
    width,
    height,
    flatListRef,
    onMomentumScrollEnd,
    handleNext,
    animatedStyle,
    buttonStyle,
  };
};
