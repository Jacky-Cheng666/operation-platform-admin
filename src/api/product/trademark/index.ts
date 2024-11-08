import request from '@/utils/request';
import type { TradeMarkResponseData, TradeMark } from './type';

enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  ADD_TRADMARK_URL = '/admin/product/baseTrademark/save',
  UPDATE_TRADMARK_URL = '/admin/product/baseTrademark/update',
  DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}

// 获取已有品牌接口
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`);

// 添加或修改品牌
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_TRADMARK_URL, data);
  } else {
    return request.post<any, any>(API.ADD_TRADMARK_URL, data);
  }
};

// 删除品牌
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETE_TRADEMARK_URL + id);
