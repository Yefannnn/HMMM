<template>
  <div class="container">
    <div class="subject-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="successForm">
          <el-form-item label-width="80px" label="目录名称">
            <el-input v-model="successForm.directoryNames" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label-width="80px" label="状态">
            <el-select v-model="successForm.label" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value"
      :label="item.label"
      :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="clearDirBtn">清除</el-button>
            <el-button class="searchBtn" size="small" type="primary" @click="searchDirectory"
              >搜索</el-button
            >
          </el-form-item>

          <el-button @click="toSubject" v-if="showBtn" icon="el-icon-back" type="text">返回学科</el-button>
          <!-- 新增学科按钮 -->
          <el-button
            class="divBtn"
            size="small"
            type="success"
            icon="el-icon-edit"
            @click="addDirectory">
            新增目录
          </el-button>
           <!-- 动态显示返回学科 -->
          <!-- 显示有几条数据的条 -->
          <el-alert
            style="width: 100%"
            :closable="false"
            show-icon
            :title="`数据一共${this.page.total}条`"
            type="info">
          </el-alert>
        </el-form>
        <div class="tables">
          <!-- 表格部分 -->
          <el-table  :data="table2Data" class="tableWidth" style="width:100%">
            <el-table-column prop="id" align="center" label="序号" width="75">
            </el-table-column>
            <el-table-column prop="subjectName" align="center" label="所属学科" width="155">
            </el-table-column>
            <el-table-column prop="directoryName" align="center" label="目录名称" width="150">
            </el-table-column>
            <el-table-column prop="username" align="center" label="创建者" width="150">
            </el-table-column>
            <el-table-column
              prop="addDate"
              label="创建日期"
              align="center"
              width="230">
              <template v-slot="{row}">
          {{row.addDate|parseTimeByString}}
        </template>
            </el-table-column>
            <el-table-column
              prop="totals"
              label="面试题数量"
              align="center"
              width="130">
            </el-table-column>
            <el-table-column prop="state" align="center" label="状态" width="150">
              <template v-slot="{row}">
                {{row.state===1?'已启用':'已禁用'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
              <template v-slot="{ row }">
                <el-button type="text" @click="disabled(row)">
                    {{row.state===0?'启用':'禁用'}}
               </el-button>
                <el-button type="text" @click="eitDirectory(row)" :disabled="row.state=='1'">修改</el-button>
                <el-button type="text"
                @click="btndelsub2(row.id)"
                :disabled="row.state=='1'">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 放置分页 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px">
          <el-pagination
            @size-change="handleSizeChange"
            background
            :page-sizes="[5, 10, 20, 50]"
            :page-size="page.pagesize"
            :total="page.total"
            :current-page="page.page"
            layout="prev,pager,next,sizes,jumper"
            @current-change="changepage"/>
        </el-row>
      </el-card>
      <!-- 弹窗 -->
      <directoryAdd
      @adddirectory='DirectoryList'
        ref="eiduse"
        :directoryDialog.sync="directoryDialog" />
      <!-- 删除弹窗 -->
      <el-dialog
        title="提示"
        :visible="delsub"
        width="30%"
        center
        @close="btnCancel">
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
import directoryAdd from '../components/directorys-add.vue'
import { DirectoryList, deldirectory } from '@/api/hmmm/subjects'
// import {parseTime} from '@/utils/index'
export default {
  components: {
    directoryAdd
  },
  data () {
    return {
      options: [{
        value: 1,
        label: '已启用'
      }, {
        value: 0,
        label: '已禁用'
      }],
      delid: '',
      delsub: false,
      table2Data: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 10
      },
      directoryDialog: false,
      successForm: {
        directoryNames: '',
        label: null
      }

    }
  },
  mounted () {
    this.DirectoryList()
    // this.DirectoryState()
  },
  methods: {
    // 获取目录数据
    async DirectoryList () {
      const res = await DirectoryList({ ...this.page, directoryName: this.directoryNames, state: this.successForm.label })
      // 获取目录列表数据
      this.table2Data = res.data.items
      // 获取分页总数目
      this.page.total = res.data.counts
    },
    // 切换分页
    changepage (newpage) {
      this.page.page = newpage
      this.DirectoryList()
    },
    // 显示一页显示几条数据
    handleSizeChange (val) {
      this.page.pagesize = val
      this.DirectoryList()
    },
    // 点击新增学科打开弹窗
    addDirectory () {
      this.directoryDialog = true
    },
    // 模糊搜索学科名称
    searchDirectory () {
      this.DirectoryList({ pagesize: 999 })
      this.table2Data = this.table2Data.filter((items) => {
        if (items.directoryName.includes(this.directoryNames)) {
          return items
        }
      })
      // this.DirectoryList()
    },
    // 清除input值
    clearDirBtn () {
      this.directoryNames = ''
      this.label = ''
    },
    // 修改学科名称
    eitDirectory (val) {
      this.$refs.eiduse.title = '修改学科'
      this.directoryDialog = true
      this.$refs.eiduse.formdata = {
        subjectName: val.subjectName,
        directoryName: val.directoryName,
        id: val.id,
        subjectID: val.subjectID
      }
    },
    // 点击删除弹出弹窗
    btndelsub2 (id) {
      this.delsub = true
      this.delid = id
    },
    // 确认删除弹窗
    btnOk () {
      this.DirectoryList({ pagesize: 99 })
      this.table2Data.filter(async (item) => {
        if (item.id === this.delid) {
          await deldirectory(item)
        }
      })
      this.DirectoryList()
      this.delsub = false
    },
    // 关闭删除弹窗
    btnCancel () {
      this.delsub = false
    },
    // 点击禁用按钮
    async disabled (val) {
      val.state = val.state === 1 ? 0 : 1
    },
    toSubject () {
      this.$router.push({
        path: '/subjects/list'
      })
    }
  },
  computed: {
    showBtn () {
      return !!this.$route.query.id
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .tables {
    margin: 12px 6px;
  }
  .box-card {
    width: 100%;
    margin-top: 15px;
    .divBtn {
      margin-left: 30px;
    }
  }

  .searchBtn {
    margin-right: 230px;
  }
}
</style>
