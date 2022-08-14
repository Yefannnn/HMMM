import { createAPI } from '@/utils/request'

// 学科基础详情
export const subjectList = data => createAPI('/subjects', 'get', data)

// 学科添加
export const addsubject = data => createAPI('/subjects', 'post', data)

// 学科修改
export const editsubject = data => createAPI(`/subjects/${data.id}`, 'PUT', data)

// 学科删除
export const delsubject = data => createAPI(`/subjects/${data.id}`, 'delete', data)

// 学科简单列表
export const simpleSubject = data => createAPI('/subjects/simple', 'get', data)

// 目录详情
export const DirectoryList = data => createAPI('/directorys', 'get', data)

// 目录状态
export const DirectoryState = data => createAPI(`/directorys/${data.id}/${data.state}`, 'post', data)

// 新增目录
export const adddirectory = data => createAPI('/directorys', 'post', data)

// 修改目录
export const editdirectory = data => createAPI(`/directorys/${data.id}`, 'put', data)

// 删除目录
export const deldirectory = data => createAPI(`/directorys/${data.id}`, 'delete', data)

// 目录简单列表
export const simpleDirectory = data => createAPI('/directorys/simple', 'get', data)
