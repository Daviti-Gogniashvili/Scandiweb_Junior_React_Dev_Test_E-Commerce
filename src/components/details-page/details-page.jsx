import React, { Component } from 'react';
import { fetchByIdData } from '../../services/dataFetching/fetchDataFromEndpoint';

import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

import store from '../../store/store';

import './details-page.css';
import ProductExtention from '../../_extensions/product-extensions';

let listData = [0];
let id;
let extension = new ProductExtention();

class DetailsPage extends Component {
    status = false;
    fetched = false;
    attributes = [];

    constructor() {
        super();
        this.state = {
            subscribed: true,
            data: [],
            html: "",
            gallerySrc: "",
            curIndex: 0,
            show: ""
        }
    }

    changeBadgeState(operator) {
        store.dispatch({
            type: operator
        })
    }

    sendDataToCart = () => {
        let list = [];
        let attr = this.state.data.attributes;
        if (this.state.data.inStock === false) alert("Out Of Stock");
        else {
            let id = this.state.data.id + "_Cart_";
            if (attr.length === 0)
                id += "NO ATTRIBUTE";

            else
                attr.map((item) => (
                    id += this.state[item.name]
                ));

            if (sessionStorage.getItem(id) === null) listData = [0];
            attr.length !== 0 ?
                attr.map((item) => (
                    list.push(this.state[item.name])
                )) : list = ["NO ATTRIBUTE"];
            if (list.find((e) => e === "NO VALUE")) alert("Please Select Attribute/s");
            else {
                extension.cartDataCreator(id, listData, this, list);
                this.changeBadgeState("plus");
            }
        }
    }

    setStatus_attributes() {
        if (this.fetched) {
            if (this.state.data.attributes.length !== 0) {
                this.attributes = this.state.data.attributes;
                this.status = true;
            }
        }
    }

    setAttributeValue(id, value) {
        this.setState({ [id]: value });
        if (this.state[id] === value) this.setState({ [id]: "NO VALUE" })
    }

    attributeAction = (id, value) => {
        this.setAttributeValue(id, value);
    }

    getAttributes(item) {
        this.fetched &&
            item.map((r) => (
                this.setState({
                    [r.name]: "NO VALUE",
                })
            ))
    }


    async componentDidMount() {
        this.getCurrencyIndex();
        await fetchByIdData(id).then((res) => {
            this.fetched = true;
            this.setState({
                data: res.data.product,
                html: res.data.product.description,
                gallerySrc: res.data.product.gallery[0]
            });
        });
        this.getAttributes(this.state.data.attributes);
    }

    htmlFrom = (htmlString) => {
        const cleanHtmlString = DOMPurify.sanitize(htmlString,
            { USE_PROFILES: { html: true } });
        const html = parse(cleanHtmlString);
        return html;
    }

    getGallerySrc = (src) => {
        this.setState({ gallerySrc: src });
    }

    getCurrencyIndex() {
        store.subscribe(() => {
            this.fetched && this.setState({ curIndex: store.getState().currencyReducer.curIndex });
        })
    }

    componentWillUnmount() {
        this.fetched = false;
    }

    setId = () => {
        id = window.location.pathname.substring(1, window.location.pathname.length);
    }

    render() {
        this.setStatus_attributes();
        this.setId();
        return (
            <section className="details-page-container">
                {this.fetched ?
                    <div className="details-container">
                        <div className="gallery-list">
                            {this.state.data.gallery.map((item) => (
                                <div key={item} className="list-item-container">
                                    <input
                                        type="image"
                                        onClick={() => this.getGallerySrc(item)}
                                        src={item}
                                        alt=""
                                        className="gallery-img"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="gallery-item-container">
                            {
                                this.state.data.inStock === false &&
                                <div className="gallery-cover"><span>OUT OF STOCK</span></div>
                            }
                            <img src={this.state.gallerySrc} alt="" id="gallery-img-large" className="gallery-img-large" />
                        </div>
                        <div className="item-details">
                            <div className="item-title-container">
                                <h1 className="brand">{this.state.data.brand}</h1>
                                <h2 className="name">{this.state.data.name}</h2>
                            </div>
                            <div className="item-size-container">
                                {
                                    this.status ?
                                        this.attributes.map((item, index) => (
                                            <div key={index}>
                                                <label htmlFor="size-form" className="size-label">{item.name.toUpperCase() + ":"}</label>
                                                <div className="sizes">
                                                    {item.type === "text" ?
                                                        <>
                                                            {item.items.map((r) => (
                                                                <button
                                                                    key={r.id}
                                                                    onClick={(e) => this.attributeAction(item.name, r.value)}
                                                                    className={
                                                                        `size-input
                                                                        ${this.state[item.name] === r.value ?
                                                                            " show" :
                                                                            ""}`
                                                                    }>
                                                                    {r.value}
                                                                </button>
                                                            ))}
                                                        </> :
                                                        <>
                                                            {item.items.map((r) => (
                                                                <button
                                                                    onClick={(e) => this.attributeAction(item.name, r.value)}
                                                                    key={r.id}
                                                                    style={{
                                                                        backgroundColor: r.value,
                                                                        color: r.value
                                                                    }}
                                                                    className={
                                                                        `size-input-swatch
                                                                        ${this.state[item.name] === r.value ?
                                                                            " show" :
                                                                            ""}`
                                                                    }
                                                                />
                                                            ))}
                                                        </>}
                                                </div>
                                            </div>
                                        )) :
                                        <div className="no-size">No Attributes</div>
                                }
                            </div>
                            <div className="item-price-container">
                                <p>PRICE:</p>
                                <p>
                                    {this.state.data.prices[this.state.curIndex].currency.symbol}
                                    {this.state.data.prices[this.state.curIndex].amount}
                                </p>
                            </div>
                            <button onClick={this.sendDataToCart} className="add-to-cart">ADD TO CART</button>
                            <div id="desc-container" className="desc-container">
                                {this.htmlFrom(this.state.html)}
                            </div>
                        </div>
                    </div>
                    : <h1><em>Loading...</em></h1>
                }
            </section>
        );
    }
}

export default DetailsPage;
