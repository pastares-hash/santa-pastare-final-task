import { APIRequestContext } from "@playwright/test";
import { ShopUser } from "../models/ShopUser";

export interface ProductsResponse {
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

    async getProducts(): Promise<ProductsResponse> {
        const response = await this.request.get(`${this.BASE_URL}/productsList`);
        const body = await response.json();

        if (!response.ok()) throw new Error(`fetch failed ${response.status()}: ${JSON.stringify(body)}`)

        return body as ProductsResponse;
    }

    async searchProducts(keyword?: string): Promise<ProductsResponse> {
        const options = keyword ? { form: { search_product: keyword }} : {};

        const response = await this.request.post(`${this.BASE_URL}/searchProduct`, options);

        const body = await response.json();
        if (!response.ok()) throw new Error(`search failed ${response.status()}: ${JSON.stringify(body)}`)

        return body as ProductsResponse
    }

    async createAccount(user: ShopUser): Promise<void> {
        const response = await this.request.post(`${this.BASE_URL}/createAccount`, {
            form: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: user.title,
                birth_date: user.birthDay,
                birth_month: user.birthMonth,
                birth_year: user.birthYear,
                firstname: user.firstName,
                lastname: user.lastName,
                company: user.company,
                address1: user.address,
                address2: user.address2,
                country: user.country,
                zipcode: user.zipCode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobileNumber
            }
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`registration failed ${response.status()}: ${JSON.stringify(body)}`) 
    }

    async deleteAccount(email: string, password: string): Promise<void> {
        const response = await this.request.delete(`${this.BASE_URL}/deleteAccount`, {
            form: {
                email: email,
                password: password,
            }
        });
        const body = await response.json();

        if (!response.ok()) throw new Error(`user deletion failed ${response.status()}: ${JSON.stringify(body)}`)
    }

    async verifyLogin(email: string, password: string): Promise<boolean> {
        const response = await this.request.post(`${this.BASE_URL}/verifyLogin`, {
            form: { 
                email: email,
                password: password
            }
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`verification failed ${response.status()}: ${JSON.stringify(body)}`)

        return response.ok()
    }
}
