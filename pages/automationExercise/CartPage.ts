import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
    // Locators
    readonly proceedToCheckoutButton: Locator;
    readonly cartProducts: Locator;
    readonly cartTotal: Locator;

    constructor(readonly page: Page) {

        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
        this.cartProducts = page.locator('tr[id^="product-"]');
        this.cartTotal = page.locator('.cart_total_price');
    }

    // Methods
    async assertProductCount(count: number) {
        await expect(this.cartProducts).toHaveCount(count);
    }

    async assertProductDetails(name: string, price: number, quantity: number, total: number) {
        const row = await this.cartProducts.filter({ hasText: name });
        await this.page.screenshot({path: 'screenshot.png'})
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

    async clickProceedToCheckoutButton() {
        await this.proceedToCheckoutButton.click();
    }
}
