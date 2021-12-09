const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

let savedCases = []
savedCases.push({caseID: "A01"}, {caseID: "B03"},)
Given(/^I log in$/, () => {
  cy.visit("http://localhost:8080/#/login");
    cy.url().should('includes', '/login');
    cy.intercept('POST', '/login', {
        statusCode: 201,
        body: {
          token: '8zwa76gtd87aotghz987uwaztdgho9p87zh',
        },
      }).as("intercept");
    cy.get("[data-testid=loginBtn").click();
    cy.wait("@intercept");
});

When(/^I am in the dashboard$/, () => {
  cy.intercept('POST', '/dashboard', {
    statusCode: 201,
    body: {
      token: 'i837498qkjhdaada',
      welcome: 'Welcome to the dashboard UserToken[i837498qkjhdaada]',
    },
    }).as("validationIntercept");
    cy.intercept('Get', '/dashboard', { 
      //backend will have saved the cases with some ID
      //and given it a dynamic route to the page where the case can be worked upon.
      //so sending the ID of the cases is enough to access them.
      statusCode: 201,
      body: {
        cases: savedCases
      },
    }).as("gatherCases")
  cy.visit('http://localhost:8080/#/dashboard');
  cy.wait("@validationIntercept");
  cy.wait("@gatherCases");
  cy.url().should('includes', '/dashboard');
  cy.contains('Welcome');
});

Then(/^create a new case$/, () => {
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
    cy.url().should('includes', '/casefaq');
});


When(/^I anwsered all the questions$/, () => {
    cy.get('[type="radio"]').first().check();
    cy.intercept('Get', '/casefaq', {
      statusCode: 201,
      body: {
        question: "NULL",
        currentAnwsers: []
        },
    }).as("allAnwsered");
    cy.get("[data-testid=submitBtn").click();
    cy.wait("@allAnwsered");
    cy.contains("All questions anwsered, Please check your anwsers and press submit to finish");
});


Then(/^I should be redirected to the dashboard$/, () => {
  //could omit the override on the dashboard post and get, but somehow caused an error.
    cy.intercept("POST", "/casefaq", (req) => {
        req.reply(201);
    }).as("sentLastVerificationCopy");

    cy.intercept('POST', '/dashboard', {
      statusCode: 201,
      body: {
        token: 'i837498qkjhdaada',
        welcome: 'Welcome to the dashboard UserToken[i837498qkjhdaada]',
      },
    }).as("validationIntercept");

  cy.intercept('Get', '/dashboard', { 
      //backend will have saved the cases with some ID
      //and given it a dynamic route to the page where the case can be worked upon.
      //so sending the ID of the cases is enough to access them.
      statusCode: 201,
      body: {
        cases: savedCases
      },
  }).as("gatherCases");
    cy.get("[data-testid=submitBtn]").click();
    //push to the cases storage
    savedCases.push({caseID: "C03"})
    cy.wait("@sentLastVerificationCopy");
    cy.url().should('includes', '/dashboard');
    cy.wait("@validationIntercept");
    cy.wait("@gatherCases");
    cy.url().should('includes', '/dashboard');
    cy.contains('Welcome');
});


Then(/^I should see the case number incremented$/, () => {
  cy.contains("Cases: 3");
});

Then(/^I should see a new case in the case list$/, () => {
    cy.contains("C03");
    cy.contains("caseID");
    cy.contains("caseID: A01");
});