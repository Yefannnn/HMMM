<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="form">
        <el-form-item label="标签名称">
          <el-input v-model="form.input"
           style="width: 200px"
            />
        </el-form-item>
        <el-form-item label="状态" >
          <el-select placeholder="请选择" class="slected" v-model="form.select">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
          <el-button size="small" @click="delate()" >清除</el-button>
          <el-button size="small" type="primary" @click="getList()" >搜索</el-button>
        </el-form-item>
        <el-button class="btn" type="success" size="small" icon="el-icon-edit" @click="addFn()"
          >新增标签</el-button
        >
      </el-form>
      <!-- 弹出层 -->
      <el-alert
       :title="`数据一共${page.total}条`"
        type="info"
        class="alert"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 表格区域 -->
      <el-table :data="tableData" border class="table" style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="80">
        </el-table-column>
        <el-table-column
          prop="subjectName"
          align="center"
          label="所属学科"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="tagName"
          align="center"
          label="标签名称"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          align="center"
          label="创建者"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="addDate"
          align="center"
          label="创建日期"
          width="180"
        >
          <template slot-scope="{ row }">
            {{ row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" label="状态" width="180">
          <template slot-scope="{ row }">
            {{ row.state === 1 ? "已禁用" : "已启用" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="handleStatus(row)">
              {{ row.state === 0 ? "禁" : "启" }}用
            </el-button>
            <el-button type="text" size="small" :disabled="row.state == '0'" @click="edit(row.id)" >
              修改
            </el-button>
            <el-button type="text" size="small" :disabled="row.state == '0'"  @click="btnDelate(row.id)" >
              删除
            </el-button>
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
    <TagAdd ref="tagAdd" @uplist="getList()" :showDialog.sync="showDialog" ></TagAdd>
  </div>
</template>
<script>
import { list, changeState, remove } from '@/api/hmmm/tags.js'
import TagAdd from '@/module-hmmm/components/tags-add'
export default {
  components: {
    TagAdd
  },
  data () {
    return {

      // 表格
      tableData: [],
      // 表单
      form: {
        select: null, // 选择框
        input: ''
      },
      page: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      showDialog: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      const form = {
        page: this.page.page,
        pagesize: this.page.pagesize,
        tagName: this.form.input,
        state: this.form.select
      }

      const res = await list(form)
      this.tableData = res.data.items
      this.page.total = res.data.counts
    },
    // 一页显示多少
    handleSizeChange (val) {
      this.page.pagesize = val
      this.getList()
    },
    // 切换页码
    handleCurrentChange (newpage) {
      this.page.page = newpage
      this.getList()
    },
    // 点击清除输入框内容
    delate () {
      this.form.input = ''
      this.form.select = null
    },
    // 点击切换状态
    async handleStatus (val) {
      try {
        await changeState({
          id: val.id,
          state: val.state === 0 ? 1 : 0
        })
        this.getList()

        this.$message.success('操作成功')
      } catch (err) {
        this.$message.success('操作失败')
      }
    },
    // 删除按钮
    async btnDelate (id) {
      await this.$confirm('确定要删除吗')
      try {
        await remove(id)
        this.$message.success('删除成功')
        this.getList()
      } catch (error) {
        console.log(error)
      }
    },
    addFn () {
      this.showDialog = true
    },
    edit (id) {
      this.showDialog = true
      this.$refs.tagAdd.getDetail(id)
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
.table {
  margin-top: 10px;
}
</style>
