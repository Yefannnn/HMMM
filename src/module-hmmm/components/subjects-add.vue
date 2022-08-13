<template>
  <el-dialog :title="title" :visible="subjectDialog" width="30%" center @close="btnCancel">
    <el-form ref="formData" :model="formdata">
      <el-form-item :rules="rules" label="学科名称" label-width="80px" prop="subjectName">
        <el-input v-model="formdata.subjectName" placeholder="请输入学科名称"></el-input>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-switch
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
    }
  },
  data () {
    return {
      title: '新增学科',
      formdata: {
        subjectName: '',
        isFrontDisplay: this.value === true ? 0 : 1
      },
      value: true,
      rules: [{ required: true, message: '请输入学科名称', trigger: 'blur' }]
    }
  },
  methods: {
    btnOk () {
      this.$refs.formData.validate(async isOK => {
        if (isOK) {
          if (this.formdata.id) {
            await editsubject({ ...this.formdata })
            this.$emit('addsubject')
            this.$emit('update:subjectDialog', false)
          } else {
            this.title = '新增学科'
            await addsubject({ ...this.formdata })
            // console.log({ ...this.formdata })
            this.$emit('addsubject')
            this.$emit('update:subjectDialog', false)
          }
        }
      })
    },
    btnCancel () {
      this.$refs.formData.resetFields()
      this.subjectName = ''
      this.$emit('update:subjectDialog', false)
    }
  }
}
</script>

<style scoped lang="scss"></style>
