Feature: Logging out of the website

  Background:
    Given I logged in
    Given I am in the dashboard
    Then I should see a logout button

  @main @auth
  Scenario: loging out of the client
    When I click on the logout button
    Then I should not see my welcome page anymore