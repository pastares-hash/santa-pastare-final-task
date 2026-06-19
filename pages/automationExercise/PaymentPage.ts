import { Locator, Page, expect } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class PaymentPage extends BaseShopPage {
    // Locators
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expirationMonthInput: Locator;
    readonly expirationYearInput: Locator;
    readonly payAndConfirmButton: Locator;

    constructor(page: Page) {
        super(page);

        this.nameOnCardInput = page.locator('input[name="name_on_card"]');
        this.cardNumberInput = page.locator('input[name="card_number"]')
        this.cvcInput = page.getByRole('textbox', { name: 'ex.' });
        this.expirationMonthInput = page.getByRole('textbox', { name: 'MM' });
        this.expirationYearInput = page.getByRole('textbox', { name: 'YYYY' });
        this.payAndConfirmButton = page.getByRole('button', { name: 'Pay and Confirm Order' });
    }

    // Methods
    async assertOnPage() {
        await expect(this.page).toHaveURL('/payment');
    }
        
    async fillCardDetails(name: string, cardNumber: string, cvc: string, month: string, year: string) {
        await this.nameOnCardInput.fill(name);
        await this.cardNumberInput.fill(cardNumber);
        await this.cvcInput.fill(cvc);
        await this.expirationMonthInput.fill(month);
        await this.expirationYearInput.fill(year);
    }

    async clickPayAndConfirmButton() {
        await this.payAndConfirmButton.click();
    }
}