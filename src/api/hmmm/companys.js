/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:32:40
 *
 * 企业管理
 */

import { createAPI } from '@/utils/request'
// 企业管理列表
// export const list = data => createAPI('/companys', 'get', data)
export const list = page => createAPI(`/companys?page=${page.page}&pagesize=${page.pagesize}`, 'get')
// 添加接口
export const add = data => createAPI('/companys', 'post', data)
// 更新接口
export const update = data => createAPI(`/companys/${data.id}`, 'put', data)
// 删除接口
export const removeData = id => createAPI(`/companys/${id}`, 'delete')

// 根据id查询数据
export const getCompanyByIdAPI = id => createAPI(`/companys/${id}`, 'GET')

export const detail = data => createAPI(`/companys/${data.userId}`, 'post', data)

export const disabled = data => createAPI('/companys/state', 'post', data)

export const qiye = data => createAPI('/companys/', 'get', data)
