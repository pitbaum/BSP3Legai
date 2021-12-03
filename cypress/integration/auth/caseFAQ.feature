Feature: Anwsering questions
    Background:
        Given I log in
        Given I am in the dashboard
        When I click on the newCase button
        Then I should see a question and multiple choice fields
        
    Scenario: Anwser and submit all questions
        When I tick and submit my anwser
        Then I should see the next question and a summary of the anwser progress
        When I anwsered all the questions
        Then I should see a validation Message
        Then I should be redirected to the dashboard
        When I am in the Dashboard I should see the newly created document