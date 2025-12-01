import { Footer } from "@/components";
import {
  getLoginUserUsingGet,
  userLoginUsingPost,
} from "@/services/xybi/userController";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { Helmet, Link, useModel,history } from "@umijs/max";
import { App, Tabs } from "antd";
import { createStyles } from "antd-style";
import React, { useState } from "react";
import { flushSync } from "react-dom";
import Settings from "../../../../config/defaultSettings";
import { error } from "console";
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

// useEffect(() =>{
//   listFavourPostByPageUsingPost({}).then(res =>{
//     console.error("res",res)
//   })
// })
const Login: React.FC = () => {
  const [type, setType] = useState<string>("account");
  const { setInitialState } = useModel("@@initialState");
  const { styles } = useStyles();
  const { message } = App.useApp();

  /**
   * 登陆成功后，获取用户登录信息
   */
  const fetchUserInfo = async () => {
    //调用后端实际接口，获取到用户信息
    const userInfo = await getLoginUserUsingGet();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLoginUsingPost(values);
      //如果响应值的code为0，则登录成功
      if (res.code === 0) {
        const defaultLoginSuccessMessage = "登录成功！";
        //并弹窗提示登录成功
        message.success(defaultLoginSuccessMessage);
        //登录成功之后获取当前用户的登录信息
        await fetchUserInfo();
        //跳转为登入前的页面
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get("redirect") || "/");
        return;
        //否则，把系统返回的错误信息给用户提示出来
      } else {
        message.error(res.message);
      }
      //为了求稳，捕获一个异常
    } catch (error) {
      const defaultLoginFailureMessage = "登录失败，请重试！";
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {"登录"}
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
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: "account",
                label: "账户密码登录",
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
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Link to="/user/register">注册</Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
function useEffect(arg0: () => void) {
  throw new Error("Function not implemented.");
}

