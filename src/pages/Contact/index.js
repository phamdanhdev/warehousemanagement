import React from "react";
import "./style.scss";
export default function ContactPage() {
  return (
    <div className="_contactPage">
      <h3>Phần mềm Quản Lý Bán Hàng</h3>
      <p>
        Sản phẩm <b>Phần mềm Quản Lý Bán Hàng</b> được phát triển bởi{" "}
        <b>phamdanh.dev</b> có toàn bộ bản quyền quản lý sản phẩm dựa theo{" "}
        <b>Điều 3, Phần 1, Luật Sở Hữu Trí Tuệ 50/2005/QH11.</b>
      </p>
      <p>
        Quý khách hàng có nhu cầu tích hợp thêm chức năng hoặc phản ánh về lỗi
        phát sinh, vui lòng liên hệ:
        <br />
        <b>Email: phamdanh.dev@gmail.com</b>
        <br />
        <b>Phone: 0971520653</b>
      </p>

      <h5>&copy; Copyright 2021 phamdanh.dev. All Rights Reserved.</h5>
    </div>
  );
}
