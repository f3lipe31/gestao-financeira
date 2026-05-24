import {
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useState } from "react";
import Button from "../../components/Button";

export default function AddTransactions() {
  const initialForm = {
    description: "",
    value: "",
    date: "",
    category: "Renda",
  };

  const [form, setForm] = useState(initialForm);

  const addTransaction = () => {
    Alert.alert(
      "Dados do Formulário",
      `${form.description} | ${form.value} | ${form.date} | ${form.category}`
    );
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView style={globalStyles.content}>
        <View style={styles.formContainer}>
          <View>
            <Text style={globalStyles.inputLabel}>Descrição</Text>
            <TextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              style={globalStyles.input}
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Valor</Text>
            <TextInput
              value={form.value}
              onChangeText={(text) => setForm({ ...form, value: text })}
              keyboardType="numeric"
              style={globalStyles.input}
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Data</Text>
            <TextInput
              value={form.date}
              onChangeText={(text) => setForm({ ...form, date: text })}
              style={globalStyles.input}
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Categoria</Text>
            <TextInput
              value={form.category}
              onChangeText={(text) => setForm({ ...form, category: text })}
              style={globalStyles.input}
            />
          </View>
        </View>

        <Button onPress={addTransaction}>Adicionar</Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
    marginBottom: 20
  }
});