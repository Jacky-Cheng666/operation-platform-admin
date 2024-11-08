// 封装本地存储/读取数据
export const SET_TOKEN = (token: string) => {
  window.localStorage.setItem('TOKEN', token);
};

export const GET_TOKEN = () => {
  return window.localStorage.getItem('TOKEN');
};

export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN');
};
