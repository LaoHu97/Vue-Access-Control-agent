<template>
<section>
  <el-form :inline="true" :model="filters" ref="filters">
    <el-row style="padding: 20px 0 0 10px">
      <el-form-item prop="state">
        <el-select v-model="filters.state" clearable placeholder="请选择支付方式">
          <el-option v-for="item in optionsState" :key="item.valueState" :label="item.labelState" :value="item.valueState">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="time1">
        <el-date-picker v-model="filters.time1" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="time2">
        <el-date-picker v-model="filters.time2" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-tag type="gray">可查询最近三个月的信息</el-tag>
      <el-form-item style="float: right;">
        <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
        <el-button @click="resetForm('filters')" size="medium" round>重置</el-button>
      </el-form-item>
    </el-row>
  </el-form>
  <!--列表-->
  <el-table :data="users" border highlight-current-row v-loading="listLoading" style="width: 100%;">
    <el-table-column prop="mname" label="商户名称" min-width="100">
    </el-table-column>
    <el-table-column prop="trans_amt" label="交易金额" min-width="100">
    </el-table-column>
    <el-table-column prop="amount" label="有效金额" min-width="100">
    </el-table-column>
    <el-table-column prop="sum_total" label="交易笔数" width="100">
    </el-table-column>
    <el-table-column prop="refund_amt" label="退款金额" width="100">
    </el-table-column>
    <el-table-column prop="pay_type" label="支付方式" width="100">
    </el-table-column>
    <el-table-column prop="factorage" label="手续费" width="100">
    </el-table-column>
    <el-table-column prop="surplus" label="结余金额" width="100">
    </el-table-column>
    <!-- <el-table-column label="操作" width="100">
      <template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">交易详情</el-button>
				</template>
    </el-table-column> -->
  </el-table>

  <!--工具条-->
  <el-col :span="24" class="toolbar">
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
    </el-pagination>
  </el-col>
</section>
</template>

<script>
import * as util from '../../../assets/util.js'
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
      }],
      //时间控制
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
        }
      },
      //商户名
      filters: {
        time1: Date(),
        time2: Date(),
        state: '',
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,
    }
  },
  methods: {
    formatPay2: function(row, column) {
      return row.status == 1 ? '已支付' : row.status == 3 ? '已支付（有退款）' : '未知';
    },
    //获取用户列表
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    getUsers() {
      let para = {
        pageNum: String(this.page),
        startTime: this.filters.time1,
        endTime: this.filters.time2,
        payType: this.filters.state
      };
      para.startTime = (!para.startTime || para.startTime == '') ? '' : String(util.formatDate.format(new Date(para.startTime), 'yyyy/MM/dd')); //开始时间
      para.endTime = (!para.endTime || para.endTime == '') ? '' : String(util.formatDate.format(new Date(para.endTime), 'yyyy/MM/dd')); //结束时间
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
