import CustomIcon from "@/components/CustomIcon";
import Header from "@/components/Header";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { Modal, Toast } from "zarm";

import PopupAddBill from "@/components/PopupAddBill";

import { deleteBillDetail, getBillDetail } from "@/service/api";
import { typeMap } from "@/utils";
import cx from "classnames";
import dayjs from "dayjs";
import qs from "query-string";
import { useHistory } from "react-router-dom";
import s from "./style.module.less";
const Detail = () => {
  const location = useLocation();
  const history = useHistory();
  const { id } = qs.parse(location.search);

  const [detail, setDetail] = useState({});
  const editRef = useRef();

  useEffect(() => {
    console.log(897979);
    getDetail();
  }, [id]);

  const getDetail = async () => {
    const { data } = await getBillDetail(id);
    setDetail(data);
  };

  const deleteDetail = () => {
    Modal.confirm({
      title: "删除",
      content: "确认删除账单？",
      onOk: async () => {
        const result = await deleteBillDetail(detail.id);
        Toast.show("删除成功");
        history.goBack();
      },
    });
  };
  return (
    <div className={s.detail}>
      <Header title="账单详情" />
      <div className={s.card}>
        <div className={s.type}>
          <span
            className={cx({
              [s.expense]: detail.payType == 1,
              [s.income]: detail.payType == 2,
            })}
          >
            <CustomIcon
              className={s.iconfont}
              type={detail.typeId ? typeMap[detail.typeId].icon : 1}
            />
          </span>
          <span>{detail.typeName || ""}</span>
        </div>
        {detail.payType == 1 ? (
          <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
        ) : (
          <div className={cx(s.amount, s.incom)}>+{detail.amount}</div>
        )}
        <div className={s.info}>
          <div className={s.time}>
            <span>记录时间</span>
            <span>{dayjs(detail.date).format("YYYY-MM-DD HH:mm")}</span>
          </div>
          <div className={s.remark}>
            <span>备注</span>
            <span>{detail.remark || "-"}</span>
          </div>
        </div>
        <div className={s.operation}>
          <span onClick={deleteDetail}>
            <CustomIcon type="shanchu" />
            删除
          </span>
          <span onClick={() => editRef.current && editRef.current.show()}>
            <CustomIcon type="tianjia" />
            编辑
          </span>
        </div>
      </div>
      <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
  );
};

export default Detail;
