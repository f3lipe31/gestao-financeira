import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: "#10B981" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Transações",
          tabBarIcon: ({ color }) => <MaterialIcons name="list" size={26} color={color} />,
        }}
      />
      {/* Aqui entra a nova aba de Categorias do Passo 10 */}
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color }) => <MaterialIcons name="category" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-transactions"
        options={{
          title: "Adicionar",
          tabBarIcon: ({ color }) => <MaterialIcons name="add-circle" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Resumo",
          tabBarIcon: ({ color }) => <MaterialIcons name="pie-chart" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}