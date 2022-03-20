import { gql } from '@apollo/client';

const getAllQuery = gql`
    query all($category: String!){
    category(input: { title: $category}) {
        name
        products {
            id
			name
			inStock
			gallery
            description
            brand
            attributes {
                type
                items {
                    id
                    value
                }
            }
			prices {
                currency {
                    label
                    symbol
                }
            amount
            }
        }
    }
}`;

const getByIdQuery = gql`
    query byIdQuery($id: String!) {
        product(id: $id) {
            id
			name
			inStock
			gallery
            description
            brand
            attributes {
                name
                type
                items {
                    id
                    value
                }
            }
			prices {
                currency {
                    label
                    symbol
                }
            amount
            }
        }
    }
`

const getCategories = gql`
    query getCategory {
        categories {
            name
        }
    }
`

const getCurrencies = gql`
    query getCurrency {
        currencies {
            label
            symbol
        }
    }
`

export { getAllQuery, getByIdQuery, getCategories,getCurrencies }