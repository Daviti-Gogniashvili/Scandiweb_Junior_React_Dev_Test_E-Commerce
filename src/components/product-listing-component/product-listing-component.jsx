import React, { Component } from 'react';
import store from '../../store/store';
import ProductTemplate from '../product-template/product-template';
import './product-listing-component.css';

class ProductListingComponent extends Component {

    subscribed = false
    constructor() {
        super();
        this.state = {
            data: [],
            category: null,
            currencyIndex: 0
        }
    }

    componentDidMount() {
        this.subscribed = true;
        store.subscribe(() => {
            this.subscribed &&
                this.setState
                    ({
                        data: store.getState().categoryDataReducer.data,
                        category: store.getState().categoryDataReducer.category,
                        currencyIndex: store.getState().currencyReducer.curIndex
                    });
        })
    }

    componentWillUnmount() {
        this.subscribed = false;
    }

    render() {
        return (
            <section className="product-body-container">
                <div className="category-name-container">
                    <h2 className="category-name">{this.subscribed && this.state.category}</h2>
                </div>
                <div className="product-container">
                    {this.state.data.map((item) => (
                        <ProductTemplate
                            key={item.id}
                            id={item.id}
                            item={item}
                            currencyIndex={this.state.currencyIndex}
                        />
                    ))}
                </div>
            </section>
        );
    }
}

export default ProductListingComponent;
