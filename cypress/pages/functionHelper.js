export const createIssue = (issueDescription, issueTitle) => {
    cy.get('[data-testid="modal:issue-create"]')
    .within(() => {
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Bug"]').click();
        cy.get(".ql-editor").type(issueDescription);
        cy.get('input[name="title"]').type(issueTitle);
        cy.get('[data-testid="select:userIds"]').click();
        cy.get('[data-testid="select-option:Lord Gaben"]').click();
        cy.get('button[type="submit"]').click();
    });
};

export const validateTime = (timeValue, remainingPartOfString, shouldBeVisible = true)=> {
    if (shouldBeVisible) {
        cy.contains(`${timeValue}${remainingPartOfString}`).should('be.visible');
    } else {
        cy.contains(`${timeValue}${remainingPartOfString}`).should('not.exist');
    }
}

export const openTimeTrackingAndChangeLoggedTime = (timeTrackingModal, timeTrackingButton, inputFieldTime, loggedTime, remainingTime, shouldClearTime = false)=> {
    cy.get(timeTrackingButton).click();
    cy.get(timeTrackingModal).should('be.visible')
        .within(() => {
            if (shouldClearTime) {
                cy.get(inputFieldTime).eq(0).clear();
                cy.get(inputFieldTime).eq(1).clear();
            } else {
                cy.get(inputFieldTime).eq(0).type(loggedTime);
                cy.get(inputFieldTime).eq(1).type(remainingTime);
            }

            cy.contains('button', 'Done').click();
        });

    cy.get(timeTrackingModal).should('not.exist');
}

export const validateNoTimeLogged = (shouldShowNoTimeLogged   = false)=> {
    if (shouldShowNoTimeLogged) {
        cy.contains('No time logged').should('be.visible');
    } else {
        cy.contains('No time logged').should('not.exist');
    }
}

