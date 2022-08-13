<template>
  <div class='container'>
    <el-dialog :title="titie" width="30%"  :visible="showDialog" >
      <el-form ref="formref" :rules="rules" :model="form">
        <el-form-item label="所属学科" prop="subjectName" >
           <el-select v-model="form.subjectName" placeholder="请选择活动区域">
            <el-option>

            </el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="tagName" >
          <el-input v-model="form.tagName" style="width: 230px" >
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-row type="flex" justify="end">
          <el-col>
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOk()"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { detail, add, update } from '@/api/hmmm/tags.js'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    title () {
      return this.form.id ? '修改标签' : '新增标签'
    }
  },
  data () {
    return {
      titie: '新增标签',
      form: {
        subjectName: '',
        tagName: ''
      },
      subjectNames: [],
      rules: {
        subjectName: [{ required: true, message: '请选择所属学科', trigger: 'blur' }],
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getDetail (id) {
      const res = await detail(id)
      this.form = res.data
    },
    async btnOk () {
      try {
        this.$refs.formRef.validate()
        if (this.form.id) {
          await update(this.form)
          this.$message.success('修改成功')
        } else {
          this.form = await add(this.form)
          this.$message.success('新增成功')
        }
        this.$emit('uplist')
        this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
      }
    },

    // 点击取消
    cancel () {
      this.$refs.formRef.resetFields()
      this.form = {
        subjectName: '',
        tagName: ''
      }
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped lang='less'></style>
