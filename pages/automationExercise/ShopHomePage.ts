import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class ShopHomePage extends BaseShopPage {
    // Locators
    readonly signUpLoginLink: Locator;

    constructor(page: Page) {
        super(page);
        
        this.signUpLoginLink = page.getByRole('link', { name: 'Signup / Login'});
    }

    // Methods
    async open() {
        await this.page.goto('/')
        await this.acceptCookiesIfPresent();
    }

    async assertOnPage() {
        await expect(this.page).toHaveURL('/');
    }

    async assertLoggedInUsername(username: string) {
        await expect(this.page.getByText(`Logged in as ${username}` )).toBeVisible();
    }

    async assertEmailInputEmpty() {
        await expect(this.emailInput).toBeEmpty();
    }

    async clickSignupLoginLink() {
        await this.signUpLoginLink.click();
    }
}
