const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

Given(/^I log in$/, () => {
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
    }).as("gatherCases")
      cy.visit('http://localhost:8080/#/dashboard');
      cy.wait("@validationIntercept");
      cy.wait("@gatherCases");
      cy.url().should('includes', '/dashboard');
      cy.contains('Welcome');
});

When(/^I click on the newCase button$/, () => {
    cy.intercept('Get', '/casefaq', {
        statusCode: 201,
        body: {
          question: "This is the 1st question",
          currentAnwsers: [{
              anwser: "possible anwser 1"
          },
          {
              anwser: "Just another choice"
          },
          {
              anwser: "this is already the 3rd anwser possibility"
          }]
        },
      }).as("interceptnewCase");
    cy.get("[data-testid=newCaseBtn").click();
    cy.wait('@interceptnewCase');
});

Then(/^I should see a question and multiple choice fields$/, () => {
    cy.url().should('includes', '/casefaq');
    cy.contains("This is the 1st question");
    cy.contains("Submit");
    cy.contains("anwser");
    cy.contains("possibility");
    cy.contains("choice");
});

When(/^I tick and submit my anwser$/, () => {
  cy.get('[type="radio"]').first().check();
  cy.intercept('Get', '/casefaq', {
    statusCode: 201,
    body: {
      question: "This is the 2nd question",
      currentAnwsers: [{
          anwser: "The case was made in the US"
      },
      {
          anwser: "The case was made in the EU"
      },
      {
          anwser: "Not sure"
      },
      {
          anwser: "The case wasnt yet formelly presented"
      }]
    },
  }).as("intercept2ndQ");
  cy.get("[data-testid=submitBtn").click();
  cy.wait("@intercept2ndQ");
});

Then(/^I should see the next question and a summary of the anwser progress$/, () => {
  cy.contains("This is the 2nd question");
  cy.contains("The case was made in the US");
  cy.contains("The case was made in the EU");
  cy.contains("Not sure");
  cy.contains("The case wasnt yet formelly presented");
  cy.contains("Previous Results:");
  cy.contains("Q: This is the 1st question A: possible anwser 1");
});

When(/^I anwsered all the questions$/, () => {
  cy.get('[type="radio"]').first().check();
  cy.intercept('Get', '/casefaq', {
    statusCode: 201,
    body: {
      question: "NULL",
      currentAnwsers: []
    },}).as("allAnwsered");
    cy.get("[data-testid=submitBtn").click();
    cy.wait("@allAnwsered");
});

Then(/^I should see a validation Message$/, () => {
  cy.contains("All questions anwsered, Please check your anwsers and press submit to finish");
});

Then(/^I should be redirected to the dashboard$/, () => {
  cy.intercept("POST", "/casefaq", (req) => {
      req.reply(201);
  }).as("sentLastVerificationCopy");
  cy.get("[data-testid=submitBtn]").click();
  cy.wait("@sentLastVerificationCopy");
  cy.url().should('includes', '/dashboard');
});