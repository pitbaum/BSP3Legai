const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");
let valid;

Given(/^I am in the home$/, () => {
  cy.visit("http://localhost:8080/#/");
});

Given(/^I go to register page$/, () => {
  cy.get('a[href*="register"]').click();
  cy.url().should('includes', '/register');
});

Given(/^I enter valid credentials$/, () => {
  cy.get("[data-testid=email]").type("good@email.com");
  cy.get("[data-testid=password]").type("goodpassword");
  valid = true;
});

Given(/^I enter incorrect credentials$/, () => {
  cy.get("[data-testid=email]").type("registered@email.com");
  cy.get("[data-testid=password]").type("badpassword");
  valid = false;
});

When(/^I click on submit button$/, () => {
  cy.intercept("POST", "/register", (req) => {
    if (valid) {
      req.reply(201);
    } else {
      req.reply(400);
    }
  }).as("intercept");
  cy.get("[data-testid=registerBtn").click();
  cy.wait("@intercept");
});


Then(/^I should see successfully registered$/, () => {
  cy.contains('successfully registered');
});

Then(/^I should see an error message$/, () => {
  cy.contains('Error');
});