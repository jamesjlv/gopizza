import React from "react";
import { TouchableOpacityProps } from "react-native";

import {
  Container,
  Description,
  Image,
  Name,
  StatusContainer,
  StatusLabel,
  StatusTypesProps,
} from "./styles";

export type OrderProps = {
  id: string;
  pizza: string;
  image: string;
  status: StatusTypesProps;
  table_number: string;
  quantity: string;
};

export interface OrderCardProps extends TouchableOpacityProps {
  index?: number;
  data: OrderProps;
}

export function OrderCard({ index = 0, data, ...rest }: OrderCardProps) {
  return (
    <Container index={index} {...rest}>
      <Image source={{ uri: data.image }} />
      <Name>{data.pizza}</Name>
      <Description>
        Mesa {data.table_number} • Qtd: {data.quantity}
      </Description>
      <StatusContainer status={data.status}>
        <StatusLabel status={data.status}>{data.status}</StatusLabel>
      </StatusContainer>
    </Container>
  );
}
