import React from 'react';
import { InputWithSlide } from './InputWithSlide';
import { render, screen } from '@testing-library/react';

interface InputWithSlideTestComponentProps {

}

const InputWithSlideTestComponent = (): JSX.Element => {
    return (
        <InputWithSlide/>
    )
}

describe('<InputWithSlide/>', () => {
    describe('Initialisation', () => {
        test('should', () => {
            render(<InputWithSlideTestComponent/>);
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
