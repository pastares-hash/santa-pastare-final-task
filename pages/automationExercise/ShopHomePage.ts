import { expect, Locator, Page } from "@playwright/test";

export class ShopHomePage {
    // Locators
    readonly signUpLoginLink: Locator;
    readonly acceptButton: Locator;

    constructor(readonly page: Page) {
        this.signUpLoginLink = page.getByRole('link', { name: 'Signup / Login'});
        this.acceptButton = page.getByRole('button', { name: /consent|accept/i, });
    }

    // Methods
    async open() {
        await this.page.goto('/')
        await this.acceptCookiesIfPresent();
    }

    private async acceptCookiesIfPresent() {
        if (await this.acceptButton.isVisible().catch(() => false)) {
            await this.acceptButton.click();
        }
    }

    async assertOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }

    async assertLoggedInUsername(username: string) {
        await expect(this.page.getByText(`Logged in as ${username}` )).toBeVisible();
    }

    async clickSignupLoginLink() {
        await this.signUpLoginLink.click();
    }
}
