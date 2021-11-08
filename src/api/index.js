const fs = window.require("fs");
const ExcelJS = require("exceljs");
const FileSaver = require("file-saver");
const moment = require("moment");

export const getOrderData = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  let finalData = [];
  let data = await fs.promises.readFile(filePath);
  await workbook.xlsx.load(data.buffer);
  const worksheet = workbook.getWorksheet("ban_hang");
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
  const worksheet = workbook.getWorksheet("nhap_hang");
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
  const worksheet = workbook.getWorksheet("san_pham");
  worksheet.eachRow((row, rowNumber) => {
    let rowData = row.values;
    rowData[0] = rowNumber;
    finalData.push(rowData);
  });
  return finalData;
};

const getMonthFromFileName = (filePath) => {
  return filePath.split("").reverse().slice(5, 7).reverse().join("");
};

export const saveOrderData = async (excelFilePath, orderData) => {
  try {
    //Load ExcelFile
    const workbook = new ExcelJS.Workbook();
    let data = await fs.promises.readFile(excelFilePath);
    await workbook.xlsx.load(data.buffer);

    //Get and update OrderSheet
    const worksheetBanHang = workbook.getWorksheet("ban_hang");
    if (!(getMonthFromFileName(excelFilePath) === moment().format("MM"))) {
      workbook.removeWorksheet(worksheetBanHang.id);
      const newWorksheetBanHang = workbook.addWorksheet("ban_hang");
      newWorksheetBanHang.addRow(Object.values(orderData));
    } else {
      worksheetBanHang.addRow(Object.values(orderData));
    }

    //Get and update ProductSheet
    const worksheetSanPham = workbook.getWorksheet("san_pham");
    let productRow;
    worksheetSanPham.eachRow((row, rowNumber) => {
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
    worksheetSanPham.spliceRows(productRowNum, 1, productRow);

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
    const worksheetNhapHang = workbook.getWorksheet("nhap_hang");
    if (!(getMonthFromFileName(excelFilePath) === moment().format("MM"))) {
      workbook.removeWorksheet(worksheetNhapHang.id);
      const newWorksheetNhapHang = workbook.addWorksheet("nhap_hang");
      newWorksheetNhapHang.addRow(Object.values(importData));
    } else {
      worksheetNhapHang.addRow(Object.values(importData));
    }

    //Get and update ProductSheet
    const worksheetSanPham = workbook.getWorksheet("san_pham");
    let productRow;
    worksheetSanPham.eachRow((row, rowNumber) => {
      let productId = row.values[1];
      if (productId === importData.id) {
        let rowData = row.values;
        rowData[0] = rowNumber;
        rowData[3] = +rowData[3] - +importData?.quantity;
        productRow = rowData;
      }
    });
    let productRowNum = productRow[0];
    productRow.shift();
    worksheetSanPham.spliceRows(productRowNum, 1, productRow);

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
    const worksheetSanPham = workbook.getWorksheet("san_pham");
    worksheetSanPham.addRow(Object.values(productData));

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
