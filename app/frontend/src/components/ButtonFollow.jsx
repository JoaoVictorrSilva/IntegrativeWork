import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";

export default function ButtonFollow ( ) {

  const [rotulo, setRotudo] = useState("Follow");

  function mudaRotudo(){
    if(rotulo === "Follow"){
      setRotudo('Folliwing');
      console.log('Recebi um Follow');
      axios.post('/follow')
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
    }

    else {
      setRotudo('Follow');
      console.log('Recebi unfollow');
      axios.post('/unfollow')
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  return (
    <Stack spacing={2} direction="column" marginTop={2} color={green}>
      <Button variant="contained" onClick={mudaRotudo} color='success'>{rotulo}</Button>
    </Stack>
  );

}