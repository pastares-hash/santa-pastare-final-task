import { expect, Locator, Page } from "@playwright/test";

export class PaymentConfirmationPage {
    // Locators
    readonly orderConfirmedHeading: Locator;

    constructor(readonly page: Page) {
        this.orderConfirmedHeading = page.getByRole('heading', { name: 'Order Placed!' });
    }

    // Methods
    async assertOderPlaced() {
        await expect(this.page).toHaveURL(/payment_done\/\d+/)
        await expect(this.orderConfirmedHeading).toBeVisible();
    }
}