import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import { createItem, updateItem, deleteItem, listenItems } from "../services/crud";

const Stack = createNativeStackNavigator();

/* =========================
   HELPERS DE UI (simples)
========================= */
function Card({ children }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      {children}
    </View>
  );
}

function Btn({ title, onPress, variant = "primary" }) {
  const stylesByVariant = {
    primary: { bg: "#5b2cff", color: "#fff" },
    dark: { bg: "#111827", color: "#fff" },
    danger: { bg: "#ef4444", color: "#fff" },
    light: { bg: "#fff", color: "#111827", border: "#cbd5e1" },
    gray: { bg: "#f3f4f6", color: "#111827", border: "#e5e7eb" },
  };

  const v = stylesByVariant[variant] || stylesByVariant.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: v.bg,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: v.border ? 1 : 0,
        borderColor: v.border || "transparent",
      }}
    >
      <Text style={{ color: v.color, fontWeight: "900" }}>{title}</Text>
    </TouchableOpacity>
  );
}

function Input({ label, value, onChangeText, placeholder }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: "900", color: "#111827" }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
    </View>
  );
}

/* =========================
   CONFIRMAÇÃO (WEB vs MOBILE)
========================= */
async function confirmarExclusao(titulo, mensagem) {
  if (Platform.OS === "web") {
    // No web, Alert.alert pode falhar / não abrir; confirm funciona sempre
    return window.confirm(`${titulo}\n\n${mensagem}`);
  }

  return new Promise((resolve) => {
    Alert.alert(titulo, mensagem, [
      { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
      { text: "Excluir", style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}

/* =========================
   TELA 1 - PAINEL (HOME)
========================= */
function Painel({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const sair = async () => {
    try {
      await logout();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f6f7fb" }}>
      <View style={{ padding: 20, gap: 14, flex: 1 }}>
        <View
          style={{
            backgroundColor: "#111827",
            borderRadius: 14,
            padding: 18,
            gap: 6,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900" }}>
            Painel do Usuário • Sawil Contabilidade
          </Text>

          <Text style={{ color: "#cbd5e1", fontSize: 13 }}>
            Você está logado como:
          </Text>

          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "800" }}>
            {user?.email || "Usuário"}
          </Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
          Gestão do Sistema
        </Text>

        <Btn
          title="CATEGORIAS (Fiscal, Folha, Impostos...)"
          onPress={() => navigation.navigate("Categorias")}
          variant="primary"
        />

        <Btn
          title="SERVIÇOS (IRPF, Abertura de Empresa...)"
          onPress={() => navigation.navigate("Servicos")}
          variant="dark"
        />

        <Btn title="SAIR / LOGOUT" onPress={sair} variant="danger" />
      </View>
    </ScrollView>
  );
}

/* =========================
   TELA 2 - CATEGORIAS (CRUD REAL)
========================= */
function Categorias({ navigation }) {
  const { user } = useContext(AuthContext);
  const PATH = useMemo(() => `sawil/categorias/${user?.uid}`, [user?.uid]);

  const [lista, setLista] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = listenItems(PATH, setLista);
    return () => unsub && unsub();
  }, [PATH, user?.uid]);

  const limpar = () => {
    setNome("");
    setDescricao("");
    setEditId(null);
  };

  const salvar = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "Informe o nome da categoria.");
      return;
    }

    try {
      if (editId) {
        await updateItem(PATH, editId, {
          nome: nome.trim(),
          descricao: descricao.trim(),
        });
        Alert.alert("Sucesso", "Categoria atualizada!");
      } else {
        await createItem(PATH, {
          nome: nome.trim(),
          descricao: descricao.trim(),
        });
        Alert.alert("Sucesso", "Categoria cadastrada!");
      }

      limpar();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a categoria.");
    }
  };

  const editar = (item) => {
    setEditId(item.id);
    setNome(item.nome || "");
    setDescricao(item.descricao || "");
  };

  const excluir = async (item) => {
    const ok = await confirmarExclusao(
      "Excluir categoria",
      `Deseja excluir "${item.nome}"?`
    );

    if (!ok) return;

    try {
      await deleteItem(PATH, item.id);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível excluir.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f7fb", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "900", color: "#111827" }}>
        Categorias • Sawil Contabilidade
      </Text>

      <Card>
        <Text style={{ fontSize: 14, fontWeight: "900", marginBottom: 10 }}>
          {editId ? "Editar Categoria" : "Nova Categoria"}
        </Text>

        <View style={{ gap: 10 }}>
          <Input
            label="Nome da Categoria"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Fiscal"
          />

          <Input
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Ex: Obrigações fiscais, impostos e guias..."
          />

          <Btn
            title={editId ? "SALVAR ALTERAÇÕES" : "CADASTRAR CATEGORIA"}
            onPress={salvar}
            variant="primary"
          />

          {editId ? <Btn title="CANCELAR EDIÇÃO" onPress={limpar} variant="gray" /> : null}
        </View>
      </Card>

      <Card>
        <Text style={{ fontSize: 14, fontWeight: "900", marginBottom: 10 }}>
          Categorias Cadastradas
        </Text>

        {lista.length === 0 ? (
          <Text style={{ color: "#6b7280" }}>
            Nenhuma categoria cadastrada ainda.
          </Text>
        ) : (
          <FlatList
            data={lista}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e7eb",
                  gap: 6,
                }}
              >
                <Text style={{ fontWeight: "900", color: "#111827" }}>
                  {item.nome}
                </Text>

                {item.descricao ? (
                  <Text style={{ color: "#374151" }}>{item.descricao}</Text>
                ) : null}

                <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                  <View style={{ flex: 1 }}>
                    <Btn title="EDITAR" onPress={() => editar(item)} variant="dark" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Btn title="EXCLUIR" onPress={() => excluir(item)} variant="danger" />
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </Card>

      <Btn title="VOLTAR" onPress={() => navigation.goBack()} variant="light" />
    </View>
  );
}

/* =========================
   TELA 3 - SERVIÇOS (CRUD REAL)
========================= */
function Servicos({ navigation }) {
  const { user } = useContext(AuthContext);
  const PATH = useMemo(() => `sawil/servicos/${user?.uid}`, [user?.uid]);

  const [lista, setLista] = useState([]);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = listenItems(PATH, setLista);
    return () => unsub && unsub();
  }, [PATH, user?.uid]);

  const limpar = () => {
    setNome("");
    setCategoria("");
    setDescricao("");
    setEditId(null);
  };

  const salvar = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "Informe o nome do serviço.");
      return;
    }

    if (!categoria.trim()) {
      Alert.alert("Atenção", "Informe a categoria do serviço.");
      return;
    }

    try {
      if (editId) {
        await updateItem(PATH, editId, {
          nome: nome.trim(),
          categoria: categoria.trim(),
          descricao: descricao.trim(),
        });
        Alert.alert("Sucesso", "Serviço atualizado!");
      } else {
        await createItem(PATH, {
          nome: nome.trim(),
          categoria: categoria.trim(),
          descricao: descricao.trim(),
        });
        Alert.alert("Sucesso", "Serviço cadastrado!");
      }

      limpar();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o serviço.");
    }
  };

  const editar = (item) => {
    setEditId(item.id);
    setNome(item.nome || "");
    setCategoria(item.categoria || "");
    setDescricao(item.descricao || "");
  };

  const excluir = async (item) => {
    const ok = await confirmarExclusao(
      "Excluir serviço",
      `Deseja excluir "${item.nome}"?`
    );

    if (!ok) return;

    try {
      await deleteItem(PATH, item.id);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível excluir.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f7fb", padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "900", color: "#111827" }}>
        Serviços • Sawil Contabilidade
      </Text>

      <Card>
        <Text style={{ fontSize: 14, fontWeight: "900", marginBottom: 10 }}>
          {editId ? "Editar Serviço" : "Novo Serviço"}
        </Text>

        <View style={{ gap: 10 }}>
          <Input
            label="Nome do Serviço"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Declaração de IRPF"
          />

          <Input
            label="Categoria"
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Ex: Fiscal"
          />

          <Input
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Ex: Preparação e envio da declaração..."
          />

          <Btn
            title={editId ? "SALVAR ALTERAÇÕES" : "CADASTRAR SERVIÇO"}
            onPress={salvar}
            variant="dark"
          />

          {editId ? <Btn title="CANCELAR EDIÇÃO" onPress={limpar} variant="gray" /> : null}
        </View>
      </Card>

      <Card>
        <Text style={{ fontSize: 14, fontWeight: "900", marginBottom: 10 }}>
          Serviços Cadastrados
        </Text>

        {lista.length === 0 ? (
          <Text style={{ color: "#6b7280" }}>
            Nenhum serviço cadastrado ainda.
          </Text>
        ) : (
          <FlatList
            data={lista}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e7eb",
                  gap: 6,
                }}
              >
                <Text style={{ fontWeight: "900", color: "#111827" }}>
                  {item.nome}
                </Text>

                <Text style={{ color: "#374151" }}>
                  Categoria: <Text style={{ fontWeight: "800" }}>{item.categoria}</Text>
                </Text>

                {item.descricao ? (
                  <Text style={{ color: "#374151" }}>{item.descricao}</Text>
                ) : null}

                <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                  <View style={{ flex: 1 }}>
                    <Btn title="EDITAR" onPress={() => editar(item)} variant="primary" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Btn title="EXCLUIR" onPress={() => excluir(item)} variant="danger" />
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </Card>

      <Btn title="VOLTAR" onPress={() => navigation.goBack()} variant="light" />
    </View>
  );
}

/* =========================
   NAVEGAÇÃO INTERNA
========================= */
export default function Navegacao() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Painel" component={Painel} />
      <Stack.Screen name="Categorias" component={Categorias} />
      <Stack.Screen name="Servicos" component={Servicos} />
    </Stack.Navigator>
  );
}