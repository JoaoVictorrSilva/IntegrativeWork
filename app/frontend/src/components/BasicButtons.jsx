import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicButtons({curso}) {

  return (
    <Stack spacing={2} direction="column" marginTop={2}>
      <Button variant="contained" color='success'>{curso}</Button>
    </Stack>
  );
}