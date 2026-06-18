import { expect, Locator, Page } from "@playwright/test";

export enum Title {
    Mr = 'Mr',
    Mrs = 'Mrs',
}

export class AccountCreationPage {
    // Locators
    readonly mrRadio: Locator
    readonly mrsRadio: Locator
    // readonly nameInput: Locator;
    // readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly dayDropdown: Locator;
    readonly monthDropdown: Locator;
    readonly yearDropdown: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly countryDropdown: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipCodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;
    readonly accountCreatedHeading: Locator;
    readonly continueButton: Locator;

    constructor(readonly page: Page) {
        this.mrRadio = page.getByLabel('Mr.');
        this.mrsRadio = page.getByLabel('Mrs.');
        // this.nameInput = page.getByLabel('Name');
        // this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.dayDropdown = page.locator('[data-qa="days"]');
        this.monthDropdown = page.locator('[data-qa="months"]');
        this.yearDropdown = page.locator('[data-qa="years"]');
        this.firstNameInput = page.getByLabel('First Name');
        this.lastNameInput = page.getByLabel('Last Name');
        this.addressInput = page.getByRole('textbox', { name: 'Address * (Street address, P.' });
        this.countryDropdown = page.getByLabel('Country');
        this.stateInput = page.getByLabel('State');
        this.cityInput = page.getByLabel("City");
        this.zipCodeInput = page.locator('[data-qa="zipcode"]');
        this.mobileNumberInput = page.getByLabel('Mobile Number');
        this.createAccountButton = page.getByRole('button', { name: 'Create Account'});
        this.accountCreatedHeading = page.getByRole('heading', { name: 'Account Created!' });
        this.continueButton = page.getByRole('link', { name: 'Continue' });
    }

    // Methods
    async assertNavigatedOnPage() {
        await this.page.waitForURL(/signup/);
    }

    async assertAccountCreated(page: Page) {
        await expect(page).toHaveURL(/account_created/);
        await expect(this.accountCreatedHeading).toBeVisible();
    }

    async createAccount(title: Title, password: string, birthDay: string, birthMonth: string, 
        birthYear: string, firstName: string, lastName: string, address: string,
        country: string, state: string, city: string, zipCode: string, mobileNumber: string) {
            if (title == Title.Mr) {
                await this.mrRadio.check()
            } else {
                await this.mrsRadio.check()
            }
            await this.passwordInput.fill(password);
            await this.dayDropdown.selectOption(birthDay);
            await this.monthDropdown.selectOption(birthMonth);
            await this.yearDropdown.selectOption(birthYear);
            await this.firstNameInput.fill(firstName);
            await this.lastNameInput.fill(lastName);
            await this.addressInput.fill(address);
            await this.countryDropdown.selectOption(country);
            await this.stateInput.fill(state);
            await this.cityInput.fill(city);
            await this.zipCodeInput.fill(zipCode);
            await this.mobileNumberInput.fill(mobileNumber);
            await this.createAccountButton.click();
    }

    async clickContinue() {
        await this.continueButton.click()
    }
}
