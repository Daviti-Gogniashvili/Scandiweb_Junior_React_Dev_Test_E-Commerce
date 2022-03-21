import { Component } from 'react';
import DetailsPage from '../details-page/details-page';
import CartComponent from '../cart-component/cart-component';
import NavBar from '../nav-bar/nav-bar';
import ProductListingComponent from '../product-listing-component/product-listing-component';
import './product-body.css';

class ProductBody extends Component {

    setID = () => {
        let id = window.location.pathname.substring(1, window.location.pathname.length);
        return id;
    }

    render() {
        return (
            <div>
                <NavBar />
                {this.setID() !== "cart" ?
                    this.props.path === undefined ? <DetailsPage /> :
                        <ProductListingComponent /> :
                    <CartComponent />
                }
            </div>
        );
    }
}

export default ProductBody;
