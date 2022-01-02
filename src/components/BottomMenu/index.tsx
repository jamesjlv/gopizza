import React from "react";

import { Container, Title, Notification, Quantity } from "./styles";

type Props = {
  title: string;
  color: string;
  notifications?: string | undefined;
};

export function BottomMenu({ title, color, notifications }: Props) {
  const noNotificarions = notifications === "0";

  return (
    <Container>
      <Title color={color}>{title}</Title>
      {notifications && (
        <Notification noNotifications={noNotificarions}>
          <Quantity noNotifications={noNotificarions}>{notifications}</Quantity>
        </Notification>
      )}
    </Container>
  );
}
