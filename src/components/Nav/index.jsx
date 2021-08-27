import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TabBar } from 'zarm';
import TabIcon from '@/components/CustomIcon';

const NavBar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState('/');
  const history = useHistory();
  const changeTab = (path) => {
    setActiveKey(path);
    history.push(path);
  };

  return (
    <TabBar visible={showNav} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item itemKey="/" title="账单" icon={<TabIcon type="zhangdan" />} />
      <TabBar.Item itemKey="/data" title="统计" icon={<TabIcon type="tongji" />} />
      <TabBar.Item itemKey="/user" title="我的" icon={<TabIcon type="wode" />} />
    </TabBar>
  );
};
NavBar.propTypes = {
  showNav: PropTypes.bool,
};
export default NavBar;
