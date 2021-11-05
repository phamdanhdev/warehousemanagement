import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderData } from "../../api/index";
import { Table, DatePicker } from "antd";
import moment from "moment";
import "./style.scss";
import { setLoading } from "../../actions/loading";
import { addOrderData } from "../../actions/order";

export default function OrderPage() {
  const dispatch = useDispatch();
  const { excelFilePath } = useSelector((state) => state.filePath);
  const orderDataStore = useSelector((state) => state.order);
  const [orderData, setOrderData] = useState([]);

  const dateFormat = "DD/MM/YYYY";

  useEffect(() => {
    (async () => {
      dispatch(setLoading(true));
      const res = await getOrderData(excelFilePath);
      let tableData = convertDatatoTableData(res);
      setOrderData(
        getOrderDataByDate(tableData, moment().format("DD/MM/YYYY"))
      );
      dispatch(addOrderData(tableData));
      dispatch(setLoading(false));
    })();
  }, [excelFilePath, dispatch]);

  const getOrderDataByDate = (orderData, date) => {
    return orderData.filter((e) => e.date === date);
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
    setOrderData(getOrderDataByDate(orderDataStore, dateString));
  };

  const handleViewAllBtn = () => {
    setOrderData(orderDataStore);
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
    <div className="_orderPage">
      <h1>Quản lý bán hàng</h1>
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
      <Table columns={columns} dataSource={orderData} />
    </div>
  );
}
