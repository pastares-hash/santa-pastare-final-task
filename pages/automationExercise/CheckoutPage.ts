import { expect, Locator, Page } from "@playwright/test";
import { BaseShopPage } from "./BaseShopPage";

export class CheckoutPage extends BaseShopPage {
    // Locators
    readonly address: Locator;
    readonly placeOrderLink: Locator;

    constructor(page: Page) {
        super(page);

        this.address = page.locator('#address_delivery');
        this.placeOrderLink = page.getByRole('link', { name: 'Place Order' });
    }

    // Methods
    async assertOnPage() {
        await expect(this.page).toHaveURL('/checkout');
    }

    async assertAddress(address: string, state: string, city: string, zipCode: string, country: string, ) {
        const addressLine = this.address.locator('li.address_address1.address_address2')
        .filter({ hasText: /.+/ });
        await expect(addressLine).toHaveText(address);
        const middleLane = this.address.locator('li.address_city.address_state_name.address_postcode');
        const cityStateZip = `${city} ${state} ${zipCode}`;
        await expect(middleLane).toHaveText(cityStateZip);
        const countryLine = this.address.locator('li.address_country_name');
        await expect(countryLine).toHaveText(country);
    }

    async clickPlaceOrderButton() {
        await this.placeOrderLink.click();
    }
}