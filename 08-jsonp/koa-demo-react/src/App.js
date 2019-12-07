import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

Axios.defaults.withCredentials = true;

function App() {
  const [state, setState] = useState([]);
  const getUserInfo = () => Axios.get('http://localhost:8000/getUserInfo');

  useEffect(() => {
    async function getData() {
      const { data } = await getUserInfo();
      setState(data);
    }
    getData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {state.map(elem => {
          const { name, age } = elem;
          return (
            <div>
              姓名：{name}, 年龄：{age}
            </div>
          );
        })}
      </header>
    </div>
  );
}

export default App;
