export interface AmortisedTableValues {
    balance: string;
    payment: string;
    interestPayment: string;
    principalAmount: string;
}

export interface PersonalLoanCalcs {
    loanAmount: string;
    loanTerm: string;
    paymentFrequency: string;
    interestRate: string;
    balloon: string;
}

export type PersonalLoanCalcKeys = keyof PersonalLoanCalcs;