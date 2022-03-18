import { getAllQuery, getByIdQuery, getCategories, getCurrencies } from "../graphQL/queries";
import { client } from '../graphQL/client';

const fetchAllData = async (category) => {
    let res = await client.query({
        query: getAllQuery,
        variables: { category }
    });

    return res;
}

const fetchByIdData = async (id) => {
    let res = await client.query({
        query: getByIdQuery,
        variables: { id }
    });

    return res;
}

const fetchCategories = async () => {
    let res = await client.query({
        query: getCategories
    });
    return res;
}

const fetchCurrencies = async () => {
    let res = await client.query({
        query: getCurrencies
    });
    return res;
}

export { fetchAllData, fetchByIdData, fetchCategories, fetchCurrencies }