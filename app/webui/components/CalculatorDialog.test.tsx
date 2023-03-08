import React from 'react';
import { CalculatorDialog } from './CalculatorDialog';
import { render, screen } from '@testing-library/react';

interface CalculatorDialogTestComponentProps {

}

const CalculatorDialogTestComponent = (): JSX.Element => {
    return (
        <CalculatorDialog/>
    )
}

describe('<CalculatorDialog/>', () => {
    describe('Initialisation', () => {
        test('should', () => {
            render(<CalculatorDialogTestComponent/>);
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
