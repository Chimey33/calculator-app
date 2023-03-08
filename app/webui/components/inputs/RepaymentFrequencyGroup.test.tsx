import React from 'react';
import { RepaymentFrequencyGroup } from './RepaymentFrequencyGroup';
import { render, screen } from '@testing-library/react';

interface RepaymentFrequencyGroupTestComponentProps {

}

const RepaymentFrequencyGroupTestComponent = (): JSX.Element => {
    return (
        <RepaymentFrequencyGroup/>
    )
}

describe('<RepaymentFrequencyGroup/>', () => {
    describe('Initialisation', () => {
        test('should', () => {
            render(<RepaymentFrequencyGroupTestComponent/>);
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
