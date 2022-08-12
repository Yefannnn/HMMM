<template>
  <!-- 选项 -->
  <el-form-item
    v-if="questionForm.questionType !== 3"
    label="选项"
    class="options"
  >
    <!-- 单选框组 -->
    <el-radio-group
      v-if="questionForm.questionType === 1"
      v-model="OptionIsRight"
    >
      <el-radio
        :label="optionObj.code"
        v-for="optionObj in questionOptions"
        :key="optionObj.code"
      >
        <span>{{ optionObj.code }} : </span>
        <el-input v-model="optionObj.title"></el-input>
        <uploadImg
          @delOption="delOption"
          :optionCode="optionObj.code"
          @newUpLoadUrl="newUpLoadUrl"
        ></uploadImg>
        <!-- 删除按钮 -->
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="delOption(optionObj.code)"
          circle
        ></el-button>
      </el-radio>
    </el-radio-group>
    <!-- 多选框组 -->
    <el-checkbox-group
      v-else-if="questionForm.questionType === 2"
      v-model="CheckboxOptionIsRight"
    >
      <el-checkbox
        :label="optionObj.code"
        v-for="optionObj in questionOptions"
        :key="optionObj.code"
      >
        <span>{{ optionObj.code }} : </span>
        <el-input v-model="optionObj.title"></el-input>
        <uploadImg
          @delOption="delOption"
          :optionCode="optionObj.code"
          @newUpLoadUrl="newUpLoadUrl"
        ></uploadImg>
        <!-- 删除按钮 -->
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="delOption(optionObj.code)"
          circle
        ></el-button>
      </el-checkbox>
    </el-checkbox-group>
    <el-button type="danger" plain :disabled="compuntedDis" @click="addOptions"
      >+增加选项与答案</el-button
    >
  </el-form-item>
</template>

<script>
import uploadImg from '@/module-hmmm/components/question-uoloadImg'
export default {
  components: {
    uploadImg
  },
  inject: ['reload'],
  created () {
    this.questionOptions = this.questionForm.options
  },
  props: {
    questionForm: {
      type: Object,
      required: true
    },
    OptionIsRight: {
      required: true
    },
    questionOptionsCopy: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      questionOptions: []
    }
  },

  methods: {
    // 删除
    delOption (code) {
      this.$emit('delOptions', code)
    },
    // 图片云端地址
    newUpLoadUrl (UrlObj) {
      this.questionForm.options.find((item) => item.code === UrlObj.code).img =
        UrlObj.url
    },
    addOptions () {
      const xArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const code = this.questionForm.options[this.questionForm.options.length - 1].code
      const index = xArr.indexOf(code)
      //   组织新的数据插入选项中
      const optionObj = {
        code: xArr[index + 1],
        img: '',
        isRight: false,
        title: ''
      }
      //  父组件增加数据
      this.$emit('addOptions', optionObj)
    }
  },
  computed: {
    // 计算是否隐藏
    compuntedDis () {
      return this.questionForm.questionType === 1
    },
    // 计算多选的数组
    CheckboxOptionIsRight: {
      get () {
        const checkboxIsRight = this.questionForm.options.filter(item => item.isRight)
        const isRightArr = []
        checkboxIsRight.forEach(obj => { isRightArr.push(obj.code) })
        return isRightArr
      },
      set (newValue) {
        // console.log(newValue)
        this.questionForm.options.forEach(obj => {
          newValue.forEach(item => {
            if (obj.code === item) {
              obj.isRight = true
            }
          })
        })
      }

    }
  },
  watch: {
    // 'questionForm.questionType' () {
    //   console.log(111)
    //   this.reload()
    // }
  }
}
</script>

<style lang="scss">
.options {
  position: relative;
}
.el-radio {
  margin-bottom: 20px;
  width: 330px;
}
.el-checkbox {
  margin-bottom: 20px;
  width: 340px;
}
.el-button--mini {
  zoom: 0.7;
  position: absolute;
  right: -230px;
  top: -10px;
}
</style>
