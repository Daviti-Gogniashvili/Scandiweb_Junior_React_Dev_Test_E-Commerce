import React, { Component } from 'react';
import { fetchAllData } from '../../services/dataFetching/fetchDataFromEndpoint';

import store from '../../store/store';

import './all-items-component.css';
import ProductBody from '../product-body/product-body';

class AllItemsComponent extends Component {

    fetched = false

    constructor() {
        super();
        this.category = "all";
        this.path = "all";
    }

    async componentDidMount() {
        await fetchAllData(this.category).then((res) => {
            this.fetched = true;
            this.fetched && store.dispatch({
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
            <section className="all-items-container">
                <ProductBody path={this.path}/>
            </section>
        );
    }
}

export default AllItemsComponent;
