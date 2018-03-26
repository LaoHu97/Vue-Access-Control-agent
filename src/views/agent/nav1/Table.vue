<template>
<section>
  <!--工具条-->
  <el-form :inline="true" :model="filters" ref="filters" size="medium">
    <el-row>
        <el-form-item prop="state1">
          <el-select v-model="filters.state1" placeholder="请选择商户名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="loading" clearable @visible-change="clickShop">
            <el-option v-for="item in optionsMers" :key="item.mid" :value="item.mid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="play">
          <el-select v-model="filters.play" clearable placeholder="请选择支付场景">
            <el-option v-for="item in optionsScene" :key="item.valueScene" :label="item.labelScene" :value="item.valueScene">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="filters.state" clearable placeholder="请选择支付状态">
            <el-option v-for="item in optionsState" :key="item.valueState" :label="item.labelState" :value="item.valueState">
            </el-option>
          </el-select>
        </el-form-item>
    </el-row>
    <el-row>
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
  <div v-loading="listLoading">
    <el-table :data="users" border highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="商户名称：">
              <span>{{ props.row.mname }}</span>
            </el-form-item>
            <el-form-item label="订单 ID：">
              <span>{{ props.row.orderId }}</span>
            </el-form-item>
            <el-form-item label="第三方订单号：">
              <span>{{ props.row.transactionId }}</span>
            </el-form-item>
            <el-form-item label="交易金额(元)：">
              <span>{{ props.row.goodsPrice }}</span>
            </el-form-item>
            <el-form-item label="付款时间：">
              <span>{{ props.row.payTime }}</span>
            </el-form-item>
            <el-form-item label="交易状态：">
              <span>{{ props.row.status == 1 ? '已支付' : props.row.status == 3 ? '已支付（有退款）' : '未知' }} </span>
            </el-form-item>
            <el-form-item label="支付方式：">
              <span>{{ props.row.payWay == 'WX' ? '微信' : props.row.payWay == 'ALI' ? '支付宝' : '未知' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="orderId" label="订单ID" min-width="280">
      </el-table-column>
      <el-table-column prop="mname" label="商户名称">
      </el-table-column>
      <el-table-column prop="payTime" label="付款时间"  min-width="160">
      </el-table-column>
      <el-table-column prop="goodsPrice" label="交易金额">
      </el-table-column>
      <el-table-column prop="status" label="交易状态" :formatter="formatPay2">
      </el-table-column>
      <el-table-column prop="payWay" label="支付方式" :formatter="formatPay1">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
            <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">交易详情</el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>
  <!--工具条-->
  <el-row :span="24" class="toolbar">
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
    </el-pagination>
  </el-row>

  <!--编辑界面-->
  <el-dialog title="交易详情" :visible.sync="editFormVisible" :close-on-click-modal="false">
    <el-form :model="editForm" label-width="" ref="editForm">
      <el-form-item label="商户名称：">
        <span>{{editForm.mname}}</span>
      </el-form-item>
      <el-form-item label="订单号：">
        <span>{{editForm.orderId}}</span>
      </el-form-item>
      <el-form-item label="第三方订单号：">
        <span>{{editForm.transactionId}}</span>
      </el-form-item>
      <el-form-item label="交易金额（元）：">
        <span>{{editForm.goodsPrice}}</span>
      </el-form-item>
      <el-form-item label="付款时间：">
        <span>{{editForm.payTime}}</span>
      </el-form-item>
      <el-form-item label="交易状态：">
        <span>{{editForm.status}}</span>
      </el-form-item>
      <el-form-item label="支付方式：">
        <span>{{editForm.payWay}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</section>
</template>

<script>
import * as util from '../../../assets/util.js'
import {
  queryAgentOrder,
  selectMersByName,
  selectSaleByName
} from '../../../api/agent';

export default {
  data() {
    return {
      //支付方式
      optionsScene: [{
        valueScene: 'WX',
        labelScene: '微信'
      }, {
        valueScene: 'ALI',
        labelScene: '支付宝'
      }],
      //支付状态
      optionsState: [{
        valueState: '1',
        labelState: '已支付'
      }, {
        valueState: '3',
        labelState: '已支付（含退款）'
      }, {
        valueState: '5',
        labelState: '未知'
      }],
      //商户查询
      optionsMers: [],
      loading: false,
      //时间控制
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now() ||time.getTime() < Date.now()-3600 * 1000 * 24 * 90;
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() ||time.getTime() < Date.now()-3600 * 1000 * 24 * 90;
        }
      },
      //商户名
      filters: {
        time1: Date(),
        time2: Date(),
        state1: '',
        play: '',
        state: '',
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      //编辑界面数据
      editForm: {
        orderId: '',
        transactionId: '',
        goodsPrice: '',
        payTime: '',
        status: '',
        storeName: '',
        refundAmount: '',
        payWay: ''
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,

    }
  },
  methods: {
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
    formatPay2: function(row, column) {
      return row.status == 1 ? '已支付' : row.status == 3 ? '已支付（有退款）' : '未知';
    },
    formatPay1: function(row, column) {
      return row.payWay == 'WX' ? '微信' : row.payWay == 'ALI' ? '支付宝' : '未知';
    },
    //获取用户列表
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    getUsers() {
      if (this.filters.time1 !== "") {
        var d = new Date(this.filters.time1);
        var a1 = d.getFullYear();
        var a2 = (d.getMonth() + 1);
        var a3 = d.getDate();
        if (a2 < 10 && a3 < 10) {
          a2 = "0" + a2;
          a3 = "0" + a3;
        } else if (a2 < 10) {
          a2 = "0" + a2;
        } else if (a3 < 10) {
          a3 = "0" + a3;
        }
        var starttime = a1 + "-" + a2 + "-" + a3;
      } else {
        this.filters.time1 = "";
      }
      if (this.filters.time2 !== "") {
        var e = new Date(this.filters.time2);
        var b1 = e.getFullYear();
        var b2 = (e.getMonth() + 1);
        var b3 = e.getDate();
        if (b2 < 10 && b3 < 10) {
          b2 = "0" + b2;
          b3 = "0" + b3;
        } else if (b2 < 10) {
          b2 = "0" + b2;
        } else if (b3 < 10) {
          b3 = "0" + b3;
        }
        var endtime = b1 + "-" + b2 + "-" + b3;
      } else {
        this.filters.time2 = ""
      }
      let para = {
        pageNum: this.page,
        startTime: starttime,
        endTime: endtime,
        payWay: this.filters.play,
        mid: this.filters.state1,
        status:this.filters.state
      };
      this.listLoading = true;
      queryAgentOrder(para).then((res) => {
        let {
          data,
          message,
          status
        } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.filters.time1 = res.data.returnST;
          this.users = res.data.orderList;
        }
        setTimeout(() => {
          this.listLoading = false;
        }, 1500);
        
      });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      var pay = this.editForm.payWay;
      if (pay == 'WX') {
        this.editForm.payWay = "微信"
      } else {
        this.editForm.payWay = "支付宝"
      };
      var state = this.editForm.status;
      if (state == 1) {
        this.editForm.status = "已支付"
      } else if (state == 3) {
        this.editForm.status = "已支付（有退款）"
      } else {
        this.editForm.status = "未知"
      }
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
