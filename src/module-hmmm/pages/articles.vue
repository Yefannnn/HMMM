<template>
  <div class="container">
    <el-card class="box-card">
      <el-form :inline="true" :model="form">
        <el-form-item label="关键字">
          <el-input
            v-model="form.input"
            style="width: 200px"
            model=""
            placeholder="根据文章标题搜索"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            placeholder="请选择"
            class="slected"
            v-model="form.select"
          >
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
          <el-button size="small" @click="delateword" >清除</el-button>
          <el-button size="small" type="primary" @click="getData()"
            >搜索</el-button
          >
        </el-form-item>
        <el-button class="btn" type="success" size="small" icon="el-icon-edit"
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
      <el-table :data="tableData" border style="width: 100%">
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
          width="280"
          align="center"
        >
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
          width="120"
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
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="{ row }">
            <!-- <pre>{{ row }}</pre> -->
            <el-button type="text" size="small" @click="preve(row.id)"
              >预览</el-button
            >
            <el-button type="text" size="small" @click="handleStatus(row)">
              {{ row.state === 0 ? "禁" : "启" }}用
            </el-button>
            <el-button type="text" size="small" :disabled="row.state == '0'"
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
    <ArticlesAdd ref="acticleAdd" :isShow.sync="showDialog" />
  </div>
</template>

<script>
import { list, changeState, remove } from '@/api/hmmm/articles'
// import { parseTimeByString } from '@/filters/index.js'
import ArticlesAdd from '@/module-hmmm/components/articles-add'
export default {
  components: {
    ArticlesAdd
  },
  data () {
    return {
      showDialog: false,
      artId: '',
      artname: '',

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
    // 点击搜索
    serach () {
      this.tableData = this.tableData.filter((item) => {
        if (item.title.includes(this.artname)) {
          return item
        }
      })

      console.log(this.tableData)
      this.getData(this.tableData)
    },
    preve (id) {
      this.showDialog = true
      this.artId = id
      this.$refs.acticleAdd.getDetail(id)
    },
    // 点击切换状态
    async handleStatus (val) {
      try {
        console.log(123)
        await changeState({
          id: val.id,
          state: val.state === 0 ? 1 : 0
        })
        this.getData()

        this.$message.success('操作成功')
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
</style>
