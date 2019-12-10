import React from 'react';
import { Button } from 'zent';
interface Props {}

interface IUserInfo {
  username: string;
  userId: string;
  email: string;
}

interface IGlobal {
  userInfo: IUserInfo;
}

export const App: React.FC<Props> = () => {
  // @ts-ignore
  const _global: IGlobal = { userInfo: window._global };
  console.log(_global);

  const renderUserInfo = (userInfo: IUserInfo) => {
    return (
      <ul>
        <li>
          用户ID: <span>{userInfo.userId}</span>
        </li>
        <li>
          姓名: <span>{userInfo.username}</span>
        </li>
        <li>
          邮箱: <span>{userInfo.email}</span>
        </li>
      </ul>
    );
  };

  const renderUserLogin = () => (
    <div>
      <Button
        type="primary"
        outline
        onClick={() => (location.pathname = '/login')}
      >
        登录
      </Button>
    </div>
  );

  return (
    <div>
      <h1>Index</h1>
      <div>
        {_global.userInfo
          ? renderUserInfo(_global.userInfo)
          : renderUserLogin()}
      </div>
    </div>
  );
};
