const fs = window.require("fs");
const ExcelJS = require("exceljs");
const FileSaver = require("file-saver");
const moment = require("moment");

export const getOrderData = async (filePath) => {
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

export const getImportData = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  let finalData = [];
  let data = await fs.promises.readFile(filePath);
  await workbook.xlsx.load(data.buffer);
  const worksheet = workbook.getWorksheet(2);
  worksheet.eachRow((row, rowNumber) => {
    let rowData = row.values;
    rowData[0] = rowNumber;
    // rowData[5] = moment(rowData[5]).format("HH:mm");
    finalData.push(rowData);
  });
  return finalData;
};

export const getProductData = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  let finalData = [];
  let data = await fs.promises.readFile(filePath);
  await workbook.xlsx.load(data.buffer);
  const worksheet = workbook.getWorksheet(3);
  worksheet.eachRow((row, rowNumber) => {
    let rowData = row.values;
    rowData[0] = rowNumber;
    // rowData[5] = moment(rowData[5]).format("HH:mm");
    finalData.push(rowData);
  });
  return finalData;
};

export const saveOrderData = async (excelFilePath, orderData) => {
  //Load OrderFile and get OrderSheet
  const workbook = new ExcelJS.Workbook();
  let data = await fs.promises.readFile(excelFilePath);
  await workbook.xlsx.load(data.buffer);
  const worksheet = workbook.getWorksheet(1);

  //Add data to Sheet
  worksheet.addRow(Object.values(orderData));

  try {
    //Update to OrderSheet
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${moment().format("YYYY")}_${moment().format("MM")}.xlsx`;
    FileSaver.saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName
    );

    //Update to ProductSheet

    //Update JSON file

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
