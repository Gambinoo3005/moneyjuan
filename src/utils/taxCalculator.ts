import { TaxConfig } from './taxConfig';

export interface EmployeeCompInput {
    period: 'monthly' | 'semi-monthly' | 'weekly' | 'daily';
    basicPay: number;
    overtimePay: number;
    nightShiftHours?: number;
    nightDifferentialRate?: number;
    allowancesTaxable: number;
    allowancesNonTaxable: number;
    bonusThisPay: number;
    bonusYTDExclThisPay: number;
    sssEmployee?: number;
    philhealthEmployee?: number;
    pagibigEmployee?: number;
    isMinimumWageEarner: boolean;
}

export interface EmployeeCompResult {
    grossPay: number;
    netPay: number;
    deductions: {
        sss: number;
        philhealth: number;
        pagibig: number;
        tax: number;
        total: number;
    };
    nightDifferentialPay: number;
}

function getAnnualMultiplier(period: string): number {
    switch (period) {
        case 'monthly': return 12;
        case 'semi-monthly': return 24;
        case 'weekly': return 52;
        case 'daily': return 260;
        default: return 12;
    }
}

export function calculateSSS(monthlySalary: number): { employee: number; employer: number; total: number } {
    let msc = monthlySalary;
    if (msc < TaxConfig.sss.msc_min) msc = TaxConfig.sss.msc_min;
    if (msc > TaxConfig.sss.msc_max) msc = TaxConfig.sss.msc_max;

    const total = msc * TaxConfig.sss.total_rate;
    const employee = msc * TaxConfig.sss.employee_rate;
    const employer = msc * TaxConfig.sss.employer_rate;

    return { employee, employer, total };
}

export function calculatePhilHealth(monthlyBasicSalary: number): { employee: number; employer: number; total: number } {
    let base = monthlyBasicSalary;
    if (base < TaxConfig.philhealth.floor) base = TaxConfig.philhealth.floor;
    if (base > TaxConfig.philhealth.ceiling) base = TaxConfig.philhealth.ceiling;

    const total = base * TaxConfig.philhealth.rate;
    const employee = total * TaxConfig.philhealth.share_employee;
    const employer = total * TaxConfig.philhealth.share_employer;

    return { employee, employer, total };
}

export function calculatePagIBIG(monthlyCompensation: number): { employee: number; employer: number; total: number } {
    const fundSalary = Math.min(monthlyCompensation, TaxConfig.pagibig.fund_salary_cap);

    let eeRate = 0.02;
    if (fundSalary <= 1500) {
        eeRate = 0.01;
    }

    const employee = fundSalary * eeRate;
    const employer = fundSalary * TaxConfig.pagibig.er_rate;

    return { employee, employer, total: employee + employer };
}

export function calculateIncomeTax(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;

    for (const bracket of TaxConfig.individual_income_tax.brackets) {
        if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
            return bracket.base + (taxableIncome - bracket.excess_over) * bracket.rate;
        }
    }
    return 0;
}

function calculateWithholdingTax(taxableIncomePeriod: number, period: string): number {
    const multiplier = getAnnualMultiplier(period);
    const projectedAnnual = taxableIncomePeriod * multiplier;
    const annualTax = calculateIncomeTax(projectedAnnual);
    return annualTax / multiplier;
}

export function calculateEmployeeNetPay(input: EmployeeCompInput): EmployeeCompResult {
    const multiplier = getAnnualMultiplier(input.period);

    let monthlyBasic = input.basicPay;
    if (input.period === 'semi-monthly') monthlyBasic *= 2;
    else if (input.period === 'weekly') monthlyBasic *= 4.33;
    else if (input.period === 'daily') monthlyBasic *= 22;

    const sss = calculateSSS(monthlyBasic);
    const philhealth = calculatePhilHealth(monthlyBasic);
    const pagibig = calculatePagIBIG(monthlyBasic);

    const periodDivisor = multiplier / 12;

    const sssDed = input.sssEmployee ?? (sss.employee / periodDivisor);
    const phDed = input.philhealthEmployee ?? (philhealth.employee / periodDivisor);
    const piDed = input.pagibigEmployee ?? (pagibig.employee / periodDivisor);

    const totalGovtDed = sssDed + phDed + piDed;

    let hourlyRate = 0;
    if (input.period === 'daily') {
        hourlyRate = input.basicPay / 8;
    } else {
        const dailyRate = monthlyBasic / 22;
        hourlyRate = dailyRate / 8;
    }

    const ndRate = input.nightDifferentialRate || 0.10;
    const nightShiftHours = input.nightShiftHours || 0;
    const nightDifferentialPay = hourlyRate * ndRate * nightShiftHours;

    const grossComp = input.basicPay + input.overtimePay + nightDifferentialPay + input.allowancesTaxable + input.bonusThisPay;

    let taxableBonusThisPay = 0;
    if (input.bonusYTDExclThisPay >= TaxConfig.individual_income_tax.thirteenth_month_cap) {
        taxableBonusThisPay = input.bonusThisPay;
    } else {
        const remainingExemption = TaxConfig.individual_income_tax.thirteenth_month_cap - input.bonusYTDExclThisPay;
        taxableBonusThisPay = Math.max(0, input.bonusThisPay - remainingExemption);
    }

    let withholdingTax = 0;
    let taxableIncome = 0;

    if (input.isMinimumWageEarner) {
        taxableIncome = input.allowancesTaxable + taxableBonusThisPay;
    } else {
        taxableIncome = (input.basicPay + input.overtimePay + nightDifferentialPay + input.allowancesTaxable + taxableBonusThisPay) - totalGovtDed;
    }

    if (taxableIncome > 0) {
        withholdingTax = calculateWithholdingTax(taxableIncome, input.period);
    }

    const netPay = grossComp + input.allowancesNonTaxable - totalGovtDed - withholdingTax;

    return {
        grossPay: grossComp + input.allowancesNonTaxable,
        netPay,
        deductions: {
            sss: sssDed,
            philhealth: phDed,
            pagibig: piDed,
            tax: withholdingTax,
            total: totalGovtDed + withholdingTax
        },
        nightDifferentialPay
    };
}

export function calculateFreelancerTax(grossIncome: number, expenses: number, type: 'graduated' | '8%' = 'graduated') {
    const percentageTaxRate = TaxConfig.percentage_tax.at(-1)?.rate ?? 0.03;
    const netTaxableA = Math.max(0, grossIncome - expenses);
    const incomeTaxA = calculateIncomeTax(netTaxableA);
    const percentageTaxA = grossIncome * percentageTaxRate;
    const totalTaxA = incomeTaxA + percentageTaxA;

    const deductionB = TaxConfig.eight_percent_option.pure_self_employed_extra_deduction;
    const taxBaseB = Math.max(0, grossIncome - deductionB);
    const totalTaxB = taxBaseB * TaxConfig.eight_percent_option.rate;

    let recommendation = type === '8%' ? 'Option B' : 'Option A';
    if (totalTaxA !== totalTaxB) {
        recommendation = totalTaxB < totalTaxA ? 'Option B' : 'Option A';
    }

    return {
        optionA: {
            totalTax: totalTaxA,
            incomeTax: incomeTaxA,
            percentageTax: percentageTaxA,
            netIncome: grossIncome - expenses - totalTaxA,
            taxBase: netTaxableA
        },
        optionB: {
            totalTax: totalTaxB,
            netIncome: grossIncome - expenses - totalTaxB,
            taxBase: taxBaseB,
            deduction: deductionB
        },
        recommendation
    };
}

export function calculateBusinessTax(grossSales: number, inputVat: number = 0, isVatRegistered: boolean) {
    if (isVatRegistered || grossSales > TaxConfig.vat.threshold) {
        const outputVat = grossSales * TaxConfig.vat.rate;
        const vatDue = outputVat - inputVat;
        return {
            taxType: 'Value Added Tax (VAT)',
            taxDue: vatDue,
            grossSales,
            outputVat,
            inputVat,
            taxRate: '12%'
        };
    } else {
        const rate = TaxConfig.percentage_tax.at(-1)?.rate ?? 0.03;
        const taxDue = grossSales * rate;
        return {
            taxType: 'Percentage Tax',
            taxDue,
            grossSales,
            taxRate: '3%',
            details: { rate }
        };
    }
}
