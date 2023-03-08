"use client";
import React from 'react';
import {InputLabel, InputLabelProps, ToggleButton, ToggleButtonGroup} from "@mui/material";
import styles from './RepaymentFrequencyGroup.module.css';

export interface RepaymentFrequencyGroupProps {
    updateFrequencyCallback: (frequency: number) => void;
    /**
     * The label to display for the input
     */
    label: string;
    /**
     * (Optional) Properties to apply to the input label
     */
    InputLabelProps?: Partial<InputLabelProps>;
}

export const RepaymentFrequencyGroup = (props: RepaymentFrequencyGroupProps): JSX.Element => {
    const {updateFrequencyCallback, label, InputLabelProps} = props;
    const [frequency, setFrequency] = React.useState('Monthly');

    const handleChange = (event: React.MouseEvent<HTMLElement>, newFrequency: string) => {
        setFrequency(newFrequency);
    };

    return (
        <div
            className={styles['frequency-group__container']}
        >
            <InputLabel
                className={styles['label']}
                shrink={true}
                variant={'standard'}
                aria-label={label}
                {...InputLabelProps}
            >
                {label}
            </InputLabel>
            <ToggleButtonGroup
                value={frequency}
                exclusive
                onChange={handleChange}
                aria-label={'repayment frequency'}
                className={styles['frequency-group__button-group']}
            >
                <ToggleButton
                    value={'Monthly'}
                    onClick={() => updateFrequencyCallback(12)}
                    aria-label={'monthly frequency'}
                    className={styles['button']}
                >
                    Monthly
                </ToggleButton>
                <ToggleButton
                    value={'Fortnightly'}
                    onClick={() => updateFrequencyCallback(26)}
                    aria-label={'fortnightly frequency'}
                    className={styles['button']}
                >
                    Fortnightly
                </ToggleButton>
                <ToggleButton
                    value={'Weekly'}
                    onClick={() => updateFrequencyCallback(52)}
                    aria-label={'weekly frequency'}
                    className={styles['button']}
                >
                    Weekly
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};
