import { MoneyContext } from "../../contexts/GlobalState";
import { useContext } from "react";
import { Text } from "react-native";

export default function Transactions() {
  const [transactions] = useContext(MoneyContext);

  // Exibe a descrição do primeiro item da lista (posição 0), se existir (?)
  return <Text>{transactions[0]?.description}</Text>;
}