<template>
  <div class="container">
    <el-card>
      <div class="header">
        <h4>{{$route.query?.id ? '试题修改' : '试题新增'}}</h4>
      </div>
      <div class="fromMain">
        <el-form
          ref="questionForm"
          label-width="80px"
          class="questionForm"
          :model="questionForm"
          :rules="QuestionsRules"
        >
          <el-form-item label="学科" prop="subjectID">
            <el-select
              v-model="questionForm.subjectID"
              placeholder="请选择学科"
              class="elSelect"
            >
              <el-option
                v-for="item in subJcetList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录" prop="catalogID">
            <el-select
              v-model="questionForm.catalogID"
              placeholder="请选择目录"
              class="elSelect"
            >
              <el-option
                v-for="(item,index) in catalogue"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业" prop="enterpriseID">
            <el-select
              v-model="questionForm.enterpriseID"
              placeholder="请选择企业"
              class="elSelect"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.company"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 城市双下拉 -->
          <el-form-item label="城市" prop="province">
            <el-col :span="11">
              <el-select
                v-model="questionForm.province"
                placeholder="请选择省份"
              >
                <el-option
                  v-for="item in ProvincesList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-select v-model="questionForm.city" placeholder="请选择地区">
                <el-option
                  v-for="item in CitysList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <!-- 方向 -->
          <el-form-item label="方向" prop="direction">
            <el-select
              v-model="questionForm.direction"
              placeholder="请选择方向"
              class="elSelect"
            >
              <el-option
                v-for="item in directionList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 题型 -->
          <el-form-item label="题型" prop="questionType">
            <el-radio-group
              v-for="item in questionTypeList"
              :key="item.value"
              v-model="questionForm.questionType"
            >
              <el-radio style="margin-right: 30px" :label="item.label">{{
                item.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 难度 -->
          <el-form-item label="难度" prop="difficulty">
            <el-radio-group
              v-model="questionForm.difficulty"
              v-for="item in difficultyList"
              :key="item.value"
            >
              <el-radio style="margin-right: 30px" :label="item.label">{{
                item.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 题干 富文本   object []-->
          <el-form-item label="题干" prop="question">
            <RichText
              v-model="questionForm.question"
              @change="onQuestionEditorChange"
              class="richText"
            />
          </el-form-item>
          <!-- 选项组件 -->
          <questionOption
            :OptionIsRight="OptionIsRight"
            :questionForm="questionForm"
            :questionOptionsCopy="questionOptionsCopy"
            @addOptions="addOptions"
            @delOptions="delOptions"
          >
          </questionOption>

          <!-- 解析视频 -->
          <el-form-item label="解析视频">
            <el-input v-model="questionForm.videoURL"></el-input>
          </el-form-item>
          <!-- 答案解析 富文本 -->
          <el-form-item label="答案解析">
            <RichText
              v-model="questionForm.answer"
              @change="onAnswerEditorChange"
              class="richText"
            />
          </el-form-item>
          <!-- 题目备注 -->
          <el-form-item label="题目备注" prop="remarks">
            <el-input type="textarea" v-model="questionForm.remarks"></el-input>
          </el-form-item>
          <!-- 试题标签 -->
          <el-form-item label="试题标签" prop="tags">
            <el-select
              multiple
              v-model="questionForm.tags"
              placeholder="请选择活动区域"
              collapse-tags
              @change="changeTags"
            >
              <el-option
                v-for="item in catalogue"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
              <template #empty>
                <span>11</span>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :type="this.$route.query?.id? 'success' :'primary'" @click="onSubmit">{{this.$route.query?.id? '确认修改' : "确认添加"}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  questionSubjectAPI,
  catalogueListApi,
  getCompanyListAPI,
  portQuestionAPI,
  getQuestionDetailAPI,
  exitQuestionAPI
} from '@/api/hmmm/questions.js'
import RichText from '../components/rich-text.vue'
import { provinces, citys } from '@/api/hmmm/citys.js'
import { direction, questionType, difficulty } from '@/api/hmmm/constants.js'
import questionOption from '@/module-hmmm/components/question-options'
export default {
  components: {
    RichText,
    questionOption
  },
  data () {
    return {
      questionForm: {
        subjectID: '', // 学科
        catalogID: '', // 目录
        enterpriseID: '', // 企业
        province: '', // 省份
        city: '', // 地区
        direction: '', // 方向
        questionType: '单选', // 题型
        difficulty: '简单', // 难度
        question: '', // 题干
        options: [
          {
            code: 'A', // 代码
            title: '', // 标题
            img: '', // 图片url
            isRight: true // 是否正确，布尔值
          },
          {
            code: 'B', // 代码
            title: '', // 标题
            img: '', // 图片url
            isRight: true // 是否正确，布尔值
          },
          {
            code: 'C', // 代码
            title: '', // 标题
            img: '', // 图片url
            isRight: false // 是否正确，布尔值
          },
          {
            code: 'D', // 代码
            title: '', // 标题
            img: '', // 图片url
            isRight: false // 是否正确，布尔值
          }
        ],
        answer: '', // 答案解析
        remarks: '' // 题目备注
        // tags: ''
      },
      questionOptionsCopy: [], // 选项的拷贝
      subJcetList: [], // 存放学科数据对象
      catalogue: [], // 存放目录分类的数据对象
      companyList: [], // 获取公司
      ProvincesList: [], // 获取省市数据
      CitysList: [], // 区县数据
      directionList: direction, // 方向数据
      questionTypeList: questionType, // 题型列表
      difficultyList: difficulty, // 难度
      tagsList: [], // 标签数组
      questionDetial: [], // 回显数据
      QuestionsRules: {
        subjectID: [{ required: true, message: '请写必填项', trigger: 'blur' }],
        catalogID: [{ required: true, message: '请写必填项', trigger: 'blur' }],
        enterpriseID: [
          { required: true, message: '请写必填项', trigger: 'blur' }
        ],
        province: [{ required: true, message: '请写必填项', trigger: 'blur' }],
        direction: [{ required: true, message: '请写必填项', trigger: 'blur' }],
        questionType: [
          { required: true, message: '请写必填项', trigger: 'blur' }
        ],
        difficulty: [
          { required: true, message: '请写必填项', trigger: 'blur' }
        ],
        question: [{ required: true, message: '请写必填项', trigger: 'blur' }],
        remarks: [{ required: true, message: '请写必填项', trigger: 'blur' }],
        tags: [{ required: true, message: '请写必填项', trigger: 'blur' }]
      }
      // routerId: this.$router.query.id
    }
  },
  created () {
    this.questionOptionsCopy = this.questionForm.options
    // 回显数据
    this.getQuestionDetail()
    // 获取学科分类
    this.questionSubject()
    // 获取公司名称
    this.getCompanyList()
    // 获取省份
    this.GetProvinces()
  },
  methods: {
    // 获取学科的分类
    async questionSubject () {
      try {
        const subJectList = await questionSubjectAPI()
        this.subJcetList.push(...subJectList.data)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 获取对应的目录分类
    async catalogueList (newvalue) {
      try {
        const { data } = await catalogueListApi(newvalue)
        this.catalogue.splice(0)
        this.catalogue.push(...data)
        return this.catalogue
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async getCompanyList () {
      const {
        data: { items }
      } = await getCompanyListAPI()
      this.companyList.push(...items)
    },
    // 获取省份数据
    GetProvinces () {
      const data = provinces()
      this.ProvincesList.push(...data)
    },
    // 获取区县数据
    GetCitys (newvalue) {
      const data = citys(newvalue)
      this.CitysList.push(...data)
    },
    // 改变标签
    changeTags (value) {
      this.tagsList = value
    },
    async onSubmit () {
      try {
        await this.$refs.questionForm.validate()
        // 将默认的题型和难度的数据转换成字符串类型
        this.questionForm.questionType = String(this.questionForm.questionType)
        this.questionForm.difficulty = String(this.questionForm.difficulty)
        this.questionForm.videoURL = String(this.questionForm.videoURL)

        // 判断是新增还是修改
        // 新增逻辑
        if (!this.$route.query?.id) {
          await portQuestionAPI({
            ...this.questionForm,
            tags: this.tagsList.join(',')
          })
          this.$message.success('添加成功')
        } else {
          // 修改逻辑
          await exitQuestionAPI({ ...this.questionForm, id: Number(this.$route.query.id), tags: this.tagsList.join(',') })
          this.$message.success('修改成功')
        }

        // 跳转基础题库
        this.$router.push('/questions/list')
        // 删除表单的验证
        this.$refs.questionForm.resetFields()
      } catch (error) {
        console.log(error)
        if (error === false) {
          return this.$message.error('请检查必填项')
        } else {
          // alert('111')
          this.$message.error(error.message)
        }
      }
    },
    onQuestionEditorChange (value) {
      // 富文本中的值全部放进数据对象
      this.questionForm.question = value.html
    },
    onAnswerEditorChange (value) {
      this.questionForm.answer = value.html
    },
    // 增加选项数据
    addOptions (Obj) {
      this.questionForm.options.push(Obj)
    },
    delOptions (code) {
      const index = this.questionForm.options.findIndex(item => item.code === code)
      this.questionForm.options.splice(index, 1)
    },
    // 回显
    async getQuestionDetail () {
      if (!this.$route.query?.id) return
      // 发请求
      try {
        const { data } = await getQuestionDetailAPI(this.$route.query?.id)
        this.questionForm = JSON.parse(JSON.stringify(data))
        // // 回显目录
        const catalog = await this.catalogueList(this.questionForm.subjectID)
        this.questionForm.catalogID = catalog.find(item => {
          return item.value === data.catalogID
        }).value
        // 回显城市
        this.questionForm.city = this.CitysList.find(item => item === data.city)
        // 回显tags
        this.questionForm.tags = data.tags.split(',')

        // 数据赋值
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  },
  watch: {
    'questionForm.subjectID' (newvalue) {
      // 只要是改变了，先直接把目录数组置空
      this.catalogue.splice(0)
      this.questionForm.catalogID = ''
      if (newvalue) {
        this.catalogueList(newvalue)
      }
    },
    'questionForm.province' (newvalue) {
      // 先清除区县的数据
      this.questionForm.city = ''
      this.CitysList.splice(0)
      this.GetCitys(newvalue)
    }
  },
  computed: {
    // 计算选项是否正确
    OptionIsRight: {
      get () {
        const data = this.questionForm.options.find((item) => item.isRight)
        return data ? data.code : 0
      },
      set (code) {
        // 将指定的code项的isRight 值改成 1，其余改成0
        this.questionForm.options.forEach((item) => {
          item.isRight = false
        })
        this.questionForm.options.find(
          (item) => item.code === code
        ).isRight = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  h4 {
    padding-bottom: 20px;
    border-bottom: 1px solid #999;
  }
}
.fromMain {
  .questionForm {
    width: 600px;
    .elSelect {
      width: 100%;
    }
    .options {
      width: 650px;
      .el-radio {
        margin-bottom: 20px;
      }
    }
  }
  .richText {
    width: 100%;
  }
  .el-input--medium {
    width: 320px;
  }
  .is-checked {
    position: relative;
  }
}
</style>
