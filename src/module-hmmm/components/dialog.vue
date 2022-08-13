<template>
  <div>
    <el-dialog type="flex" :visible="showDialog" title="编辑用户">
      <el-form :model="tableData" label-width="120px">
            <el-form-item label="企业名称">
              <el-input
                v-model="tableData.shortName"
                placeholder="审批人"
                style="width: 70%"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属公司">
              <el-input
                v-model="tableData.company"
                placeholder="审批人"
                style="width: 70%"
              ></el-input>
            </el-form-item>

            <h1>https://www.tianyancha.com （在此可查询所属公司全称及简称）</h1>

        <el-form-item label="城市地区">
          <el-select v-model="tableData.city" placeholder="城市地区" class="citynew">
          </el-select>
           <el-select v-model="tableData.province" placeholder="城市地区">
          </el-select>
        </el-form-item>

            <el-form-item label="方向（企业标签">
              <el-input
                v-model="tableData.tags"
                style="width: 70%"
              ></el-input>
            </el-form-item>

        <el-form-item label="备注" style="width: 70%">
          <el-input type="textarea" v-model="tableData.remarks"></el-input>
        </el-form-item>

            <el-form-item>
              <el-button @click="btnCancel">取消</el-button>
              <el-button type="primary"  @click="btnOK">确定</el-button>
            </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
      }
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
    // newfrom: {
    //   type: Object,
    //   default: null
    // }
  },
  methods: {
    btnOK () {
      this.$emit('update:showDialog', false)
    },
    btnCancel () {
      this.$emit('update:showDialog', false)
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
