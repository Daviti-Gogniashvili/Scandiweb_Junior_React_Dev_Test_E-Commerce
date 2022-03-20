import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CartExtensions from '../../_extensions/cart-extensions';

import store from '../../store/store';

import './minicart-component.css';

let extention = new CartExtensions();

class MinicartComponent extends Component {

    mounted = false;

    constructor() {
        super();
        this.state = {
            cartData: JSON.parse(sessionStorage.getItem("cartData")) || {},
            totalPrice: 0,

        }
    }

    componentDidMount() {
        this.computeTotal();
        this.outOfMinicart();
        this.mounted = true;
    }

    outOfMinicart() {
        window.addEventListener("click", (event) => {
            if (event.target.id === "show") this.props.minicartState(false);
        })
    }

    cartCheck() {
        this.setState({ cartData: JSON.parse(sessionStorage.getItem("cartData")) });
    }

    computeTotal = () => {
        let total = 0;
        if (Object.keys(this.state.cartData).length !== 0) {
            Object.entries(this.state.cartData).map(([key, value]) => (
                total += value[1].item.prices[this.props.curIndex].amount * value[0]
            ));
        } else {
            total = 0;
        }

        this.setState({ totalPrice: Math.round(total * 100) / 100 });
    }

    changeBadgeState(operator) {
        store.dispatch({
            type: operator
        })
    }

    refreshCart() {
        store.dispatch({
            type: "refresh"
        })
    }

    addItem = (e) => {
        this.refreshCart();
        this.changeBadgeState("plus");
        this.setState({ totalPrice: extention.addOrSubtract(e, this.state.totalPrice, this.props.curIndex, "plus") });

        this.cartCheck();
    }

    removeItem = (e) => {
        this.refreshCart();
        this.changeBadgeState("minus");
        this.setState({ totalPrice: extention.addOrSubtract(e, this.state.totalPrice, this.props.curIndex, "minus") });

        this.cartCheck();
    }

    onClick = () => {
        this.props.outside(false)
    }

    displayTotalAmount() {
        let total = 0;
        Object.entries(this.state.cartData).map(([key, value]) => (total += value[0]));
        return total;

    }

    render() {
        return (
            <section id="show" className="minicart-container">
                <div className="minicart">
                    <p className="minicart-items-title">My Bag<span>, {this.displayTotalAmount()} items</span></p>
                    <div className="minicart-items-list">
                        {Object.entries(this.state.cartData).map(([key, value]) => (
                            <div className="minicart-list-item" key={key}>
                                <div className="minicart-item-details">
                                    <p className="mini-brand">{value[1].item.brand}</p>
                                    <p className="mini-title">{value[1].item.name}</p>
                                    <p className="mini-price">
                                        {value[1].item.prices[this.props.curIndex].currency.symbol}
                                        {value[1].item.prices[this.props.curIndex].amount}</p>
                                    <div className="size-container">
                                        {value[1].item.attributes.length === 0 ?
                                            <p
                                                id="size"
                                                className="size">
                                                {value[1].size}
                                            </p> :
                                            value[1].item.attributes.map((item, index) => (
                                                <div key={index} className="divider">
                                                    {item.items.map((r, key) => (
                                                        <div key={key}>
                                                            {item.type === "text" ?
                                                                r.value !== value[1].size[index] ?

                                                                    <p
                                                                        id="size"
                                                                        className="size-gray">
                                                                        {r.value}
                                                                    </p> :
                                                                    <p
                                                                        id="size"
                                                                        className="size">
                                                                        {r.value}
                                                                    </p>
                                                                :
                                                                r.value !== value[1].size[index] ?

                                                                    <p
                                                                        id="size"
                                                                        style={{color: r.value, backgroundColor: r.value}}
                                                                        className="size-color gray">
                                                                        A
                                                                    </p> :
                                                                    <p
                                                                        id="size"
                                                                        style={{color: r.value, backgroundColor: r.value}}
                                                                        className="size-color">
                                                                        A
                                                                    </p>
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="minicart-each-item-count">
                                    <button
                                        id={
                                            value[1].item.id + "_Cart_" +
                                            value[1].size.join('')
                                        }
                                        onClick={this.addItem}
                                    >+</button>
                                    <p>{value[0]}</p>
                                    <button
                                        id={
                                            value[1].item.id + "_Cart_" +
                                            value[1].size.join('')}
                                        onClick={this.removeItem}
                                    >-</button>
                                </div>
                                <img src={value[1].item.gallery[0]} alt="" className="minicart-item-img" />
                            </div>
                        ))}
                    </div>
                    <div className="minicart-items-total-amount">
                        <p>Total</p>
                        <p>{this.props.curSymbol} {this.state.totalPrice}</p>
                    </div>
                    <div className="minicart-items-checkout">
                        <Link className="link" to={"/cart"}>VIEW BAG</Link>
                        <button>CHECK OUT</button>
                    </div>
                </div>
            </section>
        );
    }
}

export default MinicartComponent;
