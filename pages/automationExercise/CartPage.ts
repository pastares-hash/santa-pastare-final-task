import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
    // Locators
    readonly proceedToCheckoutButton: Locator;
    readonly cartProducts: Locator;
    readonly cartTotal: Locator;
    readonly cartTitle: Locator;
    readonly emptyCartMessage: Locator;

    constructor(readonly page: Page) {
        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
        this.cartProducts = page.locator('tr[id^="product-"]');
        this.cartTotal = page.locator('.cart_total_price');
        this.cartTitle = page.getByText('Shopping Cart')
        this.emptyCartMessage = page.locator('#empty_cart');
    }

    // Methods
    async goto() {
        await this.page.goto('/view_cart');
    }

    async assertOnPage() {
        await expect(this.cartTitle).toBeVisible();
    }

    async assertProductCount(count: number) {
        await expect(this.cartProducts).toHaveCount(count);
    }

    async assertProductDetails(name: string, price: number, quantity: number, total: number) {
        const row = await this.cartProducts.filter({ hasText: name });
        await expect(row.getByRole('link', { name: name })).toBeVisible();
        await expect(row.locator('.cart_price')).toContainText(`Rs. ${price}`);
        await expect(row.locator('.cart_quantity')).toContainText(quantity.toString());
        await expect(row.locator('.cart_total')).toContainText(`Rs. ${total}`);
    }

    async asertCartTotal(sum: number) {
        const total = await this.cartTotal.allTextContents();
        const actualTotal = total.reduce((sum, text) => {
            const amount = Number(text.replace(/[^\d]/g, ''));
            return sum + amount;
        }, 0);

        expect(actualTotal).toBe(sum);
    }

    async assertProductVisibility(visible: boolean, productName: string) {
        const row = await this.cartProducts.filter({ hasText: productName });
        this.page.screenshot({path: 'screenshot.png'})
        if (visible == true) {
            expect(row).toBeVisible();
        } else {
            expect(row).not.toBeVisible();
        }
    }

    async assertCartIsEmpty() {
        await expect(this.cartProducts).toHaveCount(0);
        expect(this.emptyCartMessage).toContainText('Cart is empty!');
    }

    async assertNoErrors() {
        await expect(this.page.locator('.error, .alert-danger')).toHaveCount(0);
    }

    async clickProceedToCheckoutButton() {
        await this.proceedToCheckoutButton.click();
    }

    async removeProduct(productName: string) {
        const row = await this.cartProducts.filter({ hasText: productName });
        await row.locator('.cart_quantity_delete').click();
    }
}
