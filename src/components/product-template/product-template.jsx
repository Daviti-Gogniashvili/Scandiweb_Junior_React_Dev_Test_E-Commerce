import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CircleIcon from '../../assets/product-template-assets/CircleIcon.svg';

import store from '../../store/store';

import './product-template.css';
import ProductExtention from '../../_extensions/product-extensions';

let listData = [0];
let extension = new ProductExtention();


class ProductTemplate extends Component {

    fetched = false;
    constructor() {
        super();
        this.state = {
            data: [],
        }
    }

    sendData = () => {
        store.dispatch({
            type: "id",
            payload: {
                id: this.props.id
            }
        });
    }

    changeBadgeState(operator) {
        store.dispatch({
            type: operator
        })
    }

    sendDataToCart = () => {
        this.changeBadgeState("plus");
        let id;
        if (this.props.item.attributes.length === 0)
            id = this.props.id + "_Cart_NO SIZE";
        else {
            id = this.props.id + "_Cart_" +
                this.props.item.attributes[0].items[0].value
        }
        if (sessionStorage.getItem(id) === null) listData = [0];
        extension.cartDataCreator(
            id,
            listData,
            this,
            this.props.item.attributes.length === 0 ?
                "NO SIZE" : this.props.item.attributes[0].items[0].value
        );
    }

    LetButton = () => {
        return (
            <input onClick={this.sendDataToCart} className="product-template-icon" type="image" src={CircleIcon} alt="cart" />
        )
    }

    LetCover = () => {
        return (
            <Link to={"/" + this.props.id} onClick={this.sendData} className="out-of-stock-cover-container">
                <div className="out-of-stock-cover">
                    <h3>OUT OF STOCK</h3>
                </div>
            </Link>
        );
    }

    componentDidMount() {
        this.setState({
            data: this.props.item
        })
    }

    render() {
        return (
            <div className="template">
                <Link to={"/" + this.props.id} onClick={this.sendData} className="product-template-container">
                    <div className="product-image-container">
                        <img src={this.props.item.gallery[0]} alt="Selling Product" className="product-image" />
                    </div>
                    <div className="product-data-container">
                        <h4 className="product-data-brand">{this.props.item.brand}</h4>
                        <h4 className="product-data-name">{this.props.item.name}</h4>
                        <p className="product-data-tag">
                            {this.props.item.prices[this.props.currencyIndex].currency.symbol +
                                this.props.item.prices[this.props.currencyIndex].amount}
                        </p>
                    </div>
                </Link>
                {this.props.item.inStock && <this.LetButton />}
                {!this.props.item.inStock && <this.LetCover />}
            </div>
        );
    }
}

export default ProductTemplate;
