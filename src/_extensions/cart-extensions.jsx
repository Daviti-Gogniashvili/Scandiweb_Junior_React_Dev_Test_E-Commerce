import { Component } from 'react';

class CartExtensions extends Component {
    addOrSubtract(Id,Price,Index,operator) {
        let dictOf = {}
        let id = Id;
        let list = []
        let item = JSON.parse(sessionStorage.getItem(id));

        //removing item when only one remains and "-" button is clicked and updating variables too;
        if (item[0] === 1 && operator!=="plus") {
            sessionStorage.removeItem(id);
            let dict = JSON.parse(sessionStorage.getItem("cartData"));
            delete dict[id];
            sessionStorage.setItem("cartData", JSON.stringify(dict));

            let totalPrice = Price - item[1].item.prices[Index].amount;

            return Math.round(totalPrice * 100) / 100;

        } 

        //any other case;
        else 

        {
            //Setting or removing item in sessionStorage according to the operator;
            let increment = operator === "plus" ? item[0] += 1 : item[0] -= 1;
            sessionStorage.setItem(id, JSON.stringify([]));
            list.push(increment);
            list.push(item[1])
            sessionStorage.setItem(id, JSON.stringify(list));
            dictOf[id] = list;
            sessionStorage.setItem(
                "cartData",
                JSON.stringify(Object.assign({}, JSON.parse(sessionStorage.getItem("cartData")), dictOf))
            );

            //Updating totalPrice accoding to the operator;
            let totalPrice = operator === "plus" ?
                Price + item[1].item.prices[Index].amount :
                Price - item[1].item.prices[Index].amount;

            return Math.round(totalPrice * 100) / 100;
        }
    }

    displayTotalAmount() {
        let total = 0;
        Object.entries(JSON.parse(sessionStorage.getItem("cartData"))).map(([key,value]) => (total += value[0]));
        return total;

    }
}

export default CartExtensions;
