import request from '@/utils/request';
import type { CategoryResponseData, AttrResponseData, Attr } from './type';

enum API {
  // 一级分类
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  ATTR_URL = '/admin/product/attrInfoList/',
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  // 删除某一个已有属性
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

// 一级分类接口
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL);

// 二级分类接口
export const reqC2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id);

// 三级分类接口
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id);

// 获取对应分类下属性和属性值
export const reqAttr = (id1: number | string, id2: number | string, id3: number | string) =>
  request.get<any, AttrResponseData>(API.ATTR_URL + `${id1}/${id2}/${id3}`);

// 新增或删除已有属性接口
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATEATTR_URL, data);

// 删除某个已有的属性业务
export const reqRemoveAttr = (attrId: number) => request.delete<any, any>(API.DELETEATTR_URL + attrId);
