import { test as base, Page } from '@playwright/test';
import { SignupLoginPage } from '../pages/automationExercise/SignupLoginPage';
import {
  AccountCreationPage,
  Title,
} from '../pages/automationExercise/AccountCreationPage';
import { ShopHomePage } from '../pages/automationExercise/ShopHomePage';
import { ShopApiClient } from '../utils/shopApiClient';
import { ShopUser } from '../models/ShopUser';

export type AuthenticatedShopPageFixture = {
  authenticatedShopPage: Page;
  user: ShopUser;
};

export const test = base.extend<AuthenticatedShopPageFixture>({
  user: async ({}, use) => {
    await use(generateUser());
  },

  authenticatedShopPage: async ({ browser, user, request }, use) => {
    const page = await browser.newPage();

    const signUpLoginPage = new SignupLoginPage(page);

    await signUpLoginPage.goto();
    await signUpLoginPage.assertOnPage();

    await signUpLoginPage.signUp(user.name, user.email);
    await signUpLoginPage.clickSubscribeButton();

    const accountCreationPage = new AccountCreationPage(page);

    await accountCreationPage.assertOnPage();

    await accountCreationPage.createAccount(
      user.title,
      user.password,
      user.birthDay,
      user.birthMonth,
      user.birthYear,
      user.firstName,
      user.lastName,
      user.address,
      user.country,
      user.state,
      user.city,
      user.zipCode,
      user.mobileNumber
    );

    await accountCreationPage.assertAccountCreated(page);
    await accountCreationPage.clickContinue();

    const homePage = new ShopHomePage(page);
    await homePage.assertOnPage();

    await homePage.assertLoggedInUsername(user.name);

    await use(page);
    
    const apiClient = new ShopApiClient(request);
    await apiClient.deleteAccount(user.email, user.password);

    await page.close();
  },
});

function generateUser(): ShopUser {
  const timestamp = Date.now();

  return {
    title: Title.Mr,
    password: 'password123',
    birthDay: '1',
    birthMonth: '2',
    birthYear: '2020',
    name: `tester${timestamp}`,
    email: `${timestamp}@example.com`,
    company: '',
    firstName: 'Paul',
    lastName: 'Jackson',
    address: '158 Eaton Dr',
    address2: '',
    state: 'Colorado',
    country: 'United States',
    city: 'Pagosa Springs',
    zipCode: 'CO 81147',
    mobileNumber: '+19707316000',
  };
}