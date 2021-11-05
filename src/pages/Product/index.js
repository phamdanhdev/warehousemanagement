import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProductData } from "../../api/index";
import { Table, AutoComplete } from "antd";
import "./style.scss";
import { setLoading } from "../../actions/loading";
import { addProductData } from "../../actions/product";

export default function ProductPage() {
  const dispatch = useDispatch();
  const { excelFilePath } = useSelector((state) => state.filePath);
  const productDataStore = useSelector((state) => state.product);
  const [productData, setProductData] = useState([]);

  //FormSearch
  const [valueSearch, setValueSearch] = useState("");

  useEffect(() => {
    (async () => {
      dispatch(setLoading(true));
      const res = await getProductData(excelFilePath);
      let tableData = convertDatatoTableData(res);
      tableData.sort((a, b) => +a.quantity - +b.quantity);
      setProductData(tableData);
      dispatch(addProductData(tableData));
      dispatch(setLoading(false));
    })();
  }, [excelFilePath, dispatch]);

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

  const onChangeSearch = (data) => {
    setValueSearch(data);
    if (!data) {
      setProductData(productDataStore);
      return;
    }
    let productDataMatch = [];
    productDataStore.forEach((e) => {
      if (e?.id.toLowerCase().includes(data.toLowerCase())) {
        productDataMatch.push(e);
      }
    });
    setProductData(productDataMatch);
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
    <div className="_productPage">
      <h1>Quản lý sản phẩm</h1>
      <div className="_filter">
        <div className="_searchForm">
          <span>Mã sản phẩm</span>
          <AutoComplete
            className="_autoComplete"
            allowClear={true}
            value={valueSearch}
            size="large"
            onChange={onChangeSearch}
          />
        </div>
      </div>
      <Table columns={columns} dataSource={productData} />
    </div>
  );
}
