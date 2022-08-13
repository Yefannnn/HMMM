<template>
  <div class="container">
    <el-dialog :title="title" width="30%" :visible="showDialog" @close="cancel" >
      <el-form ref="formref" :rules="rules" :model="tagForm">
        <el-form-item label="所属学科" prop="subjectID">
          <el-select v-model="tagForm.subjectID" placeholder="请选择活动区域">
            <el-option
              v-for="(item, index) in subjectNames"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item
          label="目录名称"
          placeholder="请输入目录名称"
          prop="tagName"
        >
          <el-input v-model="tagForm.tagName" style="width: 230px"> </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-row type="flex" justify="end">
          <el-col>
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOk"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { detail, add, update, simpleSubject } from '@/api/hmmm/tags.js'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    title () {
      return this.tagForm.id ? '修改标签' : '新增标签'
    }
  },
  data () {
    return {
      tagForm: {
        subjectName: '',
        tagName: '',
        subjectID: '',
        id: ''
      },
      subjectNames: [],
      rules: {
        subjectID: [
          { required: true, message: '请选择所属学科', trigger: 'blur' }
        ],
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getDetail()
    this.simpleSubject()
  },
  methods: {
    async getDetail (id) {
      if (!this.tagForm.id) return
      const res = await detail(id)
      this.tagForm = res.data
    },
    async btnOk () {
      try {
        await this.$refs.formref.validate()
        if (this.tagForm.id) {
          await update(this.tagForm)
          this.$message.success('修改成功')
        } else {
          await add(this.tagForm)
          this.$message.success('新增成功')
        }
        this.$emit('uplist')
        this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
      }
    },
    async simpleSubject () {
      const res = await simpleSubject()
      this.subjectNames = res.data
    },

    // 点击取消
    cancel () {
      this.form = {
        subjectName: '',
        tagName: ''
      }
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped lang="scss"></style>
