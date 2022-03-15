import { getAllQuery } from "../graphQL/queries";
import { getByIdQuery } from "../graphQL/queries";
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

export { fetchAllData, fetchByIdData }