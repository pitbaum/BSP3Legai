Feature: Registering into the website

  Background:
    Given I am in the home
    And I go to register page

  @main @auth
  Scenario: register with incorrect credential
    Given I enter incorrect credentials
    When I click on submit button
    Then I should see an error message

  @main @auth
  Scenario: register with valid credential
    Given I enter valid credentials
    When I click on submit button
    Then I should see successfully registered