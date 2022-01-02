import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import { ButtonBack } from "../../components/ButtonBack";
import { Input } from "../../components/Input";
import { RadioButton } from "../../components/RadioButton";
import { Button } from "../../components/Button";
import { PIZZA_TYPES } from "../../utils/pizzaTypes";

import {
  Container,
  Header,
  Photo,
  Sizes,
  Form,
  Title,
  Label,
  FormRow,
  InputGroup,
  Price,
  ContentScroll,
} from "./styles";
import { OrderNavigationProps } from "../../@types/navigation";
import { ProductProps } from "../../components/ProductCard";
import { useAuth } from "../../hooks/auth";

type PizzaResponse = ProductProps & {
  prices_sizes: {
    [key: string]: number;
  };
};

export function Order() {
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState("");
  const [sendingOrder, setSendingOrder] = useState(false);

  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { id } = route.params as OrderNavigationProps;
  const { user } = useAuth();

  const amount = size ? pizza.prices_sizes[size] * quantity : "0,00";

  function handleGoBack() {
    goBack();
  }

  function handleOrder() {
    if (!size) {
      return Alert.alert("Pedido", "Selecione o tamanho da pizza.");
    }
    if (!tableNumber) {
      return Alert.alert("Pedido", "Informe o número da mesa.");
    }

    if (!quantity) {
      return Alert.alert("Pedido", "Informe a quantidade.");
    }

    setSendingOrder(true);

    firestore()
      .collection("orders")
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        size,
        table_number: tableNumber,
        status: "Preparando",
        waiter_id: user?.id,
        image: pizza.photo_url,
      })
      .then(() => navigate("home"))
      .catch(() => {
        Alert.alert("Pedido", "Não foi possível realizar o pedido.");
        setSendingOrder(false);
      });
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection("pizzas")
        .doc(id)
        .get()
        .then((response) => setPizza(response.data() as PizzaResponse))
        .catch(() =>
          Alert.alert("Pedido", "Não foi possível carregar o produto")
        );
    }
  }, []);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ContentScroll showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleGoBack} style={{ marginBottom: 108 }} />
        </Header>
        <Photo source={{ uri: pizza.photo_url }} />
        <Form>
          <Title>{pizza.name}</Title>
          <Label>Selecione um tamanho</Label>
          <Sizes>
            {PIZZA_TYPES.map((item) => (
              <RadioButton
                key={item.id}
                title={item.name}
                onPress={() => setSize(item.id)}
                selected={item.id === size}
              />
            ))}
          </Sizes>
          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input
                keyboardType="numeric"
                onChangeText={setTableNumber}
                value={tableNumber}
              />
            </InputGroup>
            <InputGroup>
              <Label>Quantidade</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setQuantity(Number(value))}
              />
            </InputGroup>
          </FormRow>
          <Price>Valor de R$ {amount}</Price>
          <Button
            title="Confirmar pedido"
            onPress={handleOrder}
            isLoading={sendingOrder}
          />
        </Form>
      </ContentScroll>
    </Container>
  );
}
