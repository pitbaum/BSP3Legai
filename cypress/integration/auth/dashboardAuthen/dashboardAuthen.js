const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

Given(/^I logged in$/, () => {
    cy.url().should('includes', '/login');
    cy.get("[data-testid=email]").type("good@email.com");
    cy.get("[data-testid=password]").type("goodpassword");
    cy.intercept('POST', '/login', {
        statusCode: 201,
        body: {
          token: '8zwa76gtd87aotghz987uwaztdgho9p87zh',
        },
      }).as("intercept");
    cy.get("[data-testid=loginBtn").click();
    cy.wait("@intercept");
  });

Then(/^I should get to the dashboard$/, () => {
    cy.intercept('POST', '/dashboard', {
        statusCode: 201,
        body: {
          token: 'i837498qkjhdaada',
          welcome: 'Welcome to the dashboard UserToken[i837498qkjhdaada]',
        },
      }).as("validationIntercept");
    cy.intercept('Get', '/dashboard', {
        statusCode: 201,
    }).as("gatherCases")
      cy.visit('http://localhost:8080/#/dashboard');
      cy.wait("@validationIntercept");
      cy.wait("@gatherCases");
      cy.url().should('includes', '/dashboard');
      cy.contains('Welcome');
});

Given(/^I am in the dashboard$/, () => {
    cy.url().should('includes', '/dashboard');
});


Then(/^I should see the dashboards contents$/, () => {
    cy.contains('Welcome');
    cy.contains('New Case');
    cy.contains('Cases:');
    cy.contains('Log out');
});

Given(/^I didnt log in$/, () => {
  cy.intercept("POST", "/dashboard", (req) => {
    req.reply(200);
  }).as("LoginValidation");
  cy.visit('http://localhost:8080/#/dashboard');
  cy.wait("@LoginValidation");
});


When(/^I visit the dashboard$/, () => {

});


Then(/^I should get redirected to the login$/, () => {
  cy.url().should('includes', '/login');
});