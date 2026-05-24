import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Resumo",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="add-transactions" 
        options={{ 
          title: "Adicionar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="summary" 
        options={{ 
          title: "Extrato",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          )
        }} 
      />
    </Tabs>
  );
}