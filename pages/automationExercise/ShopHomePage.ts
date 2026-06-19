import { expect, Locator, Page } from "@playwright/test";

export class ShopHomePage {
    // Locators
    readonly signUpLoginLink: Locator;
    readonly acceptButton: Locator;
    readonly subscibtionHeading: Locator;
    readonly emailInput: Locator;
    readonly subscribeButton: Locator;
    readonly successAlert: Locator;

    constructor(readonly page: Page) {
        this.signUpLoginLink = page.getByRole('link', { name: 'Signup / Login'});
        this.acceptButton = page.getByRole('button', { name: /consent|accept/i, });
        this.subscibtionHeading = page.getByRole('heading', { name: 'Subscription' });
        this.emailInput = page.getByPlaceholder('Your email address');
        this.subscribeButton = page.locator('#subscribe');
        this.successAlert = page.locator('.alert-success');
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

    async assertSuccessMessage() {
        await expect(this.successAlert).toHaveText('You have been successfully subscribed!');
    }

    async assertEmailInputEmpty() {
        await expect(this.emailInput).toBeEmpty();
    }

    async clickSignupLoginLink() {
        await this.signUpLoginLink.click();
    }

    async scrollToSubscriptionSection() {
        await this.subscibtionHeading.scrollIntoViewIfNeeded();
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async clickSubscribeButton() {
        await this.subscribeButton.click();
    }
}
