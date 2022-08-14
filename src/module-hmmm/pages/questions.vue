<template>
  <!-- 基础题库 -->
  <div class="container">
    <el-card>
      <!-- 头部表单区域 -->
      <questionsFormpannel @getSearch="getSearch" @clearSearch="clearSearch" />
      <!-- 底部表格区域 -->
      <questionsTablepannel
        :tableData="tableData"
        :pageInfo="pageInfo"
        :pageSizes="pageSizes"
        @getChangeData="getChangeData"
        @preview="preview"
      >

      </questionsTablepannel>
      <questionPreviewpannel ref="previewRef" :isShow.sync="isShowQuestionPreview" :id="id"/>
    </el-card>
  </div>
</template>

<script>
import { getQuestionsList, delQuestion } from '@/api/hmmm/questions.js'
import questionsFormpannel from '../components/questions/questions-form.vue'
import questionsTablepannel from '../components/questions/questions-table.vue'
import questionPreviewpannel from '../components/questions/question-preview.vue'
export default {
  components: {
    questionsFormpannel,
    questionsTablepannel,
    questionPreviewpannel
  },
  data () {
    return {
      isShowQuestionPreview: false,
      id: '',
      tableData: [],
      pageInfo: {
        page: 1, // 当前页数
        pagesize: 5, // 每页条数
        counts: 10
      },
      pageSizes: [5, 10, 15, 20], // 可选的页数数组
      obj: '' // 判断是否有搜索查询
    }
  },
  mounted () {
    this.getQList()
  },
  methods: {
    // 获取题库数据列表
    async getQList () {
      let searchObj = ''
      if (this.obj) searchObj = Object.assign(this.obj, this.pageInfo)
      const { data } = await getQuestionsList(searchObj || this.pageInfo)
      this.tableData = data.items
      this.pageInfo.counts = data.counts
    },
    // 清除搜索查询
    clearSearch () {
      this.obj = {}
      this.getQList()
    },
    // 搜索数据
    getSearch (obj) {
      this.obj = obj
      console.log(this.obj)
      this.getQList()
    },
    // 表格组件修改分页时触发s
    getChangeData (flag, value) {
      if (flag === 1) {
        this.pageInfo.page = value // 修改页数
      } else if (flag === 0) {
        this.pageInfo.pagesize = value // 修改每页条数
      }
      this.getQList()
    },

    // 表格按钮事件

    // 预览
    // 触发预览事件
    async preview (id) {
      this.id = id
      await this.$refs.previewRef.getPreviewMsg(id)
      this.isShowQuestionPreview = true
    },
    // 删除
    async deleteMsg (id) {
      try {
        await this.$confirm('此操作将该题目进行删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        delQuestion(id)
        this.$message('删除成功')
      } catch (error) {}
    },
    // 加入精选
    async check () {
      try {
        await this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
        // 添加进精选
      } catch (error) {}
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 10px;
}
</style>
