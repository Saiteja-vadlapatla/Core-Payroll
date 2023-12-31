export const payrollColumns = [
  {
    title: 'No. of Working Days',
    dataIndex: 'noOfDaysWorked',
    key: 'noOfDaysWorked',
    width: 100,
  },
  {
    title: 'Allowances',
    dataIndex: 'allowances',
    key: 'allowances',
    width: 110,
  },
  {
    title: 'OT Hours',
    dataIndex: 'otHours',
    key: 'otHours',
    width: 100,
  },
  {
    title: 'OT Amount',
    dataIndex: 'otAmount',
    key: 'otAmount',
    width: 100,
  },
  {
    title: 'Incentives',
    dataIndex: 'incentives',
    key: 'incentives',
    width: 105,
  },
  {
    title: 'Net Wage',
    dataIndex: 'netWage',
    key: 'netWage',
    width: 100,
  },
  {
    title: 'Wage/PF',
    dataIndex: 'wageForPF',
    key: 'wageForPf',
    width: 100,
  },
  {
    title: 'Wage/ESI',
    dataIndex: 'wageForESI',
    key: 'wageForEsi',
    width: 100,
  },
  {
    title: 'PF Ded',
    dataIndex: 'pfDeducted',
    key: 'pfDeducted',
    width: 100,
  },
  {
    title: 'ESI Ded',
    dataIndex: 'esiDeducted',
    key: 'esiDeducted',
    width: 100,
  },
  {
    title: 'Prof Tax',
    dataIndex: 'professionalTax',
    key: 'professionalTax',
    width: 100,
  },
  {
    title: 'TDS',
    dataIndex: 'tds',
    key: 'tds',
    width: 100,
  },
  {
    title: 'Advance CF',
    dataIndex: 'advanceCarryForward',
    key: 'advanceCarryForward',
    width: 100,
  },
  {
    title: 'Advance Addition',
    dataIndex: 'advanceAddition',
    key: 'advanceAddition',
    width: 100,
  },
  {
    title: 'Advance Ded',
    dataIndex: 'advanceDeducted',
    key: 'advanceDeducted',
    width: 100,
  },
  {
    title: 'Total Ded',
    dataIndex: 'totalDeductions',
    key: 'totalDeductions',
    width: 100,
  },
  {
    title: 'Net Pay',
    dataIndex: 'netPayable',
    key: 'netPayable',
    width: 100,
    // Render in bold
    render: (text) => <b>{text}</b>,
  },
];
