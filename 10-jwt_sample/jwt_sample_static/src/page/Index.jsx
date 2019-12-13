import React, { useState, useEffect } from 'react';
import Axios from 'axios';

Axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.common['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

export const Index = () => {
  const [state, setState] = useState('');

  const getIndex = async () => {
    const data = await Axios.get('http://127.0.0.1:8000/api/Index');
    setState(data.data);
    console.log(data);
  };

  useEffect(() => {
    getIndex();
  }, []);

  return <div>{state}</div>;
};
