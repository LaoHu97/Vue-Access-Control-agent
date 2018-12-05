<template>
  <section>
    <el-row class="toolbar">
      <el-form :inline="true" :model="whole">
        <el-tag type="primary" style="margin:10px 10px 20px 0;">交易总金额（元）：{{whole.sumAmt}}元</el-tag>
        <el-tag type="primary" style="">交易总笔数（笔）：{{whole.countRow}}笔</el-tag>
      </el-form>
    </el-row>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-row>
        <el-form-item label="商户名称">
          <el-select v-model="filters.state1" class="fixed_search_input" placeholder="请输入关键字查询" :multiple="false" filterable remote :remote-method="remoteShop" :loading="loading" clearable @visible-change="clickShop">
            <el-option v-for="item in optionsMers" :key="item.mid" :value="item.mid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务员">
          <el-select v-model="filters.state2" class="fixed_search_input" placeholder="请输入关键字查询" :multiple="false" filterable remote :remote-method="remoteSale" :loading="loading" clearable @visible-change="clickSale">
            <el-option v-for="item in optionsSale" :key="item.id" :value="item.id" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期时间">
          <el-date-picker v-model="filters.time1" class="fixed_search_input_date" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.time2" class="fixed_search_input_date" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
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
        <el-table-column prop="sum_total" label="交易笔数">
        </el-table-column>
        <el-table-column prop="refund_amt" label="退款金额" :formatter="format_refund_amt">
        </el-table-column>
        <el-table-column prop="factorage" label="手续费" :formatter="format_factorage">
        </el-table-column>
        <el-table-column prop="avg_amt" label="平均每笔交易额" min-width="120" :formatter="format_avg_amt">
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
    queryMerDaySum,
    selectSaleByName,
    selectMersByName
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
          state1: '',
          state2: ''
        },
        whole: {
          sumAmt: "",
          countRow: ""
        },
        total: 0,
        page: 1,
        users: [],
        optionsSale: [],
        //商户查询
        optionsMers: [],
        listLoading: false,
        loading: false
      }
    },
    methods: {
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
      format_avg_amt(row, column) {
        return util.number_format(row.avg_amt, 2, ".", ",")
      },
      //商户远程搜索
      clickShop: function () {
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
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
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
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
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
      formatPay2: function (row, column) {
        return row.status == 1 ? '已支付' : row.status == 3 ? '已支付（有退款）' : '未知';
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
          salesmanId: this.filters.state2.toString(),
          mid: this.filters.state1.toString()
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(util.formatDate.format(new Date(para.startTime),
          'yyyy/MM/dd')); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(util.formatDate.format(new Date(para.endTime),
          'yyyy/MM/dd')); //结束时间
        this.listLoading = true;
        queryMerDaySum(para).then((res) => {
          let {
            data,
            message,
            status
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.merDaySumList;
            this.whole.countRow = res.data.sumTotal;
            this.whole.sumAmt = res.data.sumAmt;
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
