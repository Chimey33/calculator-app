import React from 'react';
import { WidgetCard } from './WidgetCard';
import { render, screen } from '@testing-library/react';

interface WidgetCardTestComponentProps {

}

const WidgetCardTestComponent = (): JSX.Element => {
    return (
        <WidgetCard/>
    )
}

describe('<WidgetCard/>', () => {
    describe('Initialisation', () => {
        test('should', () => {
            render(<WidgetCardTestComponent/>);
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
