import { Locator, Page, expect } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class SignupLoginPage extends BaseShopPage {
    // Locators
    readonly nameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;

    constructor(page: Page) {
        super(page); 

        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.getByRole('button', { name: 'Signup'});
    }

    // Methods
    async goto() {
        await this.page.goto('/login');
    }

    async assertOnPage() {
        await expect(this.page).toHaveURL('/login');
    }    

    async assertNavigatedOnPage() {
        await this.page.waitForURL(/login/);
    }

    async signUp(name: string, email: string,) {
        await this.nameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.acceptCookiesIfPresent();
        await this.signupButton.click();
    }
}
