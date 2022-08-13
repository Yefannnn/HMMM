/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 15:16:53
 *
 * 文章
 */

import { createAPI } from '@/utils/request'

// 文章列表
export const list = data => createAPI('/articles', 'get', data)

// 文章简单列表
export const simple = data => createAPI('/articles/simple', 'post', data)

// 文章详情
export const detail = id =>
  createAPI(`/articles/${id}`, 'get')

// 文章添加
export const add = data => createAPI('/articles', 'post', data)

// 文章修改
export const update = data => createAPI(`/articles/${data.id}`, 'put', data)

// 文章删除
export const remove = id =>
  createAPI(`/articles/${id}`, 'delete')

// 文章状态
export const changeState = data => createAPI(`/articles/${data.id}/${data.state}`, 'post')
