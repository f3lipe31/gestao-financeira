import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MoneyContext } from "../../contexts/GlobalState";

export default function CategoriesScreen() {
  const { categories, addCategory, removeCategory } = useContext(MoneyContext);

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [icon, setIcon] = useState("label");
  const [background, setBackground] = useState("#94A3B8");
  const [isIncome, setIsIncome] = useState(false);

  // Envia a nova categoria para a API
  const handleCreate = async () => {
    if (!name || !displayName) {
      Alert.alert("Erro", "Preencha o nome técnico e o nome de exibição.");
      return;
    }
    await addCategory({ name, displayName, icon, background, isIncome });
    setName("");
    setDisplayName("");
  };

  // Solicita a exclusão da categoria na API
  const handleDelete = (id, isDefault) => {
    if (isDefault) {
      Alert.alert("Bloqueado", "Categorias padrão não podem ser excluídas.");
      return;
    }
    Alert.alert("Excluir", "Tem certeza que deseja apagar esta categoria?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => removeCategory(id) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Nome técnico (ex: health)" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Nome exibição (ex: Saúde)" value={displayName} onChangeText={setDisplayName} />
        
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, isIncome && styles.btnActive]} onPress={() => setIsIncome(true)}>
            <Text style={[styles.btnText, isIncome && styles.btnTextActive]}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, !isIncome && styles.btnActive]} onPress={() => setIsIncome(false)}>
            <Text style={[styles.btnText, !isIncome && styles.btnTextActive]}>Despesa</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
          <Text style={styles.submitText}>Criar Categoria</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.iconBg, { backgroundColor: item.background }]}>
              <MaterialIcons name={item.icon} size={24} color="#FFF" />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.displayName} {item.isIncome ? "(Receita)" : ""}</Text>
              {item.isDefault && <Text style={styles.badge}>Padrão</Text>}
            </View>
            {!item.isDefault && (
              <TouchableOpacity onPress={() => handleDelete(item.id, item.isDefault)}>
                <MaterialIcons name="delete" size={24} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8FAFC" },
  form: { backgroundColor: "#FFF", padding: 16, borderRadius: 8, marginBottom: 16, elevation: 2 },
  input: { borderWidth: 1, borderColor: "#E2E8F0", padding: 10, borderRadius: 6, marginBottom: 10 },
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  btn: { flex: 1, padding: 10, borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", borderRadius: 6 },
  btnActive: { backgroundColor: "#1E293B", borderColor: "#1E293B" },
  btnText: { color: "#64748B", fontWeight: "600" },
  btnTextActive: { color: "#FFF" },
  submitBtn: { backgroundColor: "#10B981", padding: 12, borderRadius: 6, alignItems: "center" },
  submitText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginBottom: 10, elevation: 1 },
  iconBg: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  badge: { fontSize: 12, color: "#94A3B8", marginTop: 4 }
});