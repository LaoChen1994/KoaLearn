import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import { Login } from './page/Login';
import { Index } from './page/Index';


function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/index">主页</Link>
            </li>
            <li>
              <Link to="/login">登录</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/index" component={Index} />
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
