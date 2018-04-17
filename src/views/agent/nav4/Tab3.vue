<template>
  <section>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-row>
        <el-form-item prop="startTime">
          <el-date-picker v-model="filters.startTime" type="month" :clearable="false" placeholder="选择月" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="filters.endTime" type="month" :clearable="false" placeholder="选择月" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="salesmanId">
          <template>
            <el-select v-model="filters.salesmanId" placeholder="请选择业务员" :multiple="false" filterable remote :remote-method="remoteSale"
              :loading="saleLoading" clearable @visible-change="clickSale">
              <el-option v-for="item in optionsSale" :key="item.id" :value="item.id" :label="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="settled_date" label="结算月份" min-width="80" :formatter="format_settled_date">
        </el-table-column>
        <el-table-column prop="sname" label="业务员姓名" min-width="120">
        </el-table-column>
        <el-table-column prop="sum_total" label="交易笔数" min-width="120">
        </el-table-column>
        <el-table-column prop="sum_amt" label="交易金额(￥)" min-width="120" :formatter="format_sum_amt">
        </el-table-column>
        <el-table-column prop="pay_type" label="支付方式" min-width="120" :formatter="format_pay_type">
        </el-table-column>
        <el-table-column prop="rate" label="商户费率(‰)" min-width="120">
        </el-table-column>
        <el-table-column prop="rebate_rate" label="返佣费率(‰)" min-width="120">
        </el-table-column>
        <el-table-column prop="commission" label="返佣金额(￥)" min-width="120" :formatter="format_rebate_amt">
        </el-table-column>
        <el-table-column prop="rebate_amt" label="业务员提成金额(￥)" min-width="120">
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
  import * as util from "../../../assets/util.js";
  import {
    queryAgentRebate,
    updateRebateStatus,
    querySalesmanRebate,
    selectSaleByName
  } from "../../../api/agent";

  export default {
    data() {
      return {
        //商户名
        filters: {
          startTime: Date(),
          endTime: Date(),
          salesmanId: ""
        },
        total: 0,
        page: 1,
        users: [],
        listLoading: false,
        saleLoading:false,
        optionsSale:[],
      };
    },
    methods: {
      //业务员远程搜索
      clickSale: function () {
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
          this.saleLoading = true;
          setTimeout(() => {
            this.saleLoading = false;
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
      format_settled_date(row, column){
        return row.settled_date = util.formatDate.format(new Date(row.settled_date), 'yyyy-MM')
      },
      //格式化金额
      format_sum_amt(row, column) {
        return util.number_format(row.sum_amt, 2, ".", ",")
      },
      format_rebate_amt(row, column) {
        return util.number_format(row.rebate_amt, 2, ".", ",")
      },
      format_pay_type(row, column) {
        return row.pay_type === 'WX' ? '微信' : row.pay_type === 'ALI' ? '支付宝' : row.pay_type === 'DEBIT' ? '借记卡' : row.pay_type === 'CREDIT' ? '贷记卡' : row.pay_type === 'BEST' ? '翼支付' : '未知';
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
          pageNum: this.page,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
          salesmanId: this.filters.salesmanId
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : util.formatDate.format(new Date(para.startTime),
          'yyyy-MM'); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime),
          'yyyy-MM'); //开始时间
        this.listLoading = true;
        querySalesmanRebate(para).then(res => {
          let {
            data,
            message,
            status
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.merRebateList;
          }
          this.listLoading = false;
        });
      }
    },
    mounted() {
      this.getUsers();
    }
  };

</script>

<style scoped>


</style>
