<template>
  <el-dialog
    :title="title"
    :visible="directoryDialog"
    width="30%"
    center
    @close="btnCancel"
  >
    <el-form ref="formData" :model="formdata" :rules="rules">
      <!-- 所属学科下拉选择框 -->
      <el-form-item label="学科名称" label-width="80px" prop="subjectName">
        <el-select
          style="width: 255px"
          v-model="formdata.subjectID"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in subjectNames"
            :key="index"
            :label="item.subjectName"
            :value="item.subjectID"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 目录名称输入框 -->
      <el-form-item label="目录名称" label-width="80px" prop="directoryName">
        <el-input
          v-model="formdata.directoryName"
          placeholder="请输入目录名称"
        ></el-input>
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
import {
  adddirectory,
  editdirectory,
  DirectoryList
} from '@/api/hmmm/subjects'
export default {
  props: {
    directoryDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: [],
      title: '新增目录',
      formdata: {
        subjectName: '',
        directoryName: '',
        id: '',
        subjectID: ''
      },
      subjectNames: [],
      value: true,
      rules: {
        subjectID: [{
          required: true,
          message: '请选择学科名称',
          trigger: 'change'
        }],
        directoryName: [{
          required: true,
          message: '请输入目录名称',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.DirectoryList()
    // this.simpleDirectory()
  },
  methods: {
    async DirectoryList () {
      const res = await DirectoryList({ pagesize: 99 })
      // 弹窗的下拉数据
      res.data.items.filter((item) => {
        if (!this.data.includes(item.subjectName) && item.subjectName) {
          this.data.push(item.subjectName)
          this.subjectNames.push({ subjectName: item.subjectName, subjectID: item.subjectID })
          return
        }
        console.log(this.subjectNames)
      })
    },
    btnOk () {
      this.$refs.formData.validate(async (isOK) => {
        if (isOK) {
          console.log(this.formdata.id)
          if (this.formdata.id) {
            await editdirectory({ ...this.formdata })
            this.$emit('adddirectory')
            this.$emit('update:directoryDialog', false)
          } else {
            this.title = '新增学科'
            await adddirectory({ ...this.formdata })
            this.$emit('adddirectory')
            this.$emit('update:directoryDialog', false)
          }
        }
      })
    },
    btnCancel () {
      this.$refs.formData.resetFields()
      this.formdata = {
        subjectName: '',
        directoryName: ''
      }
      this.$emit('update:directoryDialog', false)
    }
  }
}
</script>

<style scoped lang="scss"></style>
