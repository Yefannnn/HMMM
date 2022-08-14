<template>
  <div>
    <el-dialog type="flex" :visible="showDialog" :title="title" @close="btnCancel">
      <el-form ref="newref" :model="tableData" :rules="rules" label-width="120px">
            <el-form-item label="企业名称" prop="shortName">
              <el-input
                v-model="tableData.shortName"
                placeholder="审批人"
                style="width: 70%"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属公司" prop="company">
              <el-input
                v-model="tableData.company"
                placeholder="审批人"
                style="width: 70%"
              ></el-input>
            </el-form-item>

            <h1>https://www.tianyancha.com （在此可查询所属公司全称及简称）</h1>

        <el-form-item label="城市地区">
          <el-select @change="change" v-model="tableData.province" placeholder="城市地区" class="citynew">
            <el-option v-for="(item,index) in city.provinces" :key="index" :label="item" :value="item"></el-option>
          </el-select>
           <el-select v-model="tableData.city"  placeholder="城市地区">
            <el-option v-for="(item,index1) in city.citys" :key="index1" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

             <el-form-item label="方向" style="width: 70%" prop="tags">
          <el-input type="text" v-model="tableData.tags"></el-input>
        </el-form-item>

        <el-form-item label="备注" style="width: 70%" prop="remarks">
          <el-input type="textarea" v-model="tableData.remarks"></el-input>
        </el-form-item>
                  <el-form-item>
              <el-button type="primary" @click="btnOK(tableData.id)">确定</el-button>
              <el-button @click="btnCancel">取消</el-button>
                   </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { provinces, citys } from '@/api/hmmm/citys'
import { update, add } from '@/api/hmmm/companys'

export default {
  props: ['chuanzhi', 'show-dialog'],
  data () {
    return {
      city: {
        provinces: provinces(),
        citys: []
      },

      tableData: {
        id: '',
        number: '',
        isFamous: '',
        shortName: '',
        company: '',
        province: '',
        city: '',
        tags: '',
        remarks: ''
      },
      rules: {
        shortName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请选择所属公司', trigger: 'change' }
        ],
        tags: [
          { required: true, message: '请输入企业方向', trigger: 'change' }
        ],
        remarks: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    die () {
      this.$emit('update:showDialog', false)
    },
    async btnOK (id) {
      if (this.tableData.id) {
        // 编辑逻辑代码
        console.log(this.tableData.isFamous)
        const famous = this.tableData.isFamous === 1
        await update({ ...this.tableData, id, isFamous: famous })
        this.$emit('getList')
        this.$emit('update:showDialog', false)
        this.tableData = {
          id: '',
          number: '',
          isFamous: '',
          shortName: '',
          company: '',
          province: '',
          city: '',
          tags: '',
          remarks: ''
        }
      } else {
        const famous = this.tableData.isFamous === 1
        // 添加功能
        await add({ ...this.tableData, isFamous: famous })
        this.$emit('getList')
        this.$emit('update:showDialog', false)
        this.tableData = {
          id: '',
          number: '',
          isFamous: '',
          shortName: '',
          company: '',
          province: '',
          city: '',
          tags: '',
          remarks: ''
        }
        // this.$parent.list()
      }
    },
    btnCancel () {
      this.$emit('update:showDialog', false)
      this.tableData = {}
      this.tableData.id = ''
      // 给from表单关闭的时候取消验证resetFields
      this.$refs.newref.resetFields()
    },
    change (val) {
      this.city.citys = citys(val)
    }
  },
  computed: {
    title () {
      return this.tableData.id === '' ? '新增用户' : '编辑用户'
    }
  }
}
</script>

<style scoped lang="scss">
h1{
  font-size: 8px;
  text-align: center;
}

</style>
