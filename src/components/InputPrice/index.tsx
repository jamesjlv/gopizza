import React from "react";
import { TextInputProps } from "react-native";

import { Container, Input, Size, Label } from "./styles";

interface InputPrice extends TextInputProps {
  size: "P" | "M" | "G";
}

export function InputPrice({ size, ...rest }: InputPrice) {
  return (
    <Container>
      <Size>
        <Label>{size}</Label>
      </Size>
      <Label>R$</Label>
      <Input keyboardType="numeric" {...rest} />
    </Container>
  );
}
