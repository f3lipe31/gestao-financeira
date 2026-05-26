import React, { useContext, useState } from "react"; // Adicionado useState para controlar o Modal
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert, TouchableOpacity, Modal, TextInput } from "react-native"; // Adicionado Modal e TextInput
import { MoneyContext } from "../../contexts/GlobalState";
import { MaterialIcons } from "@expo/vector-icons";

export default function TransactionsScreen() {
  const { transactions, loading, error, refresh, removeTransaction } = useContext(MoneyContext);

  // --- Estados para controlar o Modal de Edição ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editValue, setEditValue] = useState("");

  // Menu de opções que abre ao segurar o dedo na transação
  const handleLongPress = (item) => {
    Alert.alert("Opções da Transação", "O que você deseja fazer?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Editar Transação", onPress: () => openEditModal(item) },
      { text: "Excluir", style: "destructive", onPress: () => handleDelete(item.id) }
    ]);
  };

  const handleDelete = (id) => {
    Alert.alert("Excluir", "Deseja apagar esta transação?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => removeTransaction(id) }
    ]);
  };

  // Abre o modal e joga os valores da transação nos inputs
  const openEditModal = (item) => {
    setSelectedTransaction(item);
    setEditDescription(item.description);
    setEditValue(String(item.value));
    setModalVisible(false); // Garante fechamento de alertas anteriores
    setModalVisible(true);
  };

  // Envia a alteração (fazer o PUT) para o servidor Backend
  const handleSaveEdit = async () => {
    if (!editDescription.trim() || !editValue.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Faz o PUT direto na rota do seu backend usando o ID da transação selecionada
      const response = await fetch(`http://localhost:3000/transactions/${selectedTransaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: editDescription,
          value: parseFloat(editValue.replace(",", ".")), // Converte vírgula para ponto se o usuário digitar errado
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível atualizar no servidor.");
      }

      Alert.alert("Sucesso", "Transação atualizada com sucesso!");
      setModalVisible(false); // Fecha a janelinha
      refresh(); // Recarrega a lista na tela automaticamente
    } catch (err) {
      Alert.alert("Erro", "Ocorreu um erro ao atualizar a transação.");
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Carregando transações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} colors={["#10B981"]} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação registrada.</Text>}
        renderItem={({ item }) => (
          // Mudamos aqui de handleDelete para handleLongPress
          <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.8}>
            <View style={styles.item}>
              <View style={[styles.iconBg, { backgroundColor: item.category.background }]}>
                <MaterialIcons name={item.category.icon} size={24} color="#FFF" />
              </View>
              <View style={styles.info}>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.catName}>{item.category.displayName}</Text>
              </View>
              <Text style={[styles.value, { color: item.category.isIncome ? "#10B981" : "#EF4444" }]}>
                {item.category.isIncome ? "+" : "-"} R$ {Number(item.value).toFixed(2).replace(".", ",")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* ==================== MODAL DE EDIÇÃO ==================== */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Transação</Text>
            
            <Text style={styles.label}>Descrição</Text>
            <TextInput 
              style={styles.input} 
              value={editDescription} 
              onChangeText={setEditDescription}
              placeholder="Ex: Almoço"
            />

            <Text style={styles.label}>Valor (R$)</Text>
            <TextInput 
              style={styles.input} 
              value={editValue} 
              onChangeText={setEditValue}
              keyboardType="numeric"
              placeholder="0,00"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSaveEdit}>
                <Text style={styles.btnSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, color: "#64748B" },
  errorText: { color: "#EF4444", fontSize: 16, marginVertical: 10, textAlign: "center" },
  retryBtn: { backgroundColor: "#1E293B", padding: 12, borderRadius: 8, marginTop: 10 },
  retryText: { color: "#FFF", fontWeight: "bold" },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderBottomWidth: 1, borderColor: "#E2E8F0" },
  iconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 12 },
  info: { flex: 1 },
  desc: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  catName: { fontSize: 13, color: "#94A3B8" },
  value: { fontSize: 16, fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 40, color: "#94A3B8" },
  
  // Novos Estilos do Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#FFF", borderRadius: 12, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B", marginBottom: 15, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "600", color: "#64748B", marginBottom: 4, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 6, padding: 10, fontSize: 16, color: "#1E293B", backgroundColor: "#F8FAFC" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  btn: { flex: 1, padding: 12, borderRadius: 6, alignItems: "center", marginHorizontal: 5 },
  cancelBtn: { backgroundColor: "#F1F5F9" },
  saveBtn: { backgroundColor: "#10B981" },
  btnCancelText: { color: "#64748B", fontWeight: "600" },
  btnSaveText: { color: "#FFF", fontWeight: "600" }
});