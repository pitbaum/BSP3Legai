const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

Given(/^I log in$/, () => {
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

When(/^I am in the dashboard$/, () => {
    cy.url().should('includes', '/dashboard');
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
    cy.intercept("POST", "/casefaq", (req) => {
        req.reply(201);
    }).as("sentLastVerificationCopy");
    cy.get("[data-testid=submitBtn]").click();
    cy.wait("@sentLastVerificationCopy");
    cy.url().should('includes', '/dashboard');
});


Then(/^I should see the case number incremented$/, () => {
    cy.contains("number of cases: 1");
});

Then(/^I should see a new case in the case list$/, () => {
    cy.contains("Case link:");
    cy.contains("case1");
});