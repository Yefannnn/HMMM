<template>
  <div class="container">
    <div class="subject-container">
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item label-width="80px" label="学科名称">
            <el-input v-model="subjectNames" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="clearBtn">清除</el-button>
            <el-button size="small" type="primary" @click="searchSubject">搜索</el-button>
          </el-form-item>
          <!-- 新增学科按钮 -->
          <el-button
            class="divBtn"
            size="small"
            type="success"
            icon="el-icon-edit"
            @click='addSubject'>
            新增学科
            </el-button>
            <!-- 显示有几条数据的条 -->
          <el-alert
            style="width: 100%"
            :closable="false"
            show-icon
            :title="`数据一共${this.page.total}条`"
            type="info"
          >
          </el-alert>
        </el-form>
        <div class="tables">
          <!-- 表格部分 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="subjectName" label="学科名称" width="100">
            </el-table-column>
            <el-table-column prop="username" label="创建者" width="120 ">
            </el-table-column>
            <el-table-column prop="addDate" label="创建日期" width="230">
              <template v-slot="{row}">
          {{row.addDate|parseTimeByString}}
        </template>
            </el-table-column>
            <el-table-column
              prop="isFrontDisplay"
              label="前台是否显示"
              width="150"
            >
              <template v-slot="{ row }">
                {{ row.isFrontDisplay === 1 ? "是" : "否" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="twoLevelDirectory"
              label="二级目录"
              width="100"
            >
            </el-table-column>
            <el-table-column prop="tags" label="标签" width="100">
            </el-table-column>
            <el-table-column prop="totals" label="题目数量" width="100">
            </el-table-column>
            <el-table-column label="操作" width="260">
              <template v-slot="{row}">
                <el-button type="text" @click="subjectAddBtn(row)">学科分类</el-button>
                <el-button type="text" @click="tagBtn(row)">学科标签</el-button>
                <el-button type="text" @click="eitSubject(row.id)">修改</el-button>
                <el-button type="text" @click="btndelsub(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 放置分页 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            @size-change="handleSizeChange"
            background
            :page-sizes="[5, 10, 20, 50]"
            :page-size="page.pagesize"
            :total="page.total"
            :current-page="page.page"
            layout="prev,pager,next,sizes,jumper"
            @current-change="changepage"
          />
        </el-row>
      </el-card>
    <!-- 弹窗 -->
  <subjectsAdd ref="eiduse" :subjectId.sync="subjectId" @addsubject="subjectList" :subjectDialog.sync="subjectDialog" />
  <!-- 删除弹窗 -->
  <el-dialog title="提示" :visible="delsub" width="30%" center @close="btnCancel">
    <span icon="el-icon-warning">此操作将永久删除该学科, 是否继续?</span>
    <!-- footer部分 -->
    <el-row slot="footer" type="flex" justify="end">
      <el-col>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
    </div>
  </div>
</template>

<script>
import subjectsAdd from '../components/subjects-add.vue'
import { subjectList, delsubject } from '@/api/hmmm/subjects'
// import {parseTime} from '@/utils/index'
export default {
  components: {
    subjectsAdd
  },
  data () {
    return {
      table: [],
      delid: '',
      delsub: false,
      tableData: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 10
      },
      subjectDialog: false,
      subjectNames: '',
      subjectId: ''
    }
  },
  mounted () {
    this.subjectList()
  },
  methods: {
    // 获取数据
    async subjectList () {
      const res = await subjectList({ ...this.page, subjectName: this.subjectNames })
      // 获取列表数据
      this.tableData = res.data.items
      // console.log(res)
      // 获取分页总数目
      this.page.total = res.data.counts
    },
    // 切换分页
    changepage (newpage) {
      this.page.page = newpage
      this.subjectList(this.page.page)
    },
    // 显示一页显示几条数据
    handleSizeChange (val) {
      this.page.pagesize = val
      this.subjectList(this.page.pagesize)
    },
    // 点击新增学科打开弹窗
    addSubject () {
      this.subjectDialog = true
    },
    // 模糊搜索学科名称
    searchSubject () {
      this.subjectList({ pagesize: 999 })
      this.tableData = this.tableData.filter((items) => {
        if (items.subjectName.includes(this.subjectNames)) {
          return items
        }
      })
      // this.subjectList()
    },
    // 清除input值
    clearBtn () {
      this.subjectNames = ''
    },
    // 修改学科名称
    eitSubject (id) {
      // this.$refs.eiduse.title = '修改学科'
      this.subjectList({ pagesize: 99 })
      this.subjectId = String(id)
      this.tableData.forEach(item => {
        if (item.id === id) {
          console.log(item)
          this.$refs.eiduse.formdata.subjectName = item.subjectName
          // this.$refs.eiduse.formdata.isFrontDisplay = item.isFrontDisplay
          // this.$refs.eiduse.formdata.id = item.id
        }
      })
      this.subjectDialog = true
    },
    // 点击删除弹出弹窗
    btndelsub (id) {
      this.delsub = true
      this.delid = id
    },
    // 确认删除弹窗
    btnOk () {
      this.subjectList({ pagesize: 99 })
      this.tableData.filter(async item => {
        if (item.id === this.delid) {
          await delsubject(item)
        }
      })
      this.subjectList()
      this.delsub = false
    },
    // 关闭删除弹窗
    btnCancel () {
      this.delsub = false
    },
    // 跳转目录
    subjectAddBtn (row) {
      this.$router.push({
        path: '/subjects/directorys',
        query: {
          id: row.id,
          name: row.subjectName
        }
      })
    },
    // 跳转标签
    tagBtn (row) {
      this.$router.push({
        path: '/subjects/tags',
        query: {
          id: row.id,
          name: row.subjectName
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.container {
  .tables {
    margin-top: 15px;
  }
  .box-card {
    width: 100%;
    .divBtn {
      float: right;
    }
  }
}
</style>
