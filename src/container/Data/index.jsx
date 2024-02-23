import CustomIcon from "@/components/CustomIcon";
import PopupDate from "@/components/PopupDate";
import { getBillData } from "@/service/api";
import { typeMap } from "@/utils";
import cx from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Icon, Progress } from "zarm";
import s from "./style.module.less";
const Data = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [totalType, setTotalType] = useState("expense");
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [pieType, setPieType] = useState("expense");
  let proportionChart = null;

  const dateRef = useRef();

  useEffect(() => {
    getData();
    return () => {
      proportionChart.dispose();
    };
  }, [currentMonth]);

  const setPieChart = (data) => {
    if (window.echarts) {
      proportionChart = echarts.init(document.getElementById("proportion"));
      proportionChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          data: data.map((item) => item.typeName),
        },
        series: [
          {
            name: "支出",
            type: "pie",
            radius: "55%",
            data: data.map((item) => {
              return {
                value: item.number,
                name: item.typeName,
              };
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    }
  };

  const getData = async () => {
    const { data } = await getBillData({ date: currentMonth });

    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);

    const expense_data = data.total_data
      .filter((i) => i.payType == 1)
      .sort((a, b) => b.number - a.number);
    const income_data = data.total_data
      .filter((i) => i.payType == 2)
      .sort((a, b) => b.number - a.number);
    setPieChart(pieType == "expense" ? expense_data : income_data);
    setExpenseData(expense_data);
    setIncomeData(income_data);
  };

  const monthShow = () => {
    dateRef.current && dateRef.current.show();
  };

  const selectMonth = (val) => {
    setCurrentMonth(val);
  };

  const changeTotalType = (type) => {
    setTotalType(type);
  };

  const changePieType = (type) => {
    setPieChart(type == "expense" ? expenseData : incomeData);
  };
  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date" />
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>￥{totalExpense}</div>
        <div className={s.income}>共收入:￥{totalIncome}</div>
      </div>
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span
              onClick={() => changeTotalType("expense")}
              className={cx({
                [s.expense]: true,
                [s.active]: totalType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeTotalType("income")}
              className={cx({
                [s.income]: true,
                [s.active]: totalType == "income",
              })}
            >
              收入
            </span>
          </div>
        </div>
        <div className={s.content}>
          {(totalType == "expense" ? expenseData : incomeData).map(
            (item, index) => (
              <div className={s.item} key={index}>
                <div className={s.left}>
                  <div className={s.type}>
                    <span
                      className={cx({
                        [s.expense]: totalType == "expense",
                        [s.income]: totalType == "income",
                      })}
                    >
                      <CustomIcon
                        type={item.typeId ? typeMap[item.typeId].icon : 1}
                      />
                    </span>
                    <span className={s.name}>{item.typeName}</span>
                    <div className={s.progress}>
                      ¥{Number(item.number).toFixed(2) || 0}
                    </div>
                  </div>
                  <div className={s.right}>
                    <div className={s.percent}>
                      <Progress
                        shape="line"
                        theme="primary"
                        percent={Number(
                          (item.number /
                            Number(
                              totalType == "expense"
                                ? totalExpense
                                : totalIncome
                            )) *
                            100
                        ).toFixed(2)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>
            <div className={s.tab}>
              <span
                onClick={() => changePieType("expense")}
                className={cx({
                  [s.expense]: true,
                  [s.active]: pieType == "expense",
                })}
              >
                支出
              </span>
              <span
                onClick={() => changePieType("income")}
                className={cx({
                  [s.income]: true,
                  [s.active]: pieType == "income",
                })}
              >
                收入
              </span>
            </div>
          </div>
          {/* 这是用于放置饼图的 DOM 节点 */}
          <div id="proportion"></div>
        </div>
      </div>
      <PopupDate ref={dateRef} mode="month" onSelect={selectMonth} />
    </div>
  );
};

export default Data;
