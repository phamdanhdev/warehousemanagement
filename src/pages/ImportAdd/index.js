import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { setLoading } from "../../actions/loading";
import "./style.scss";
import {
  AutoComplete,
  Input,
  message,
  DatePicker,
  TimePicker,
  Modal,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getProductData, saveImportData } from "../../api/index";
import moment from "moment";

const timeFormat = "HH:mm";
const dateFormat = "DD/MM/YYYY";

let initialImportForm = {
  id: null,
  name: null,
  quantity: null,
  date: moment().format(dateFormat),
  time: moment().format(timeFormat),
};

export default function ImportAddPage() {
  const [validId, setValidId] = useState(false); //To show validate ID
  const [valueSearch, setValueSearch] = useState("");
  const [optionsSearch, setOptionsSearch] = useState([]);
  const { excelFilePath } = useSelector((state) => state.filePath);
  const [productData, setProductData] = useState([]);
  const [quantityInStockState, setQuantityInStockState] = useState(0);
  const [quantityState, setQuantityState] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const importForm = useRef(initialImportForm);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await getProductData(excelFilePath);
      let searchData = convertDataToSearchData(res);
      setProductData(searchData);
    })();
  }, [excelFilePath]);

  const convertDataToSearchData = (dataInput = []) => {
    let res = dataInput.reduce((acc, cur) => {
      let item = `${cur[1]} - ${cur[2]} - ${cur[3]}`;
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
    importForm.current = {
      ...importForm.current,
      id: "",
      name: "",
      quantity: null,
    };
    setValidId(false);
    setValueSearch(data?.split("-")[0].trim());
    setQuantityInStockState(0);
  };

  const onSelectSearch = (data) => {
    let id = data.split("-")[0].trim();
    let name = data.split("-")[1].trim();
    let quantityInStock = +data.split("-")[2].trim();
    importForm.current = {
      ...importForm.current,
      id: id,
      name: name,
      quantity: 1,
    };
    setValidId(true);
    setQuantityInStockState(quantityInStock);
  };

  const onChangeQuantity = (num) => {
    setQuantityState(num.target.value);
    if (isNaN(num.target.value)) {
      message.warning("Số lượng phải là số!");
      importForm.current = {
        ...importForm.current,
        quantity: null,
      };
      return;
    }
    if (+num.target.value < 1) {
      message.warning("Số lượng phải lớn hơn 0!");
      importForm.current = {
        ...importForm.current,
        quantity: null,
      };
      return;
    }
    importForm.current = {
      ...importForm.current,
      quantity: +num.target.value,
    };
  };

  const handleChangeDate = (date, dateString) => {
    importForm.current = { ...importForm.current, date: dateString };
  };

  const handleChangeTime = (time, timeString) => {
    importForm.current = { ...importForm.current, time: timeString };
  };

  const handleAddNewImport = async () => {
    dispatch(setLoading(true));
    if (
      importForm.current.id === "" ||
      importForm.current.id === null ||
      importForm.current.quantity === null
    ) {
      message.error("Thông tin không hợp lệ!");
      dispatch(setLoading(false));
      return;
    }
    let saveStatus = await saveImportData(excelFilePath, importForm.current);
    dispatch(setLoading(false));
    if (saveStatus) {
      history.push("/");
    } else {
      message.error("Thêm mới không thành công!");
      return;
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleAddNewImport();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="_importAddPage">
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
            OK
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
          value={importForm.current.name}
          placeholder="Tên sản phẩm"
          disabled
        ></Input>
      </div>
      <div className="_formItem _quantityForm">
        <div className="_quantity">
          <span>Số lượng</span>
          <Input
            size="large"
            value={quantityState}
            onChange={onChangeQuantity}
            placeholder="Số lượng không được bỏ trống!"
          ></Input>
        </div>
        <div className="_quantityInStock">
          <span>Số lượng còn trong kho</span>
          <Input size="large" value={quantityInStockState} disabled></Input>
        </div>
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
        <button className="_addImportBtn" type="primary" onClick={showModal}>
          Nhập thêm hàng
        </button>
      </div>
      <Modal
        title="Xác nhận nhập hàng"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Huỷ"
      >
        <p>
          Mã sản phẩm:{" "}
          <span style={{ fontWeight: "bold" }}>{importForm.current.id}</span>
        </p>
        <p>
          Tên sản phẩm:{" "}
          <span style={{ fontWeight: "bold" }}>{importForm.current.name}</span>
        </p>
        <p>
          Số lượng:{" "}
          <span style={{ fontWeight: "bold" }}>
            {importForm.current.quantity}
          </span>
        </p>
        <p>
          Ngày:{" "}
          <span style={{ fontWeight: "bold" }}>{importForm.current.date}</span>
        </p>
        <p>
          Giờ:{" "}
          <span style={{ fontWeight: "bold" }}>{importForm.current.time}</span>
        </p>
      </Modal>
    </div>
  );
}
