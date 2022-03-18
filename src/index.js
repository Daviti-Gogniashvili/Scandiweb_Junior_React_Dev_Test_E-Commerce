import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AllItemsComponent from "./components/main-component/main-component";
import ProductBody from "./components/product-body/product-body";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="cart" element={<ProductBody />} />
        <Route path="all" element={<AllItemsComponent key={Date.now() + "all"}/>} />
        <Route path="clothes" element={<AllItemsComponent key={Date.now() + "clothes"}/>} />
        <Route path="tech" element={<AllItemsComponent key={Date.now() + "tech"}/>} />
        <Route path="out-of-stock" element={<AllItemsComponent key={Date.now() + "outStock"}/>} />
        <Route path=":id" element={<ProductBody />} />
        <Route path="/" element={<Navigate replace to="/all" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
