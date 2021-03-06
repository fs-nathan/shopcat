import axios from 'axios';
import { get } from 'lodash';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_GQL_ENDPOINT || '';

const headers = {
    "content-type": "application/json",
};

export interface IProduct {
    id: number;
    name: string;
    data: string;
    variantRewards: string;
}

export const fetchProductById = async (productId = 53) => {
    const query = `
    {
        productById(productId: ${productId}) {
          id
          name
          data
          variantRewards
        }
    }`;

    const options = {
        method: 'POST',
        url: GQL_ENDPOINT,
        headers,
        data: { query }
    };
    const product = await axios.request(options)
        .then(res => get(res.data, 'data.productById', null));

    return product;
};

export const addToCart = async (variantId: number) => {
    const query = `
    mutation {
        addToCart(variantId: "${variantId}")
    }
`;

    const options = {
        method: 'POST',
        url: GQL_ENDPOINT,
        headers,
        data: { query }
    };
    const product = await axios.request(options)
        .then(res => res.data);

    return product;
};
