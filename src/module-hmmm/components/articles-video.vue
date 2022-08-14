<template>
  <div class="container">
    <el-dialog :visible="playDialog" width="100%" :show-close="false" top="18vh">
      <video :src="videoUrl" autoplay class="video" width="100%"></video>
      <el-button
        @click="btn"
        size="medium"
        class="playbtn"
        icon="el-icon-close"
        circle
      ></el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    playDialog: {
      type: Boolean,
      default: false
    },
    videoUrl: {
      required: true
    }
  },
  methods: {
    btn () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.playbtn {
    position: absolute;
  top: -96px;
  left: 46%;
  background:rgba(0, 0, 0, 0.5);
  border: none;
  width: 50px;
  height: 50px;
  color: #fff;
  font-size: 25px;
}
::v-deep .el-dialog__header {
  background: none;
}
 ::v-deep .el-dialog__body {
  padding: 0px;
}

::v-deep .el-dialog__header {
  border-radius: 0px;
  width: 0px;
  height: 0px;
}
::v-deep .el-dialog__header {
  padding: 0px;
}

::v-deep .el-dialog,
.el-pager {
  background: none;
}

</style>
