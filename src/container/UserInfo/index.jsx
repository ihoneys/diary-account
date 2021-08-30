import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FilePicker, Button, Toast, Input } from 'zarm';
import Header from '@/components/Header';
import { getUser, uploadAvatar, editUserInfo } from '@/service/api';
import s from './style.module.less';
import { imageUrlTrans } from '@/utils';
const UserInfo = () => {
  const history = useHistory(); // 路由实例
  const [avatar, setAvatar] = useState('');
  const [signature, setSignature] = useState('');

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const { data: userInfo } = await getUser();
    setAvatar(imageUrlTrans(userInfo.avatar));
    setSignature(userInfo.signature);
  };
  const handleSelect = async (file) => {
    if (file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不得超过200kb');
      return;
    }
    let formData = new FormData();
    formData.append('file', file.file);
    const res = await uploadAvatar(formData);
    setAvatar(imageUrlTrans(res.data));
  };

  const save = async () => {
    const res = await editUserInfo({
      signature,
      avatar,
    });
    console.log(res);
    Toast.show('修改成功');
    history.goBack();
  };
  return (
    <>
      <Header title={'用户信息'} />
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="avatar" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker onChange={handleSelect} accept="image/*">
                <Button theme="primary" size="xs">
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input clearable type="text" value={signature} placeholder="请输入个性签名" onChange={(value) => setSignature(value)} />
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme="primary">
          保存
        </Button>
      </div>
    </>
  );
};
export default UserInfo;
