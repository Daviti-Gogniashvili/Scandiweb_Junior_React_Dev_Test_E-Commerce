import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import BrandIcon from '../../assets/nav-bar-assets/BrandIcon.svg';
import CurrencyControl from '../../assets/nav-bar-assets/Vector.png';
import EmptyCart from '../../assets/nav-bar-assets/EmptyCart.svg';

import store from '../../store/store';

import './nav-bar.css';
import MinicartComponent from '../minicart-component/minicart-component';

class NavBar extends Component {

    mounted = false;
    constructor() {
        super();
        this.state = {
            dropdownCurrency: "",
            dropdownMinicart: "",
            currencyLabel: "$",
            currencyIndex: 0,
            minicartState: false,
            badgeAmount: 0
        }
    }

    outOfDropdownCurrency() {
        window.addEventListener("click", (event) => {
            if (event.target.id !== "actions-item") {
                this.mounted && this.setState({ dropdownCurrency: "" });
            }
        })
    }

    dropdownCurrency = () => {
        this.setState({ minicartState: false });
        if (this.state.dropdownCurrency === "show-nav") this.setState({ dropdownCurrency: "" });
        else this.setState({ dropdownCurrency: "show-nav" });
    }

    setMinicartState = () => {
        this.setState({ minicartState: !this.state.minicartState });
    }

    currency = (e) => {
        store.dispatch({
            type: "currency",
            payload: {
                curIndex: e.target.id,
                symbol: e.target.value
            }
        });
        this.setState({ currencyIndex: e.target.id, currencyLabel: e.target.value });

    }

    getBadgeAmount() {
        store.subscribe(() => {
            this.mounted && this.setState({ badgeAmount: store.getState().badgeReducer });
            sessionStorage.setItem("badge", JSON.stringify(store.getState().badgeReducer));
        });
    }

    getMinicartState = (data) => {
        this.mounted && this.setState({ minicartState: data })
    }

    componentDidMount() {
        this.mounted = true;
        this.getBadgeAmount();
        this.outOfDropdownCurrency();
        store.dispatch({
            type: "currency",
            payload: {
                curIndex: 0,
                symbol: "$"
            }
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <div className="nav-bar-container" id="show">
                {this.mounted &&
                    <>
                        <div className="category-container">
                            <NavLink to="/all" id="show" className="category-item">ALL</NavLink>
                            <NavLink to="/clothes" id="show" className="category-item">CLOTHES</NavLink>
                            <NavLink to="/tech" id="show" className="category-item">TECH</NavLink>
                            <NavLink to="/out-of-stock" id="show" className="category-item">OUT OF STOCK</NavLink>
                        </div>
                        <div className="logo-container">
                            <img src={BrandIcon} alt="brand logo" className="logo-item" />
                        </div>
                        <div className="actions-container" id="show">
                            <div className="dropdown-currency">
                                <p>{this.state.currencyLabel}</p>
                                <input
                                    className="actions-item"
                                    onClick={this.dropdownCurrency}
                                    id="actions-item" type="image"
                                    src={CurrencyControl}
                                    alt="currency controler"
                                />
                                <div id="myDropdown" className={"dropdown-content " + this.state.dropdownCurrency}>
                                    <button onClick={this.currency} id="0" className="dropdown-item" value="$">$ USD</button>
                                    <button onClick={this.currency} id="1" className="dropdown-item" value="£">£ GBP</button>
                                    <button onClick={this.currency} id="2" className="dropdown-item" value="A$">A$ AUD</button>
                                    <button onClick={this.currency} id="3" className="dropdown-item" value="¥">¥ JPY</button>
                                    <button onClick={this.currency} id="4" className="dropdown-item" value="₽">₽ RUB</button>
                                </div>
                            </div>
                            <div onClick={this.setMinicartState} className="cart-display-container">
                                <input
                                    className="actions-item"
                                    id="minicart"
                                    type="image"
                                    src={EmptyCart}
                                    alt="empty cart" />
                                {
                                    this.state.badgeAmount !== 0 ?
                                        <p className="cart-item-count">{this.state.badgeAmount}</p> : null
                                }
                            </div>


                            {
                                this.state.minicartState ?
                                    <MinicartComponent
                                        curIndex={this.state.currencyIndex}
                                        curSymbol={this.state.currencyLabel}
                                        minicartState={
                                            this.getMinicartState
                                        }
                                    /> :
                                    null
                            }
                        </div>
                    </>}
            </div>
        );
    }
}

export default NavBar;
