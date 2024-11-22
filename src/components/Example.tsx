import { Container } from '@mui/material';
import React from 'react';

// Update the Example component to accept props
const Example: React.FC<ComponentProps> = ({ url, body, tabId }) => {
  return (
    <Container sx={{ minWidth: "300px", padding: "10px" }}>
      <h1>Example Component</h1>
      <p><strong>URL:</strong> {url}</p>
      <p><strong>Body:</strong> {body}</p>
      <p><strong>Tab ID:</strong> {tabId}</p>
    </Container>
  );
};

export default Example;
