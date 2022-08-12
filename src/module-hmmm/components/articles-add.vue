<template>
  <div class="container">
    <el-dialog :title="title">
      <el-form  :model="form"  :rules="rule" >
        <el-form-item label="文章标题">
          <el-input v-model="form.title" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        title: ''

      }
    }
  }

}
</script>

<style scoped lang="scss">
</style>
