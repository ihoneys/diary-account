import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { Popup, Icon, Keyboard, Input, Toast } from 'zarm';
import PopupDate from '../PopupDate';
import CustomIcon from '../CustomIcon';
import s from './style.module.less';
import cx from 'classnames';
import dayjs from 'dayjs';
import { typeMap } from '@/utils';
import { getTypeList, addBillData, updateBillDetail } from '@/service/api';
const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const [show, setShow] = useState(false);
  const [payType, setPayType] = useState('expense');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [currentType, setCurrentType] = useState({});
  const [expense, setExpense] = useState([]); // 支出类型数组
  const [income, setIncome] = useState([]); // 收入类型数组
  const [showRemark, setShowRemark] = useState(false);
  const [remark, setRemark] = useState('');

  const dateRef = useRef();

  const id = detail && detail.id; // 外部传进来的账单详情 id
  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income');
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name,
      });
      setRemark(detail.remark);
      setAmount(detail.amount);
      setDate(dayjs(Number(detail.date)).$d);
    }
  }, [detail]);

  useEffect(async () => {
    const {
      data: { list },
    } = await getTypeList();
    console.log(list);
    const _expense = list.filter((i) => i.type == 1); // 支出类型
    const _income = list.filter((i) => i.type == 2); // 收入类型
    setExpense(_expense);
    setIncome(_income);
    if (!id) {
      setCurrentType(_expense[0]);
    }
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

  const selectDate = (value) => {
    setDate(value);
  };

  const changeType = (type) => {
    setPayType(type);

    setCurrentType(type === 'expense' ? expense[0] : income[0]);
  };

  const handleMoney = (value) => {
    console.log(value);
    if (value === 'delete') {
      let _amount = amount.slice(0, amount.length - 1);
      setAmount(_amount);
      return;
    }

    if (value === 'ok') {
      addBill();
      return;
    }

    if (value === '.' && amount.includes('.')) return;
    if (value !== '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return;

    setAmount(amount + value);
  };

  const addBill = async () => {
    if (!amount) {
      Toast.show('请输入具体金额');
      return;
    }

    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000,
      pay_type: payType === 'expense' ? 1 : 2,
      remark: remark || '',
    };

    if (id) {
      params.id = id;
      const result = await updateBillDetail(params);
      Toast.show('修改成功');
    } else {
      const result = await addBillData(params);
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark('');
      Toast.show('添加成功');
    }
    setShow(false);
    if (onReload) onReload();
  };
  return (
    <Popup visible={show} direction="bottom" onMaskClick={() => setShow(false)} destroy={false} mountContainer={() => document.body}>
      <div className={s.addWrap}>
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Icon type="wrong"></Icon>
          </span>
        </header>
        <div className={s.filter}>
          <div className={s.type}>
            <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>
              支出
            </span>
            <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>
              收入
            </span>
          </div>
          <div className={s.time} onClick={() => dateRef.current && dateRef.current.show()}>
            {dayjs(date).format('MM-DD')} <Icon className={s.arrow} type="arrow-bottom" />
          </div>
        </div>
        <div className={s.money}>
          <span className={s.sufix}>￥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        <div className={s.typeWarp}>
          <div className={s.typeBody}>
            {(payType == 'expense' ? expense : income).map((item) => (
              <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
                <span className={cx({ [s.iconfontWrap]: true, [s.expense]: payType === 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id })}>
                  <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.remark}>
          {showRemark ? (
            <Input autoHeight showLength maxLength={50} type="text" rows={3} value={remark} placeholder="请输入备注信息" onChange={(val) => setRemark(val)} onBlur={() => setShowRemark(false)} />
          ) : (
            <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
          )}
        </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  );
});

export default PopupAddBill;
