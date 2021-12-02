const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

Given(/^I logged in$/, () => {
  cy.visit('http://localhost:8080/#/login');
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

Given(/^I am in the dashboard$/, () => {
    cy.intercept('POST', '/dashboard', {
        statusCode: 201,
        body: {
          token: 'i837498qkjhdaada',
          welcome: 'Welcome to the dashboard UserToken[i837498qkjhdaada]',
        },
      }).as("validationIntercept");
    cy.intercept('Get', '/dashboard', {
        statusCode: 201,
        body: {
          
        },
    }).as("gatherCases")
      cy.visit('http://localhost:8080/#/dashboard');
      cy.wait("@validationIntercept");
      cy.wait("@gatherCases");
      cy.url().should('includes', '/dashboard');
      cy.contains('Welcome');
});

Then (/^I should see a logout button$/, () => {
    cy.contains("Log out");
});

When (/^I click on the logout button$/, () => {
    cy.intercept("POST", "/dashboard", (req) => {
          req.reply(201);
      }).as("interceptLogout");
    cy.get("[data-testid=logoutBtn").click();
    cy.wait('@interceptLogout');
});

Then(/^I should not see my welcome page anymore$/, () => {
    cy.contains('Login')
});

