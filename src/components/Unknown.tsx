import { Container } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ComponentProps from '../types/ComponentProps';

export default function Unknown({ url, body, tabId, information }: ComponentProps) {
  return (
    <Container sx={{ minWidth: "300px", padding: "10px" }}>
      Unknown url ({url}) will need to be implemented still
    </Container>
  );
}