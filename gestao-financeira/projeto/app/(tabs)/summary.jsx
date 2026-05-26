import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import { MaterialIcons } from "@expo/vector-icons";

export default function SummaryScreen() {
  const { transactions, categories } = useContext(MoneyContext);

  // Calcula Renda e Despesa Totais
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const val = Number(tx.value);
    if (tx.category.isIncome) {
      totalIncome += val;
    } else {
      totalExpense += val;
    }
  });

  const balance = totalIncome - totalExpense;

  // Agrupa gastos por categoria
  const summaryByCategory = categories.map((cat) => {
    const total = transactions
      .filter((tx) => tx.categoryId === cat.id)
      .reduce((acc, tx) => acc + Number(tx.value), 0);
    return { ...cat, total };
  }).filter(cat => cat.total > 0 || cat.isIncome); // Mostra rendas e as que tem gasto

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saldo Atual</Text>
        <Text style={[styles.balanceText, { color: balance >= 0 ? "#10B981" : "#EF4444" }]}>
          R$ {balance.toFixed(2).replace(".", ",")}
        </Text>
        <View style={styles.row}>
          <Text style={styles.income}>+ R$ {totalIncome.toFixed(2).replace(".", ",")}</Text>
          <Text style={styles.expense}>- R$ {totalExpense.toFixed(2).replace(".", ",")}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Despesas por Categoria</Text>
      
      <FlatList
        data={summaryByCategory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
             <View style={[styles.iconBg, { backgroundColor: item.background }]}>
                <MaterialIcons name={item.icon} size={24} color="#FFF" />
              </View>
            <Text style={styles.catName}>{item.displayName}</Text>
            <Text style={styles.value}>R$ {item.total.toFixed(2).replace(".", ",")}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  header: { backgroundColor: "#1E293B", padding: 20, borderRadius: 12, alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#94A3B8", fontSize: 16 },
  balanceText: { fontSize: 32, fontWeight: "bold", marginVertical: 8 },
  row: { flexDirection: "row", gap: 20 },
  income: { color: "#10B981", fontWeight: "600" },
  expense: { color: "#EF4444", fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B", marginBottom: 12 },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 8, marginBottom: 8 },
  iconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 12 },
  catName: { flex: 1, fontSize: 16, color: "#1E293B" },
  value: { fontSize: 16, fontWeight: "bold", color: "#64748B" }
});