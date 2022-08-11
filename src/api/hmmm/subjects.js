import { createAPI } from '@/utils/request'

// 学科基础详情
export const subjectList = data => createAPI('/subjects', 'get', data)

// 学科添加
export const addsubject = data => createAPI('/subjects', 'post', data)

// 学科修改
export const editsubject = data => createAPI(`/subjects/${data.id}`, 'PUT', data)

// 学科删除
export const delsubject = data => createAPI(`/subjects/${data.id}`, 'delete', data)
