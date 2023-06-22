export const days = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
export const daysMap = {
  'Wed': 0,
  'Thu': 1,
  'Fri': 2,
  'Sat': 3,
  'Sun': 4,
  'Mon': 5,
  'Tue': 6,
}

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthsMap = {
  'Jan': 0,
  'Feb': 1,
  'Mar': 2,
  'Apr': 3,
  'May': 4,
  'Jun': 5,
  'Jul': 6,
  'Aug': 7,
  'Sep': 8,
  'Oct': 9,
  'Nov': 10,
  'Dec': 11,
}

export const getMonthMatrix = (month, year) => {
  // Create a matrix where there are 7 columns.
  // Last column is for the tuesdays.
  // Each row is a week.
  // Each cell is a day.
  // No. of days in a month and the first day of the month determine the no. of rows.

  const firstDay = (new Date(year, month, 1)).toString().split(' ')[0];
  const lastDay = (new Date(year, month, 0)).toString().split(' ')[0];
  
  // Create a matrix of 7 columns and 6 rows
  const matrix = [...Array(6)].map(e => Array(7).fill(0));
  let dayCount = 1;
  const maxDaysInMonth = (new Date(year, month, 0)).getDate();

  // Fill the matrix with the days of the month in such a way that last column is for tuesdays
  matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      // If the cell is in the first row and the column is less than the first day of the month, fill it with 0
      if(i === 0 && j < daysMap[firstDay]) {
        matrix[i][j] = 0;
      }
      // If the cell is in the last row and the column is greater than the last day of the month, fill it with 0
      else if(i === matrix.length - 1 && j > daysMap[lastDay]) {
        matrix[i][j] = 0;
      }
      else {
        if(dayCount > maxDaysInMonth) {
          matrix[i][j] = 0;
        } else {
          matrix[i][j] = dayCount;
          dayCount += 1;
        } 
      } 
    })
  })

  // Check if last row is empty. If yes, remove it.
  if(matrix[matrix.length - 1].every((cell) => cell === 0)) {
    matrix.pop();
  }

  if(matrix[matrix.length - 1].every((cell) => cell === 0)) {
    matrix.pop();
  }

  return matrix;
}
