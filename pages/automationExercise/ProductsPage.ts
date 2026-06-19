import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class ProductsPage extends BaseShopPage {
    // Locators
    readonly products: Locator;
    readonly viewCartLink: Locator;
    readonly continueShoppingButton: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly acceptButton: Locator;
    readonly searchedProductsHeading: Locator;
    readonly viewProductLink: Locator;

    constructor(page: Page) {
        super(page);

        this.products = page.locator('.product-image-wrapper');
        this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.searchInput = page.getByPlaceholder('Search Product');
        this.searchButton = page.locator('#submit_search');
        this.acceptButton = page.getByRole('button', { name: /consent|accept/i, });
        this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
        this.viewProductLink = page.getByRole('link', { name: 'View Product' });
    }

    // Methods
    async goto() {
        await this.page.goto('/products');
    }

    async assertOnPage() {
        await expect(this.page).toHaveURL('/products');
    }

    async assertSearchedProductsHeadingVisible() {
        await expect(this.searchedProductsHeading).toBeVisible();
    }

    async assertAllProductsContainText(text: string) {
        const productNames = this.page.locator('.productinfo p');
        const names = await productNames.allTextContents();

        expect(names.length).toBeGreaterThan(0);

        for (const name of names) {
            expect(name.toLowerCase()).toContain(text.toLowerCase());
        }
    }

    async hoverProductAndAddToCart(index: number) {
        const product = this.products.nth(index);
        await this.acceptCookiesIfPresent();
        await product.hover();
        const overlay = product.locator('.product-overlay');
        await overlay.locator('.add-to-cart').click();
    }

    async clickViewCartLink() {
        await this.page.screenshot({path: 'screenshot.png'})
        await this.viewCartLink.click();
    }

    async clickContinueShoppingLink() {
        await this.page.screenshot({path:'screenshot.png'})
        await this.continueShoppingButton.click();
    }

    async searchProduct(product: string) {
        await this.searchInput.fill(product);
        await this.acceptCookiesIfPresent();
        await this.searchButton.click();
    }

    async addProductToCartAndContinueShopping(index: number) {
        await this.goto();
        await this.hoverProductAndAddToCart(index);
        await this.clickContinueShoppingLink();
    }

    async clickViewProduct(index: number) {
        const product = await this.viewProductLink.nth(index);
        await this.acceptCookiesIfPresent();
        await product.click();
    }
}
