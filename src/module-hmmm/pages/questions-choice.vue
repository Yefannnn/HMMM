<template>
  <!-- 精选题库 -->
  <div class="container">
    <el-card>
      <!-- 头部表单区域 -->
      <questionsFormpannel @getSearch="getSearch" @clearSearch="clearSearch" />
      <!-- tab标签栏 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
          <!-- 底部表格区域 -->
          <questionsTablepannel
            :tableData="tableData"
            :pageInfo="pageInfo"
            :pageSizes="pageSizes"
            @getChangeData="getChangeData"
            @preview="preview"
            isChoice
          >

          </questionsTablepannel>
        </el-tab-pane>
        <el-tab-pane label="待审核" name="second">
          <!-- 底部表格区域 -->
          <questionsTablepannel
            :tableData="tableData"
            :pageInfo="pageInfo"
             :pageSizes="pageSizes"
            @getChangeData="getChangeData"
             @preview="preview"
            isChoice
          />
        </el-tab-pane>
        <el-tab-pane label="已审核" name="third">
          <!-- 底部表格区域 -->
          <questionsTablepannel
            :tableData="tableData"
            :pageInfo="pageInfo"
             :pageSizes="pageSizes"
            @getChangeData="getChangeData"
             @preview="preview"
            isChoice
          />
        </el-tab-pane>
        <el-tab-pane label="已拒绝" name="fourth">
          <!-- 底部表格区域 -->
          <questionsTablepannel
            :tableData="tableData"
            :pageInfo="pageInfo"
             :pageSizes="pageSizes"
            @getChangeData="getChangeData"
             @preview="preview"
            isChoice
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <questionPreviewpannel ref="previewRef" :isShow.sync="isShowQuestionPreview" :id="id"/>
  </div>
</template>

<script>
import questionsFormpannel from '../components/questions/questions-form.vue'
import questionsTablepannel from '../components/questions/questions-table.vue'
import questionPreviewpannel from '../components/questions/question-preview.vue'
import { getQueChooseList } from '@/api/hmmm/questions.js'
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
      searchObj: {}, // 判断是否有搜索查询
      activeName: 'first', // 标签栏选中值
      chkState: ''
    }
  },
  mounted () {
    this.getQCList()
  },
  methods: {
    // 获取题库数据列表
    async getQCList () {
      console.log(this.searchObj)
      const obj = {}
      if (this.searchObj !== {}) Object.assign(obj, this.pageInfo, this.searchObj)
      if (this.chkState || this.chkState === 0) Object.assign(obj, this.pageInfo, { chkState: this.chkState })
      const { data } = await getQueChooseList(obj !== {} ? obj : this.pageInfo)
      this.tableData = data.items
      this.pageInfo.counts = data.counts
    },
    // 点击tab标签
    handleClick (value) {
      if (value.label === '全部') {
        this.chkState = ''
      } else if (value.label === '待审核') {
        this.chkState = 0
      } else if (value.label === '已审核') {
        this.chkState = 1
      } else {
        this.chkState = 2
      }
      this.pageInfo = {
        page: 1, // 当前页数
        pagesize: 5, // 每页条数
        counts: 10
      }
      this.getQCList()
    },
    // 清除搜索查询
    clearSearch () {
      this.searchObj = {}
      this.getQCList()
    },
    // 搜索数据
    getSearch (obj) {
      this.searchObj = { ...obj }
      this.getQCList()
    },
    // 表格组件修改分页时触发
    getChangeData (flag, value) {
      if (flag === 1) {
        this.pageInfo.page = value // 修改页数
      } else if (flag === 0) {
        this.pageInfo.pagesize = value // 修改每页条数
      }
      this.getQCList()
    },

    // 触发预览事件
    async preview (id) {
      this.id = id
      await this.$refs.previewRef.getPreviewMsg(id)
      this.isShowQuestionPreview = true
    }
  }
}
</script>

<style scoped>
.container {
  padding: 10px;
}
</style>
