import React, { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export const MoneyContext = createContext();

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca os dados atualizados da API (Categorias e Transações)
  const refresh = useCallback(async () => {
    setLoading(true); 
    setError(null);
    try {
      const [cats, txs] = await Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ]);
      setCategories(cats);
      setTransactions(txs);
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    refresh(); 
  }, [refresh]);

  // Ação: Adicionar uma nova Transação na API
  const addTransaction = useCallback(async (data) => {
    try {
      setError(null);
      const newTx = await api.createTransaction(data);
      setTransactions((prev) => [newTx, ...prev]);
      return newTx;
    } catch (e) {
      setError(e.message ?? "Erro ao adicionar transação");
      throw e;
    }
  }, []);

  // Ação: Remover uma Transação da API
  const removeTransaction = useCallback(async (id) => {
    try {
      setError(null);
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (e) {
      setError(e.message ?? "Erro ao remover transação");
    }
  }, []);

  // Ação: Adicionar uma nova Categoria na API
  const addCategory = useCallback(async (data) => {
    try {
      setError(null);
      const newCat = await api.createCategory(data);
      setCategories((prev) => [...prev, newCat].sort((a, b) => a.displayName.localeCompare(b.displayName)));
    } catch (e) {
      setError(e.message ?? "Erro ao adicionar categoria");
    }
  }, []);

  // Ação: Remover uma Categoria da API
  const removeCategory = useCallback(async (id) => {
    try {
      setError(null);
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (e) {
      setError(e.message ?? "Erro ao remover categoria");
    }
  }, []);

  return (
    <MoneyContext.Provider value={{
      transactions, categories, loading, error, refresh,
      addTransaction, removeTransaction, addCategory, removeCategory,
    }}>
      {children}
    </MoneyContext.Provider>
  );
}
