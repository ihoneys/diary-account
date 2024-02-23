import BillItem from "@/components/BillItem";
import PopupType from "@/components/PopupType";
import React, { useEffect, useRef, useState } from "react";
import { Icon, Pull } from "zarm";

import { getData } from "@/service/api";
import s from "./style.module.less";

import dayjs from "dayjs";

import CustomIcon from "@/components/CustomIcon";
import PopupDate from "@/components/PopupDate";
import { LOAD_STATE, REFRESH_STATE } from "@/utils";
import PopupAddBill from "../../components/PopupAddBill";

const Home = () => {
  const [page, setPage] = useState(1); // 分页
  const [currentTime, setCurrentTime] = useState(dayjs().format("YYYY-MM"));
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  const [list, setList] = useState([]); // 账单列表
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选的类型
  const [totalExpense, setTotalExpense] = useState(0); // 总收入
  const [totalIncome, setTotalIncome] = useState(0); // 总支出

  const typeRef = useRef();
  const monthRef = useRef();
  const addRef = useRef();

  useEffect(() => {
    getBillList();
  }, [page, currentSelect, currentTime]);

  const getBillList = async () => {
    const { data } = await getData({
      page,
      page_size: 10,
      date: currentTime,
      typeId: currentSelect.id || "all",
    });
    console.log(data, "data");
    if (page === 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage);
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  };

  // 请求列表数据
  const refreshData = () => {
    console.log("refreshData");
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };

  const loadData = () => {
    console.log("loadData", page, totalPage);
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  };

  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentSelect(item);
  };

  const selectMonth = (value) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(value);
    if (value === currentTime) {
      getBillList();
    }
  };

  const toggle = () => {
    typeRef.current && typeRef.current.show();
  };

  const monthToggle = () => {
    monthRef.current && monthRef.current.show();
  };

  const addToggle = () => {
    addRef.current && addRef.current.show();
  };
  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>
            总支出：<b>￥{totalExpense}</b>
          </span>
          <span className={s.income}>
            总收入：<b>￥{totalIncome}</b>
          </span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left}>
            <span className={s.title} onClick={toggle}>
              {currentSelect.name || "全部类型"}{" "}
              <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
          <div className={s.right}>
            <span className={s.time} onClick={monthToggle}>
              {currentTime}
              <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
          </Pull>
        ) : null}
      </div>
      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
      <PopupAddBill ref={addRef} onReload={refreshData} />
      <div className={s.add} onClick={addToggle}>
        <CustomIcon type="tianjia"></CustomIcon>
      </div>
    </div>
  );
};

export default Home;
