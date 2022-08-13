<template>
  <el-dialog
    title="题目预览"
    :visible.sync="dialogVisible"
    width="60%"
    @close="closeBtn"
  >
    <el-row :gutter="20">
    <el-col :span="6">
        <div class="grid-content bg-purple">
            <span>【题型】：</span>
            <span>单选题</span>
        </div>
    </el-col>
    <el-col :span="6">
        <div class="grid-content bg-purple">
            <span>【题型】：</span>
            <span>单选题</span>
        </div>
    </el-col>

</el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeBtn">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { perviewQuestionAPI, getQuestionDetailAPI } from '@/api/hmmm/questions.js'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    questionId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  methods: {
    // 关闭弹窗
    closeBtn () {
      this.$emit('closeDiolog', false)
    },
    // 获取题组的编号
    async getQuestionNumber (id) {
      const { data } = await getQuestionDetailAPI(id)
      console.log(' data', data)
    },
    // 获取预览数据
    async perviewQuestion (id) {
      const { data } = await perviewQuestionAPI(id)
      console.log('data', data)
    }
  }
}
</script>

<style>
</style>
