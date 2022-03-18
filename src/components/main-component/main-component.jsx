import React, { Component } from 'react';
import { fetchAllData } from '../../services/dataFetching/fetchDataFromEndpoint';

import store from '../../store/store';

import './main-component.css';
import ProductBody from '../product-body/product-body';

let id;

class AllItemsComponent extends Component {

    fetched = false;

    constructor() {
        super();
        this.path = "all";
    }

    setCategory() {
        let category;
        category = id.replace(/-/g," ");
        return category;
    }

    filterData(data, valve) {
        let filteredData = [];

        if (valve === "out of stock") {
            data.map((fData) => (
                fData.inStock ? null : filteredData.push(fData)
            ));
        }

        else filteredData = data;

        return filteredData;
    }

    async componentDidMount() {
        this.fetched = true;
        await fetchAllData(this.setCategory() === "out of stock" ? "all" : id).then((res) => {
            this.fetched && store.dispatch({
                type: this.fetched,
                payload: {
                    data: this.filterData(res.data.category.products,this.setCategory()),
                    category: this.setCategory(),
                    path: this.path
                }
            })
        })
    }

    componentWillUnmount() {
        this.fetched = false;
    }

    render() {
        id = window.location.pathname.substring(1, window.location.pathname.length);
        return (
            <div>
                <ProductBody path={this.path}/>
            </div>
        );
    }
}

export default AllItemsComponent;
