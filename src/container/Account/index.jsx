import React, { memo } from 'react';
import Header from '@/components/Header';
import { Button, Cell, Input, Toast } from 'zarm';
import s from './style.module.less';
import { createForm } from 'rc-form';
import { modifyPassword } from '@/service/api';
const Account = (props) => {
  const { getFieldProps } = props.form;
  const submit = () => {
    props.form.validateFields(async (err, value) => {
      if (!err) {
        if (value.newpass !== value.newpass2) {
          Toast.show('新密码输入不一致');
          return;
        }
        await modifyPassword({
          old_pass: value.oldpass,
          new_pass: value.newpass,
          new_pass2: value.newpass2,
        });
        Toast.show('修改成功');
      }
    });
  };
  return (
    <>
      <Header title={'重置密码'} />
      <div className={s.account}>
        <div className={s.form}>
          <Cell title="原密码">
            <Input clearable type="text" placeholder="请输入原密码" {...getFieldProps('oldpass', { rules: [{ required: true }] })} />
          </Cell>
          <Cell title="新密码">
            <Input clearable type="text" placeholder="请输入新密码" {...getFieldProps('newpass', { rules: [{ required: true }] })} />
          </Cell>
          <Cell title="确认密码">
            <Input clearable type="text" placeholder="请再此输入新密码确认" {...getFieldProps('newpass2', { rules: [{ required: true }] })} />
          </Cell>
        </div>
        <Button className={s.btn} theme="primary" block onClick={submit}>
          提交
        </Button>
      </div>
    </>
  );
};
export default createForm()(Account);
