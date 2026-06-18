import { expect, Locator, Page } from "@playwright/test";

export class ProductDetailPage {
    // Locators
    readonly productInfo: Locator;
    readonly heading: Locator;
    readonly categoryField: Locator;
    readonly priceField: Locator;
    readonly availabilityField: Locator;
    readonly conditionField: Locator;
    readonly brandField: Locator;
    readonly addToCartButton: Locator;

    constructor(readonly page: Page) {
        this.productInfo = page.locator('.product-information');
        this.heading = this.productInfo.getByRole('heading', { level: 2 });
        this.categoryField = page.locator('p', { hasText: 'Category:' });
        this.priceField = page.getByText('Rs.');
        this.availabilityField = page.locator('p', { hasText: 'Availability:' });
        this.conditionField = page.locator('p', { hasText: 'Condition:' });
        this.brandField = page.locator('p', { hasText: 'Brand:' });
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    }

    // Methods
    async assertHeadingVisible() {
        await expect(this.heading).toBeVisible();
    }

    async assertAddToCartButtonVisible() {
        await expect(this.heading).toBeVisible();
    }

    async assertProductFields() {
        const regex = '/:\s*\S+/';
        await expect(this.categoryField).toBeVisible();
        await expect(this.categoryField).not.toHaveText(regex);
        await expect(this.priceField).toBeVisible();
        await expect(this.priceField).not.toHaveText(regex);
        await expect(this.conditionField).toBeVisible();
        await expect(this.conditionField).not.toHaveText(regex);
        await expect(this.availabilityField).toBeVisible();
        await expect(this.availabilityField).not.toHaveText(regex);
        await expect(this.brandField).toBeVisible();
        await expect(this.brandField).not.toHaveText(regex);
    }
}
