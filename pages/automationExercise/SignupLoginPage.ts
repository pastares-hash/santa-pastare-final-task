import { Locator, Page } from "@playwright/test";

export class SignupLoginPage {
    // Locators
    readonly nameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;

    constructor(readonly page: Page) {
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.getByRole('button', { name: 'Signup'});
    }

    // Methods
    async assertNavigatedOnPage() {
        await this.page.waitForURL(/login/);
    }

    async signUp(name: string, email: string,) {
        await this.nameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupButton.click();
    }
}
