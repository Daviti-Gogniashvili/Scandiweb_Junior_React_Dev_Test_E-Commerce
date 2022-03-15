import React, { Component } from 'react';
import { fetchByIdData } from '../../services/dataFetching/fetchDataFromEndpoint';

import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

import store from '../../store/store';

import './details-page.css';
import ProductExtention from '../../_extensions/product-extensions';

let listData = [0];
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
            sizeButtonValue: "NO SIZE",
            html: "",
            gallerySrc: "",
            curIndex: 0
        }
    }

    changeBadgeState(operator) {
        store.dispatch({
            type: operator
        })
    }

    sendDataToCart = () => {
        if (this.state.data.inStock === false) alert("Out Of Stock");
        else {
            let id = this.state.data.id + "_Cart_" + this.state.sizeButtonValue;
            if (sessionStorage.getItem(id) === null) listData = [0];
            if (this.state.sizeButtonValue === "NO SIZE" && this.state.data.attributes.length !== 0) {
                alert("Please Select Size or Color");
            } else {
                extension.cartDataCreator(id, listData, this, this.state.sizeButtonValue);
                this.changeBadgeState("plus");
            }
        }
    }

    setStatus_attributes() {
        if (this.fetched) {
            if (this.state.data.attributes.length) {
                this.attributes = this.state.data.attributes[0].items;
                this.status = true;
            }
        }
    }

    persistId = () => {
        store.subscribe(() => {
            sessionStorage.setItem("id", JSON.stringify(store.getState().singleDataReducer.id));
        })
    }

    getId = () => {
        return JSON.parse(sessionStorage.getItem("id"));
    }

    toggleShowClass = (e) => {
        e.classList.toggle("show");
    }

    setSizeButtonValue(e) {
        this.setState({ sizeButtonValue: e.value });
        if (this.state.sizeButtonValue === e.value) this.setState({ sizeButtonValue: "NO SIZE" })
    }

    sizeButtonsAction = (e) => {
        this.toggleShowClass(e.target);
        this.setSizeButtonValue(e.target);
    }

    inputRefs = [];

    setRef = (ref) => {
        this.inputRefs.push(ref);
    };


    async componentDidMount() {
        this.getCurrencyIndex();
        this.persistId();
        await fetchByIdData(this.getId()).then((res) => {
            this.fetched = true;
            this.setState({
                data: res.data.product,
                html: res.data.product.description,
                gallerySrc: res.data.product.gallery[0]
            });
        });
    }

    removeShowFromUnsetSizeButton() {
        for (let i = 0; i < this.inputRefs.length; i++) {
            if (this.inputRefs[i] !== undefined) {
                if (this.inputRefs[i].value !== this.state.sizeButtonValue) {
                    this.inputRefs[i].classList.remove("show");

                }
            }
        }
    }

    htmlFrom = (htmlString) => {
        const cleanHtmlString = DOMPurify.sanitize(htmlString,
            { USE_PROFILES: { html: true } });
        const html = parse(cleanHtmlString);
        return html;
    }

    getGallerySrc = (e) => {
        this.setState({ gallerySrc: e.target.value });
    }

    componentDidUpdate() {
        this.removeShowFromUnsetSizeButton();
    }

    getCurrencyIndex() {
        store.subscribe(() => {
            this.fetched && this.setState({ curIndex: store.getState().currencyReducer.curIndex });
        })
    }

    componentWillUnmount() {
        this.fetched = false;
    }

    render() {
        this.setStatus_attributes();
        return (
            <section className="details-page-container">
                {this.fetched ?
                    <div className="details-container">
                        <div className="gallery-list">
                            {this.state.data.gallery.map((item) => (
                                <div key={item} className="list-item-container">
                                    <input
                                        type="image"
                                        onClick={this.getGallerySrc}
                                        src={item} alt=""
                                        value={item}
                                        className="gallery-img"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="gallery-item-container">
                            <img src={this.state.gallerySrc} alt="" id="gallery-img-large" className="gallery-img-large" />
                        </div>
                        <div className="item-details">
                            <div className="item-title-container">
                                <h1 className="brand">{this.state.data.brand}</h1>
                                <h2 className="name">{this.state.data.name}</h2>
                            </div>
                            <div className="item-size-container">
                                <label htmlFor="size-form" className="size-label">SIZE:</label>
                                <div className="sizes">
                                    {
                                        this.status ?
                                            this.attributes.map((item) => (
                                                this.state.data.attributes[0].type === "text" ?
                                                    <button
                                                        ref={this.setRef}
                                                        key={item.id}
                                                        onClick={this.sizeButtonsAction}
                                                        className="size-input"
                                                        value={item.value}>
                                                        {item.value}
                                                    </button> :
                                                    <button
                                                        ref={this.setRef}
                                                        onClick={this.sizeButtonsAction}
                                                        key={item.id}
                                                        style={{
                                                            backgroundColor: item.value,
                                                            color: item.value
                                                        }}
                                                        className="size-input-swatch"
                                                        value={item.value}
                                                    />
                                            )) :
                                            <div className="no-size">No Sizes</div>
                                    }
                                </div>
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
