<template>
  <div class="container">
    <el-card class="box-card">
      <el-form :inline="true" :model="form">
        <el-form-item label="关键字">
          <el-input
            v-model="form.input"
            style="width: 200px"
            placeholder="根据文章标题搜索"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择" class="slected" v-model="form.select">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
          <el-button size="small" @click="delateword">清除</el-button>
          <el-button size="small" type="primary" @click="getData()"
            >搜索</el-button
          >
        </el-form-item>
        <el-button
          class="btn"
          type="success"
          size="small"
          icon="el-icon-edit"
          @click.prevent="addFn()"
          >新增技巧</el-button
        >
      </el-form>
      <!-- 弹出 -->
      <el-alert
        :title="`数据一共${page.total}条`"
        type="info"
        class="alert"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 表格区域 -->
      <el-table :data="tableData" border class="table" style="width: 100%">
        <el-table-column
          fixed
          type="index"
          label="序号"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
          width="300"
          align="center"
        >
        <template slot-scope="{ row }" >
          <span>
            {{row.title}}
          </span>
          <a href="#" :class="row.videoURL? 'el-icon-film' : '' "
           @click="play(row.videoURL)"
           />

        </template>
        </el-table-column>
        <el-table-column
          prop="visits"
          label="阅读数"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="录入人"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="录入时间"
          width="160"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.createTime | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="120" align="center">
          <template slot-scope="{ row }">
            {{ row.state === 1 ? "已启用" : "已禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="{ row }">
            <!-- <pre>{{ row }}</pre> -->
            <el-button type="text" size="small" @click="preve(row)"
              >预览</el-button
            >
            <el-button type="text" size="small" @click="handleStatus(row)">
              {{ row.state === 0 ? "启" : "禁" }}用
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="row.state == '0'"
              @click.prevent="edit(row.id)"
              >修改</el-button
            >
            <el-button
              type="text"
              size="small"
              :disabled="row.state == '0'"
              @click="delate(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="end" style="height: 50px" align="middle">
        <el-pagination
          background
          @size-change="handleSizeChange"
          layout="prev, pager, next, total, sizes,  jumper"
          :total="page.total"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="page.page"
          :page-size="page.pagesize"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>

    <ArticlePreview ref="articlepreview" :isShow.sync="isShow" />

    <ArticlesAdd
      ref="articleAdd"
      @uplist="getData"
      :showDialog.sync="showDialog"
    />
     <!-- 视频弹窗 -->
       <ArticlesVideo :play-dialog.sync="playDialog" :videoUrl="videoURL" @close="close"/>
  </div>
</template>

<script>
import { list, changeState, remove } from '@/api/hmmm/articles'
// import { parseTimeByString } from '@/filters/index.js'
import ArticlesAdd from '@/module-hmmm/components/articles-add'
import ArticlePreview from '@/module-hmmm/components/articles-preview'
import ArticlesVideo from '@/module-hmmm/components/articles-video'
export default {
  components: {
    ArticlesAdd,
    ArticlePreview,
    ArticlesVideo
  },
  data () {
    return {
      showDialog: false,
      isShow: false,
      playDialog: false,
      videoURL: '',
      form: {
        select: null, // 选择框
        input: ''
      },
      tableData: [],
      page: {
        total: 0,
        page: 1,
        pagesize: 10
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      const form = {
        page: this.page.page,
        pagesize: this.page.pagesize,
        keyword: this.form.input,
        state: this.form.select
      }
      const res = await list(form)
      this.tableData = res.data.items
      this.page.total = res.data.counts
      // console.log(res.data)
    },
    // 一页显示多少
    handleSizeChange (val) {
      this.page.pagesize = val
      this.getData()
    },
    // 切换页码
    handleCurrentChange (newpage) {
      this.page.page = newpage
      this.getData()
    },
    // // 点击搜索
    // serach () {
    //   this.tableData = this.tableData.filter((item) => {
    //     if (item.title.includes(this.artname)) {
    //       return item
    //     }
    //   })

    //   console.log(this.tableData)
    //   this.getData(this.tableData)
    // },

    // 点击切换状态
    async handleStatus (val) {
      try {
        await changeState({
          id: val.id,
          state: val.state === 0 ? 1 : 0
        })
        this.getData()

        val.state === 0 ? this.$message.success('已启用，本条允许修改！') : this.$message.success('已禁用，本条禁止修改！')
      } catch (err) {
        this.$message.success('操作失败')
      }
    },
    // 点击清除关键字
    delateword () {
      this.form.input = ''
      this.form.select = null
    },
    // 点击删除按钮
    async delate (id) {
      try {
        await this.$confirm('确定删除吗？')
        await remove(id)
        this.$message.success('删除文章成功')
        this.getData()
      } catch (error) {
        this.$message('删除文章失败')
        console.log(error)
      }
    },
    // 预览
    preve (row) {
      this.isShow = true
      this.$refs.articlepreview.preve(row)
      // this.list = row
    },
    addFn () {
      this.showDialog = true
    },
    // 点击修改
    edit (id) {
      this.showDialog = true
      // 回显
      this.$refs.articleAdd.getDetail(id)
    },
    // 点击播放视频
    play (val) {
      this.videoURL = val
      this.playDialog = true
    },
    close () {
      this.videoURL = ''
      this.playDialog = false
    }

  }
}
</script>

<style scoped lang="scss">
.slected {
  margin-right: 10px;
}
.btn {
  float: right;
}
.table{
  margin-top: 10px;
}
.el-icon-film{
  color: blue;
}
</style>
