const fs = window.require("fs");
const ExcelJS = require("exceljs");

const workbook = new ExcelJS.Workbook();

// export const getData = async (filePath) => {
//   let finalData = [];
//   fs.promises
//     .readFile(filePath)
//     .then((data) => {
//       workbook.xlsx
//         .load(data.buffer)
//         .then((res) => {
//           const worksheet = res.getWorksheet(1);
//           worksheet.eachRow((row, rowNumber) => {
//             let rowData = row.values;
//             rowData[0] = rowNumber;
//             finalData.push(rowData);
//           });
//           return finalData;
//         })
//         .catch();
//     })
//     .catch();
// };

export const getData = async (filePath) => {
  let finalData = [];
  let data = await fs.promises.readFile(filePath);
  let res = await workbook.xlsx.load(data.buffer);
  const worksheet = res.getWorksheet(1);
  worksheet.eachRow((row, rowNumber) => {
    let rowData = row.values;
    rowData[0] = rowNumber;
    finalData.push(rowData);
  });
  return finalData;
};
