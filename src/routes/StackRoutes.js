import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { AuthContext } from "../context/AuthContext";

import Login from "../screens/Login";
import NovaConta from "../screens/NovaConta";
import Navegacao from "../screens/Navegacao";

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Navegacao" component={Navegacao} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="NovaConta" component={NovaConta} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}