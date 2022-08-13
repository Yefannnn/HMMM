<template>
    <el-upload
      class="upload-demo"
      action="#"
      :http-request="requestUpload"
      :file-list="fileList"
      :before-upload = "beforeUpload"
    >
      <el-button  :disabled="!!this.upLoadUrl.code"   size="small" class="uploadBtn" >上传图片</el-button>
    </el-upload>

</template>

<script>
import COS from 'cos-js-sdk-v5'
import { Notification } from 'element-ui'
var cos = new COS({
  SecretId: 'AKIDZyDVhprtvvurhMuupnpq4CICzc8Vp11w', // 身份识别 ID
  SecretKey: '8HPZisV8jTHnRCzPvX8nw8GOTXgxFtbR' // 身份密钥
})
export default {
  props: {
    optionCode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      fileList: [],
      upLoadUrl: {}

    }
  },
  methods: {
    // changeFile (file, fileList) {
    //   console.log('file', file)000
    //   console.log('fileList', fileList)
    // },
    beforeUpload (file) {
      // 检查文件的大小，如果文件过大，直接提示
      if (file.size >= 5 * 1024 * 1024) {
        this.$message.error('图片文件过大')
        return false
      }
    },
    requestUpload (params) {
      Notification({
        title: '图片正在上传',
        message: '请勿退出',
        duration: 0
      })
      cos.putObject({
        Bucket: 'tutu-1312758105', /* 存储桶 */
        Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
        Key: params.filename, /* 文件名 */
        StorageClass: 'STANDARD', // 模式
        Body: params.file, // 上传文件对象
        onProgress: function (progressData) {

        }
      }, (err, data) => {
        if (err === null && data.statusCode === 200) {
          Notification.closeAll()
          Notification({
            title: '图片上传成功',
            message: '非常棒！',
            duration: 1500
          })
          // 将数组中的数据替换成云端地址
          this.upLoadUrl = { url: `http://${data.Location}`, code: this.optionCode }
          this.$emit('newUpLoadUrl', this.upLoadUrl)
        }
      })
    },
    delBtn () {
      this.$emit('delOption', this.optionCode)
    }
  }

}
</script>

<style lang="scss">
.upload-demo {
  margin-left: 30px;
  display: inline-block;
  width: 150px;
}
::v-deep .el-upload-list--text {
  width: 150px;
}

.el-upload--text {
  float: left;
}
.el-upload-list--text {
  position: absolute;
  margin-left: 80px;
  width: 200px;
  bottom: 5px;
}
.uploadBtn {
  position: absolute;
  bottom: 3px;
}
.delBtn {
  background: url('~@/assets/delbtn.png');
  width: 20px;
  height: 20px;
  background-size: cover;
  z-index: 99;
  position: absolute;
  top: -10px;
  right: 50px;
}
</style>
