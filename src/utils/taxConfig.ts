export const TaxConfig = {
  year: 2025,
  individual_income_tax: {
    brackets: [
      { min: 0, max: 250000, base: 0, rate: 0, excess_over: 0 },
      { min: 250000, max: 400000, base: 0, rate: 0.15, excess_over: 250000 },
      { min: 400000, max: 800000, base: 22500, rate: 0.20, excess_over: 400000 },
      { min: 800000, max: 2000000, base: 102500, rate: 0.25, excess_over: 800000 },
      { min: 2000000, max: 8000000, base: 402500, rate: 0.30, excess_over: 2000000 },
      { min: 8000000, max: Infinity, base: 2202500, rate: 0.35, excess_over: 8000000 }
    ],
    thirteenth_month_cap: 90000
  },
  eight_percent_option: {
    rate: 0.08,
    vat_threshold: 3000000,
    pure_self_employed_extra_deduction: 250000
  },
  vat: {
    rate: 0.12,
    threshold: 3000000
  },
  percentage_tax: [
    { start: "2020-07-01", end: "2023-06-30", rate: 0.01 },
    { start: "2023-07-01", end: null,        rate: 0.03 }
  ],
  sss: {
    effective_from: "2025-01-01",
    total_rate: 0.15,
    employee_rate: 0.05,
    employer_rate: 0.10,
    msc_min: 5000,
    msc_max: 35000,
    // Simplified bracket logic: 
    // Contribution is based on MSC. MSC is salary rounded to nearest bracket.
    // For 2025, it's basically salary * rate, but capped at msc_max and floored at msc_min.
    // However, exact tables have specific EC and WISP components.
    // For this calculator, we will use the formula approximation as requested/implied for simplicity unless exact table is needed.
    // The user prompt said: "Use EE part as payroll deduction; optionally show employer’s share in the UI."
    // and "Store the official 2025 SSS contribution table... or use formula approximation if acceptable".
    // Given the prompt "Total rate: 15% of Monthly Salary Credit (MSC)", we will implement the MSC logic.
  },
  philhealth: {
    rate: 0.05,
    floor: 10000,
    ceiling: 100000,
    share_employee: 0.5,
    share_employer: 0.5,
    min_contribution: 500, // 5% of 10k
    max_contribution: 5000 // 5% of 100k
  },
  pagibig: {
    fund_salary_cap: 10000,
    ee_rates: [
      { max: 1500, rate: 0.01 },
      { max: Infinity, rate: 0.02 }
    ],
    er_rate: 0.02,
    max_contribution: 200 // 2% of 10k
  }
};
