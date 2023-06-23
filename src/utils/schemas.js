// create a schema for leaves of an employee
export const employeeLeaveSchema = {
  employeeId: '',
  doj: '',
  employeeName: '',
  availableTotalLeaves: 0,
  totalLeavesTaken: 0,
  leaveDaysInfo: {
    Apr: [],
    May: [],
    Jun: [],
    Jul: [],
    Aug: [],
    Sep: [],
    Oct: [],
    Nov: [],
    Dec: [],
    Jan: [],
    Feb: [],
    Mar: [],
  },
};
