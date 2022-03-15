import React, { Component } from 'react';
import { fetchAllData } from '../../services/dataFetching/fetchDataFromEndpoint';

import store from '../../store/store';

import './clothes-item-component.css';
import ProductBody from '../product-body/product-body';

class ClothesItemComponent extends Component {

    fetched = false

    constructor() {
        super();
        this.category = "clothes";
        this.path = "clothes";
    }

    async componentDidMount() {
        await fetchAllData(this.category).then((res) => {
            this.fetched = true;
            store.dispatch({
                type: this.fetched,
                payload: {
                    data: res.data.category.products,
                    category: this.category,
                    path: this.path
                }
            })
        })
    }

    componentWillUnmount() {
        this.fetched = false;
    }

    render() {
        return (
            <section className="clothes-items-container">
                <ProductBody path={this.path}/>
            </section>
        );
    }
}

export default ClothesItemComponent;
