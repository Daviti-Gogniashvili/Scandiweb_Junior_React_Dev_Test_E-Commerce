import React, { Component } from 'react';
import { fetchAllData } from '../../services/dataFetching/fetchDataFromEndpoint';
import NavBar from '../nav-bar/nav-bar';

import store from '../../store/store';

import './tech-item-component.css';
import ProductBody from '../product-body/product-body';

class TechItemComponent extends Component {

    fetched = false

    constructor() {
        super();
        this.category = "tech";
        this.path = "tech";
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
            <section className="tech-items-container">
                <NavBar />
                <ProductBody path={this.path}/>
            </section>
        );
    }
}

export default TechItemComponent;