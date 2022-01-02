import React from "react";
import { Feather } from "@expo/vector-icons";
import { Container, Input, InputArea, Button, ButtonClear } from "./styles";
import { TextInputProps } from "react-native";
import { useTheme } from "styled-components/native";

interface SearchProps extends TextInputProps {
  onSearch: () => void;
  onClear: () => void;
}

export function Search({ onClear, onSearch, ...rest }: SearchProps) {
  const { COLORS } = useTheme();
  return (
    <Container>
      <InputArea>
        <Input placeholder="pesquisar..." {...rest} />
        <ButtonClear>
          <Feather name="x" size={16} />
        </ButtonClear>
      </InputArea>
      <Button onPress={onSearch}>
        <Feather name="search" size={16} color={COLORS.TITLE} />
      </Button>
    </Container>
  );
}
