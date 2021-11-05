import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getImportData } from "../../api/index";
import { Table, DatePicker } from "antd";
import moment from "moment";
import "./style.scss";
import { setLoading } from "../../actions/loading";
import { addImportData } from "../../actions/import";

export default function ImportPage() {
  const dispatch = useDispatch();
  const { excelFilePath } = useSelector((state) => state.filePath);
  const importDataStore = useSelector((state) => state.import);
  const [importData, setImportData] = useState([]);

  const dateFormat = "DD/MM/YYYY";

  useEffect(() => {
    (async () => {
      dispatch(setLoading(true));
      const res = await getImportData(excelFilePath);
      let tableData = convertDatatoTableData(res);
      setImportData(
        getImportDataByDate(tableData, moment().format("DD/MM/YYYY"))
      );
      dispatch(addImportData(tableData));
      dispatch(setLoading(false));
    })();
  }, [excelFilePath, dispatch]);

  const getImportDataByDate = (importData, date) => {
    return importData.filter((e) => e.date === date);
  };

  const convertDatatoTableData = (dataInput = []) => {
    let res = dataInput.reduce((acc, cur) => {
      let item = {
        key: cur[0],
        id: cur[1],
        name: cur[2],
        quantity: cur[3],
        date: cur[4],
        time: cur[5],
      };
      return [...acc, item];
    }, []);
    return res;
  };

  const handleChangeDateFilter = (date, dateString) => {
    setImportData(getImportDataByDate(importDataStore, dateString));
  };

  const handleViewAllBtn = () => {
    setImportData(importDataStore);
  };

  //TABLE CONFIG

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
    },
  ];

  return (
    <div className="_importPage">
      <h1>Quản lý nhập hàng</h1>
      <div className="_filter">
        <div className="_dateFilter">
          <span>Ngày</span>
          <DatePicker
            defaultValue={moment(new Date(), dateFormat)}
            format={dateFormat}
            size="large"
            onChange={handleChangeDateFilter}
          />
        </div>
        <div className="_viewAll">
          <button onClick={handleViewAllBtn}>Xem tất cả</button>
        </div>
      </div>
      <Table columns={columns} dataSource={importData} />
    </div>
  );
}
