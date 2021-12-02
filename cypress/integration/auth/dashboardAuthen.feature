Feature: Acces restriction of the dashboard

    Scenario: Not logged in
        Given I didnt log in
        When I visit the dashboard
        Then I should get redirected to the login

    Scenario: logged in
        Given I logged in
        Then I should get to the dashboard
        Given I am in the dashboard
        Then I should see the dashboards contents
