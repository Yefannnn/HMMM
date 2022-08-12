<template>
  <div class="container">
    <el-card>
      <!-- 头部 -->
      <el-row class="headerTop">
        <el-col :span="12" flex>
          <span style="font-weight: 700">关键字</span>
          <el-input
            style="width: 200px; margin-left: 25px"
            placeholder="根据编号搜索"
            v-model="keywords"
          ></el-input>
        </el-col>
        <el-col :span="12" style="display: flex; justify-content: end">
          <el-button>清除</el-button>
          <el-button type="primary">搜索</el-button>
        </el-col>
      </el-row>
      <!-- 通知栏 -->
      <el-alert :closable="false" :title="headerTitle" type="info" show-icon style="margin-bottom:20px">
      </el-alert>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column align="center" prop="id" label="编号" width="180"> </el-table-column>
        <el-table-column align="center" prop="questionType" label="题型" width="180">
            <template slot-scope="{row}">
              {{verifyQuestion(row.questionType)}}
            </template>
        </el-table-column>
        <el-table-column align="center" prop="questionIDs" label="题目编号">
          <template slot-scope="{ row }">
            <el-link :underline="false">{{ row.questionIDs }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="addTime" label="录入时间"> </el-table-column>
        <el-table-column align="center" prop="totalSeconds" label="答题时间(s)">
        </el-table-column>
        <el-table-column align="center" prop="accuracyRate" label="正确率(%)">
        </el-table-column>
        <el-table-column align="center" prop="userName" label="录入人"> </el-table-column>
        <el-table-column align="center" prop="address" label="操作">
          <template v-slot="{ row }">
            <el-button
              icon="el-icon-delete"
              circle
              @click="delBtn(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="questionPage.page"
      :page-sizes="[5,10,15,20,30]"
      :page-size="questionPage.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="questionPage.counts">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getQuestionListAPI, delQuestionDataAPI } from '@/api/hmmm/questions.js'
import { difficulty } from '@/api/hmmm/constants.js'
export default {
  data () {
    return {
      // 列表数据
      tableData: [],
      // 分页数据
      questionPage: {
        page: 1, // 当前页数
        pagesize: 5, // 页码值,
        counts: 0 // 总数
      },
      keywords: ''
    }
  },
  computed: {
    headerTitle: {
      get () {
        return '数据一共' + this.questionPage.counts + '条'
      }
    },
    tableDataCopy: {
      get () {
        // 判断什么关键字

        return 1
      }
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (row.questionType === '3') {
        return 'error-row'
      } else if (row.questionType === '2') {
        return 'waring-row'
      }
      return 'success-row'
    },
    // 获取题组列表的数据
    async getQuestionList () {
      const {
        data,
        data: { items }
      } = await getQuestionListAPI(this.questionPage)
      this.questionPage.counts = data.counts
      // 将items里面的questionIs拼接成字符串
      items.forEach((item) => {
        let tempVar = ''
        item.questionIDs.forEach((obj) => {
          tempVar += obj.number
        })
        item.questionIDs = tempVar
      })
      // 收集数据
      this.tableData.splice(0)
      this.tableData.push(...items)
      //
    },
    // 验证题型
    verifyQuestion (typeNumber) {
      return difficulty.find(item => item.value === Number(typeNumber)).label
    },
    // 数目改变
    handleSizeChange (size) {
      this.questionPage.pagesize = size
      this.getQuestionList()
    },
    // 当前页
    handleCurrentChange (page) {
      this.questionPage.page = page
      this.getQuestionList()
    },
    // 删除按钮
    async delBtn (id) {
      try {
        await this.$confirm('确定要删除吗?', {
          options: '提醒'
        })
        await delQuestionDataAPI(id)
        await this.getQuestionList()
        this.$message.success('删除成功,新数据来啦~')
      } catch (error) {
        if (error === 'cancel') { return this.$message.warning('您已取消') } else { this.$message.error(error.message) }
      }
    }
  },
  created () {
    this.getQuestionList()
  }
}
</script>

<style scoped lang='scss'>
::v-deep.el-table .error-row {
  background: rgb(233, 233, 233);
}

::v-deep .el-table .waring-row {
  background: #fbfaf2;
}
::v-deep .el-table .success-row {
  background: #f2fced;
}

.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.headerTop {
  margin-bottom: 20px;
}
</style>
