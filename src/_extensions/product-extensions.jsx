import { Component } from 'react';

class ProductExtention extends Component {
    cartDataCreator = (id, listData, th, sizeValue) => {
        let dictData = {};
        dictData.item = th.state.data;
        dictData.size = sizeValue;
        listData.push(dictData);
        if (listData.length > 2) listData.pop();

        if (JSON.parse(sessionStorage.getItem(id)) === null) {
            sessionStorage.setItem(id, JSON.stringify(listData));
        }
        let item = JSON.parse(sessionStorage.getItem(id));
        item[0] += 1;
        sessionStorage.setItem(id, JSON.stringify(item));

        this.addCart(JSON.parse(sessionStorage.getItem(id)), id);
    }

    addCart = (item, id) => {
        if (item !== null) {
            let dictOf = {};
            dictOf[id] = item;
            sessionStorage.setItem(
                "cartData",
                JSON.stringify(Object.assign({}, JSON.parse(sessionStorage.getItem("cartData")), dictOf))
            );
        };
    }
}

export default ProductExtention;
