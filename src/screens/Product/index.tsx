import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

import { ButtonBack } from "../../components/ButtonBack";
import { Photo } from "../../components/Photo";

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Form,
  InputGroup,
  Label,
  MaxCharacters,
  InputGroupHeader,
} from "./styles";
import { InputPrice } from "../../components/InputPrice";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ProductNavigationProps } from "../../@types/navigation";
import { ProductProps } from "../../components/ProductCard";

type PizzaResponse = ProductProps & {
  photo_path: string;
  prices_sizes: {
    p: string;
    m: string;
    g: string;
  };
};

export function Product() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [description, setDescription] = useState("");
  const [priceSizeP, setPriceSizeP] = useState("");
  const [priceSizeM, setPriceSizeM] = useState("");
  const [priceSizeG, setPriceSizeG] = useState("");
  const [loading, setLoading] = useState(false);
  const [interfaceLoading, setInterfaceLoading] = useState(true);

  const { goBack, navigate } = useNavigation();
  const route = useRoute();
  const { id } = route.params as ProductNavigationProps;

  async function handlePickerImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      });
      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  async function handleAdd() {
    if (!name.trim()) {
      return Alert.alert("Cadastro", "Informe o nome da pizza.");
    }
    if (!description.trim()) {
      return Alert.alert("Cadastro", "Informe a descrição.");
    }
    if (!image) {
      return Alert.alert("Cadastro", "Selecione uma imagem da pizza.");
    }
    if (!priceSizeP || !priceSizeM || !priceSizeG) {
      return Alert.alert(
        "Cadastro",
        "Informe o preço de todos os tamanhos da pizza."
      );
    }
    setLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`);

    await reference.putFile(image);
    const photo_url = await reference.getDownloadURL();

    firestore()
      .collection("pizzas")
      .add({
        name,
        name_insensitive: name.toLocaleLowerCase().trim(),
        description,
        prices_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        photo_url,
        photo_path: reference.fullPath,
      })
      .then(() => Alert.alert("Cadastro", "Pizza cadastrada com sucesso."))
      .catch((error) =>
        Alert.alert("Cadastro", "Não foi possível cadastrar a pizza.")
      );
    setLoading(false);
    goBack();
  }

  function handleGoBack() {
    goBack();
  }

  function handleDelete() {
    firestore()
      .collection("pizzas")
      .doc(id)
      .delete()
      .then(() => {
        storage()
          .ref(photoPath)
          .delete()
          .then(() => navigate("home"));
      });
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection("pizzas")
        .doc(id)
        .get()
        .then((response) => {
          const product = response.data() as PizzaResponse;

          setName(product.name);
          setImage(product.photo_url), setDescription(product.description);
          setPriceSizeP(product.prices_sizes.p);
          setPriceSizeM(product.prices_sizes.m);
          setPriceSizeG(product.prices_sizes.g);
          setPhotoPath(product.photo_path);
        });
      setInterfaceLoading(false);
    } else {
      setInterfaceLoading(false);
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleGoBack} />
          <Title>Cadastrar</Title>
          {id ? (
            <TouchableOpacity onPress={handleDelete}>
              <DeleteLabel>Deletar</DeleteLabel>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 20 }} />
          )}
        </Header>
        {interfaceLoading ? (
          <ActivityIndicator size={24} style={{ paddingTop: 300 }} />
        ) : (
          <>
            <Upload>
              <Photo uri={image} />
              {!id && (
                <PickImageButton
                  title="Carregar"
                  type="secondary"
                  onPress={handlePickerImage}
                />
              )}
            </Upload>
            <Form>
              <InputGroup>
                <Label>Nome</Label>
                <Input onChangeText={setName} value={name} />
              </InputGroup>

              <InputGroup>
                <InputGroupHeader>
                  <Label>Descrição</Label>
                  <MaxCharacters>Max. 60 caracteres</MaxCharacters>
                </InputGroupHeader>
                <Input
                  multiline
                  maxLength={60}
                  style={{ height: 80 }}
                  onChangeText={setDescription}
                  value={description}
                />
              </InputGroup>

              <InputGroup>
                <Label>Tamanhos e preços</Label>
                <InputPrice
                  size="P"
                  onChangeText={setPriceSizeP}
                  value={priceSizeP}
                />
                <InputPrice
                  size="M"
                  onChangeText={setPriceSizeM}
                  value={priceSizeM}
                />
                <InputPrice
                  size="G"
                  onChangeText={setPriceSizeG}
                  value={priceSizeG}
                />
              </InputGroup>
              {!id && (
                <Button
                  title="Cadastrar Pizza"
                  isLoading={loading}
                  onPress={handleAdd}
                />
              )}
            </Form>
          </>
        )}
      </ScrollView>
    </Container>
  );
}
