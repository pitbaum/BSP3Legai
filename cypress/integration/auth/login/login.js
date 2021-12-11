const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");
let valid;
Given(/^I am in the home$/, () => {
    cy.visit("http://localhost:8080/#/");
});
  
Given(/^I go to the login page$/, () => {
    cy.get('a[href*="login"]').click();
    cy.url().should('includes', '/login');
});
  
Given(/^I enter valid credentials$/, () => {
    cy.get("[data-testid=email]").type("good@email.com");
    cy.get("[data-testid=password]").type("goodpassword");
    valid = true;
});
  
Given(/^I enter incorrect credentials$/, () => {
    cy.get("[data-testid=email]").type("bad@email.com");
    cy.get("[data-testid=password]").type("badpassword");
    valid = false;
});
  
When(/^I click on login button$/, () => {
    if (valid) {
        cy.intercept('POST', '/login', {
          statusCode: 201,
          body: {
            token: '8zwa76gtd87aotghz987uwaztdgho9p87zh',
          },
        }).as("intercept");
      }
      else {
        cy.intercept("POST", "/login", (req) => {
          req.reply(400);
        }).as("errintercept");
      }
      cy.get("[data-testid=loginBtn").click();
      if(valid)
      cy.wait("@intercept");
      else
      cy.wait("@errintercept")
});
  
  
Then(/^I should validate the session key for authetication$/, () => {
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

  
Then(/^I should see an error message$/, () => {
    cy.contains('Error');
});
