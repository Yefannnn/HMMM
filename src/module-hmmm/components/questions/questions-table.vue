<template>
  <div>
    <el-alert
      :title="`数据一共${pageInfo.counts}条`"
      type="info"
      show-icon
      :closable="false"
    >
    </el-alert>
    <!-- 数据表格区域 -->
    <el-table :data="tableData">
      <el-table-column prop="number" label="试题编号" width="120">
      </el-table-column>
      <el-table-column prop="subject" label="学科" width="80">
      </el-table-column>
      <el-table-column prop="catalog" label="目录" width="80">
      </el-table-column>
      <el-table-column
        prop="questionType"
        label="题型"
        width="80"
        :formatter="filterType"
      >
      </el-table-column>
      <el-table-column
        prop="question"
        label="题干"
        width="280"
        :formatter="filterHtml"
      >
      </el-table-column>
      <el-table-column
        prop="addDate"
        label="录入时间"
        width="180"
        :formatter="filterTime"
      >
      </el-table-column>
      <el-table-column
        prop="difficulty"
        label="难度"
        width="80"
        :formatter="filterDifficulty"
      >
      </el-table-column>
      <el-table-column prop="creator" label="录入人" width="80">
      </el-table-column>
      <template v-if="isChoice">
        <el-table-column
          prop="chkState"
          label="审核状态"
          width="120"
          :formatter="filterChkState"
        >
        </el-table-column>
        <el-table-column prop="chkRemarks" label="审核意见" width="150">
        </el-table-column>
        <el-table-column prop="chkUser" label="审核人" width="120">
        </el-table-column>
        <el-table-column
          prop="publishState"
          label="发布状态"
          width="150"
          :formatter="filterPublishState"
        >
        </el-table-column>
      </template>
      <el-table-column v-if="isChoice" label="操作" width="200" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="preview(row.id)"
            >预览</el-button
          >
          <el-button
            type="text"
            size="small"
            :disabled="row.chkState !== 0 ? true : false"
            @click="checkBtn(row.id)"
            >审核</el-button
          >
          <el-button
            type="text"
            size="small"
            :disabled="row.publishState === 1 ? true : false"
            @click="$router.push(`/questions/new?id=${row.id}`)">修改</el-button
          >
          <el-button type="text" size="small" @click="publishQue(row.id,row.publishState)">{{
            row.publishState === 1 ? "下架" : "上架"
          }}</el-button>
          <el-button type="text" size="small" @click="deleteMsg(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column v-else label="操作" width="180">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-view"
            plain
            circle
            size="small"
            @click="preview(row.id)"
          />
          <el-button
            type="success"
            icon="el-icon-edit"
            plain
            circle
            size="small"
            @click="$router.push(`/questions/new?id=${row.id}`)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            circle
            size="small"
            @click="deleteMsg(row.id)"
          />
          <el-button
            type="warning"
            icon="el-icon-check"
            plain
            circle
            size="small"
            @click="addToChoice(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout=" prev, pager, next, sizes,jumper"
        :current-page="pageInfo.page"
        :page-sizes="pageSizes"
        :page-size="pageInfo.pagesize"
        :total="pageInfo.counts"
      >
      </el-pagination>
    </div>
    <el-dialog title="题目审核" :visible='isShowCheck' @close="closeCheck" width="400px">
      <el-radio v-model="checkRes" label="1">通过</el-radio>
      <el-radio v-model="checkRes" label="2">拒绝</el-radio>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入审核意见"
        v-model="textarea"
        style="margin-top:20px;width:360px"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCheck">取 消</el-button>
        <el-button type="primary" @click="submitCheck"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delQuestion, addChoice, qesCheck, publishQueChoice } from '@/api/hmmm/questions.js'
import { findDifficultyType, formatDate, html2Text } from '@/utils/index.js'
import { difficulty, questionType, chkType, publishType } from '@/api/hmmm/constants.js'
export default {
  props: {
    tableData: {
      required: true,
      default: () => []
    },
    pageInfo: {
      required: true,
      default: () => {}
    },
    isChoice: { // 判断是否是精选题库
      type: Boolean,
      default: false
    },
    pageSizes: {
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      isShowCheck: false,
      checkRes: '1',
      textarea: '', // 审核信息
      checkId: ''
    }
  },
  methods: {
    // 筛选困难的枚举值
    filterDifficulty (row, column, cellValue) {
      return findDifficultyType(cellValue, difficulty)
    },
    // 筛选题型的枚举值
    filterType (row, column, cellValue) {
      return findDifficultyType(cellValue, questionType)
    },
    // 过滤时间格式
    filterTime (row, column, cellValue) {
      return formatDate(cellValue, 'yyyy-MM-dd hh:mm:ss')
    },
    // 过滤题干
    filterHtml (row, column, cellValue) {
      return html2Text(cellValue)
    },
    // 过滤审核状态
    filterChkState (row, column, cellValue) {
      return findDifficultyType(cellValue, chkType)
    },
    // 过滤发布状态
    filterPublishState (row, column, cellValue) {
      return findDifficultyType(cellValue, publishType)
    },
    // 改变每页条数触发
    handleSizeChange (num) {
      // 判断如果分页选择后不会改变当前页面数据则不调用接口(并且页数不在第一页)
      if (this.pageSizes[this.pageSizes.indexOf(num) - 1] * this.pageInfo.page >= this.pageInfo.counts && this.pageInfo.page === 1) return
      // 通知父组件重新拉取信息
      this.$emit('getChangeData', 0, num)
    },
    // currentPage 改变时会触发
    handleCurrentChange (page) {
      // 通知父组件重新拉取信息
      this.$emit('getChangeData', 1, page)
    },

    // 表格按钮事件

    // 预览
    preview (id) {
      this.$emit('preview', id)
    },
    // 删除
    async deleteMsg (id) {
      try {
        await this.$confirm('此操作将该题目进行删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delQuestion(id)
        this.$message.success('删除成功')
        this.$emit('getChangeData')
      } catch (error) {

      }
    },
    // 加入精选
    async addToChoice (id) {
      try {
        await this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })
        // 添加进精选
        await addChoice(id, 1)
        this.$message.success('加入精选成功')
        this.$router.push('/questions/choice')
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    // 审核
    checkBtn (id) {
      this.isShowCheck = true
      this.checkRes = '1'
      this.checkId = id
    },
    // 关闭审核
    closeCheck () {
      this.isShowCheck = false
      this.textarea = ''
    },
    // 提交审核
    async submitCheck () {
      try {
        await qesCheck(this.checkId, { id: this.checkId, chkState: this.checkRes - 0, chkRemarks: this.textarea })
        this.closeCheck()
        this.$message.success('审核成功')
        // 通知父组件重新拉取信息
        this.$emit('getChangeData')
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 上架
    async publishQue (id, publishState) {
      const state = publishState ? 0 : 1
      try {
        await this.$confirm(`您确认${state ? '上架' : '下架'}这道题目吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 添加进精选
        await publishQueChoice(id, state)
        this.$message.success('操作成功')
        // 通知父组件重新拉取信息
        this.$emit('getChangeData')
      } catch (error) {

      }
    }
  }
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 15px;
}
.block {
  margin-top: 20px;
  text-align: right;
}
</style>
