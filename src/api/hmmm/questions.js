/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:49:44
 *
 * 题库有关的接口：自己写吧~~  已经被张老师删了 ^_^
 */
import { createAPI } from '@/utils/request'

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
