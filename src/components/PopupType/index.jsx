import { getTypeList } from "@/service/api";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useEffect, useState } from "react";
import { Icon, Popup } from "zarm";
import s from "./style.module.less";

const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("all");
  const [expense, setExpense] = useState([]); // 所有支出的类型
  const [income, setIncome] = useState([]); // 所有收入的类型
  useEffect(async () => {
    const { data: list } = await getTypeList();
    console.log(list, "9999");

    setExpense(list.filter((i) => i.type == 1));
    setIncome(list.filter((i) => i.type == 2));
  }, []);

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }
  const choseType = (item) => {
    setActive(item.id);
    setShow(false);
    onSelect(item);
  };

  return (
    <Popup
      visible={show}
      direction="bottom"
      destroy={false}
      onMaskClick={() => setShow(false)}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon
            type="wrong"
            className={s.cross}
            onClick={() => setShow(false)}
          ></Icon>
        </div>
        <div className={s.content}>
          <div
            onClick={() => choseType({ id: "all" })}
            className={cx({ [s.all]: true, [s.active]: active === "all" })}
          >
            全部类型
          </div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expense.map((item, index) => (
              <p
                key={index}
                className={cx({ [s.active]: active === item.id })}
                onClick={() => choseType(item)}
              >
                {item.name}
              </p>
            ))}
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {income.map((item, index) => (
              <p
                key={index}
                className={cx({ [s.active]: active === item.id })}
                onClick={() => choseType(item)}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

PopupType.propTypes = {
  onSelect: PropTypes.func,
};

export default PopupType;
