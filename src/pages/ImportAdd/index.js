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
      message.warning("S??? l?????ng ph???i l?? s???!");
      importForm.current = {
        ...importForm.current,
        quantity: null,
      };
      return;
    }
    if (+num.target.value < 1) {
      message.warning("S??? l?????ng ph???i l???n h??n 0!");
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
      message.error("Th??ng tin kh??ng h???p l???!");
      dispatch(setLoading(false));
      return;
    }
    let saveStatus = await saveImportData(excelFilePath, importForm.current);
    dispatch(setLoading(false));
    if (saveStatus) {
      history.push("/");
    } else {
      message.error("Th??m m???i kh??ng th??nh c??ng!");
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
      <h2>Th??m ????n h??ng m???i</h2>
      <div className="_formItem _searchForm">
        <span>M?? s???n ph???m</span>
        <AutoComplete
          className="_autoComplete"
          allowClear={true}
          value={valueSearch}
          options={optionsSearch}
          size="large"
          onSelect={onSelectSearch}
          onSearch={onSearch}
          onChange={onChangeSearch}
          placeholder="M?? s???n ph???m"
        />
        {validId ? (
          <p className="_searchMessage" style={{ color: "green" }}>
            OK
          </p>
        ) : (
          <p className="_searchMessage" style={{ color: "red" }}>
            M?? s???n ph???m kh??ng t???n t???i!
          </p>
        )}
      </div>
      <div className="_formItem">
        <span>T??n s???n ph???m</span>
        <Input
          size="large"
          value={importForm.current.name}
          placeholder="T??n s???n ph???m"
          disabled
        ></Input>
      </div>
      <div className="_formItem _quantityForm">
        <div className="_quantity">
          <span>S??? l?????ng</span>
          <Input
            size="large"
            value={quantityState}
            onChange={onChangeQuantity}
            placeholder="S??? l?????ng kh??ng ???????c b??? tr???ng!"
          ></Input>
        </div>
        <div className="_quantityInStock">
          <span>S??? l?????ng c??n trong kho</span>
          <Input size="large" value={quantityInStockState} disabled></Input>
        </div>
      </div>

      <div className="_formItem _dateTimeForm">
        <div className="_datePicker">
          <span>Ng??y</span>
          <DatePicker
            defaultValue={moment(new Date(), dateFormat)}
            format={dateFormat}
            size="large"
            onChange={handleChangeDate}
          />
        </div>
        <div className="_timePicker">
          <span>Gi???</span>
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
          Nh???p th??m h??ng
        </button>
      </div>
      <Modal
        title="X??c nh???n nh???p h??ng"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Hu???"
      >
        <p>
          M?? s???n ph???m:{" "}
          <span style={{ fontWeight: "bold" }}>{importForm.current.id}</span>
        </p>
        <p>
          T??n s???n ph???m:{" "}
          <span style={{ fontWeight: "bold" }}>{importForm.current.name}</span>
        </p>
        <p>
          S??? l?????ng:{" "}
          <span style={{ fontWeight: "bold" }}>
            {importForm.current.quantity}
          </span>
        </p>
        <p>
          Ng??y:{" "}
          <span style={{ fontWeight: "bold" }}>{importForm.current.date}</span>
        </p>
        <p>
          Gi???:{" "}
          <span style={{ fontWeight: "bold" }}>{importForm.current.time}</span>
        </p>
      </Modal>
    </div>
  );
}
