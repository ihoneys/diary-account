import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FilePicker, Button } from 'zarm';
import { getUser } from '@/service/api';
import s from './style.module.less';
const UserInfo = () => {
  const history = useHistory(); // 路由实例
  const [user, setUser] = useState({}); // 用户
  const [avatar, setAvatar] = useState('');
  const [signature, setSignature] = useState('');

  const token = localStorage.getItem('token');
  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const { data: userInfo } = await getUser();
    setUser(userInfo);
    setAvatar(userInfo.avatar);
    setSignature(userInfo.signature);
  };
  const handleSelect = (file) => {
    console.log(file);
    if(file)
    let formData = new FormData();
    formData.append('file', file.file);
  };
  return (
    <div className={s.userinfo}>
      <FilePicker onChange={handleSelect} accept="image/*">
        <Button theme="primary" size="xs">
          点击上传
        </Button>
      </FilePicker>
    </div>
  );
};
export default UserInfo;
