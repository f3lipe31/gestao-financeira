import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import { categories } from "../../constants/categories";
import { globalStyles } from "../../styles/globalStyles";
import SummaryItem from "../../components/SummaryItem";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

const SUMMARY_CATEGORY_KEYS = [
  categories.income.name,
  categories.food.name,
  categories.house.name,
  categories.education.name,
  categories.travel.name,
];

export default function Summary() {
  const [transactions] = useContext(MoneyContext);

  const getTotals = () => {
    const totals = {
      sum: 0,
      income: 0,
      food: 0,
      education: 0,
      house: 0,
      travel: 0,
    };

    // Laço O(n): Passa pelas transações uma única vez para somar tudo.
    for (let i = 0; i < transactions.length; i++) {
      const item = transactions[i];
      
      // Ignora lixo ou categorias velhas
      if (!SUMMARY_CATEGORY_KEYS.includes(item.category)) continue;

      // Soma o valor no caixote da categoria específica
      totals[item.category] += item.value;

      // Soma ou subtrai do Saldo Total
      if (item.category === categories.income.name) {
        totals.sum += item.value;
      } else {
        totals.sum -= item.value;
      }
    }
    return totals;
  };

  // O useMemo guarda o resultado da conta e só refaz se você cadastrar/apagar transações
  const totals = useMemo(getTotals, [transactions]);

  const valueStyle =
    totals.sum >= 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.content}>
        <SummaryItem category={categories.income.name} value={totals[categories.income.name]} />
        <SummaryItem category={categories.food.name} value={totals[categories.food.name]} />
        <SummaryItem category={categories.house.name} value={totals[categories.house.name]} />
        <SummaryItem category={categories.education.name} value={totals[categories.education.name]} />
        <SummaryItem category={categories.travel.name} value={totals[categories.travel.name]} />

        <View style={globalStyles.line} />

        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={valueStyle}>
            {totals.sum.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800", // Coloquei entre aspas ("800") para evitar alertas de tipagem do React Native!
  },
});