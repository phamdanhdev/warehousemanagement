import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./style.scss";
import { Modal } from "antd";
import {
  addOrderPath,
  addImportPath,
  addProductPath,
} from "../../actions/filePath";

export default function HomePage() {
  const [isOrderFileModalVisible, setIsOrderFileModalVisible] = useState(false);
  const [isImportFileModalVisible, setIsImportFileModalVisible] =
    useState(false);
  const [isProductFileModalVisible, setIsProductFileModalVisible] =
    useState(false);

  const dispatch = useDispatch();

  const filePathStore = useSelector((state) => state.filePath);

  //ORDER FILE MODAL
  const showOrderFileModal = () => {
    setIsOrderFileModalVisible(true);
  };
  const handleCancelOrderFileModal = () => {
    setIsOrderFileModalVisible(false);
  };
  const onChangeOrderFilePath = () => {
    let filePath = document.getElementById("orderFilePath").files[0].path;
    dispatch(addOrderPath(filePath));
  };

  //IMPORT FILE MODAL
  const showImportFileModal = () => {
    setIsImportFileModalVisible(true);
  };
  const handleCancelImportFileModal = () => {
    setIsImportFileModalVisible(false);
  };
  const onChangeImportFilePath = () => {
    let filePath = document.getElementById("importFilePath").files[0].path;
    dispatch(addImportPath(filePath));
  };

  //PRODUCT FILE MODAL
  const showProductFileModal = () => {
    setIsProductFileModalVisible(true);
  };
  const handleCancelProductFileModal = () => {
    setIsProductFileModalVisible(false);
  };
  const onChangeProductFilePath = () => {
    let filePath = document.getElementById("productFilePath").files[0].path;
    dispatch(addProductPath(filePath));
  };

  return (
    <div className="_homePage">
      <div className="_homeRow">
        <div className="_homePage_item" onClick={showOrderFileModal}>
          <h3>Chọn file bán hàng</h3>
          <p>
            Trạng thái: {filePathStore.orderFilePath ? "Đã chọn" : "Chưa chọn"}
          </p>
        </div>
        <Link to="/order/add">
          <div className="_homePage_item">
            <h3>Bán hàng</h3>
          </div>
        </Link>
      </div>
      <div className="_homeRow">
        <div className="_homePage_item" onClick={showImportFileModal}>
          <h3>Chọn file nhập hàng</h3>
          <p>
            Trạng thái: {filePathStore.importFilePath ? "Đã chọn" : "Chưa chọn"}
          </p>
        </div>
        <Link to="/import/add">
          <div className="_homePage_item">
            <h3>Nhập hàng</h3>
          </div>
        </Link>
      </div>
      <div className="_homeRow">
        <div className="_homePage_item" onClick={showProductFileModal}>
          <h3>Chọn file sản phẩm</h3>
          <p>
            Trạng thái:{" "}
            {filePathStore.productFilePath ? "Đã chọn" : "Chưa chọn"}
          </p>
        </div>
        <Link to="/product/add">
          <div className="_homePage_item">
            <h3>Thêm sản phẩm mới</h3>
          </div>
        </Link>
      </div>
      <Modal
        title="Chọn file bán hàng"
        closable={false}
        visible={isOrderFileModalVisible}
        cancelText="Xong"
        onCancel={handleCancelOrderFileModal}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <input
          type="file"
          id="orderFilePath"
          onChange={onChangeOrderFilePath}
        />
        {filePathStore.orderFilePath && (
          <p>Path: {filePathStore.orderFilePath}</p>
        )}
      </Modal>
      <Modal
        title="Chọn file nhập hàng"
        closable={false}
        visible={isImportFileModalVisible}
        cancelText="Xong"
        onCancel={handleCancelImportFileModal}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <input
          type="file"
          id="importFilePath"
          onChange={onChangeImportFilePath}
        />
        {filePathStore.importFilePath && (
          <p>Path: {filePathStore.importFilePath}</p>
        )}
      </Modal>
      <Modal
        title="Chọn file sản phẩm"
        closable={false}
        visible={isProductFileModalVisible}
        cancelText="Xong"
        onCancel={handleCancelProductFileModal}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <input
          type="file"
          id="productFilePath"
          onChange={onChangeProductFilePath}
        />
        {filePathStore.productFilePath && (
          <p>Path: {filePathStore.productFilePath}</p>
        )}
      </Modal>
    </div>
  );
}
