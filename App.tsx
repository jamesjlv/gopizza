import React from "react";
import { StatusBar } from "react-native";
import { ThemeProvider } from "styled-components/native";
import AppLoading from "expo-app-loading";

import { useFonts, DMSans_400Regular } from "@expo-google-fonts/dm-sans";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";

import theme from "./src/theme";
import { AuthProvider } from "./src/hooks/auth";
import { Routes } from "./src/routes";
import { Order } from "./src/screens/Order";
import { Orders } from "./src/screens/Orders";

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
