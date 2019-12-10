import React, { useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Form,
  FormInputField,
  FormStrategy,
  Validators,
  Notify
} from 'zent';
import './sass/login.sass';
import 'zent/css/index.css';
import Axios from 'axios';
import { Tabs } from 'zent';

const TabPanel = Tabs.TabPanel;

const equalsPasswd = (value, ctx) => {
  console.log(ctx.getSectionValue('password'));
  if (value !== ctx.getSectionValue('password').password) {
    return {
      name: 'passwordEqual',
      message: '两次填写的密码不一致'
    };
  }
  return null;
};

export const App = () => {
  const [activeId, setActiveId] = useState(0);

  const loginForm = Form.useForm(FormStrategy.View);
  const resigterForm = Form.useForm(FormStrategy.View);

  const handleLogin = async () => {
    const value = loginForm.getValue();
    const data = await Axios.post('http://localhost:8080/api/login', value);
    if (data.data.success) {
      Notify.success('登录成功！');
      location.pathname = '/';
    } else {
      Notify.error(data.data.msg);
    }
  };

  const handleRes = async () => {
    const value = resigterForm.getValue();
    const data = await Axios.post('http://localhost:8080/api/register', value);
    if (data.data.success) {
      Notify.success('注册成功');
      resigterForm.resetValue();
    } else {
      Notify.error(data.msg);
    }
  };

  const renderResForm = () => (
    <Form layout="horizontal" form={resigterForm}>
      <FormInputField
        name="username"
        label="用户名："
        required="请输入用户名"
      ></FormInputField>
      <FormInputField
        name="password"
        label="密码："
        required
        props={{ type: 'password' }}
      ></FormInputField>
      <FormInputField
        name="confirmPassword"
        label="确认密码："
        required
        props={{
          type: 'password'
        }}
        validators={[equalsPasswd]}
      ></FormInputField>
      <FormInputField
        name="email"
        label="邮件："
        validators={[Validators.email('请输入邮箱地址')]}
        required
      ></FormInputField>
      <Button htmlType="submit" type="primary" outline onClick={handleRes}>
        提交
      </Button>
      <Button type="danger" outline onClick={() => resigterForm.resetValue()}>
        清空
      </Button>
    </Form>
  );

  const renderLogin = () => (
    <Form form={loginForm} layout="horizontal">
      <FormInputField
        name="username"
        required="请输入用户名"
        label="用户名："
      ></FormInputField>
      <FormInputField
        name="password"
        required="请输入密码"
        label="密码："
        props={{
          type: 'password'
        }}
      ></FormInputField>
      <Button htmlType="submit" onClick={handleLogin} outline type="primary">
        提交
      </Button>
    </Form>
  );

  const handleTabChange = id => {
    setActiveId(id);
  };

  return (
    <div className="wrapper">
      <Tabs activeId={activeId} onChange={handleTabChange}>
        <TabPanel tab={<span>登录</span>} id={0}>
          {renderLogin()}
        </TabPanel>
        <TabPanel tab={<span>注册</span>} id={1}>
          {renderResForm()}
        </TabPanel>
      </Tabs>
    </div>
  );
};
