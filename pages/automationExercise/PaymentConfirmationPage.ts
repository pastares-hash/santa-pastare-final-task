import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class PaymentConfirmationPage extends BaseShopPage {
    // Locators
    readonly orderConfirmedHeading: Locator;

    constructor(page: Page) {
        super(page);

        this.orderConfirmedHeading = page.getByRole('heading', { name: 'Order Placed!' });
    }

    // Methods
    async assertOnPage() {
        await expect(this.page).toHaveURL(/\/payment_done\/\d+$/);
    }
    
    async assertOderPlaced() {
        await expect(this.page).toHaveURL(/payment_done\/\d+/)
        await expect(this.orderConfirmedHeading).toBeVisible();
    }
}