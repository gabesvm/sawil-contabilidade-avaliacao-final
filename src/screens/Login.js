import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function Login({ navigation }) {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const acessar = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);
      await signIn(email.trim(), senha);
      // Não navega manualmente: o StackRoutes troca sozinho quando logar ✅
    } catch (e) {
      Alert.alert("Erro ao entrar", e?.message || "Não foi possível entrar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Acessar o Aplicativo
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
        placeholder="Senha"
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
        onPress={acessar}
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
          {carregando ? "ENTRANDO..." : "ACESSAR"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("NovaConta")}
        style={{ padding: 10, alignItems: "center" }}
      >
        <Text style={{ color: "#5b2cff", fontWeight: "700" }}>NOVA CONTA</Text>
      </TouchableOpacity>
    </View>
  );
}