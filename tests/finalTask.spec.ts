import { expect } from '@playwright/test';
import { ShopHomePage } from '../pages/automationExercise/ShopHomePage';
import { SignupLoginPage } from '../pages/automationExercise/SignupLoginPage';
import { AccountCreationPage, Title } from '../pages/automationExercise/AccountCreationPage';
import { ProductsPage } from '../pages/automationExercise/ProductsPage';
import { CartPage } from '../pages/automationExercise/CartPage';
import { CheckoutPage } from '../pages/automationExercise/CheckoutPage';
import { PaymentPage } from '../pages/automationExercise/PaymentPage';
import { PaymentConfirmationPage } from '../pages/automationExercise/PaymentConfirmationPage';
import { label, epic, feature, story, severity, Severity } from 'allure-js-commons';
import { ProductDetailPage } from '../pages/automationExercise/ProductDetailPage';
import { ShopApiClient } from '../utils/shopApiClient';
import { test } from "../fixtures/authenticatedShopPage";

test.describe('TC-SHOP', () => {
    // TC-SHOP-001
    test('Happy path: full shopping flow (register -> browse -> checkout)', async ({ page }) => {
        await label('Priority', 'P1');
        await epic('Shopping');
        await feature('Checkout');
        await story('Full E2E flow');
        await severity(Severity.CRITICAL);

        const timestamp = Date.now();
        const name = `tester${timestamp}`;
        const email = `${name}@example.com`;
        const firstName = 'Paul';
        const lastName = 'Jackson';
        const address = '158 Eaton Dr';
        const state = 'Colorado';
        const country = 'United States';
        const city = 'Pagosa Springs';
        const zipCode = 'CO 81147';

        const homePage = new ShopHomePage(page);
        await homePage.open();
        await homePage.assertOnPage();

        homePage.clickSignupLoginLink();

        const signupLoginPage = new SignupLoginPage(page);
        await signupLoginPage.assertOnPage();
        await signupLoginPage.signUp(name, email);

        const accountCreationPage = new AccountCreationPage(page);
        await accountCreationPage.assertOnPage();
        await accountCreationPage.createAccount(
            Title.Mr,
            'pass',
            '12',
            '6',
            '2017',
            firstName,
            lastName,
            address,
            country,
            state,
            city,
            zipCode,
            '+19707316000'
        );

        await accountCreationPage.assertAccountCreated(page);
        await accountCreationPage.clickContinue();

        await homePage.assertLoggedInUsername(name);

        const productPage = new ProductsPage(page);
        await productPage.goto();
        await productPage.assertOnPage();

        await productPage.hoverProductAndAddToCart(1);
        await productPage.clickViewCartLink();

        const cartPage = new CartPage(page);
        await cartPage.assertOnPage();
        await cartPage.clickProceedToCheckoutButton();

        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.assertAddress(address, state, city, zipCode, country);
        await checkoutPage.clickPlaceOrderButton();

        const paymentPage = new PaymentPage(page);
        await paymentPage.assertOnPage();
        await paymentPage.fillCardDetails(firstName, lastName, '123', '04', '2027');
        await paymentPage.clickPayAndConfirmButton();

        const paymentConfirmationPage = new PaymentConfirmationPage(page);
        await paymentConfirmationPage.assertOnPage();
        await paymentConfirmationPage.assertOderPlaced(); 
    });

    // TC-SHOP-002
    test('Search: keyword search returns only matching products', async ({ page }) => {
        await label('Priority', 'P1');
        await epic('Shopping');
        await feature('Product Search');
        await story('Keyword search');
        await severity(Severity.NORMAL);

        const productPage = new ProductsPage(page);
        await productPage.goto();
        await productPage.assertOnPage();

        await productPage.searchProduct('dress');
        await productPage.assertSearchedProductsHeadingVisible();
        await page.screenshot({ path: 'screenshot.png' })
        await productPage.assertAllProductsContainText('dress');
    });

    // TC-SHOP-003
    test('Cart: adding multiple products updates the item count', async ({ page }) => {
        await label('Priority', 'P1');
        await epic('Shopping');
        await feature('Cart');
        await story('Add multiple products');
        await severity(Severity.NORMAL);

        const productPage = new ProductsPage(page);
        await productPage.goto();
        await productPage.assertOnPage();

        await productPage.hoverProductAndAddToCart(0);
        await productPage.clickContinueShoppingLink();
        await productPage.hoverProductAndAddToCart(1);
        await productPage.clickViewCartLink();

        const cartPage = new CartPage(page);
        await cartPage.assertOnPage();
        await cartPage.assertProductCount(2);
        await cartPage.assertProductDetails('Blue Top', 500, 1, 500);
        await cartPage.assertProductDetails('Men Tshirt', 400, 1, 400);
        await cartPage.asertCartTotal(900);
    });

    // TC-SHOP-004
    test('Cart: removing a product updates the cart', async ({ page }) => {
        await label('Priority', 'P1');
        await epic('Shopping');
        await feature('Cart');
        await story('Remove product');
        await severity(Severity.NORMAL);

        const productsPage = new ProductsPage(page);
        await productsPage.assertOnPage();
        await productsPage.addProductToCartAndContinueShopping(0);

        const productName = 'Blue Top';

        const cartPage = new CartPage(page);
        await cartPage.goto();
        await cartPage.assertOnPage();

        await cartPage.assertProductVisibility(true, productName);
        await cartPage.removeProduct(productName);
        await cartPage.assertProductVisibility(false, productName);
        await page.screenshot({path: 'screenshot2.png'})
        await cartPage.assertCartIsEmpty();
        await cartPage.assertOnPage();
        await cartPage.assertNoErrors();
    });

    // TC-SHOP-005
    test(' Product detail: product information page shows correct data', async ({ page }) => {
        await label('Priority', 'P2');
        await epic('Shopping');
        await feature('Product Details');
        await story('View product info');
        await severity(Severity.MINOR);

        const productsPage = new ProductsPage(page);
        await productsPage.goto();
        await productsPage.assertOnPage();

        await productsPage.clickViewProduct(0);

        const productDetailPage = new ProductDetailPage(page);
        await productDetailPage.assertOnPage();
        await productDetailPage.assertHeadingVisible();
        await productDetailPage.assertProductFields();
        await productDetailPage.assertAddToCartButtonVisible();
    });

    // TC-SHOP-006
    test('API: GET /api/productsList returns a valid product list', async ({ request }) => {
        await label('Priority', 'P1');
        await epic('API');
        await feature('Products API');
        await story('List all products');
        await severity(Severity.CRITICAL);

        const shopApiClient = new ShopApiClient(request);
        const productsList = await shopApiClient.getAllProducts();

        expect(productsList.responseCode).toBe(200);

        expect(Array.isArray(productsList.products)).toBe(true);
        expect(productsList.products.length).toBeGreaterThan(0);

        for (const product of productsList.products) {
            expect(product.id).toBeDefined();
            expect(product.name).toBeDefined();
            expect(product.price).toBeDefined();
            expect(product.brand).toBeDefined();
            expect(product.category).toBeDefined();
        }

        const ids = productsList.products.map(product => product.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    // TC-SHOP-007
    test('API: POST /api/searchProduct returns matching results', async ({ request }) => {
        await label('Priority', 'P1');
        await epic('API');
        await feature('Products API');
        await story('Search products');
        await severity(Severity.NORMAL);

        const shopApiClient = new ShopApiClient(request);
        const searchProducts = await shopApiClient.searchProduct('top');

        expect(searchProducts.responseCode).toBe(200);
        expect(searchProducts.products.length).toBeGreaterThan(0);

        for (const product of searchProducts.products) {
            expect(product.name.toLowerCase()).toContain('top');
        }
    });

    // TC-SHOP-008
    test('API: POST /api/searchProduct with missing parameter returns 400', async ({ request }) => {
        await label('Priority', 'P2');
        await epic('API');
        await feature('Products API');
        await story('Missing parameter');
        await severity(Severity.MINOR);
    
        const shopApiClient = new ShopApiClient(request);
        const searchProducts = await shopApiClient.searchProduct();

        expect(searchProducts.responseCode).toBe(400);
        expect(searchProducts.message).toContain('Bad request, search_product parameter is missing in POST request');
    });

    // TC-SHOP-009
    test('Subscription: subscribing from the footer shows a success message', async ({ page }) => {
        await label('Priority', 'P2');
        await epic('Marketing');
        await feature('Newsletter');
        await story('Footer subscription');
        await severity(Severity.MINOR);

        const email = 'test@email.com';

        const homePage = new ShopHomePage(page);
        await homePage.open();
        await homePage.assertOnPage();
        await homePage.scrollToSubscriptionSection();
        await homePage.enterEmail(email);
        await homePage.clickSubscribeButton();
        await homePage.assertSuccessMessage();
        await homePage.assertEmailInputEmpty();
    });

    // TC-SHOP-010
    test(' Session: authenticated user is redirected away from the login page', async ({ authenticatedShopPage, user }) => {
        await label('Priority', 'P2');
        await epic('Auth');
        await feature('Session');
        await story('Redirect logged-in user');
        await severity(Severity.MINOR);

        const loginPage = new SignupLoginPage(authenticatedShopPage);
        await loginPage.goto();

        await authenticatedShopPage.waitForURL('/');

        const homePage = new ShopHomePage(authenticatedShopPage);
        await homePage.assertOnPage();
        await homePage.assertNavBarUsername(user.name);
    });
});
