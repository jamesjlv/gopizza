import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import branding from "../../assets/brand.png";

import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "../../hooks/auth";
import {
  Container,
  Content,
  Title,
  Brand,
  ForgotPasswordButton,
  ForgotPasswordLabel,
} from "./styles";

export function SignIn() {
  const { signIn, isLogging, forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn() {
    signIn(email, password);
  }

  function handleForgotPassword() {
    forgotPassword(email);
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Content>
          <Brand source={branding} />
          <Title>Login</Title>
          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            placeholder="Senha"
            type="secondary"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <ForgotPasswordButton onPress={handleForgotPassword}>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>
          <Button
            title="Entrar"
            type="secondary"
            onPress={handleSignIn}
            isLoading={isLogging}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}
