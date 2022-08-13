<template>
  <el-dialog :title="title" :visible="subjectDialog" width="30%" center @close="btnCancel">
    <el-form ref="formData" :model="formdata">
      <el-form-item :rules="rules" label="学科名称" label-width="80px" prop="subjectName">
        <el-input v-model="formdata.subjectName" placeholder="请输入学科名称"></el-input>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-switch
        @change="values"
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
    </el-form>
    <!-- footer部分 -->
    <el-row slot="footer" type="flex" justify="end">
      <el-col>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addsubject, editsubject } from '@/api/hmmm/subjects'
export default {
  props: {
    subjectDialog: {
      type: Boolean,
      default: false
    },
    subjectId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formdata: {
        subjectName: '',
        isFrontDisplay: this.value === true ? 0 : 1,
        id: ''
      },
      value: true,
      rules: [{ required: true, message: '请输入学科名称', trigger: 'blur' }]
    }
  },
  methods: {
    values (e) {
      // console.log('e', e)
      // debugger
      // this.value = e
      // console.log(this.value)
      // console.log(this.formdata.isFrontDisplays)
    },
    btnOk () {
      this.$refs.formData.validate(async isOK => {
        if (isOK) {
          // 给isFrontDisplay重新赋值
          if (this.value === true) {
            this.formdata.isFrontDisplay = 1
          } else {
            this.formdata.isFrontDisplay = 0
          }
          if (this.formdata.id) {
            await editsubject({ ...this.formdata, id: this.formdata.id })
          } else {
            // this.title = '新增学科'
            await addsubject({ ...this.formdata, id: Math.random().toFixed(3) * 1000 })
            // console.log({ ...this.formdata })
          }
          this.$emit('addsubject')
          this.$refs.formData.resetFields()
          this.subjectName = ''
          this.$emit('update:subjectDialog', false)
        }
      })
    },
    btnCancel () {
      this.$refs.formData.resetFields()
      this.subjectName = ''
      this.$emit('update:subjectId', '')
      this.$emit('update:subjectDialog', false)
    }
  },
  computed: {
    title () {
      return this.subjectId === '' ? '新增学科' : '修改学科'
    }
  }
}
</script>

<style scoped lang="scss"></style>
