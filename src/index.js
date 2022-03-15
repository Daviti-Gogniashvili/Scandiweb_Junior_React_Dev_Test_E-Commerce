import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AllItemsComponent from "./components/all-items-component/all-items-component";
import ClothesItemComponent from "./components/clothes-item-component/clothes-item-component";
import TechItemComponent from "./components/tech-item-component/tech-item-component";
import OutOfStockItemComponent from "./components/out-of-stock-item-component/out-of-stock-item-component";
import ProductBody from "./components/product-body/product-body";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="cart" element={<ProductBody />}/>
        <Route path="all" element={<AllItemsComponent />}/>
        <Route path="clothes" element={<ClothesItemComponent />}/>
        <Route path="tech" element={<TechItemComponent />}/>
        <Route path="out-of-stock" element={<OutOfStockItemComponent />}/>
        <Route path=":id" element={<ProductBody />}/>
        <Route path="/" element={<Navigate replace to="/all"/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
