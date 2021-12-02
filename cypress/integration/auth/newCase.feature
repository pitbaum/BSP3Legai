Feature: Create a New Case

    Background: Logged in
        Given I logged in
        And I am in the dashboard

    Scenario: NewCase
        When I click on the newCase button
        Then I should go to the caseFAQ page
        Then I should see a question and multiple choice fields