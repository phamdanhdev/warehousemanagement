const fs = window.require("fs");
const ExcelJS = require("exceljs");
const FileSaver = require("file-saver");
const moment = require("moment");

export const getData = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  let finalData = [];
  let data = await fs.promises.readFile(filePath);
  await workbook.xlsx.load(data.buffer);
  const worksheet = workbook.getWorksheet(1);
  worksheet.eachRow((row, rowNumber) => {
    let rowData = row.values;
    rowData[0] = rowNumber;
    // rowData[5] = moment(rowData[5]).format("HH:mm");
    finalData.push(rowData);
  });
  return finalData;
};

export const saveOrderData = async (
  orderFilePath,
  productFilePath,
  orderData
) => {
  //Load OrderFile and get OrderSheet
  const workbook = new ExcelJS.Workbook();
  let data = await fs.promises.readFile(orderFilePath);
  await workbook.xlsx.load(data.buffer);
  const worksheet = workbook.getWorksheet(1);

  //SaveOrderToOrderFile

  worksheet.addRow(Object.values(orderData));

  worksheet.eachRow((row, rowNumber) => {
    console.log(row.values);
  });
  try {
    // const buffer = await workbook.xlsx.writeBuffer();
    // FileSaver.saveAs(
    //   new Blob([buffer], {
    //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   }),
    //   "test.xlsx"
    // );
  } catch (error) {
    console.log(error);
    return false;
  }

  //LoadProductFile

  //UpdateQuantityToProductFile
};
