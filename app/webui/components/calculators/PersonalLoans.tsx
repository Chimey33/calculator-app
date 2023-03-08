"use client";
import React, {useState} from 'react';
import styles from './PersonalLoans.module.css';
import {InputWithSlide} from "@/app/webui/components/inputs/InputWithSlide";
import {RepaymentFrequencyGroup} from "@/app/webui/components/inputs/RepaymentFrequencyGroup";
import {Button, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Big} from 'big.js'
import {getAmortisedValues, getValue, removeFormatting,} from "@/app/webui/services/personalLoanCalculationService";
import {AmortisedTableValues, PersonalLoanCalcs} from "@/app/webui/types/PersonalLoan";

/**
 * Helper function used to format dollar values correctly
 * @param input the string input to format
 */
const formatThousands = (input: string) => {
    if (input === '' || input === '0') return '';
    return Number(input).toLocaleString('en-US')
}

const hasValueOverZero = (value: string) => {
    return value !== '' && Number(value) > 0;
}

const canPerformCalculate = (values: PersonalLoanCalcs) => {
    const {loanAmount, loanTerm, interestRate} = values;
    return !(hasValueOverZero(loanAmount) && hasValueOverZero(loanTerm) && hasValueOverZero(interestRate));
}

/**
 * Component used to take user input and display output for personal loan calculations
 */
export const PersonalLoans = (): JSX.Element => {
    const [amount, setAmount] = useState<AmortisedTableValues[]>([])
    const [calc, setCalcs] = useState<PersonalLoanCalcs>({
        loanAmount: '0',
        loanTerm: '1',
        paymentFrequency: '12',
        interestRate: '0',
        balloon: '0'
    });

    /**
     * Callback used to update state when user enters new input
     * @param min the minimum amount for that input
     * @param max the maximum amount for that input
     */
    const onInputChange = (min: number, max: number) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {name, value} = event.target;
        setCalcs(prev => {
            return {...prev, [name]: getValue(min, max, removeFormatting(value))}
        })
    }

    /**
     * Callback used to update state when user changes input via the slide
     * @param propertyName the name of the property to update
     */
    const handleSliderChange = (propertyName: string) => (event: Event, newValue: number | number[]) => {
        setCalcs(prev => {
            return {...prev, [propertyName]: String(newValue)}
        });
    };

    /**
     * Callback invoked when user wants to calculate loan amortisation values
     */
    const calculate = () => {
        const {loanAmount, loanTerm, interestRate, paymentFrequency, balloon} = calc;
        const values = getAmortisedValues(new Big(loanAmount), new Big(interestRate), new Big(loanTerm), new Big(paymentFrequency), new Big(balloon))
        setAmount(values)
    }

    return (
        <div className={styles['personal-loan__container']}>
            <div className={styles['input__container']}>
                <InputWithSlide
                    label={'Loan amount'}
                    propertyName={'loanAmount'}
                    min={0}
                    max={100000}
                    step={1000}
                    startAdornment={<InputAdornment position={'start'}>$</InputAdornment>}
                    onInputChange={onInputChange(0, 100000)}
                    onSliderChange={handleSliderChange('loanAmount')}
                    calcs={calc}
                    formatOutput={formatThousands}
                />
                <InputWithSlide
                    label={'Loan term'}
                    propertyName={'loanTerm'}
                    min={1}
                    max={7}
                    endAdornment={<InputAdornment position={'start'}>Years</InputAdornment>}
                    onInputChange={onInputChange(1, 7)}
                    onSliderChange={handleSliderChange('loanTerm')}
                    calcs={calc}
                />
                <RepaymentFrequencyGroup
                    label={'Payment frequency'}
                    updateFrequencyCallback={(updatedValue) => setCalcs(prev => {
                        return {...prev, paymentFrequency: String(updatedValue)}
                    })}
                />
                <InputWithSlide
                    propertyName={'interestRate'}
                    label={'Interest rate'}
                    min={0}
                    max={15}
                    step={0.25}
                    endAdornment={<InputAdornment position={'start'}>%</InputAdornment>}
                    onInputChange={onInputChange(0, 15)}
                    onSliderChange={handleSliderChange('interestRate')}
                    calcs={calc}
                />
                    <InputWithSlide
                        propertyName={'balloon'}
                        label={'Balloon payment'}
                        min={0}
                        max={10000}
                        step={1000}
                        startAdornment={<InputAdornment position={'start'}>$</InputAdornment>}
                        onInputChange={onInputChange(0, 10000)}
                        onSliderChange={handleSliderChange('balloon')}
                        calcs={calc}
                        formatOutput={formatThousands}
                    />
                </div>
            <div>
                <Button disabled={canPerformCalculate(calc)} onClick={calculate} className={styles['calculate__button']}>Calculate</Button>
                <div className={styles['table__container']}>
                    {!!amount.length &&
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Period</TableCell>
                                    <TableCell>Payment</TableCell>
                                    <TableCell>Interest</TableCell>
                                    <TableCell>Principle</TableCell>
                                    <TableCell align={'right'}>Balance remaining</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {amount.map((loanValue, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{index}</TableCell>
                                            <TableCell>${loanValue.payment}</TableCell>
                                            <TableCell>${loanValue.interestPayment}</TableCell>
                                            <TableCell>${loanValue.principalAmount}</TableCell>
                                            <TableCell align={'right'}>${loanValue.balance}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    }
                </div>
            </div>
        </div>
    );
};
