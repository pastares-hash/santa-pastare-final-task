import { APIRequestContext } from "@playwright/test";

export interface ProductsList {
    responseCode: number,
    products: Product[]
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
        return await response.json();
    }
}
