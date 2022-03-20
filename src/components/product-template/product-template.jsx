import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CircleIcon from '../../assets/product-template-assets/CircleIcon.svg';

import store from '../../store/store';

import './product-template.css';
import ProductExtention from '../../_extensions/product-extensions';

let listData = [0];
let extension = new ProductExtention();


class ProductTemplate extends Component {

    mounted = false;
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
        let list = []
        let id = this.props.id + "_Cart_";
        let attr = this.props.item.attributes;
        if (attr.length === 0) {
            id += "NO ATTRIBUTE";
            list = ["NO ATTRIBUTE"];
        }
        else {
            attr.map((item) => (
                list.push(item.items[0].value)
            ));
            id += list.join('');

        }
        if (sessionStorage.getItem(id) === null) listData = [0];
        extension.cartDataCreator(
            id,
            listData,
            this,
            list
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
        });
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <>
                {this.mounted ?
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
                    </div> :
                    <h1>...Loading</h1>
                }
            </>
        );
    }
}

export default ProductTemplate;
