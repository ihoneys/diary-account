import React, { useEffect, useState } from 'react';

import { Button, Cell } from 'zarm';

import { getUser } from '@/service/api';
import s from './style.module.less';
import { useHistory } from 'react-router';
const User = () => {
  const [user, setUser] = useState({});

  const history = useHistory();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const { data: userInfo } = await getUser();
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };
  return (
    <div className={s.user}>
      <div className={s.head}>
        <div className={s.info}>
          <span>昵称：{user.username}</span>
          <span>
            <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
            <b>{user.signature || ''}</b>
          </span>
        </div>
        <img className={s.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={user.avatar} alt="" />
      </div>
      <div className={s.content}>
        <Cell
          hasArrow
          title="用户信息修改"
          onClick={() => history.push('/userinfo')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
        />
        <Cell hasArrow title="重制密码" onClick={() => history.push('/account')} icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />} />
        <Cell hasArrow title="关于我们" onClick={() => history.push('/about')} icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />} />
      </div>
      <Button className={s.logout} block theme="danger" onClick={logout}>
        退出登录
      </Button>
    </div>
  );
};

export default User;
