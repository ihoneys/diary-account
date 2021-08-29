import React from 'react';
import { useHistory } from 'react-router';
import PropsType from 'prop-types';
import { Icon, NavBar } from 'zarm';
import s from './style.module.less';

const Header = ({ title = '' }) => {
  const history = useHistory();
  return (
    <div className={s.headerWarp}>
      <div className={s.block}>
        <NavBar title={title} className={s.header} left={<Icon type="arrow-left" theme="primary" onClick={() => history.goBack()} />} />
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropsType.string,
};

export default Header;
