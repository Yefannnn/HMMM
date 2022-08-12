<template>
  <!-- 题库模板 -->
   <div class="container">
    <el-card>
      <!-- 头部提示和按钮区域 -->
      <div class="head">
        <span class="headSpan">说明：目前支持学科和关键字条件筛选</span>
        <el-button icon="el-icon-edit" type="success" size="small"
          >新增试题</el-button
        >
      </div>

      <!-- 中部菜单区域 -->
      <el-form class="menu">
        <el-row class="menu-item" :gutter="20">
          <el-col class="item" :span="6">
            <span>学科</span>
            <el-select v-model="subjectID" placeholder="请选择" @change="objChange">
              <el-option
                v-for="item in subOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>

          <el-col class="item" :span="6">
            <span>二级目录</span>
            <el-select v-model="secondLevelId" placeholder="请选择">
              <el-option
                v-for="item in secondLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col class="item" :span="6">
            <span>标签</span>
            <el-select v-model="tagsId" placeholder="请选择">
              <el-option
                v-for="item in tagsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col class="item" :span="6">
            <span>关键字</span>
            <el-input v-model="keyValue" placeholder="根据题干搜索"></el-input>
          </el-col>
        </el-row>

        <el-row class="menu-item" :gutter="20">
          <el-col class="item" :span="6">
            <span>试题类型</span>
            <el-select v-model="questionTypeId" placeholder="请选择">
              <el-option
                v-for="item in questionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col class="item" :span="6">
            <span>难度</span>
            <el-select v-model="difficultyId" placeholder="请选择">
              <el-option
                v-for="item in difficulty"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col class="item" :span="6">
            <span>方向</span>
            <el-select v-model="directionId" placeholder="请选择">
              <el-option
                v-for="(item,index) in direction"
                :key="index"
                :label="item"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col class="item" :span="6">
            <span>录入人</span>
            <el-select v-model="creatorId" placeholder="请选择" @visible-change="getUser">
              <el-option
                v-for="item in creatorList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="menu-item" :gutter="20">
          <el-col class="item" :span="6">
            <span>题目备注</span>
            <el-input v-model="notes"></el-input>
          </el-col>
          <el-col class="item" :span="6">
            <span>企业简称</span>
            <el-input v-model="companyName"></el-input>
          </el-col>
          <el-col class="item" :span="6">
            <span>城市</span>
            <el-select style="width: 40%;" v-model="provincesId" placeholder="请选择" @change="chooseCity">
              <el-option
                v-for="(item,ind) in provinces"
                :key="ind"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-select style="width: 40%;" v-model="citysId" placeholder="请选择">
              <el-option
                v-for="(item,ind) in citys"
                :key="ind"
                :label="item"
                :value="ind"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col class="item" :span="6">
            <el-button size="mini" @click="clear">清除</el-button>
            <el-button type="primary" size="mini" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <slot></slot>
      <el-alert :title="`数据一共${pageInfo.counts}条`" type="info" show-icon :closable="false"> </el-alert>
      <!-- 数据表格区域 -->
      <el-table
      :data="tableData">
      <el-table-column
        prop="number"
        label="试题编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="subject"
        label="学科"
        width="80">
      </el-table-column>
      <el-table-column
        prop="catalog"
        label="目录"
        width="80">
      </el-table-column>
      <el-table-column
        prop="questionType"
        label="题型"
        width="80"
        :formatter="filterDifficulty">
      </el-table-column>
      <el-table-column
        prop="question"
        label="题干"
        width="280"
        :formatter="filterHtml">
      </el-table-column>
      <el-table-column
        prop="addDate"
        label="录入时间"
        width="180"
        :formatter="filterTime">
      </el-table-column>
      <el-table-column
        prop="difficulty"
        label="难度"
        width="80"
        :formatter="filterType">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="录入人"
        width="80">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" plain circle size="small"></el-button>
          <el-button type="success" icon="el-icon-edit" plain circle size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle size="small" @click="deleteMsg(scope.row.id)"></el-button>
          <el-button type="warning" icon="el-icon-check" plain circle size="small" @click="check"></el-button>
      </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div class="block">
    <el-pagination background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout=" prev, pager, next, sizes,jumper"
      :current-page="pageInfo.page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageInfo.pagesize"
      :total="pageInfo.counts">
    </el-pagination>
  </div>
    </el-card>
  </div>
</template>

<script>
import { getQuestionsList, getSubjectList, getSecondLevel, getTagsList, getUserList, delQuestion } from '@/api/hmmm/questions.js'
import { findDifficultyType, formatDate, html2Text } from '@/utils/index.js'
import { difficulty, questionType, direction } from '@/api/hmmm/constants.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
export default {
  data () {
    return {
      tableData: [],
      subOptions: [], // 学科数据
      subjectID: '', // 学科值
      secondLevelOptions: [], // 二级目录数据
      secondLevelId: '', // 二级目录值
      tagsOptions: [], // 标签数据
      tagsId: '',
      keyValue: '', // 关键字
      questionType: [], // 试题类型
      questionTypeId: '',
      difficulty: [], // 难度
      difficultyId: '', // 难度Id
      direction: [], // 方向
      directionId: '',
      creatorList: [], // 录入人数据
      creatorId: '',
      notes: '', // 题目备注
      companyName: '', // 企业简称
      provinces: [], // 城市数据
      provincesId: '', // 城市下标
      citys: [], // 区域数据
      citysId: '',
      pageInfo: {
        page: 1,
        pagesize: 5,
        counts: 10
      }
    }
  },
  mounted () {
    this.getQList()
    this.getSubList()
    this.difficulty = difficulty // 获取难度
    this.questionType = questionType // 获取难度
    this.direction = direction // 获取方向
    this.provinces = provinces() // 获取城市
  },
  methods: {
    // 获取题库数据列表
    async getQList (obj) {
      const { data } = await getQuestionsList(obj || this.pageInfo)
      this.tableData = data.items
      this.pageInfo.counts = data.counts
    },
    // 获取学科列表
    async getSubList () {
      const { data } = await getSubjectList()
      this.subOptions = data
    },
    // 选择学科
    async objChange (value) {
      this.subjectID = value
      // 获取二级目录
      const { data } = await getSecondLevel(value)
      this.secondLevelOptions = data
      // 获取标签列表
      const res = await getTagsList(value)
      this.tagsOptions = res.data
    },
    // 获取录入人
    async getUser () {
      const { data } = await getUserList()
      this.creatorList = data
    },
    chooseCity (value) {
      this.citys = citys(value) // 获取地区
    },
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
    // 改变每页条数触发
    handleSizeChange (num) {
      this.pageInfo.pagesize = num
      this.getQList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (page) {
      this.pageInfo.page = page
      this.getQList()
    },

    // 清除
    clear () {
      this.subjectID = ''
      this.secondLevelId = ''
      this.tagsId = ''
      this.keyValue = ''
      this.questionTypeId = ''
      this.difficultyId = ''
      this.directionId = ''
      this.creatorId = ''
      this.notes = ''
      this.companyName = ''
      this.provincesId = ''
      this.citysId = ''
      this.secondLevelOptions = []
      this.tagsOptions = []
      this.citys = []
      this.getQList() // 重新获取所有数据
    },
    // 搜索
    async search () {
      const obj = { ...this.pageInfo }
      if (this.subjectID) obj.subjectID = this.subjectID
      if (this.keyValue) obj.keyword = this.keyValue
      if (!this.subjectID && !this.keyValue) return
      this.getQList(obj)
    },

    // 表格按钮事件
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
      } catch (error) {

      }
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
      } catch (error) {

      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 10px;

  .head {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    .headSpan {
      font-size: 12px;
      color: pink;
      top: 0;
    }
  }
  .menu {
    .menu-item {
      .item {
        margin-bottom: 18px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        ::v-deep .el-select,.el-input{
          width: 80%;
        }
        span {
          text-align: right;
          margin-right: 12px;
          width: 80px;
          font-size: 14px;
          color: rgb(96, 98, 102);
          font-weight: 700;
        }
      }
    }
  }
  .el-alert{
    margin-bottom: 15px;
  }
  .block{
    margin-top: 20px;
    text-align: right;
  }
}
</style>
