import {Big} from "big.js";
import {AmortisedTableValues} from "@/app/webui/types/PersonalLoan";

const ZERO = new Big(0);
const ONE = new Big(1);

/**
 * Returns the monthly interest rate
 * @param interest the interest rate applied to the lan
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 */
export const getMonthlyInterest = (interest: Big, frequency: Big) => {
    // (interest / 100) * number of payments per year
    const convertedRate = interest.div(new Big(100));
    return convertedRate.div(frequency);
}

/**
 * Returns the total number of pay periods for the life of the loan
 * @param term the number of years the loan runs for
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 */
export const getTotalPayPeriod = (term: Big, frequency: Big) => {
    // years * number of payments per year
    return term.mul(frequency);
}

/**
 * Returns the amount of interest paid on a portion of the loan
 * @param principle the outstanding loan amount
 * @param interest the interest rate applied to the loan
 * @param frequency the frequency of the payments made per year (monthly, fortnightly, weekly)
 */
export const interestPaid = (principle: Big, interest: Big, frequency: Big): Big => {
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
export const calculatePeriodicPayment = (principle: Big, interest: Big, term: Big, frequency: Big, balloon: Big) => {
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

    return principle.mul(total).minus(balloonPayment);
}

/**
 * Returns the outstanding loan if the remaining balance is <= monthly payment or balloon payment
 * else return the monthly repayment amount
 * @param outstandingLoan the amount remaining on the loan
 * @param monthlyPayment the balloon amount
 * @param balloon the amount of the balloon payment
 */
export const calculateMonthlyPayment = (outstandingLoan: Big, monthlyPayment: Big, balloon: Big) => {
    return (outstandingLoan.lte(monthlyPayment) || outstandingLoan.lte(balloon)) ? outstandingLoan : monthlyPayment;
}

/**
 * Returns the remaining balance in a payment cycle
 * @param outstandingLoan the amount remaining on the loan
 * @param principal the amount of principal to be paid on the loan
 * @param balloon the amount of the balloon payment
 */
export const calculateRemainingBalance = (outstandingLoan: Big, principal: Big, balloon: Big) => {
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
export const populateAmortisationArray = (monthlyPayment: Big, outstandingLoan: Big, interest: Big, term: Big, frequency: Big, balloon: Big, paymentBreakdown: AmortisedTableValues[]) => {
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
export const getAmortisedValues = (principle: Big, interest: Big, term: Big, frequency: Big, balloon: Big): AmortisedTableValues[] => {
    const paymentBreakdown: AmortisedTableValues[] = [];
    const paymentAmount = calculatePeriodicPayment(principle, interest, term, frequency, balloon);
    populateAmortisationArray(paymentAmount, principle, interest, term, frequency, balloon, paymentBreakdown);
    return paymentBreakdown;
}

export const removeFormatting =  (value: string) => {
    return value.replace(/[^0-9.]/g, '');
}

export const getValue = (min: number, max: number, newValue?: string): string => {
    if(!newValue) return '';
    if(Number(newValue) < min) return min.toString();
    if(Number(newValue) > max) return max.toString();

    return newValue;
}