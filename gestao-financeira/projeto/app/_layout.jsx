import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import GlobalState from "../contexts/GlobalState";

export default function RootLayout() {
  return (
    // Agora todas as telas dentro do Stack tem acesso ao Contexto!
    <GlobalState>
      <StatusBar backgroundColor={colors.primary} style="light" />
      <Stack>
        {/* Adicionamos a tela de login (index) aqui, escondendo o cabeçalho */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GlobalState>
  );
}