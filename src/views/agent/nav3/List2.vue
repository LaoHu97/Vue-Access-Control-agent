<template>
<section>
  <el-row>
    <el-form :inline="true" :model="sale" ref="sale">
      <el-form-item prop="old">
        <el-select v-model="sale.old" placeholder="请选择旧业务员" clearable filterable @visible-change="testSaleold">
          <el-option v-for="item in optionsOld" :value="item.id" :label="item.value" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="new">
        <el-select v-model="sale.new" placeholder="请选择新业务员" clearable filterable @visible-change="testSalenew">
          <el-option v-for="item in optionsNew" :value="item.id" :label="item.value" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</section>
</template>

<script>
import * as util from '../../../assets/util.js'
import {
  selectSaleByName,
  updateAgentAllSalesman
} from '../../../api/agent';

export default {
  data() {
    return {
      sale: {
        old: '',
        new: ''
      },
      optionsOld: [],
      optionsNew: []
    }
  },
  methods: {
    testSaleold: function() {
      selectSaleByName().then((res) => {
        this.optionsOld = res.data.salesmanList
      })
    },
    testSalenew: function() {
      selectSaleByName().then((res) => {
        this.optionsNew = res.data.salesmanList
      })
    },
    submit: function() {
      this.$refs.sale.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            let para = {
              oldId: this.sale.old,
              id: this.sale.new
            };
            updateAgentAllSalesman(para).then((res) => {
              var _this = this;
              this.editLoading = false;
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.$notify({
                  title: '成功',
                  message: message,
                  type: 'success'
                });
              }
            });
          });
        }
      });
    }
  },
}
</script>

<style scoped>

</style>
