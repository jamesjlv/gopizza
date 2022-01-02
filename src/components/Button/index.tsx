import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, TypeProps, Title, Load } from "./styles";

interface ButtonProps extends RectButtonProps {
  title: string;
  type?: TypeProps;
  isLoading?: boolean;
}

export function Button({
  type = "primary",
  title,
  isLoading = false,
  ...rest
}: ButtonProps) {
  return (
    <Container type={type} enabled={!isLoading} {...rest}>
      {isLoading ? <Load /> : <Title>{title}</Title>}
    </Container>
  );
}
