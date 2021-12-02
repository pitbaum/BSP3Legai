Feature: Logging into the website

  Background:
    Given I am in the home
    And I go to the login page

  @main @auth
  Scenario: login with incorrect credential
    Given I enter incorrect credentials
    When I click on login button
    Then I should see an error message

  @main @auth
  Scenario: login with valid credential
    Given I enter valid credentials
    When I click on login button
    Then I should validate the session key for authetication