Feature: Anwsering questions and add a case to the dashboard
    Background:
        Given I log in
        When I am in the dashboard
        Then create a new case

    Scenario: Anwser some questions and then leave
        When I anwsered all the questions
        Then I should be redirected to the dashboard
        Then I should see the case number incremented
        Then I should see a new case in the case list
