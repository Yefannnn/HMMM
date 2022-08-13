<template>
  <el-dialog
    title="题目预览"
    :visible="dialogVisible"
    width="60%"
    height="60%"
    @close="closeBtn"
  >
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span
            >【题型】：{{
              filterQuestionType(previewDiolog.questionType)
            }}</span
          >
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span>【编号】：{{ previewDiolog.id }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span
            >【难度】：{{ filterDifficuity(previewDiolog.difficulty) }}</span
          >
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span>【标签】：{{ previewDiolog.tags }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      style="
        margin-top: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #666;
      "
    >
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span>【学科】：{{ previewDiolog.subjectID }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span>【目录】：{{ previewDiolog.catalogID }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span>【方向】：{{ previewDiolog.direction }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
    <!-- 参考答案 -->
    <el-row>
      <el-col>
        <div class="grid-content bg-purple">
          <p>【题干】: {{previewDiolog.question}}</p>
          <p>选项：（以下选中的选项为正确的答案）</p>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-form>
        <!-- 选项 -->
        <el-form-item  class="options">
          <!-- 单选框组 -->
          <el-radio-group v-model="OptionIsRight">
            <el-radio
              :label="optionObj.code"
              v-for="optionObj in previewDiolog.options"
              :key="optionObj.code"
              style="margin-left:25px"

            >
              <span>{{ optionObj.code }} : </span>
              <el-input v-model="optionObj.title"></el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 参考答案 -->
    <el-row>
      <span>【参考答案】：  <el-button v-if="!videoPlayer" type="danger" @click="videoPlay">视频答案预览</el-button></span>
      <div class="demo">
      <video-player
      v-if="videoPlayer"
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        @onPlayerPlay="onPlayerPlay"
      >
      </video-player>
    </div>
    </el-row>
    <!-- 答案解析 -->
    <el-row style="margin-top:20px;">
      <span>【答案解析】：
        <p style="backgroundColor:#d1ffe5;font-size:18px;text-indent:2em">{{previewDiolog.answer}}</p>
      </span>
    </el-row>
    <!-- 题目备注 -->
    <el-row style="margin-top:20px">
      <span>【题目备注】：
        <p style="backgroundColor:#d1ffe5;font-size:18px;text-indent:2em">{{previewDiolog.remarks}}</p>
      </span>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeBtn">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { perviewQuestionAPI } from '@/api/hmmm/questions.js'
import { questionType, difficulty } from '@/api/hmmm/constants.js'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    questionId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      previewForm: [],
      previewDiolog: [], // 预览弹窗回显数据
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', // 类型
            // url地址
            src: 'https://vodaliyun.ecook.cn/pianhua/10510.mp4'
          }
        ],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      },
      videoPlayer: false

    }
  },
  methods: {
    // 关闭弹窗
    closeBtn () {
      this.$emit('closeDiolog', false)
    },
    // 获取预览数据
    async perviewQuestion (id) {
      // 需要回显的信息
      const { data } = await perviewQuestionAPI(id)
      this.previewDiolog = JSON.parse(JSON.stringify(data))
    },
    OkBtn () {
      alert('发请求')
    },
    // 题型过滤
    filterQuestionType (type) {
      return questionType.find((item) => {
        return item.value === Number(type)
      })?.label
    },
    // 难度过滤
    filterDifficuity (type) {
      return difficulty.find((item) => item.value === Number(type))?.label
    },
    // 播放回调
    onPlayerPlay () {

    },
    videoPlay () {
      this.videoPlayer = true
      this.$refs.videoPlayer.player.play() // 播放
    }
  },
  computed: {
    // 计算选项是否正确
    OptionIsRight: {
      get () {
        const data = this.previewDiolog.options.find((item) => item.isRight)
        return data ? data.code : 0
      },
      set (code) {
        // 将指定的code项的isRight 值改成 1，其余改成0
        this.previewDiolog.options.forEach((item) => {
          item.isRight = false
        })
        this.previewDiolog.options.find(
          (item) => item.code === code
        ).isRight = true
      }
    }
  }
}
</script>

<style lang="scss">

</style>
