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
