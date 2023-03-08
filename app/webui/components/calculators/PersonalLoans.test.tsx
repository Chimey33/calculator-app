import React from 'react';
import { PersonalLoans } from './PersonalLoans';
import { render, screen } from '@testing-library/react';

interface PersonalLoansTestComponentProps {

}

const PersonalLoansTestComponent = (): JSX.Element => {
    return (
        <PersonalLoans/>
    )
}

describe('<PersonalLoans/>', () => {
    describe('Initialisation', () => {
        test('should', () => {
            render(<PersonalLoansTestComponent/>);
        });
    });

    describe('Loading states', () => {
        test('should', () => {

        });
    });

    describe('User actions', () => {
        test('should', () => {

        });
    });

    describe('Error handling', () => {
        test('should', () => {

        });
    });

    describe('Helper functions', () => {
        test('should', () => {

        });
    });
});
