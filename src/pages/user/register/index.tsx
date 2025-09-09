import { Footer } from "@/components";
import { userRegisterUsingPost } from "@/services/xybi/userController";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { Helmet, Link, history } from "@umijs/max";
import { App, Tabs } from "antd";
import { createStyles } from "antd-style";
import React, { useState } from "react";
import Settings from "../../../../config/defaultSettings";

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: "8px",
      color: "rgba(0, 0, 0, 0.2)",
      fontSize: "24px",
      verticalAlign: "middle",
      cursor: "pointer",
      transition: "color 0.3s",
      "&:hover": {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: "42px",
      position: "fixed",
      right: 16,
      borderRadius: token.borderRadius,
      ":hover": {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "auto",
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: "100% 100%",
    },
  };
});

const Register: React.FC = () => {
  const [type, setType] = useState<string>("account");
  const { styles } = useStyles();
  const { message } = App.useApp();

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    try {
      // 注册
      const res = await userRegisterUsingPost(values);
      // 如果响应值的code为0，则注册成功
      if (res.code === 0) {
        const defaultRegisterSuccessMessage = "注册成功！";
        // 并弹窗提示注册成功
        message.success(defaultRegisterSuccessMessage);
        // 注册成功后跳转到登录页面
        setTimeout(() => {
          history.push("/user/login");
        }, 1000);
        return;
      } else {
        message.error(res.message);
      }
    } catch (error) {
      const defaultRegisterFailureMessage = "注册失败，请重试！";
      console.log(error);
      message.error(defaultRegisterFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {"注册"}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: "1",
          padding: "32px 0",
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: "75vw",
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="XYBI"
          subTitle={"XYBI 是利用AI自动生成可视化图表和学习的分析结论"}
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: "account",
                label: "账户注册",
              },
            ]}
          />

          {type === "account" && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined />,
                }}
                placeholder={"请输入用户名"}
                rules={[
                  {
                    required: true,
                    message: "用户名是必填项！",
                  },
                  {
                    min: 4,
                    message: "用户名不能少于4位",
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                placeholder={"请输入密码"}
                rules={[
                  {
                    required: true,
                    message: "密码是必填项！",
                  },
                  {
                    min: 8,
                    message: "密码不能少于8位",
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                placeholder={"请再次输入密码"}
                rules={[
                  {
                    required: true,
                    message: "确认密码是必填项！",
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Link to="/user/login">已有账户？去登录</Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;