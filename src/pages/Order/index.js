import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderData } from "../../api/index";
import { Table, DatePicker } from "antd";
import moment from "moment";
import "./style.scss";
import { setLoading } from "../../actions/loading";

export default function OrderPage() {
  const dispatch = useDispatch();
  const { excelFilePath } = useSelector((state) => state.filePath);
  const [orderData, setOrderData] = useState([]);

  const dateFormat = "DD/MM/YYYY";

  useEffect(() => {
    (async () => {
      dispatch(setLoading(true));
      const res = await getOrderData(excelFilePath);
      let tableData = convertDatatoTableData(res);
      setOrderData(tableData);
      dispatch(setLoading(false));
    })();
  }, [excelFilePath, dispatch]);

  const convertDatatoTableData = (dataInput = []) => {
    let res = dataInput.reduce((acc, cur) => {
      let item = {
        key: cur[0],
        id: cur[1],
        name: cur[2],
        quatity: cur[3],
        date: cur[4],
        time: cur[5],
      };
      return [...acc, item];
    }, []);
    return res;
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
      dataIndex: "quatity",
      key: "quatity",
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
          />
        </div>
      </div>
      <Table columns={columns} dataSource={orderData} />
    </div>
  );
}
