import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { AutoComplete, Input, message, DatePicker, TimePicker } from "antd";
import { useSelector } from "react-redux";
import { getData, saveOrderData } from "../../api/index";
import moment from "moment";

const timeFormat = "HH:mm";
const dateFormat = "DD/MM/YYYY";

let initialOrderForm = {
  id: null,
  name: null,
  quantity: 1,
  date: moment().format(dateFormat),
  time: moment().format(timeFormat),
};

export default function OrderAddPage() {
  const [validId, setValidId] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [optionsSearch, setOptionsSearch] = useState([]);
  const { orderFilePath, productFilePath } = useSelector(
    (state) => state.filePath
  );
  const [productData, setProductData] = useState([]);

  const orderForm = useRef(initialOrderForm);

  useEffect(() => {
    (async () => {
      const res = await getData(productFilePath);
      let searchData = convertDataToSearchData(res);
      setProductData(searchData);
    })();
  }, [productFilePath]);

  const convertDataToSearchData = (dataInput = []) => {
    let res = dataInput.reduce((acc, cur) => {
      let item = `${cur[1]} - ${cur[2]}`;
      return [...acc, item];
    }, []);
    return res;
  };

  const getSearchSuggestion = (searchText) => {
    let productDataMatch = [];
    productData.every((e) => {
      if (productDataMatch.length > 5) {
        return false;
      }
      let id = e.split("-")[0].trim().toLowerCase();
      if (id.includes(searchText.toLowerCase())) {
        productDataMatch.push(e);
        return true;
      }
      return true;
    });
    let res = productDataMatch.reduce((acc, cur) => {
      let item = { value: cur };
      return [...acc, item];
    }, []);
    return res;
  };

  const onSearch = (searchText) => {
    setOptionsSearch(!searchText ? [] : getSearchSuggestion(searchText));
  };

  const onChangeSearch = (data) => {
    orderForm.current = { ...orderForm.current, id: "", name: "" };
    setValidId(false);
    setValueSearch(data?.split("-")[0].trim());
  };

  const onSelectSearch = (data) => {
    let id = data.split("-")[0].trim();
    let name = data.split("-")[1].trim();
    orderForm.current = { ...orderForm.current, id: id, name: name };
    setValidId(true);
  };

  const onChangeQuantity = (num) => {
    if (isNaN(num.target.value)) {
      message.warning("Số lượng phải là số!");
      orderForm.current = { ...orderForm.current, quantity: null };
      console.log(orderForm.current);
      return;
    }
    if (+num.target.value < 1) {
      message.warning("Số lượng phải lớn hơn 0!");
      orderForm.current = { ...orderForm.current, quantity: null };
      return;
    }
    orderForm.current = { ...orderForm.current, quantity: +num.target.value };
  };

  const handleChangeDate = (date, dateString) => {
    orderForm.current = { ...orderForm.current, date: dateString };
  };

  const handleChangeTime = (time, timeString) => {
    orderForm.current = { ...orderForm.current, time: timeString };
  };

  const handleAddNewOrder = async () => {
    if (
      orderForm.current.id === "" ||
      orderForm.current.id === null ||
      orderForm.current.quantity === null
    ) {
      message.error("Thông tin không hợp lệ!");
      return;
    }
    await saveOrderData(orderFilePath, productFilePath, orderForm.current);
  };

  return (
    <div className="_orderAddPage">
      <h2>Thêm đơn hàng mới</h2>
      <div className="_formItem _searchForm">
        <span>Mã sản phẩm</span>
        <AutoComplete
          className="_autoComplete"
          allowClear={true}
          value={valueSearch}
          options={optionsSearch}
          size="large"
          onSelect={onSelectSearch}
          onSearch={onSearch}
          onChange={onChangeSearch}
          placeholder="Mã sản phẩm"
        />
        {validId ? (
          <p className="_searchMessage" style={{ color: "green" }}>
            Mã sản phẩm tồn tại!
          </p>
        ) : (
          <p className="_searchMessage" style={{ color: "red" }}>
            Mã sản phẩm không tồn tại!
          </p>
        )}
      </div>
      <div className="_formItem">
        <span>Tên sản phẩm</span>
        <Input
          size="large"
          value={orderForm.current.name}
          placeholder="Tên sản phẩm"
          disabled
        ></Input>
      </div>
      <div className="_formItem">
        <span>Số lượng</span>
        <Input
          size="large"
          defaultValue={1}
          onChange={onChangeQuantity}
          placeholder="Số lượng không được bỏ trống!"
        ></Input>
      </div>
      <div className="_formItem _dateTimeForm">
        <div className="_datePicker">
          <span>Ngày</span>
          <DatePicker
            defaultValue={moment(new Date(), dateFormat)}
            format={dateFormat}
            size="large"
            onChange={handleChangeDate}
          />
        </div>
        <div className="_timePicker">
          <span>Giờ</span>
          <TimePicker
            size="large"
            defaultValue={moment(new Date(), timeFormat)}
            format={timeFormat}
            onChange={handleChangeTime}
          />
        </div>
      </div>
      <div className="_formBtn">
        <button
          className="_addOrderBtn"
          type="primary"
          onClick={handleAddNewOrder}
        >
          Thêm đơn hàng mới
        </button>
      </div>
    </div>
  );
}
