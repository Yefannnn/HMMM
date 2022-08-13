
// 题库请求方法
import { createAPI } from '@/utils/request' // 调用createAPI 返回一个 axios实例的调用

// 获取题库详情
export const questionDetailsAPI = id => createAPI(`/questions/${id}`, 'GET')
// 获取学科的简单分类
export const questionSubjectAPI = () => createAPI('/subjects/simple', 'GET')
// 获取目录列表
export const catalogueListApi = (subjectID) => createAPI(`/tags/simple?subjectID=${subjectID}`, 'GET')

// 获取企业列表
export const getCompanyListAPI = () => createAPI('/companys', 'GET')

// 提交试题请求
export const portQuestionAPI = data => createAPI('/questions', 'POST', data)
// 题库详情
export const getQuestionDetailAPI = data => createAPI(`/question/${data}`, 'GET')
// 获取提足列表的数据
export const getQuestionListAPI = data => createAPI(`/questions/randoms?page=${data.page}&pagesize=${data.pagesize}&keyword=${data.keywords}`, 'GET')
// 删除题组的数据
export const delQuestionDataAPI = id => createAPI(`/questions/randoms/${id},'DELETE`)
// 预览题组的数据
export const perviewQuestionAPI = id => createAPI(`/questions/${id}?id=${id}`, 'GET')

/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:49:44
 *
 * 题库有关的接口：自己写吧~~  已经被张老师删了 ^_^
 */

// 获取基础题库列表
export function getQuestionsList (data) {
  return createAPI('/questions', 'get', data)
}

// 获取学科列表
export function getSubjectList (data) {
  return createAPI('/subjects/simple', 'get', data)
}
// 获取二级目录
export function getSecondLevel (subjectID) {
  return createAPI(`/directorys/simple?subjectID=${subjectID}`, 'get')
}

// 标签列表
export function getTagsList (subjectID) {
  return createAPI(`/tags/simple?subjectID=${subjectID}`, 'get')
}

// 获取录入人
export function getUserList () {
  return createAPI('/users/simple', 'get')
}

// 基础题库删除
export function delQuestion (id) {
  return createAPI(`/questions/${id}`, 'DELETE')
}
