"use client";
import React from 'react';
import styles from './InputWithSlide.module.css';
import {Slider} from "@mui/material";
import InputWithLabel from './InputWithLabel'
import {PersonalLoanCalcKeys, PersonalLoanCalcs} from "@/app/webui/types/PersonalLoan";

export interface InputWithSlideProps {
    min: number;
    max: number;
    label: string;
    propertyName: PersonalLoanCalcKeys;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    showLabels?: boolean;
    step?: number;
    onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onSliderChange: (event: Event, newValue: number | number[]) => void;
    calcs: PersonalLoanCalcs;
    formatOutput?: (input: string) => string;
}

export const InputWithSlide = (props: InputWithSlideProps): JSX.Element => {
    const {
        min,
        max,
        label,
        startAdornment,
        endAdornment,
        showLabels = false,
        step = 1,
        onInputChange,
        onSliderChange,
        calcs,
        propertyName,
        formatOutput
    } = props;

    const value = calcs[propertyName] === '0' ? '' : calcs[propertyName];

    const marks = [
        {
            value: min,
            label: showLabels ? min : undefined
        },
        {
            value: max,
            label: showLabels ? max : undefined
        },
    ];

    return (
        <div className={styles['container']}>
            <InputWithLabel
                id={`${label}-outlined-adornment`}
                startAdornment={startAdornment}
                endAdornment={endAdornment}
                label={label}
                value={formatOutput ? formatOutput(value) : value}
                onChange={onInputChange}
                className={styles['input']}
                name={propertyName}
            />
            <Slider
                min={min}
                max={max}
                step={step}
                value={!!value ? Number(value) : min}
                onChange={onSliderChange}
                className={styles['slider']}
                marks={marks}
            />
        </div>
    );
};
