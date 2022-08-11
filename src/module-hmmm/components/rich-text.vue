<template>
    <div ref="editor" :style="finalStyle"></div>
</template>
<script>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

export default {
  watch: {
    value (newVal) {
      if (newVal && newVal !== this.newValue) {
        // 父组件传入新值，且父组件传入的新值不为子组件当前的值（子组件的内容发生改变时传给父组件的值）时
        this.newValue = newVal
        this.quill.pasteHTML(newVal)
      } else if (!newVal) {
        this.quill.setText('')
      }
    },
    disabled (newVal) {
      this.quill.enable(!newVal)
    }
  },
  props: {
    hideTool: {
      type: Boolean,
      default: false
    },
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    editorStyle: {
      type: Object,
      default: () => {
        return {
          minHeight: '100px'
        }
      }
    },
    disabledStyle: {
      type: Object,
      default: () => {
        // 与elementui表单禁用风格一致
        return {
          background: '#f5f7fa',
          color: '#c0c4cc',
          cursor: 'not-allowed',
          borderRadius: '4px',
          border: '1px solid #dcdfe6'
        }
      }
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  methods: {
    disEditor () {
      this.finalStyle = Object.assign({}, this.finalStyle, this.disabledStyle)
    },
    init () {
      if (JSON.stringify(this.editorStyle) !== '{}') {
        this.finalStyle = this.editorStyle
      }
      // 自定义字体
      const fontList = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong']
      Quill.import('formats/font').whitelist = fontList // 将字体加入到白名单
      const defaultOptions = {
        theme: 'snow',
        placeholder: '请在这里输入',
        modules: {
          syntax: {
            highlight: text => {
              return hljs.highlightAuto(text).value // 这里就是代码高亮需要配置的地方
            }
          },
          toolbar: {
            container: [
              // [{ 'header': 1 }, { 'header': 2 }], // 标题 —— 独立平铺
              // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题 —— 下拉选择
              // [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
              ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
              ['blockquote', 'code-block'], // 引用  代码块
              // 链接按钮需选中文字后点击
              ['link', 'image', 'video'], // 链接、图片、视频
              [{ align: [] }], // 对齐方式// text direction
              [{ list: 'ordered' }, { list: 'bullet' }] // 有序、无序列表
              // [{ indent: '-1' }, { indent: '+1' }], // 缩进

              // [{ script: 'sub' }, { script: 'super' }], // 下标/上标
              // [{ font: fontList }], // 字体
              // ['clean'] // 清除文本格式
            ]
          }
        }
      }
      const finalOptions = Object.assign({}, defaultOptions, this.options)
      if (this.hideTool) {
        finalOptions.modules.toolbar = null
      }
      this.quill = new Quill(this.$refs.editor, finalOptions)
      this.addQuillTitle()
      if (this.value) {
        this.quill.pasteHTML(this.value)
      }
      // 调整光标到最后
      this.quill.setSelection(this.quill.getLength() + 1)
      this.quill.enable(!this.disabled)
      if (this.disabled) {
        this.disEditor()
      }
      this.quill.on('selection-change', range => {
        if (!range) {
          this.$emit('blur', this.quill)
        } else {
          this.$emit('focus', this.quill)
        }
      })
      this.quill.on('text-change', () => {
        let html = this.$refs.editor.children[0].innerHTML
        if (html === '<p><br></p>') html = ''
        this.newValue = html
        this.$emit('input', this.newValue)
        this.$emit('change', {
          html: this.newValue,
          text: this.quill.getText()
        })
      })
    },
    addQuillTitle () {
      const titleConfig = {
        'ql-bold': '加粗',
        'ql-color': '颜色',
        'ql-font': '字体',
        'ql-code': '插入代码',
        'ql-italic': '斜体',
        'ql-link': '添加链接',
        'ql-background': '背景颜色',
        'ql-size': '字体大小',
        'ql-strike': '删除线',
        'ql-script': '上标/下标',
        'ql-underline': '下划线',
        'ql-blockquote': '引用',
        'ql-header': '标题',
        'ql-indent': '缩进',
        'ql-list': '列表',
        'ql-align': '文本对齐',
        'ql-direction': '文本方向',
        'ql-code-block': '代码块',
        'ql-formula': '公式',
        'ql-image': '图片',
        'ql-video': '视频',
        'ql-clean': '清除字体样式'
      }
      const oToolBar = document.querySelector('.ql-toolbar')
      if (!oToolBar) {
        return
      }
      const aButton = oToolBar.querySelectorAll('button')
      const aSelect = oToolBar.querySelectorAll('select')
      aButton.forEach(function (item) {
        if (item.className === 'ql-script') {
          item.value === 'sub' ? item.title = '下标' : item.title = '上标'
        } else if (item.className === 'ql-indent') {
          item.value === '+1' ? item.title = '向右缩进' : item.title = '向左缩进'
        } else {
          item.title = titleConfig[item.classList[0]]
        }
      })
      aSelect.forEach(function (item) {
        item.parentNode.title = titleConfig[item.classList[0]]
      })
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.quill = null
    delete this.quill
  },
  data () {
    return {
      quill: null,
      newValue: null,
      finalStyle: {}
    }
  }
}
</script>
<style>
    .ql-snow .ql-tooltip[data-mode="link"]::before {
        content: "请输入链接地址:";
    }

    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-right: 0px;
        content: "保存";
        padding-right: 0px;
    }

    .ql-snow .ql-tooltip[data-mode="video"]::before {
        content: "请输入视频地址:";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: "14px";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
        content: "10px";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
        content: "18px";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
        content: "32px";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: "文本";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
        content: "标题1";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
        content: "标题2";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
        content: "标题3";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
        content: "标题4";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
        content: "标题5";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
        content: "标题6";
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimSun]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimSun]::before {
        content: "宋体";
    }

    .ql-font-SimSun {
        font-family: "SimSun";
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimHei]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimHei]::before {
        content: "黑体";
    }

    .ql-font-SimHei {
        font-family: "SimHei";
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Microsoft-YaHei]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Microsoft-YaHei]::before {
        content: "微软雅黑";
    }

    .ql-font-Microsoft-YaHei {
        font-family: "Microsoft YaHei";
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=KaiTi]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=KaiTi]::before {
        content: "楷体";
    }

    .ql-font-KaiTi {
        font-family: "KaiTi";
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=FangSong]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=FangSong]::before {
        content: "仿宋";
    }

    .ql-font-FangSong {
        font-family: "FangSong";
    }
</style>
