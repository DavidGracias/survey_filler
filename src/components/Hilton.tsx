import { Container } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ComponentProps from '../types/ComponentProps';

export default function Hilton({ url, body, tabId, information }: ComponentProps) {
  return (
    <Container sx={{ minWidth: "300px", padding: "10px" }}>
      Hilton Survey
    </Container>
  );
}