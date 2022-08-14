<template>
  <div class="container">
    <el-dialog title="预览提示" width="60%" :visible="isShow" @close='cancle' >
      <h2>{{ list.title }}</h2>
      <div>
        <span>{{ list.createTime | parseTimeByString }}</span
        >&nbsp;&nbsp; <span>{{ list.username }}</span
        >&nbsp;&nbsp;
        <i class="el-icon-view"> </i>
        <span>{{ list.visits }}</span>
      </div>
      <div class="box">
        <p v-html="list.articleBody" ></p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {

    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: {

      }
    }
  },
  methods: {
    // 回显数据
    preve (val) {
      console.log(val)
      this.list = val
    },
    cancle () {
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style scoped lang="scss">
.box{
border-top: 1px dashed #6666;
background-color: #f5f5f5;
display: flex;

}
.box p{

  align-items: center;
}
</style>
