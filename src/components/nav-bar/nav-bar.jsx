import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { fetchCategories, fetchCurrencies } from '../../services/dataFetching/fetchDataFromEndpoint';

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
        this.compRef = React.createRef();
        this.Ref = React.createRef();
        this.beacon = 0;
        this.state = {
            dropdownCurrency: "",
            dropdownMinicart: "",
            currencyLabel: "$",
            currencyIndex: 0,
            minicartState: false,
            badgeAmount: 0,
            categories: [],
            currencies: [],
        }
    }

    outOfDropdownCurrency() {
        window.addEventListener('click', (ev) => {
            if (!this.Ref.current.contains(ev.target))
                this.mounted && this.setState({ dropdownCurrency: "" });
        });
    }

    dropdownCurrency = () => {
        this.setState({ minicartState: false });
        if (this.state.dropdownCurrency === "show-nav") this.setState({ dropdownCurrency: "" });
        else this.setState({ dropdownCurrency: "show-nav" });
    }

    setMinicartState = () => {
        this.setState({ minicartState: !this.state.minicartState });
    }

    currency = (index) => {
        this.beacon = 1;
        // this.setState({ dropdownCurrency: "" });
        let symbol = this.state.currencies[index].symbol;
        store.dispatch({
            type: "currency",
            payload: {
                curIndex: index,
                symbol: symbol
            }
        });
        this.setState({ currencyIndex: index, currencyLabel: symbol });

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

    getCategories() {
        fetchCategories().then((res) => {
            this.mounted && this.setState({ categories: res.data.categories });
        });
    }

    getCurrencies() {
        fetchCurrencies().then((res) => {
            this.mounted && this.setState({ currencies: res.data.currencies });
        });
    }

    componentDidMount() {
        this.mounted = true;
        this.getCategories();
        this.getCurrencies();
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
                            {this.state.categories.map((item, index) => (
                                <NavLink key={index} to={"/" + item.name} id="show" className="category-item">{item.name.toUpperCase()}</NavLink>
                            ))}
                            <NavLink to="/out-of-stock" id="show" className="category-item">OUT OF STOCK</NavLink>
                        </div>
                        <div className="logo-container">
                            <img src={BrandIcon} alt="brand logo" className="logo-item" />
                        </div>
                        <div className="actions-container" id="show">
                            <div className="dropdown-currency">
                                <p>{this.state.currencyLabel}</p>
                                <input
                                    ref={this.Ref}
                                    className="actions-item"
                                    onClick={this.dropdownCurrency}
                                    id="actions-item" type="image"
                                    src={CurrencyControl}
                                    alt="currency controler"
                                />
                                <div id="myDropdown" className={"dropdown-content " + this.state.dropdownCurrency}>
                                    {this.state.currencies.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => this.currency(index)}
                                            className="dropdown-item"
                                            name={item.value}>
                                            {item.symbol} {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div ref={this.compRef} onClick={this.setMinicartState} className="cart-display-container">
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
                                        compRef={this.compRef}
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
