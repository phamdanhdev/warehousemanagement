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
import { getProductData, saveProductData } from "../../api/index";
import moment from "moment";

const timeFormat = "HH:mm";
const dateFormat = "DD/MM/YYYY";

let initialProductForm = {
  id: null,
  name: null,
  quantity: 1,
  date: moment().format(dateFormat),
  time: moment().format(timeFormat),
};

export default function ProductAddPage() {
  const [validId, setValidId] = useState(false); //To show validate ID
  const [valueSearch, setValueSearch] = useState("");
  const { excelFilePath } = useSelector((state) => state.filePath);
  const [productData, setProductData] = useState([]);
  const [quantityState, setQuantityState] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const productForm = useRef(initialProductForm);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await getProductData(excelFilePath);
      let idData = convertDataToIdData(res);
      setProductData(idData);
    })();
  }, [excelFilePath]);

  const convertDataToIdData = (dataInput = []) => {
    let res = dataInput.reduce((acc, cur) => {
      let item = `${cur[1]}`;
      return [...acc, item];
    }, []);
    return res;
  };

  const onChangeSearch = (data) => {
    setValueSearch(data);
    if (!data.length) {
      setValidId(false);
      return;
    }

    data.split("").forEach((e) => {
      if (e.indexOf(" ") >= 0) {
        setValidId(false);
        return;
      }
    });

    let idIsAvailable = productData.some(
      (e) => e.trim().toLowerCase() === data.trim().toLowerCase()
    );
    if (idIsAvailable) {
      setValidId(false);
      return;
    }
    productForm.current = {
      ...productForm.current,
      id: data,
    };
    setValidId(true);
  };

  const onChangeQuantity = (num) => {
    setQuantityState(num.target.value);
    if (isNaN(num.target.value)) {
      message.warning("S??? l?????ng ph???i l?? s???!");
      productForm.current = {
        ...productForm.current,
        quantity: null,
      };
      return;
    }
    if (+num.target.value < 1) {
      message.warning("S??? l?????ng ph???i l???n h??n 0!");
      productForm.current = {
        ...productForm.current,
        quantity: null,
      };
      return;
    }
    productForm.current = {
      ...productForm.current,
      quantity: +num.target.value,
    };
  };

  const handleChangeDate = (date, dateString) => {
    productForm.current = { ...productForm.current, date: dateString };
  };

  const handleChangeTime = (time, timeString) => {
    productForm.current = { ...productForm.current, time: timeString };
  };

  const handleAddNewProduct = async () => {
    dispatch(setLoading(true));
    if (
      productForm.current.id === "" ||
      productForm.current.id === null ||
      productForm.current.name.length < 1 ||
      productForm.current.quantity === null ||
      !validId
    ) {
      message.error("Th??ng tin kh??ng h???p l???!");
      dispatch(setLoading(false));
      return;
    }
    let saveStatus = await saveProductData(excelFilePath, productForm.current);

    dispatch(setLoading(false));
    if (saveStatus) {
      history.push("/");
    } else {
      message.error("Th??m m???i kh??ng th??nh c??ng!");
      return;
    }
  };

  const onChangeName = (nameStr) => {
    productForm.current = {
      ...productForm.current,
      name: nameStr.target.value,
    };
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleAddNewProduct();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="_productAddPage">
      <h2>Th??m ????n h??ng m???i</h2>
      <div className="_formItem _searchForm">
        <span>M?? s???n ph???m</span>
        <AutoComplete
          className="_autoComplete"
          allowClear={true}
          value={valueSearch}
          size="large"
          onChange={onChangeSearch}
          placeholder="M?? s???n ph???m"
        />
        {validId ? (
          <p className="_searchMessage" style={{ color: "green" }}>
            OK
          </p>
        ) : (
          <p className="_searchMessage" style={{ color: "red" }}>
            M?? s???n ph???m ???? t???n t???i!
          </p>
        )}
      </div>
      <div className="_formItem">
        <span>T??n s???n ph???m</span>
        <Input
          size="large"
          onChange={onChangeName}
          placeholder="T??n s???n ph???m"
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
        <button className="_addProductBtn" type="primary" onClick={showModal}>
          Th??m s???n ph???m m???i
        </button>
      </div>
      <Modal
        title="X??c nh???n s???n ph???m m???i"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Hu???"
      >
        <p>
          M?? s???n ph???m:{" "}
          <span style={{ fontWeight: "bold" }}>{productForm.current.id}</span>
        </p>
        <p>
          T??n s???n ph???m:{" "}
          <span style={{ fontWeight: "bold" }}>{productForm.current.name}</span>
        </p>
        <p>
          S??? l?????ng:{" "}
          <span style={{ fontWeight: "bold" }}>
            {productForm.current.quantity}
          </span>
        </p>
        <p>
          Ng??y:{" "}
          <span style={{ fontWeight: "bold" }}>{productForm.current.date}</span>
        </p>
        <p>
          Gi???:{" "}
          <span style={{ fontWeight: "bold" }}>{productForm.current.time}</span>
        </p>
      </Modal>
    </div>
  );
}
