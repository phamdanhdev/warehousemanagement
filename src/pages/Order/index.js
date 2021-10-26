import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getData } from "../../api/index";
import { Table } from "antd";

export default function OrderPage() {
  const { orderFilePath } = useSelector((state) => state.filePath);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getData(orderFilePath);
      console.log({ res });
      let tableData = convertDatatoTableData(res);
      console.log({ tableData });
      setOrderData(tableData);
    })();
  }, [orderFilePath]);

  const convertDatatoTableData = (dataInput = []) => {
    // console.log(dataInput);

    let res = dataInput.reduce((acc, cur) => {
      console.log(cur);
      let item = {
        key: cur[0],
        id: cur[1],
        name: cur[2],
        quatity: cur[3],
        date: cur[4],
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
  ];

  return (
    <div>
      <Table columns={columns} dataSource={orderData} />
    </div>
  );
}
