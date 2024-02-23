import { typeMap } from "@/utils";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Cell } from "zarm";
import CustomIcon from "../CustomIcon";
import s from "./style.module.less";

const BillItem = ({ bill }) => {
  const [income, setIncome] = useState(0); // 收入
  const [expense, setExpense] = useState(0); // 收入
  const history = useHistory();

  // 当添加账单是，bill.bills 长度变化，触发当日收支总和计算。
  useEffect(() => {
    // 初始化将传入的 bill 内的 bills 数组内数据项，过滤出支出和收入。
    // payType 为支出；2 为收入
    // 通过 reduce 累加
    const _income = bill.bills
      .filter((i) => i.payType === 2)
      .reduce((cur, item) => {
        cur += Number(item.amount);
        return cur;
      }, 0);
    setIncome(_income);
    const _expense = bill.bills
      .filter((i) => i.payType === 1)
      .reduce((cur, item) => {
        cur += Number(item.amount);
        return cur;
      }, 0);
    setExpense(_expense);
  }, [bill.bills]);

  const goToDetail = (item) => {
    history.push(`/detail?id=${item.id}`);
  };

  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{bill.date}</div>
        <div className={s.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>￥{income.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>￥{expense.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {bill &&
        bill.bills.map((item) => (
          <Cell
            className={s.bill}
            key={item.id}
            onClick={() => goToDetail(item)}
            title={
              <>
                <CustomIcon
                  className={s.itemIcon}
                  type={item.typeId ? typeMap[item.typeId].icon : 1}
                />
                <span>{item.typeName}</span>
              </>
            }
            description={
              <span
                style={{ color: item.payType === 2 ? "red" : "#39be77" }}
              >{`${item.payType === 1 ? "-" : "+"}${item.amount}`}</span>
            }
            help={
              <div>
                {dayjs(item.date).format("HH:MM")}{" "}
                {item.remark ? `| ${item.remark}` : ""}
              </div>
            }
          ></Cell>
        ))}
    </div>
  );
};
BillItem.porpTypes = {
  bill: PropTypes.object,
};
export default BillItem;
