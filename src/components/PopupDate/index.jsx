import React, { forwardRef, useState } from 'react';
import { Popup, DatePicker } from 'zarm';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
const PopupDate = forwardRef(({ onSelect, mode = 'date' }, ref) => {
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(new Date());

  const choseMonth = (value) => {
    setNow(value);
    setShow(false);
    if (mode === 'month') {
      onSelect(dayjs(value).format('YYYY-MM'));
    } else if (mode === 'date') {
      onSelect(dayjs(value).format('YYYY-MM-DD'));
    }
  };

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

  return (
    <Popup visible={show} direction="bottom" onMaskClick={() => setShow(false)} destroy={false} mountContainer={() => document.body}>
      <div>
        <DatePicker visible={show} value={now} mode={mode} onOk={choseMonth} onCancel={() => setShow(false)} />
      </div>
    </Popup>
  );
});
PopupDate.propTypes = {
  onSelect: PropTypes.func,
  mode: PropTypes.string,
};

export default PopupDate;
