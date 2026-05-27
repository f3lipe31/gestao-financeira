import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MoneyContext } from "../../contexts/GlobalState";
import { useRouter } from "expo-router";

export default function AddTransactionScreen() {
  const { categories, addTransaction } = useContext(MoneyContext);
  const router = useRouter();

  // Pega a primeira categoria disponível como padrão
  const defaultCategory = categories.length > 0 ? categories[0].id : "";

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategory);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSave = async () => {
    if (!description.trim() || !value.trim() || !categoryId) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    const numericValue = parseFloat(value.replace(",", "."));
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert("Atenção", "Insira um valor válido maior que zero.");
      return;
    }

    setIsSaving(true);
    try {
      await addTransaction({
        description: description.trim(),
        value: numericValue,
        categoryId,
        date: new Date().toISOString(),
      });

      // Limpa o form e volta pra tela inicial
      setDescription("");
      setValue("");
      router.replace("/");
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível salvar a transação.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} placeholder="Ex: Mercado" value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput style={styles.input} placeholder="0,00" keyboardType="numeric" value={value} onChangeText={setValue} />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={categoryId} onValueChange={(val) => setCategoryId(val)}>
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.displayName} value={cat.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={[styles.btn, (isSaving || categories.length === 0) && styles.btnDisabled]} onPress={handleSave} disabled={isSaving || categories.length === 0}>
        {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Salvar Transação</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  label: { fontSize: 16, fontWeight: "600", color: "#1E293B", marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E2E8F0", padding: 14, borderRadius: 8, fontSize: 16 },
  pickerContainer: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, overflow: "hidden" },
  btn: { backgroundColor: "#10B981", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 30 },
  btnDisabled: { backgroundColor: "#94A3B8" },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
