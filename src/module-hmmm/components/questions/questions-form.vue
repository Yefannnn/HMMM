<template>
  <!-- 题库顶部表单模板 -->
   <div>
      <!-- 头部提示和按钮区域 -->
      <div class="head">
        <span class="headSpan">说明：目前支持学科和关键字条件筛选</span>
        <el-button icon="el-icon-edit" type="success" size="small"
          @click="$router.push('/questions/new')">新增试题</el-button
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
  </div>
</template>

<script>
import { getSubjectList, getSecondLevel, getTagsList, getUserList } from '@/api/hmmm/questions.js'
import { difficulty, questionType, direction } from '@/api/hmmm/constants.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
export default {
  data () {
    return {
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
      citysId: ''
    }
  },
  mounted () {
    this.getSubList()
    this.difficulty = difficulty // 获取难度
    this.questionType = questionType // 获取难度
    this.direction = direction // 获取方向
    this.provinces = provinces() // 获取城市
  },
  methods: {
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
      // 通知父组件重新获取所有值
      this.$emit('clearSearch')
    },
    // 搜索
    async search () {
      const obj = { }
      if (this.subjectID) obj.subjectID = this.subjectID
      if (this.keyValue) obj.keyword = this.keyValue
      if (!this.subjectID && !this.keyValue) return
      // 给父组件传值重新获取搜索后的数据
      this.$emit('getSearch', obj)
    }
  }
}
</script>

<style scoped lang="scss">
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
</style>
