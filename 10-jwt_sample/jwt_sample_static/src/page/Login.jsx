import React, { useState } from 'react';
import Axios from 'axios';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [passwd, setPasswd] = useState('');

  const handleLogin = async () => {
    const { data } = await Axios.post('http://127.0.0.1:8000/api/login', {
      username,
      password: passwd
    });
    const { token } = data;

    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', token);
    }
  };

  return (
    <div>
      用户名:
      <input
        type="text"
        name="username"
        value={username}
        onChange={event => {
          setUsername(event.target.value);
        }}
      />
      <br />
      密码:
      <input
        type="password"
        name="password"
        value={passwd}
        onChange={event => setPasswd(event.target.value)}
      />
      <br />
      <button onClick={handleLogin}>登录</button>
    </div>
  );
};
