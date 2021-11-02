import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./style.scss";
import { Modal } from "antd";
import { addExcelFilePath } from "../../actions/filePath";

export default function HomePage() {
  const [isExcelFileModalVisible, setIsExcelFileModalVisible] = useState(false);

  const dispatch = useDispatch();

  const filePathStore = useSelector((state) => state.filePath);

  //EXCEL FILE MODAL
  const showExcelFileModal = () => {
    setIsExcelFileModalVisible(true);
  };
  const handleCancelExcelFileModal = () => {
    setIsExcelFileModalVisible(false);
  };
  const onChangeExcelFilePath = () => {
    let filePath = document.getElementById("excelFilePath").files[0].path;
    dispatch(addExcelFilePath(filePath));
  };

  return (
    <div className="_homePage">
      <div className="_homePathRow">
        <div className="_homePage_item" onClick={showExcelFileModal}>
          <h3>Chọn file bán hàng</h3>
          <p>
            Trạng thái: {filePathStore.excelFilePath ? "Đã chọn" : "Chưa chọn"}
          </p>
        </div>
      </div>
      <div className="_homeRow">
        <Link to="/order/add">
          <div className="_homePage_item">
            <h3>Bán hàng</h3>
          </div>
        </Link>
        <Link to="/import/add">
          <div className="_homePage_item">
            <h3>Nhập hàng</h3>
          </div>
        </Link>
        <Link to="/product/add">
          <div className="_homePage_item">
            <h3>Thêm sản phẩm mới</h3>
          </div>
        </Link>
      </div>
      <Modal
        title="Chọn file"
        closable={false}
        visible={isExcelFileModalVisible}
        cancelText="Xong"
        onCancel={handleCancelExcelFileModal}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <input
          type="file"
          id="excelFilePath"
          onChange={onChangeExcelFilePath}
        />
        {filePathStore.excelFilePath && (
          <p>Path: {filePathStore.excelFilePath}</p>
        )}
      </Modal>
    </div>
  );
}
