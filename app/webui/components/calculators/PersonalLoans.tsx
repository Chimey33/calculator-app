"use client";
import React, {useState} from 'react';
import styles from './PersonalLoans.module.css';
import {InputWithSlide} from "@/app/webui/components/inputs/InputWithSlide";
import {RepaymentFrequencyGroup} from "@/app/webui/components/inputs/RepaymentFrequencyGroup";
import {Button, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import {Big} from 'big.js'

const ZERO = new Big(0);
const ONE = new Big(1);

/**
 * Returns the monthly interest rate
 * @param interest the interest rate applied to the lan
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 */
const getMonthlyInterest = (interest: Big, frequency: Big) => {
    // (interest / 100) * number of payments per year
    const convertedRate = interest.div(new Big(100));
    return convertedRate.div(frequency);
}


/**
 * Returns the total number of pay periods for the life of the loan
 * @param term the number of years the loan runs for
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 */
const getTotalPayPeriod = (term: Big, frequency: Big) => {
    // years * number of payments per year
    return term.mul(frequency);
}

/**
 * Returns the amount of interest paid on a portion of the loan
 * @param principle the outstanding loan amount
 * @param interest the interest rate applied to the loan
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 */
const interestPaid = (principle: Big, interest: Big, frequency: Big): Big => {
    // total amount * monthly interest rate (rate / 12)
    const annualRate = getMonthlyInterest(interest, frequency)
    return principle.mul(annualRate)
}

/**
 * Returns the figure to subtract from the periodic payment
 * @param balloonPayment the amount used for the final balloon payment
 * @param monthlyInterestRate the monthly interest rate
 * @param totalPayPeriods the total number of pay periods for the life of the loan
 *
 *  iB / ((1 + i) ^n+1) - (1 + i)
 *  i = monthly interest rate
 *  n = the total pay periods
 *  B = the balloon payment amount
 */
const calculateBalloonPayment = (balloonPayment: Big, monthlyInterestRate: Big, totalPayPeriods: Big) => {
    if(balloonPayment.round(2).lte(ZERO)) return ZERO;
    // 1 + i
    const oneAndRate = ONE.add(monthlyInterestRate);
    // iB
    const numerator = monthlyInterestRate.mul(balloonPayment);
    // ((1 + i) ^n+1) - (1 + i)
    const denominator = oneAndRate.pow(ONE.add(totalPayPeriods).toNumber()).minus(oneAndRate);
    return numerator.div(denominator);
}

/**
 *  Returns the repayment amount
 *  Loan Amount *  [ i * ((1 + i) ^n) / ((1 + i) ^n) - 1 }
 *  i = monthly interest payment
 *  n = number of payments
 *
 * @param principle the outstanding loan amount
 * @param interest the interest rate applied to the loan
 * @param term the number of years the loan runs for
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 * @param balloon
 */
const calculatePeriodicPayment = (principle: Big, interest: Big, term: Big, frequency: Big, balloon: Big) => {
    const monthlyInterestRate = getMonthlyInterest(interest, frequency);
    const totalPayPeriods = getTotalPayPeriod(term, frequency);
    const balloonPayment = calculateBalloonPayment(balloon, monthlyInterestRate, totalPayPeriods);

    // 1 + i
    const oneAndRate = ONE.add(monthlyInterestRate);
    // (1 + i) ^n)
    const onePlusRateByPayPeriod = oneAndRate.pow(totalPayPeriods.toNumber());
    // i * ((1 + i) ^n)
    const numerator = monthlyInterestRate.mul(onePlusRateByPayPeriod);
    // ((1 + i) ^n) - 1
    const denominator = onePlusRateByPayPeriod.minus(ONE);
    const total = numerator.div(denominator);

    return principle.mul(total).minus(balloonPayment)
}

export interface AmortisedValues {
    balance: string;
    payment: string;
    interestPayment: string;
    principalAmount: string;
}

/**
 * Returns the outstanding loan if the remaining balance is <= monthly payment or balloon payment
 * else return the monthly repayment amount
 * @param outstandingLoan the amount remaining on the loan
 * @param monthlyPayment the balloon amount
 * @param balloon the amount of the balloon payment
 */
const calculateMonthlyPayment = (outstandingLoan: Big, monthlyPayment: Big, balloon: Big) => {
     return (outstandingLoan.lte(monthlyPayment) || outstandingLoan.lte(balloon)) ? outstandingLoan : monthlyPayment;
}

/**
 * Returns the remaining balance in a payment cycle
 * @param outstandingLoan the amount remaining on the loan
 * @param principal the amount of principal to be paid on the loan
 * @param balloon the amount of the balloon payment
 */
const calculateRemainingBalance = (outstandingLoan: Big, principal: Big, balloon: Big) => {
    return outstandingLoan.round(2).lte(balloon) ? outstandingLoan.minus(outstandingLoan) : outstandingLoan.minus(principal);
}

/**
 * Recursive function that populates our payment breakdown array
 * @param monthlyPayment the monthly repayment value
 * @param outstandingLoan the amount remaining on the loan
 * @param interest the interest rate applied to the loan
 * @param term the number of years the loan runs for
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 * @param frequency the amount of principal to be paid on the loan
 * @param balloon the amount of the balloon payment
 * @param paymentBreakdown the array to populate
 */
const populateAmortisationArray = (monthlyPayment: Big, outstandingLoan: Big, interest: Big, term: Big, frequency: Big, balloon: Big, paymentBreakdown: AmortisedValues[]) => {
    const interestValue = interestPaid(outstandingLoan, interest, frequency);
    if (outstandingLoan.round(2).lte(ZERO)) return;
    const monPay = calculateMonthlyPayment(outstandingLoan, monthlyPayment, balloon)
    const principal = monthlyPayment.minus(interestValue);
    const balanceRemaining = calculateRemainingBalance(outstandingLoan, principal, balloon);

    paymentBreakdown.push({
        balance: balanceRemaining.toFixed(2),
        payment: monPay.toFixed(2),
        interestPayment: interestValue.toFixed(2),
        principalAmount: principal.toFixed(2)
    });

    populateAmortisationArray(monPay, balanceRemaining, interest, term, frequency, balloon, paymentBreakdown);
}

/**
 *
 * @param principle the outstanding loan amount
 * @param interest the interest rate applied to the loan
 * @param term the number of years the loan runs for
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 * @param balloon the amount of the balloon payment
 */
const getAmortisedValues = (principle: Big, interest: Big, term: Big, frequency: Big, balloon: Big): AmortisedValues[] => {
    const paymentBreakdown: AmortisedValues[] = [];
    const paymentAmount = calculatePeriodicPayment(principle, interest, term, frequency, balloon);
    populateAmortisationArray(paymentAmount, principle, interest, term, frequency, balloon, paymentBreakdown);
    return paymentBreakdown;
}


export interface PersonalLoanCalcs {
    loanAmount: string;
    loanTerm: string;
    paymentFrequency: string;
    interestRate: string;
    balloon: string;

}

const removeFormatting =  (value: string) => {
    return value.replace(/[^0-9.]/g, '');
}

const getValue = (min: number, max: number, newValue?: string): string => {

    if(!newValue) return '';
    if(Number(newValue) < min) return min.toString();
    if(Number(newValue) > max) return max.toString();

    return newValue;
}

const checkThresholds = (min: number, max: number, newValue: number) => {
    return newValue >= min && newValue <= max;
}

export const PersonalLoans = (): JSX.Element => {
    const [amount, setAmount] = useState<AmortisedValues[]>([])
    const [calc, setCalcs] = useState<PersonalLoanCalcs>({
        loanAmount: '0',
        loanTerm: '0',
        paymentFrequency: '12',
        interestRate: '0',
        balloon: '0'
    });

    const onInputChange = (min: number, max: number) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {name, value} = event.target;
        const valueWithCharactersRemoved = removeFormatting(value)
        //const newValue = !!value && checkThresholds(min, max, +valueWithCharactersRemoved) ? valueWithCharactersRemoved : '';
        setCalcs(prev => {
            return {...prev, [name]: getValue(min, max, removeFormatting(value))}
        })
    }

    const handleSliderChange = (propertyName: string) => (event: Event, newValue: number | number[]) => {
        setCalcs(prev => {
            return {...prev, [propertyName]: String(newValue)}
        });
    };

    const formatThousands = (input: string) => {
        if (input === '' || input === '0') return '';
        return Number(input).toLocaleString('en-US')
    }

    const calculate = () => {
        const {loanAmount, loanTerm, interestRate, paymentFrequency, balloon} = calc;
        const values = getAmortisedValues(new Big(loanAmount.replace(/[^0-9]/g, '')), new Big(interestRate), new Big(loanTerm), new Big(paymentFrequency), new Big(balloon))
        //console.log(calculateBalloonPayment(new Big(4000), new Big(loanAmount.replace(/[^0-9.]/g, '')), new Big(interestRate), new Big(loanTerm), new Big(paymentFrequency)).toString())
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
                max={40}
                endAdornment={<InputAdornment position={'start'}>Years</InputAdornment>}
                onInputChange={onInputChange(1, 30)}
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
                />
            </div>
            <div>
                <Button onClick={calculate}>Calculate</Button>
                {!!amount.length &&
                <Table className={styles['table']}>
                    <TableHead>
                        <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Interest</TableCell>
                        <TableCell>Principle</TableCell>
                        <TableCell>Balance remaining</TableCell>
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
                                <TableCell>${loanValue.balance}</TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
                }
            </div>
        </div>
    );
};
