const issueTitle = 'This is an issue of type: Task.';

describe('Issue deletion', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            cy.contains(issueTitle).click();
        });
    });


    it('Issue should be deleted successfully', () => {
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('[data-testid="icon:trash"]').click()
        })

        cy.get('[data-testid="modal:confirm"]').should('be.visible');
        cy.get('[data-testid="modal:confirm"]').within(() => {
            cy.get('button').eq(0).contains('button', 'Delete issue').click()
        })

        cy.get('[data-testid="modal:confirm"]').should('not.exist')
        cy.reload()

        cy.get('[data-testid="board-list:backlog').should('be.visible');
        cy.get('[data-testid="board-list:backlog"]').within(() => {
            cy.contains(issueTitle).should('not.exist');
            cy.get('[data-testid="list-issue"]').should('have.length', '3')
                .and('not.contain', 'This is an issue of type: Task.');
        });

    })

    it.only('Issue should be cancel successfully', () => {
        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('[data-testid="icon:trash"]').click()
        })

        cy.get('[data-testid="modal:confirm"]').within(() => {
            cy.get('button').eq(1).contains('button', 'Cancel').click()
        })

        cy.get('[data-testid="modal:confirm"]').should('not.exist')

        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('[data-testid="icon:close"]').eq(0).click()
        })

        cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '4')
                .contains('This is an issue of type: Task.')
        })

    })


})
