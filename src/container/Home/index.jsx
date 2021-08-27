import React, { useState, useEffect, useRef } from 'react';
import { Icon, Pull } from 'zarm';
import BillItem from '@/components/BillItem';
import PopupType from '@/components/PopupType';

import s from './style.module.less';
import { getData } from '@/service/api';

import dayjs from 'dayjs';

import { LOAD_STATE, REFRESH_STATE } from '@/utils';

const Home = () => {
  const [page, setPage] = useState(1); // 分页
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  const [list, setList] = useState([]); // 账单列表
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选的类型
  const typeRef = useRef();

  useEffect(() => {
    getBillList();
  }, [page, currentSelect]);

  const getBillList = async () => {
    const { data } = await getData({
      page,
      page_size: 5,
      date: currentTime,
      type_id: currentSelect.id || 'all',
    });
    console.log(currentSelect, '______currentSelect');
    if (page === 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalPage(data.totalPage);
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  };

  // 请求列表数据
  const refreshData = () => {
    console.log('refreshData');
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };

  const loadData = () => {
    console.log('loadData', page, totalPage);
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

  const toggle = () => {
    typeRef.current && typeRef.current.show();
  };
  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>
            总支出：<b>￥0.00</b>
          </span>
          <span className={s.income}>
            总收入：<b>￥0.00</b>
          </span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left}>
            <span className={s.title} onClick={toggle}>
              {currentSelect.name || '全部类型'} <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
          <div className={s.right}>
            <span className={s.time}>
              2022-06
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
    </div>
  );
};

export default Home;
