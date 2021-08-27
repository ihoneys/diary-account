import React, { memo } from 'react';
import { Button } from 'zarm';
import s from './style.module.less';
export default memo(function Index() {
  return (
    <div className={s.index}>
      <span>666</span>
      <Button theme="primary">22</Button>
    </div>
  );
});
