const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

Given(/^I logged in$/, () => {
    cy.visit("http://localhost:8080/#/login");
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

When(/^I click on the newCase button$/, () => {
    cy.intercept('POST', '/login', {
        statusCode: 201,
        body: {
          question: "This is the 1st question",
          anwseredQuestions: [{
                question: "already anwsered 1",
                anwser: "anwser to already anwsered 1"
          },
          {
              question: "Second in a long line.",
              anwser: "yes but the line isnt that long."
          }]
        },
      }).as("interceptnewCase");
    cy.get("[data-testid=newCaseBtn").click();
    cy.wait('@interceptnewCase');
});

Then(/^I should go to the caseFAQ page$/, () => {
    cy.url().should('includes', '/casefaq');
});

Then(/^I should see a question and multiple choice fields$/, () => {
    cy.contains("Question:");
    cy.contains("Submit");
});