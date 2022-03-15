import React, { Component } from 'react';
import { fetchAllData } from '../../services/dataFetching/fetchDataFromEndpoint';

import store from '../../store/store';

import './out-of-stock-item-component.css';
import ProductBody from '../product-body/product-body';

class OutOfStockItemComponent extends Component {

    fetched = false

    constructor() {
        super();
        this.category = "all";
        this.path = "out-of-stock";
        this.state = {
            fetched: false,
        }
    }

    filterData(data) {
        let filteredData = [];
        
        data.map((fData) => (
            fData.inStock ? null : filteredData.push(fData)
        ))

        return filteredData;
    }

    async componentDidMount() {
        await fetchAllData(this.category).then((res) => {
            this.fetched = true;
            store.dispatch({
                type: this.fetched,
                payload: {
                    data: this.filterData(res.data.category.products),
                    category: "out of stock",
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
            <section className="out-of-stock-items-container">
                <ProductBody path={this.path}/>
            </section>
        );
    }
}

export default OutOfStockItemComponent;
