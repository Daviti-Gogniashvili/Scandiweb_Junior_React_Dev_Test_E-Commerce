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

    checkForSwatch() {
        if (!/^[\w]+$/.test(this.refs.sizeRef === undefined ? "A" : this.refs.sizeRef.value)) {
            this.refs.sizeRef.style.backgroundColor = this.refs.sizeRef.value;
            this.refs.sizeRef.style.color = this.refs.sizeRef.value;
            this.refs.sizeRef.innerHTML = "A";
        }
    }

    scroll = (e) => {
        let key = e.target.value;
        if (this.prev !== key) {
            this.prev = key;
            this.index = 0;
        }
        let data = this.state.cartData[key][1].item;
        let attribute = this.refs[key + "img"];
        let length = data.gallery.length;
        if (e.target.innerHTML === "❯") {
            if (this.index < length - 1) {
                this.index++;
                attribute.src = data.gallery[this.index];
            }
        }
        else {
            if (this.index > 0) {
                this.index--;
                attribute.src = data.gallery[this.index];
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
        // let refresh = this.props.refreshData;
        // if (refresh === "refresh") {
        //     window.location.reload();
        // }
    }

    componentDidMount() {
        this.mounted = true;
        this.getCurrencyIndex();
        this.computeTotal();
        this.checkForSwatch();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    changeBadgeState(operator) {
        store.dispatch({
            type: operator
        })
    }

    addItem = (e) => {
        this.changeBadgeState("plus");
        this.setState({
            totalPrice:
                extension.addOrSubtract(
                    e,
                    this.state.totalPrice,
                    this.state.curIndex,
                    "plus")
        });

        this.cartCheck();
    }

    removeItem = (e) => {
        this.changeBadgeState("minus");
        this.setState({
            totalPrice:
                extension.addOrSubtract(
                    e,
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
                            <div style={{
                                fontSize: '8em',
                                color: 'grey'
                            }}>Empty Cart</div> :
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
                                                    ref="sizeRef"
                                                    className="cart-size">
                                                    {value[1].size}
                                                </p> :
                                                value[1].item.attributes[0].items.map((item) => (
                                                    item.value !== value[1].size ?
                                                        <p
                                                            id="size"
                                                            ref="sizeRef"
                                                            className="cart-size-gray">
                                                            {item.value}
                                                        </p> :
                                                        <p
                                                            id="size"
                                                            ref="sizeRef"
                                                            className="cart-size">
                                                            {item.value}
                                                        </p>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="cart-each-item-count">
                                        <button
                                            id={value[1].item.id + "_Cart_" + value[1].size}
                                            onClick={this.addItem}
                                        >+</button>
                                        <p>{value[0]}</p>
                                        <button
                                            id={value[1].item.id + "_Cart_" + value[1].size}
                                            onClick={this.removeItem}
                                        >-</button>
                                    </div>
                                    <div className="cart-item-img-container">
                                        <div className="cart-item-gallery-scroll">
                                            <button value={key} onClick={this.scroll} className="scroll">{"❮"}</button>
                                            <button value={key} onClick={this.scroll} className="scroll">{"❯"}</button>
                                        </div>
                                        <img
                                            ref={key + "img"}
                                            src={value[1].item.gallery[this.state.galleryIndex]
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
