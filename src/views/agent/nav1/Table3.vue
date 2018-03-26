<template>
<section>
  <el-form :inline="true" :model="filters" ref="filters"  size="medium">
    <el-row>
      <el-form-item prop="state1">
        <el-select v-model="filters.state1" placeholder="请选择商户名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="inputLoading" clearable @visible-change="clickShop">
          <el-option v-for="item in optionsMers" :key="item.mid" :value="item.mid" :label="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="state2">
          <el-select v-model="filters.state2" placeholder="请选择业务员" :multiple="false" filterable remote :remote-method="remoteSale" :loading="inputLoading" clearable @visible-change="clickSale">
            <el-option v-for="item in optionsSale" :key="item.id" :value="item.id" :label="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item prop="time1">
        <el-date-picker v-model="filters.time1" placeholder="选择开始日期" type="month" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
        <el-button @click="resetForm('filters')" size="medium" round>重置</el-button>
      </el-form-item>
    </el-row>
  </el-form>
  <!--列表-->
  <div v-loading="listLoading">
    <el-table :data="users" border highlight-current-row style="width: 100%;">
      <el-table-column prop="mname" label="商户名称" min-width="120">
      </el-table-column>
      <el-table-column prop="" label="统计时间" :formatter="formatter_date">
      </el-table-column>
      <el-table-column prop="saleName" label="业务员">
      </el-table-column>
      <el-table-column prop="sum_total" label="月交易笔数(笔)">
      </el-table-column>
      <el-table-column prop="amount" label="月交易金额(元)">
      </el-table-column>
      <el-table-column label="排行榜">
      </el-table-column>
    </el-table>
  </div>
  <!--工具条-->
  <el-row class="toolbar">
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
    </el-pagination>
  </el-row>
</section>
</template>

<script>
import * as util from '../../../assets/util.js'
import {
  queryMerMonthData,
  selectSaleByName,
  selectMersByName
} from '../../../api/agent';

export default {
  data() {
    return {
      //商户名
      filters: {
        time1: Date(),
        state1: '',
        state2: ''
      },
      total: 0,
      page: 1,
      users: [],
      //业务员查询
      optionsSale:[],
      //商户查询
      optionsMers: [],
      listLoading: false,
      inputLoading:false
    }
  },
  methods: {
    //时间格式化
    formatter_date(row){
      return row.settled_date = util.formatDate.format( new Date(row.settled_date), 'yyyy-MM' )
    },
    //商户远程搜索
    clickShop:function () {
      selectMersByName().then((res) => {
        let {
          status,
          data
        } = res
        this.optionsMers = data.merchantList
      })
    },
    remoteShop(query) {
      if (query !== '') {
        this.inputLoading = true;
        setTimeout(() => {
          this.inputLoading = false;
          selectMersByName({
            mname: query
          }).then((res) => {
            let {
              status,
              data
            } = res
            this.optionsMers = data.merchantList
          })
        }, 200);
      } else {
        this.optionsMers = [];
      }
    },
        //业务员远程搜索
    clickSale:function () {
      selectSaleByName().then((res) => {
        let {
          status,
          data
        } = res
        this.optionsSale = data.salesmanList
      })
    },
    remoteSale(query) {
      if (query !== '') {
        this.inputLoading = true;
        setTimeout(() => {
          this.inputLoading = false;
          selectSaleByName({
            name: query
          }).then((res) => {
            let {
              status,
              data
            } = res
            this.optionsSale = data.salesmanList
          })
        }, 200);
      } else {
        this.optionsMers = [];
      }
    },
    //获取用户列表
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    getUsers() {
      let para = {
        pageNum: this.page.toString(),
        startTime: this.filters.time1,
        salesmanId: this.filters.state2.toString(),
        mid: this.filters.state1.toString()
      };
      para.startTime = (!para.startTime || para.startTime == '') ? '' : String(util.formatDate.format(new Date(para.startTime), 'yyyy-MM')); //开始时间
      this.listLoading = true;
      queryMerMonthData(para).then((res) => {
        let {
          data,
          message,
          status
        } = res;
        this.total = res.data.totalCount;
        this.users = res.data.merMonthSumList;
        this.listLoading = false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>

</style>
