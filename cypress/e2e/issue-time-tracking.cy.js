import {createIssue, validateTime, openTimeTrackingAndChangeLoggedTime, validateNoTimeLogged } from '../pages/functionHelper';
import {issueCreatedConfirmation, issueDescription, issueTitle} from '../constants';
import {backLogList, inputFieldTime, timeTrackingModal, timeTrackingButton} from '../pages/selectors';

const estimatedTime = '10';
const estimatedTimeUpdated = '20';
const loggedTime = '2';
const remainingTime = '5';
const loggedTimeUpdated = '3';
const remainingTimeUpdated = '4';

const estimatedTimeExpectedText = 'h estimated';
const loggedTimeExpectedText = 'h logged';
const remainingTimeExpectedText = 'h remaining';

const shouldShowNoTimeLogged = true;
const shouldNotShowEstimatedTime = false;

describe('Time-tracking functionality tests of the issue', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');

            // Create a issue
            createIssue(issueDescription,issueTitle)
            cy.contains(issueCreatedConfirmation).should('be.visible');
            cy.get(backLogList).should('be.visible').contains(issueTitle).click();
        });
    });

    it('Time Estimation Functionality: perform add, update and remove estimated time in the issue', () => {

        validateNoTimeLogged(shouldShowNoTimeLogged);
        cy.get(inputFieldTime).type(estimatedTime);
        cy.get(inputFieldTime).should('have.value', estimatedTime);
        validateTime(estimatedTime, estimatedTimeExpectedText);

        cy.get(inputFieldTime).clear().type(estimatedTimeUpdated);
        cy.get(inputFieldTime).should('have.value', estimatedTimeUpdated);
        validateTime(estimatedTimeUpdated, estimatedTimeExpectedText);

        cy.get(inputFieldTime).click().clear();
        validateNoTimeLogged(shouldShowNoTimeLogged);
    });

    it('Time logging functionality: add and remove logged time values', () => {
        const shouldClearTime = true;

        cy.get(inputFieldTime).type(estimatedTime);
        cy.get(inputFieldTime).should('have.value', estimatedTime);
        validateTime(estimatedTime, estimatedTimeExpectedText);

        openTimeTrackingAndChangeLoggedTime(timeTrackingModal, timeTrackingButton, inputFieldTime, loggedTime, remainingTime);

        validateTime(loggedTime, loggedTimeExpectedText);
        validateTime(remainingTime, remainingTimeExpectedText);
        validateTime(estimatedTime, estimatedTimeExpectedText, shouldNotShowEstimatedTime);
        validateNoTimeLogged();
        openTimeTrackingAndChangeLoggedTime(timeTrackingModal, timeTrackingButton,inputFieldTime, loggedTimeUpdated, remainingTimeUpdated);

        validateTime(loggedTimeUpdated, loggedTimeExpectedText);
        validateTime(remainingTimeUpdated, remainingTimeExpectedText);
        validateTime(estimatedTime, estimatedTimeExpectedText, shouldNotShowEstimatedTime);
        validateNoTimeLogged();

        openTimeTrackingAndChangeLoggedTime(timeTrackingModal, timeTrackingButton,inputFieldTime, loggedTime, remainingTime, shouldClearTime);

        validateTime(loggedTime, loggedTimeExpectedText, shouldNotShowEstimatedTime);
        validateTime(remainingTime, remainingTimeExpectedText, shouldNotShowEstimatedTime);
        validateTime(estimatedTime, estimatedTimeExpectedText);
        validateNoTimeLogged(shouldShowNoTimeLogged);
    });
});
