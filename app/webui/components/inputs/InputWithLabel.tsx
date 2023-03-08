"use client";
import React from 'react';
import styles from './InputWithLabel.module.css';
import {
    FormControl,
    FormControlProps,
    InputLabel,
    InputLabelProps,
    OutlinedInput,
    OutlinedInputProps
} from "@mui/material";

/**
 * API definition for the {@link InputWithLabel component}
 */
export interface InputWithLabelProps extends Partial<OutlinedInputProps> {
    /**
     * The identifier to use for the label and input
     */
    id: string;
    /**
     * The label to display for the input
     */
    label: string;
    /**
     * (Optional) Determines if the the field should be shown as optional by appending (Optional) to the label.
     * If true, the value of this field will only be enforced if the 'required' flag is set to false.
     */
    showAsOptional?: boolean;
    /**
     * (Optional) Properties to apply to the form control
     */
    formControlProps?: Partial<FormControlProps>;
    /**
     * (Optional) Properties to apply to the outlined input
     */
    InputProps?: Partial<OutlinedInputProps>;
    /**
     * (Optional) Properties to apply to the input label
     */
    InputLabelProps?: Partial<InputLabelProps>;
    /**
     * (Optional) Boolean flag representing if a label should be visible
     */
    hiddenLabel?: boolean;
}
/**
 * Displays an input field with a label and optional helper text. The label may be hidden by setting the
 * 'hidden' property on the inputLabelProps.
 * @param props the text field properties
 * @param ref the forward ref applied to the OutlinedInput component. Enables use of mui Tooltip as direct parent.
 * @constructor
 */
export const InputWithLabel = React.forwardRef(
    (props: InputWithLabelProps, ref): JSX.Element => {
        const {
            id,
            className,
            error,
            disabled,
            label,
            hiddenLabel,
            showAsOptional,
            formControlProps,
            inputProps,
            fullWidth,
            InputLabelProps,
            InputProps,
            ...rest
        } = props;

        return (
            <div className={styles['text-field__container']}>
                {!hiddenLabel && (
                    <InputLabel
                        htmlFor={`input-${id}`}
                        className={styles['label']}
                        error={error}
                        disabled={disabled}
                        shrink={true}
                        variant={'standard'}
                        {...InputLabelProps}
                    >
                        {label}
                    </InputLabel>
                )}
                <OutlinedInput
                    id={`input-${id}`}
                    error={error}
                    disabled={disabled}
                    inputProps={{ 'aria-label': label, ...inputProps }}
                    fullWidth={fullWidth}
                    size={'medium'}
                    ref={ref}
                    {...InputProps}
                    {...rest}
                />
            </div>
        );
    }
);

InputWithLabel.displayName = 'InputWithLabel';
export default InputWithLabel;
