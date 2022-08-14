<template>
  <div class="container">
    <el-dialog :title="title" :visible="showDialog" @close="cancel">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章内容" prop="articleBody">
          <!-- <RichText v-model="articleBody" >
          </RichText> -->

          <quill-editor
            v-model="form.articleBody"
            class="myQuillEditor"
            :options="editorOption"
          />

          <div v-html="data"></div>
        </el-form-item>
        <el-form-item label="视频地址" prop="videoURL">
          <el-input v-model="form.videoURL" placeholder="请输入视频地址" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-row type="flex" justify="end">
          <el-col :span="6">
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
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

// import RichText from '@/module-hmmm/components/rich-text'
import { detail, add, update } from '@/api/hmmm/articles.js'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    // RichText,
    quillEditor
  },
  data () {
    return {
      data: '',
      editorOption: {},
      form: {
        id: '',
        title: '',
        articleBody: '',
        videoURL: ''
      },
      rules: {
        title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        articleBody: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title () {
      return this.form.id ? '修改文章' : '新增文章'
    }
  },
  methods: {
    // 获取文章详情
    async getDetail (id) {
      const res = await detail(id)
      this.form = res.data
      console.log(res.data)
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
        title: '',
        articleBody: '',
        videoURL: ''
      }
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>
.ql-editor {
  height: 150px;
}
</style>
