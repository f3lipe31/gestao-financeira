import React, { useContext, useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import { MaterialIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit"; // Importamos o gráfico

// Pega a largura da tela do celular para o gráfico se adaptar
const screenWidth = Dimensions.get("window").width;
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function SummaryScreen() {
  const { transactions, categories } = useContext(MoneyContext);

  // --- Estado para o Filtro de Mês/Ano ---
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // --- Lógica de Filtragem ---
  // Filtra as transações apenas para o mês e ano selecionados
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // ATENÇÃO: Assumi que a data da transação se chama 'date'. 
      // Se no seu banco for 'createdAt' ou 'data', mude aqui!
      if (!tx.date) return true; 
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });
  }, [transactions, currentMonth, currentYear]);

  // --- Cálculos ---
  let totalIncome = 0;
  let totalExpense = 0;

  filteredTransactions.forEach((tx) => {
    const val = Number(tx.value);
    if (tx.category.isIncome) {
      totalIncome += val;
    } else {
      totalExpense += val;
    }
  });

  const balance = totalIncome - totalExpense;

  // Agrupa apenas DESPESAS para o gráfico e para a lista
  const expensesByCategory = categories
    .filter(cat => !cat.isIncome)
    .map((cat) => {
      const total = filteredTransactions
        .filter((tx) => tx.categoryId === cat.id)
        .reduce((acc, tx) => acc + Number(tx.value), 0);
      return { ...cat, total };
    })
    .filter(cat => cat.total > 0); // Só mostra categorias que tiveram gasto no mês

  // --- Dados do Gráfico ---
  const chartData = expensesByCategory.map(cat => ({
    name: cat.displayName,
    population: cat.total,
    color: cat.background || "#CBD5E1", // Usa a cor da categoria
    legendFontColor: "#64748B",
    legendFontSize: 13
  }));

  return (
    <View style={styles.container}>
      <FlatList
        data={expensesByCategory}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        // O ListHeaderComponent permite que tudo isso role junto com a lista
        ListHeaderComponent={
          <>
            {/* Filtro de Data */}
            <View style={styles.monthFilter}>
              <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
                <MaterialIcons name="chevron-left" size={28} color="#1E293B" />
              </TouchableOpacity>
              <Text style={styles.monthText}>{monthNames[currentMonth]} {currentYear}</Text>
              <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
                <MaterialIcons name="chevron-right" size={28} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Saldo e Resumo */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Saldo Mensal</Text>
              <Text style={[styles.balanceText, { color: balance >= 0 ? "#10B981" : "#EF4444" }]}>
                R$ {balance.toFixed(2).replace(".", ",")}
              </Text>
              <View style={styles.row}>
                <Text style={styles.income}>+ R$ {totalIncome.toFixed(2).replace(".", ",")}</Text>
                <Text style={styles.expense}>- R$ {totalExpense.toFixed(2).replace(".", ",")}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Despesas por Categoria</Text>

            {/* Gráfico de Pizza */}
            {chartData.length > 0 ? (
              <View style={styles.chartContainer}>
                <PieChart
                  data={chartData}
                  width={screenWidth - 32} // Largura da tela menos os paddings
                  height={180}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"10"}
                  absolute // Mostra o valor em R$ no lugar da porcentagem
                />
              </View>
            ) : (
              <Text style={styles.emptyText}>Nenhuma despesa registrada neste mês.</Text>
            )}
          </>
        }
        // Lista de categorias abaixo do gráfico
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
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 16 },
  
  // Estilos do Filtro de Mês
  monthFilter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 16 },
  arrowBtn: { padding: 8, backgroundColor: "#E2E8F0", borderRadius: 8 },
  monthText: { fontSize: 18, fontWeight: "bold", color: "#1E293B", textTransform: "capitalize" },
  
  header: { backgroundColor: "#1E293B", padding: 20, borderRadius: 12, alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#94A3B8", fontSize: 16 },
  balanceText: { fontSize: 32, fontWeight: "bold", marginVertical: 8 },
  row: { flexDirection: "row", gap: 20 },
  income: { color: "#10B981", fontWeight: "600" },
  expense: { color: "#EF4444", fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B", marginBottom: 12 },
  
  // Estilos do Gráfico
  chartContainer: { alignItems: "center", marginBottom: 20 },
  emptyText: { textAlign: "center", color: "#94A3B8", marginBottom: 20, fontStyle: "italic" },
  
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 8, marginBottom: 8 },
  iconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 12 },
  catName: { flex: 1, fontSize: 16, color: "#1E293B" },
  value: { fontSize: 16, fontWeight: "bold", color: "#64748B" }
});