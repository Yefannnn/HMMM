<template>
  <div>
    <el-card class="elCard">
      <el-form :inline="true" :model="newDate" class="demo-form-inline">
        <el-row>
          <el-col>
            <el-form-item label="标签名称">
              <el-input v-model="newDate.tags" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="城市">
              <el-select
                @change="change"
                filterable
                v-model="newDate.city"
                placeholder="请输入"
              >
                <el-option
                  v-for="(item, index) in city.provinces"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区">
              <!--  v-model="formInline.region" -->
              <el-select placeholder="请输入" v-model="newDate.province">
                <el-option
                  v-for="(item, i) in city.citys"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业简称">
              <el-input
                v-model="newDate.shortName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="newDate.state" placeholder="活动区域">
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启动" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="empty">清除</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="addUserCol">
            <el-button type="success" class="addUser" @click="addUer"
              >新增用户</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <el-form>
        <el-alert title="我来抓人了" type="info" show-icon></el-alert>
      </el-form>

      <el-form>
        <el-table :data="newdata" style="width: 100%">
          <el-table-column type="index" label="序号" width="120">
          </el-table-column>
          <el-table-column prop="number" label="企业编号" width="120">
          </el-table-column>
          <el-table-column prop="shortName" label="企业简称"> </el-table-column>

          <el-table-column prop="tags" label="标签" width="120">
          </el-table-column>
          <el-table-column prop="creatorID" label="创建者" width="120">
          </el-table-column>
          <el-table-column prop="addDate" label="创建日期">
            <template slot-scope="{ row }">
              {{ row.addDate | parseTimeByString }}
            </template>
          </el-table-column>

          <el-table-column prop="remarks" label="备注" width="120">
          </el-table-column>
          <el-table-column prop="state" label="状态" width="120">
            <template slot-scope="{ row }">
              {{ row.state === 1 ? "开启" : "屏蔽" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="操作"
            align="center"
            width="180"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editor(row.id)"
              ></el-button>
              <el-button
                type="success"
                plain
                :icon="row.state === 0 ? 'el-icon-check' : 'el-icon-close'"
                circle
                @click="open(row)"
              ></el-button>

              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteBtn(row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <PaginationPage
          :page="page"
          :total="page.counts"
          @changeSize="changeSize"
          @changeCurrent="changeCurrent"
        ></PaginationPage>
      </el-form>
    </el-card>
    <!--    :newfrom="newfrom" -->
    <AddDiolog
      :chuanzhi="tableData.id"
      ref="perform"
      :show-dialog.sync="showDialog"
      @get-list="list"
    ></AddDiolog>
  </div>
</template>

<script>
import { list, removeData, qiye, getCompanyByIdAPI } from '@/api/hmmm/companys'
import PaginationPage from '../components/pagination-page.vue'
import { changeState } from '../../api/hmmm/directorys'
import AddDiolog from '../components/dialog.vue'
// 城市
import { provinces, citys } from '@/api/hmmm/citys'

export default {
  mounted () {
    console.log(provinces())
    console.log(citys('南京市'))
  },
  data () {
    return {
      page: {
        counts: 0,
        page: 1,
        pagesize: 5
      },
      showDialog: false,
      city: {
        provinces: provinces(),
        citys: []
      },
      tableData: {
        id: '',
        number: '',
        string: '',
        tags: '',
        creatorID: '',
        addDate: '',
        remarks: ''
      },

      // // 搜索框
      // newlive: {
      //   page: '',
      //   pagesize: '',
      //   tags: '',
      //   province: '',
      //   city: '',
      //   shortName: '',
      //   state: ''
      // },
      newDate: {},
      newdata: []
      // newfrom: '',
      // tatal: ''
    }
  },
  components: {
    AddDiolog,
    PaginationPage
  },
  created () {
    this.list(this.page)
  },
  methods: {
    // 按钮禁用和启用
    async open (val) {
      console.log(val.state)
      try {
        await changeState({
          id: val.id,
          state: val.state === 0 ? 1 : 0
        })
        await qiye()
        this.list(this.page)
        this.$message.success('操作成功')
      } catch (err) {
        console.log(err.message)
        this.$message.success('操作失败')
      }
    },
    // 搜索一键清空
    empty () {
      this.newDate = {}
      this.list(this.page)
    },

    // 搜索框搜索
    async search () {
      const {
        data
      } = await qiye({ ...this.newDate, ...this.page })
      this.page.counts = data.counts
      this.newdata.splice(0)
      this.newdata.push(...data.items)
    },
    // 新增用户
    addUer () {
      this.showDialog = true
    },
    async list () {
      const {
        data,
        data: { items }
      } = await list(this.page)
      this.newdata.splice(0)
      this.page.counts = data.counts
      // 用新数组里面的push方法把items里面的每一项拿过去
      this.newdata.push(...items)
    },

    // 删除功能
    async deleteBtn (id) {
      try {
        await this.$confirm('是否删除')
        // 调用删除接口方法并且传入id
        await removeData(id)
        // 删除后获取最新的列表
        // 提示删除成功
        this.$message.success('删除成功')
        await this.list()
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑

    async editor (id) {
      // console.log(id)
      const { data } = await getCompanyByIdAPI(id)
      console.log(data)
      this.$refs.perform.tableData = data
      // console.log(this.$refs.perform.tableData)
      this.showDialog = true
    },
    change (val) {
      this.city.citys = citys(val)
    },
    // 改变每页多少条的时候触发
    changeSize (val) {
      this.page.pagesize = val
      this.list(this.page)
    },
    // 改变页数的时候
    changeCurrent (val) {
      // console.log(val)
      this.page.page = val
      this.list(this.page)
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}

.addUserCol {
  display: flex;
  justify-content: flex-end;

  .addUser {
    margin-right: 60px;
  }
}
</style>
