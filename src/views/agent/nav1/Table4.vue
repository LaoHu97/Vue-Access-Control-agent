<template>
  <section>
    <el-form :inline="true" :model="filters" ref="filters" size="medium">
      <el-row>
        <el-form-item prop="state1">
          <el-select v-model="filters.state1" placeholder="请选择商户名称" :multiple="false" filterable remote :remote-method="remoteShop"
            :loading="inputLoading" clearable @visible-change="clickShop">
            <el-option v-for="item in optionsMers" :key="item.mid" :value="item.mid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state2">
          <el-select v-model="filters.state2" placeholder="请选择业务员" :multiple="false" filterable remote :remote-method="remoteSale"
            :loading="inputLoading" clearable @visible-change="clickSale">
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
        <el-table-column prop="" label="统计时间" min-width="120" :formatter="formatter_date">
        </el-table-column>
        <el-table-column prop="pay_type" label="支付方式" min-width="120" :formatter="formatPay_type">
        </el-table-column>
        <el-table-column prop="amount" label="月交易金额(元)" min-width="120">
        </el-table-column>
        <el-table-column prop="sum_total" label="月交易笔数(笔)" min-width="120">
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row class="toolbar">
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
  import * as util from '../../../assets/util.js'
  import {
    queryMerMonthDetail,
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
        optionsSale: [],
        //商户查询
        optionsMers: [],
        listLoading: false,
        inputLoading: false
      }
    },
    methods: {
      formatPay_type(row) {
        return row.pay_type === 'WX' ? '微信' : row.pay_type === 'ALI' ? '支付宝' : row.pay_type === 'DEBIT' ? '借记卡' : row.pay_type === 'CREDIT' ? '贷记卡' : row.pay_type === 'BEST' ? '翼支付' : '未知';
      },
      //时间格式化
      formatter_date(row) {
        return row.settled_date = util.formatDate.format(new Date(row.settled_date), 'yyyy-MM')
      },
      //商户远程搜索
      clickShop: function () {
        this.inputLoading = true;
        selectMersByName().then((res) => {
          let {
            status,
            data
          } = res
          this.optionsMers = data.merchantList
          this.inputLoading = false;
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
      clickSale: function () {
        this.inputLoading = true;
        selectSaleByName().then((res) => {
          let {
            status,
            data
          } = res
          this.optionsSale = data.salesmanList
          this.inputLoading = false;
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
        this.getList();
      },
      getUsers() {
        this.page = 1
        this.getList()
      },
      getList() {
        let para = {
          pageNum: this.page.toString(),
          startTime: this.filters.time1,
          salesmanId: this.filters.state2.toString(),
          mid: this.filters.state1.toString()
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(util.formatDate.format(new Date(para.startTime),
          'yyyy-MM')); //开始时间
        this.listLoading = true;
        queryMerMonthDetail(para).then((res) => {
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
