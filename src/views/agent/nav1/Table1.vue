<template>
  <section>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-row>
        <el-form-item label="商户名称">
          <el-select v-model="filters.mid" class="fixed_search_input" placeholder="商户名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="mersLoading" clearable @visible-change="clickShop">
            <el-option v-for="item in optionsMers" :key="item.mid" :value="item.mid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="filters.state" class="fixed_search_input" clearable placeholder="支付方式">
            <el-option v-for="item in optionsState" :key="item.valueState" :label="item.labelState" :value="item.valueState">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期时间">
          <el-date-picker v-model="filters.time1" class="fixed_search_input_date" placeholder="开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.time2" class="fixed_search_input_date" placeholder="结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
          <el-button @click="resetForm('filters')" round>重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-alert title="可查询最近三个月的信息" type="warning" show-icon center close-text="知道了">
        </el-alert>
      </el-row>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="mname" label="商户名称" min-width="100">
        </el-table-column>
        <el-table-column prop="trans_amt" label="交易金额" min-width="100" :formatter="format_trans_amt">
        </el-table-column>
        <el-table-column prop="amount" label="有效金额" min-width="100" :formatter="format_amount">
        </el-table-column>
        <el-table-column prop="sum_total" label="交易笔数" min-width="100">
        </el-table-column>
        <el-table-column prop="refund_amt" label="退款金额" min-width="100" :formatter="format_refund_amt">
        </el-table-column>
        <el-table-column prop="pay_type" label="支付方式" min-width="100" :formatter="format_pay_type">
        </el-table-column>
        <el-table-column prop="factorage" label="手续费" min-width="100" :formatter="format_factorage">
        </el-table-column>
        <el-table-column prop="surplus" label="结余金额" min-width="100" :formatter="format_surplus">
        </el-table-column>
      </el-table>
    </div>

    <!--工具条-->
    <el-row class="toolbar">
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  import {
    queryAgentOrder,
    selectMersByName,
    selectSaleByName,
    showMerStatement
  } from '../../../api/agent';

  export default {
    data() {
      return {
        //支付状态
        optionsState: [{
          valueState: 'WX',
          labelState: '微信'
        }, {
          valueState: 'ALI',
          labelState: '支付宝'
        }, {
          valueState: 'DEBIT',
          labelState: '借记卡'
        }, {
          valueState: 'CREDIT',
          labelState: '贷记卡'
        }, {
          valueState: 'BEST',
          labelState: '翼支付'
        }],
        //时间控制
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 3600 * 1000 * 24 * 1 || time.getTime() < Date.now() - 3600 * 1000 * 24 *
              90;
          }
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 3600 * 1000 * 24 * 1 || time.getTime() < Date.now() - 3600 * 1000 * 24 *
              90;
          }
        },
        //商户名
        filters: {
          time1: Date.now() - 3600 * 1000 * 24 * 1,
          time2: Date.now() - 3600 * 1000 * 24 * 1,
          state: '',
          mid: ''
        },
        total: 0,
        page: 1,
        users: [],
        optionsMers: [],
        listLoading: false,
        mersLoading: false
      }
    },
    methods: {
      format_pay_type(row,column){
        return row.pay_type === 'WX' ? '微信' : row.pay_type === 'ALI' ? '支付宝' : row.pay_type === 'DEBIT' ? '借记卡' : row.pay_type === 'CREDIT' ? '贷记卡' : row.pay_type === 'BEST' ? '翼支付' : '未知';
      },
      //格式化金额
      format_trans_amt(row, column) {
        return util.number_format(row.trans_amt, 2, ".", ",")
      },
      format_amount(row, column) {
        return util.number_format(row.amount, 2, ".", ",")
      },
      format_refund_amt(row, column) {
        return util.number_format(row.refund_amt, 2, ".", ",")
      },
      format_factorage(row, column) {
        return util.number_format(row.factorage, 2, ".", ",")
      },
      format_surplus(row, column) {
        return util.number_format(row.surplus, 2, ".", ",")
      },
      //商户远程搜索
      clickShop: function () {
        this.mersLoading = true;
        selectMersByName().then((res) => {
          let {
            status,
            data
          } = res
          this.mersLoading = false;
          this.optionsMers = data.merchantList
        })
      },
      remoteShop(query) {
        if (query !== '') {
          this.mersLoading = true;
          setTimeout(() => {
            this.mersLoading = false;
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
          pageNum: String(this.page),
          startTime: this.filters.time1,
          endTime: this.filters.time2,
          payType: this.filters.state,
          mid: this.filters.mid 
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(util.formatDate.format(new Date(para.startTime),
          'yyyy/MM/dd')); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(util.formatDate.format(new Date(para.endTime),
          'yyyy/MM/dd')); //结束时间
        this.listLoading = true;
        showMerStatement(para).then((res) => {
          let {
            data,
            message,
            status
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.merStatementList;
          }
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
