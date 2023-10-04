
//constant variables
const ticketDescription = 'Description for time tracking';
const ticketTitle = 'Title for time tracking';
const ticketCreatedConfirmation = 'Issue has been successfully created.';
const originalEstimation = 10;
const updatedEstimation = 20;
const remainingPartOfEstimatedString = 'h estimated';
const remainingPartOfHourString = 'h remaining';
const remainingTotalLogString = 'h logged';
const totalLoggedTime = 20;
const totalRemainingTime = 5;


//selectors function 
const getinputFieldTime = () => cy.get('input[placeholder="Number"]');
const getTimeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
const getTimeTrackingButton = () => cy.get('[data-testid="icon:stopwatch"]');
const notimeLoggedVisibility = () => cy.contains('No time logged');
const clickAnywhereOutside = () => cy.contains('Time Tracking').click()
const openCreatedIssue = () => cy.contains('Title for time tracking').click()

//function to create issue
const createIssue = () => {
    cy.get('[data-testid="modal:issue-create"]')
        .within(() => {
            cy.get('[data-testid="select:type"]').click();
            cy.get('[data-testid="select-option:Bug"]').click();
            cy.get(".ql-editor").type(ticketDescription);
            cy.get('input[name="title"]').type(ticketTitle);
            cy.get('[data-testid="select:userIds"]').click();
            cy.get('[data-testid="select-option:Lord Gaben"]').click();
            cy.get('button[type="submit"]').click();
        });
};

describe('Time-tracking functionality tests of the issue', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
            createIssue();
            cy.wait(1000);
            openCreatedIssue();

        });
    });

    it('Time Estimation Functionality: perform add, update and remove estimated time in the issue', () => {

        // add original estimate and validate
        notimeLoggedVisibility().should("be.visible");
        getinputFieldTime().type(originalEstimation);
        clickAnywhereOutside();
        getinputFieldTime().should('have.value', originalEstimation)
        cy.contains(`${originalEstimation}${remainingPartOfEstimatedString}`).should('be.visible');

        // update added estimation and validate
        getinputFieldTime().clear().type(updatedEstimation);
        clickAnywhereOutside();
        getinputFieldTime().should('have.value', updatedEstimation)
        cy.contains(`${updatedEstimation}${remainingPartOfEstimatedString}`).should('be.visible');

        // remove estimation and validate
        getinputFieldTime().clear();
        clickAnywhereOutside();
        getinputFieldTime().should('be.empty');
    });

    it('Time logging functionality: add and remove logged time values', () => {

        // add original estimate and validate
        notimeLoggedVisibility().should("be.visible");
        getinputFieldTime().type(originalEstimation);
        clickAnywhereOutside();
        getinputFieldTime().should('have.value', originalEstimation)
        cy.contains(`${originalEstimation}${remainingPartOfEstimatedString}`).should('be.visible');


        // log time values and validate
        openTimeTrackingAndChangeLoggedTime(false);
        cy.contains(`${totalRemainingTime}${remainingPartOfHourString}`).should('be.visible');
        cy.contains(`${totalLoggedTime}${remainingTotalLogString}`).should('be.visible');

        // remove logged time values and validate
        openTimeTrackingAndChangeLoggedTime(true);
        cy.contains(`${totalRemainingTime}${remainingPartOfHourString}`).should('not.exist');
        cy.contains(`${totalLoggedTime}${remainingTotalLogString}`).should('not.exist');
        notimeLoggedVisibility().should("be.visible");
        
    });

});

const openTimeTrackingAndChangeLoggedTime = (shouldClearTime) => {
    cy.wait(1000);
    getTimeTrackingButton().click();
    getTimeTrackingModal().should('be.visible')
        .within(() => {
            if (shouldClearTime) {
                getinputFieldTime().eq(0).clear();
                getinputFieldTime().eq(1).clear();
            } else {
                getinputFieldTime().eq(0).type(totalLoggedTime);
                getinputFieldTime().eq(1).type(totalRemainingTime);
            }

            cy.contains('button', 'Done').click();
        });

        getTimeTrackingModal().should('not.exist');

};
