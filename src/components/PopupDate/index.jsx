import React, { forwardRef, useState } from 'react';
import { Popup, DatePicker } from 'zarm';
const PopupDate = forwardRef((onSelect, mode = 'date') => {
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(new Date());

  const choseMonth = (value) => {
    setNow(value);
    setShow(false);
  };
  return (
    <Popup visible={show} direction="bottom" onMaskClick={() => setShow(false)} destroy={false} mountContainer={() => document.body}>
      <div>
        <DatePicker visible={show} value={now} mode={mode} onOk={choseMonth} onCancel={() => setShow(false)} />
      </div>
    </Popup>
  );
});

export default PopupDate;
