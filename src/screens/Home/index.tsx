import React, { useCallback, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { useTheme } from "styled-components/native";
import firestore from "@react-native-firebase/firestore";

import happyEmoji from "../../assets/happy.png";

import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  MenuHeader,
  MenuTitle,
  MenuItemsNumber,
  NewProductButton,
} from "./styles";
import { Search } from "../../components/Search";
import { ProductCard, ProductProps } from "../../components/ProductCard";
import { Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

export function Home() {
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState("");
  const { signOut, user } = useAuth();
  const { navigate } = useNavigation();
  const { COLORS } = useTheme();

  function fetchPizzas(value: string) {
    const formattedValue = value.toLocaleLowerCase().trim();

    firestore()
      .collection("pizzas")
      .orderBy("name_insensitive")
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then((response) => {
        const data = response.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as ProductProps[];

        setPizzas(data);
      })
      .catch(() =>
        Alert.alert("Consulta", "Não foi possível realizar a consulta")
      );
  }

  function handleSearch() {
    fetchPizzas(search);
  }

  function handleSearchClear() {
    setSearch("");
    fetchPizzas("");
  }

  function handleOpen(id: string) {
    const route = user?.isAdmin ? "product" : "order";
    navigate(route, { id });
  }

  function handleAdd() {
    navigate("product", {});
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas("");
    }, [])
  );

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, Admin</GreetingText>
        </Greeting>
        <TouchableOpacity onPress={signOut}>
          <MaterialIcons name="logout" color={COLORS.SHAPE} size={24} />
        </TouchableOpacity>
      </Header>

      <Search
        onSearch={handleSearch}
        onClear={handleSearchClear}
        value={search}
        onChangeText={setSearch}
      />
      <MenuHeader>
        <MenuTitle>Cardápio</MenuTitle>
        <MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
      </MenuHeader>
      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24,
        }}
      />
      {user?.isAdmin && (
        <NewProductButton
          title="Cadastrar pizza"
          type="secondary"
          onPress={handleAdd}
        />
      )}
    </Container>
  );
}
