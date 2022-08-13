<template>
  <!-- s题目预览弹出框 -->
  <el-dialog title="题目预览" :visible="isShow" @close="close">
    <el-row>
      <el-col :span="6">【题型】：{{ data.questionType }}</el-col>
      <el-col :span="6">【编号】：{{ id }}</el-col>
      <el-col :span="6">【难度】：{{ data.difficulty }}</el-col>
      <el-col :span="6">【标签】：{{ data.tags }}</el-col>
      <el-col :span="6">【学科】：{{ data.subjectName }}</el-col>
      <el-col :span="6">【目录】：{{ data.directoryName }}</el-col>
      <el-col :span="6">【方向】：{{ data.direction }}</el-col>
    </el-row>
    <hr />
    <!-- 题干 -->
    <div>
      <p>【题干】：</p>
      <div class="qes">{{ data.question }}</div>
      <p>{{ data.questionType }} 选项：（以下选中的选项为正确答案）</p>
      <!-- 单选题 -->
      <div class="choose" v-if="data.questionType === '单选'">
        <el-radio
          v-for="item in data.options"
          :key="item.id"
          :label="item.isRight"
          :value="oneTrueChoice"
        >
          {{ item.code }}:{{ item.title }}
        </el-radio>
      </div>
      <!-- 多选题 -->
      <div class="choose" v-else-if="data.questionType === '多选'">
        <el-checkbox
          v-for="item in data.options"
          :key="item.id"
          :label="item.isRight"
          :value="manyTrueChoice"
        >
          {{ item.title }}
        </el-checkbox>
      </div>
      <!-- 简答题 -->
      <div v-else>
        <el-input></el-input>
      </div>
    </div>
    <hr />
    <!-- 参考答案区域 -->
    <div>
      <span>【参考答案】：</span>
      <el-button type="danger" size="small" @click="isShowVideo=true">视频答案按钮</el-button>
      <div class="videoBox" v-if="isShowVideo">
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        ></video-player>
      </div>
    </div>
    <hr />
    <!-- 答案解析 -->
    <div class="txt">
      <span>【答案解析】{{ data.answer }}</span>
    </div>
    <hr />
    <!-- 题目备注 -->
    <div class="txt">
      <span>【题目备注】{{ data.remarks }}</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPreview } from '@/api/hmmm/questions.js'
import { questionType, difficulty } from '@/api/hmmm/constants.js'
import { findDifficultyType, html2Text, toArray } from '@/utils/index.js'

import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
  components: {
    videoPlayer
  },
  props: {
    isShow: {
      required: true,
      type: Boolean
    },
    id: {
      required: true
    }
  },
  data () {
    return {
      radio: '',
      data: '',
      trueChoice: '',
      oneTrueChoice: 1,
      manyTrueChoice: [1],
      isShowVideo: false, // 是否展示视频
      // 视频播放
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选择的播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4',
            src: ''
            // 'https://v-cdn.zjol.com.cn/277004'
            // 'https://aliyun.oss.careyshop.cn/uploads/files/20191113/9bbf7ac9-a452-445b-8152-4443bc3505e8.mp4?type=aliyun'
          }
        ],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:isShow', false)
      this.isShowVideo = false
    },
    async getPreviewMsg (id) {
      const { data } = await getPreview(id)
      this.data = data
      this.data.questionType = findDifficultyType(data.questionType - 0, questionType)
      this.data.difficulty = findDifficultyType(data.difficulty - 0, difficulty)
      this.data.question = html2Text(data.question)
      this.data.answer = html2Text(data.answer)

      // 第一种解决方法：通过方法来控制最终 单选 多选 选中的值(第二种：直接通过label属性绑定isRight,然后用value绑定正确值)

      /*  const trueChoiceList = data.options.filter((item) => item.isRight === 1)
      // 单选是获取数组第一个的id值  多选是获取数组中所有id的值并放进数组
      this.trueChoice = data.questionType !== '多选' ? (trueChoiceList[0]?.id) : toArray(trueChoiceList, 'id') */

      this.playerOptions.sources[0].src = data.videoURL
      console.log(this.playerOptions.sources[0].src)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  width: 900px;
  .el-col-6 {
    padding: 10px 0;
  }
  .qes {
    color: blue;
  }
  .choose {
    display: flex;
    flex-direction: column;
    .el-radio {
      padding: 8px 0px;
    }
  }
  .txt {
    padding: 14px 0;
  }
  .videoBox {
    margin-top: 5px;
    width: 400px;
  }
}
</style>
