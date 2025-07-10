import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import History from './history';
import Navbar from './navbar';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<App/>}></Route>
          <Route path="/history" element={<History/>}></Route>
          <Route path="/nav" element={<Navbar/>}></Route>
      </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
