import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function NovaConta({ navigation }) {
  const { signUp } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const criarConta = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);
      await signUp(email.trim(), senha);
      // StackRoutes vai logar e entrar automaticamente ✅
    } catch (e) {
      Alert.alert("Erro ao criar conta", e?.message || "Não foi possível criar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Nova Conta
      </Text>

      <TextInput
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
        }}
      />

      <TextInput
        placeholder="Senha (mín. 6)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
        }}
      />

      <TouchableOpacity
        onPress={criarConta}
        disabled={carregando}
        style={{
          backgroundColor: "#5b2cff",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          opacity: carregando ? 0.7 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          {carregando ? "SALVANDO..." : "SALVAR DADOS"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ padding: 10, alignItems: "center" }}
      >
        <Text style={{ color: "#5b2cff", fontWeight: "700" }}>VOLTAR</Text>
      </TouchableOpacity>
    </View>
  );
}