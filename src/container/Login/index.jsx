import CustomIcon from "@/components/CustomIcon";
import { register } from "@/service/api";
import cx from "classnames";
import React, { useCallback, useState } from "react";
import Captcha from "react-captcha-code";
import { Button, Cell, Checkbox, Input, Toast } from "zarm";
import { login } from "../../service/api";
import s from "./style.module.less";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [type, setType] = useState("login");
  // 验证码变化，回调方法
  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha);
  }, []);

  const onSubmit = async () => {
    if (!username) {
      Toast.show("请输入账号");
      return;
    }
    if (!password) {
      Toast.show("请输入密码");
      return;
    }

    try {
      if (type === "login") {
        const { data } = await login({ username, password });
        Toast.show("登录成功");
        // 将 token 写入 localStorage
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        if (!verify) {
          Toast.show("请输入验证码");
          return;
        }
        if (verify != captcha) {
          console.log(verify);
          Toast.show("验证码错误");
          return;
        }
        const result = await register({ username, password });
        Toast.show("注册成功");
        setType("login");
      }
    } catch (error) {
      Toast.show("系统错误");
      console.log(error);
    }
  };
  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span
          className={cx({ [s.avtive]: type === "login" })}
          onClick={() => setType("login")}
        >
          登录
        </span>
        <span
          className={cx({ [s.avtive]: type === "register" })}
          onClick={() => setType("register")}
        >
          注册
        </span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value) => setPassword(value)}
          />
        </Cell>
        {type === "register" ? (
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="password"
              placeholder="请输入验证码"
              onChange={(value) => setVerify(value)}
            />
            <Captcha charNum={4} onChange={handleChange} />
          </Cell>
        ) : null}
      </div>
      <div className={s.operation}>
        {type === "register" ? (
          <div className={s.agree}>
            <Checkbox />
            <label className="text-light">
              阅读并同意<a>《掘掘手札条款》</a>
            </label>
          </div>
        ) : null}
        <Button block theme="primary" onClick={onSubmit}>
          {type === "login" ? "登录" : "注册"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
