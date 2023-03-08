import React from 'react';
import { InputWithLabel } from './InputWithLabel';
import { render, screen } from '@testing-library/react';

interface TextFieldTestComponentProps {

}

const TextFieldTestComponent = (): JSX.Element => {
    return (
        <InputWithLabel/>
    )
}

describe('<TextField/>', () => {
    describe('Initialisation', () => {
        test('should', () => {
            render(<TextFieldTestComponent/>);
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
