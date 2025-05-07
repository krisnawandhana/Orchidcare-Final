import React from "react";
import { View, Text, FlatList, Image } from "react-native";
import Animated from "react-native-reanimated";
import CustomButton from "../components/CustomButton";
import SplashscreenData from "../constants/SplashscreenData";
import { useSplashscreen } from "../hook/useSplashscreen";

const HomeScreen = () => {
  const {
    currentIndex,
    width,
    height,
    flatListRef,
    onMomentumScrollEnd,
    handleNext,
    animatedStyle,
    buttonStyle,
  } = useSplashscreen();

  return (
    <View className="bg-purple-200 flex-1 items-center justify-center">
      <FlatList
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
          <View style={{ width }} className="bg-purple-200 max-w-sm mx-auto text-center">
            <Animated.View style={animatedStyle}>
              <Image
                className="mt-16"
                style={{
                  alignSelf: "center",
                  width: width * 1,
                  height: height * 0.4,
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

      <View className="my-10">
        <View className="flex flex-row justify-center py-4">
          {SplashscreenData.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-12 rounded-full mx-1 ${
                index === currentIndex ? "bg-purple-500" : "bg-purple-300"
              }`}
            />
          ))}
        </View>

        <Animated.View style={buttonStyle}>
          <CustomButton
            onPress={handleNext}
            title={currentIndex < SplashscreenData.length - 1 ? "NEXT" : "GET STARTED"}
            style={{ width: width * 0.5 }}
            className="text-white"
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default HomeScreen;
