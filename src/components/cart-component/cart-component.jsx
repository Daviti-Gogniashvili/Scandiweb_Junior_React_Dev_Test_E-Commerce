import React, { Component } from 'react';
import CartExtensions from '../../_extensions/cart-extensions';
import './cart-component.css';
import store from '../../store/store';

let extension = new CartExtensions();

class CartComponent extends Component {
    mounted = false;
    constructor() {
        super();
        this.prev = 0;
        this.index = 0;
        this.state = {
            cartData: JSON.parse(sessionStorage.getItem("cartData")) || {},
            totalPrice: 0,
            refreshData: 0,
            galleryIndex: 0,
            curIndex: 0
        }
    }

    cartCheck() {
        this.mounted && this.setState({ cartData: JSON.parse(sessionStorage.getItem("cartData")) });
    }

    computeTotal() {
        let total = 0;
        if (Object.keys(this.state.cartData).length !== 0) {
            Object.entries(this.state.cartData).map(([key, value]) => (
                total += value[1].item.prices[this.state.curIndex].amount * value[0]
            ));
        } else {
            total = 0;
        }

        this.mounted && this.setState({ totalPrice: Math.round(total * 100) / 100 });
    }

    scroll = (Key,operator) => {
        let key = Key;
        if (this.prev !== key) {
            this.prev = key;
            this.index = 0;
        }
        let data = this.state.cartData[key][1].item;
        let length = data.gallery.length;
        if (operator === "❯") {
            if (this.index < length - 1) {
                this.index++;
                this.setState({[data.id]: this.index});
            }
        }
        else {
            if (this.index > 0) {
                this.index--;
                this.setState({[data.id]: this.index});
            }
        }

    }

    getCurrencyIndex() {
        store.subscribe(() => {
            this.mounted && this.setState({ curIndex: store.getState().currencyReducer.curIndex })
        })
    }

    refreshCart() {
        store.subscribe(() => {
            store.getState().refreshReducer ? window.location.reload() : console.log();
        })
    }

    componentDidUpdate() {
        this.refreshCart();
    }

    componentDidMount() {
        this.mounted = true;
        this.getCurrencyIndex();
        this.computeTotal();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    changeBadgeState(operator) {
        store.dispatch({
            type: operator
        })
    }

    addItem = (id) => {
        this.changeBadgeState("plus");
        this.setState({
            totalPrice:
                extension.addOrSubtract(
                    id,
                    this.state.totalPrice,
                    this.state.curIndex,
                    "plus")
        });

        this.cartCheck();
    }

    removeItem = (id) => {
        this.changeBadgeState("minus");
        this.setState({
            totalPrice:
                extension.addOrSubtract(
                    id,
                    this.state.totalPrice,
                    this.state.curIndex,
                    "minus")
        });

        this.cartCheck();
    }

    render() {
        return (
            <section className="cart-container">
                <div className="cart">
                    <h2 className="cart-items-title">CART</h2>
                    <div className="cart-items-list">
                        {Object.keys(this.state.cartData).length === 0 ?
                            <div className="empty-cart">Empty Cart</div> :
                            Object.entries(this.state.cartData).map(([key, value]) => (
                                <div className="cart-list-item" key={key}>
                                    <div className="cart-item-details">
                                        <p className="brand">{value[1].item.brand}</p>
                                        <p className="title">{value[1].item.name}</p>
                                        <p className="price">
                                            {value[1].item.prices[this.state.curIndex].currency.symbol}
                                            {value[1].item.prices[this.state.curIndex].amount}
                                        </p>
                                        <div className="cart-size-container">
                                            {value[1].item.attributes.length === 0 ?
                                                <p
                                                    id="size"
                                                    className="cart-size">
                                                    {value[1].size}
                                                </p> :
                                                value[1].item.attributes.map((item, index) => (
                                                    <div key={index} className="cart-divider">
                                                        {item.items.map((r, key) => (
                                                            <div key={key}>
                                                                {item.type === "text" ?
                                                                    r.value !== value[1].size[index] ?

                                                                        <p
                                                                            id="size"
                                                                            className="cart-size-gray">
                                                                            {r.value}
                                                                        </p> :
                                                                        <p
                                                                            id="size"
                                                                            className="cart-size">
                                                                            {r.value}
                                                                        </p>
                                                                    :
                                                                    r.value !== value[1].size[index] ?

                                                                        <p
                                                                            id="size"
                                                                            style={{ color: r.value, backgroundColor: r.value }}
                                                                            className="cart-size-color cart-gray">
                                                                            A
                                                                        </p> :
                                                                        <p
                                                                            id="size"
                                                                            style={{ color: r.value, backgroundColor: r.value }}
                                                                            className="cart-size-color">
                                                                            A
                                                                        </p>
                                                                }
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="cart-each-item-count">
                                        <button
                                            id={value[1].item.id + "_Cart_" + value[1].size.join('')}
                                            onClick={() => this.addItem(value[1].item.id + "_Cart_" + value[1].size.join(''))}
                                        >+</button>
                                        <p>{value[0]}</p>
                                        <button
                                            id={value[1].item.id + "_Cart_" + value[1].size.join('')}
                                            onClick={() => this.removeItem(value[1].item.id + "_Cart_" + value[1].size.join(''))}
                                        >-</button>
                                    </div>
                                    <div className="cart-item-img-container">
                                        {value[1].item.gallery.length > 1 &&
                                            <div className="cart-item-gallery-scroll">
                                                <button onClick={() => this.scroll(key,"❮")} className="scroll">{"❮"}</button>
                                                <button onClick={() => this.scroll(key,"❯")} className="scroll">{"❯"}</button>
                                            </div>
                                        }
                                        <img
                                            src={value[1].item.gallery[this.state[value[1].item.id] || 0]
                                            }
                                            alt=""
                                            className="cart-item-img" />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>
        );
    }
}

export default CartComponent;
