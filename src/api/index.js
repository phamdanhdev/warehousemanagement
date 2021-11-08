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
    finalData.push(rowData);
  });
  return finalData;
};

export const saveOrderData = async (excelFilePath, orderData) => {
  try {
    //Load ExcelFile
    const workbook = new ExcelJS.Workbook();
    let data = await fs.promises.readFile(excelFilePath);
    await workbook.xlsx.load(data.buffer);

    //Get and update OrderSheet
    const worksheet1 = workbook.getWorksheet(1);
    worksheet1.addRow(Object.values(orderData));

    //Get and update ProductSheet
    const worksheet3 = workbook.getWorksheet(3);
    let productRow;
    worksheet3.eachRow((row, rowNumber) => {
      let productId = row.values[1];
      if (productId === orderData.id) {
        let rowData = row.values;
        rowData[0] = rowNumber;
        rowData[3] = +rowData[3] - +orderData?.quantity;
        productRow = rowData;
      }
    });
    let productRowNum = productRow[0];
    productRow.shift();
    worksheet3.spliceRows(productRowNum, 1, productRow);

    //Save to ExcelFile
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${moment().format("YYYY")}_${moment().format("MM")}.xlsx`;
    FileSaver.saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const saveImportData = async (excelFilePath, importData) => {
  try {
    //Load ExcelFile
    const workbook = new ExcelJS.Workbook();
    let data = await fs.promises.readFile(excelFilePath);
    await workbook.xlsx.load(data.buffer);

    //Get and update ImportSheet
    const worksheet2 = workbook.getWorksheet(2);
    worksheet2.addRow(Object.values(importData));

    //Get and update ProductSheet
    const worksheet3 = workbook.getWorksheet(3);
    let productRow;
    worksheet3.eachRow((row, rowNumber) => {
      let productId = row.values[1];
      if (productId === importData.id) {
        let rowData = row.values;
        rowData[0] = rowNumber;
        rowData[3] = +rowData[3] + +importData?.quantity;
        productRow = rowData;
      }
    });
    let productRowNum = productRow[0];
    productRow.shift();
    worksheet3.spliceRows(productRowNum, 1, productRow);

    //Save to ExcelFile
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${moment().format("YYYY")}_${moment().format("MM")}.xlsx`;
    FileSaver.saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const saveProductData = async (excelFilePath, productData) => {
  try {
    //Load ExcelFile
    const workbook = new ExcelJS.Workbook();
    let data = await fs.promises.readFile(excelFilePath);
    await workbook.xlsx.load(data.buffer);

    //Get and update ProductSheet
    const worksheet3 = workbook.getWorksheet(3);
    worksheet3.addRow(Object.values(productData));

    //Save to ExcelFile
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${moment().format("YYYY")}_${moment().format("MM")}.xlsx`;
    FileSaver.saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
