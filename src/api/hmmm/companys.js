/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:32:40
 *
 * 企业管理
 */

<<<<<<< Updated upstream
import createAPI from '@/utils/request'

export const list = data => createAPI('/comapnys', 'post')
export const add = data => createAPI('/comapnys', 'post', data)
export const update = data =>
  createAPI(`/comapnys/${data.userId}`, 'get', data)
export const remove = data => createAPI(`/comapnys/${data.id}`, 'get')
export const detail = data =>
  createAPI(`/comapnys/${data.userId}`, 'post', data)
export const disabled = data => createAPI('/comapnys/state', 'post', data)
=======
import { createAPI } from '@/utils/request'
// 企业管理列表
// export const list = data => createAPI('/companys', 'get', data)
export const list = page => createAPI(`/companys?page=${page.page}&pagesize=${page.pagesize}`, 'get')
// 添加接口
export const add = data => createAPI('/companys', 'post', data)
// 更新接口
export const update = id => createAPI(`/companys/${id}`, 'put')
// 删除接口
export const removeData = id => createAPI(`/companys/${id}`, 'delete')

export const detail = data => createAPI(`/companys/${data.userId}`, 'post', data)

export const disabled = data => createAPI('/companys/state', 'post', data)

export const qiye = data => createAPI('/companys/' + data, 'get')
>>>>>>> Stashed changes
