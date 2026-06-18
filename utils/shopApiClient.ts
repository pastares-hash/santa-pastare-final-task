import { APIRequestContext } from "@playwright/test";

export interface ProductsList {
    responseCode: number,
    products: Product[],
    message: string
}

export interface Product {
    id: number,
    name: string,
    price: string,
    brand: string,
    category: {
        usertype: {
            usertype: string;
        };
        category: string;
  };
}

export class ShopApiClient {
    readonly BASE_URL = 'https://automationexercise.com/api';

    constructor(private readonly request: APIRequestContext) {
    }

    async getAllProducts(): Promise<ProductsList> {
        const response = await this.request.get(`${this.BASE_URL}/productsList`);
        const body = await response.json();

        if (!response.ok()) throw new Error(`fetch failed ${response.status()}: ${JSON.stringify(body)}`)

        return body as ProductsList;
    }

    async searchProduct(data?: string): Promise<ProductsList> {
        const options = data ? { form: { search_product: data }} : {};

        const response = await this.request.post(`${this.BASE_URL}/searchProduct`, options);

        const body = await response.json();
        if (!response.ok()) throw new Error(`search failed ${response.status()}: ${JSON.stringify(body)}`)

        return body as ProductsList
    }
}
