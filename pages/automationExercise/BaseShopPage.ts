import { expect, Locator, Page } from "@playwright/test";

export class BaseShopPage {
    readonly acceptButton: Locator;
    readonly emailInput: Locator;
    readonly subscibtionHeading: Locator;
    readonly subscribeButton: Locator;
    readonly successAlert: Locator;
    readonly loggedInAs: Locator;

    constructor(readonly page: Page) {
        this.acceptButton = page.getByRole('button', { name: /consent|accept/i, });
        this.subscibtionHeading = page.getByRole('heading', { name: 'Subscription' });
        this.emailInput = page.getByPlaceholder('Your email address');
        this.subscribeButton = page.locator('#subscribe');
        this.successAlert = page.locator('.alert-success');
        this.loggedInAs = page.getByRole('listitem').filter({ hasText: 'Logged in as' })
    }

    // Methods
    async assertSuccessMessage() {
        await expect(this.successAlert).toHaveText('You have been successfully subscribed!');
    }

    async assertNavBarUsername(username: string) {
        await expect(this.loggedInAs).toContainText(username);
    }

    async acceptCookiesIfPresent() {
        if (await this.acceptButton.isVisible().catch(() => false)) {
            await this.acceptButton.click();
        }
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
