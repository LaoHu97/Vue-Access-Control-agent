<template>
  <section>
    <!--工具条-->
    <el-form :inline="true" :model="filters" ref="filters" size="medium">
      <el-row>
        <el-form-item prop="startTime">
          <el-date-picker v-model="filters.startTime"  class="fixed_search_input_datetime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="filters.endTime" class="fixed_search_input_datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
          <el-button @click="resetForm('filters')" size="medium" round>重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="mid" class="fixed_search_input">
          <el-select v-model="filters.mid" placeholder="商户名称" :multiple="false" filterable remote :remote-method="remoteShop"
            :loading="loading" clearable @visible-change="clickShop">
            <el-option v-for="item in optionsMers" :key="item.mid" :value="item.mid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="play" class="fixed_search_input">
          <el-select v-model="filters.play" clearable placeholder="支付方式">
            <el-option v-for="item in optionsScene" :key="item.valueScene" :label="item.labelScene" :value="item.valueScene">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state" class="fixed_search_input">
          <el-select v-model="filters.state" clearable placeholder="支付状态">
            <el-option v-for="item in optionsState" :key="item.valueState" :label="item.labelState" :value="item.valueState">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-alert title="可查询最近3个月的交易" type="warning" center close-text="知道了" show-icon>
        </el-alert>
      </el-row>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row>
        <el-table-column type="expand" label="展开" width="80">
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
                <span>{{ props.row.payWay == 'WX' ? '微信' : props.row.payWay == 'ALI' ? '支付宝' : props.row.payWay == 'DEBIT' ? '借记卡' : props.row.payWay == 'CREDIT' ? '贷记卡' : props.row.payWay ? '翼支付' : '未知' }}</span>
              </el-form-item>
              <el-form-item label="支付类型：">
                <span>{{ props.row.payType == 'JSAPI' ? '公众号支付' : props.row.payType == 'NATIVE' ? '扫码支付' : props.row.payType == 'MICRO' ? '刷卡支付' : '未知' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单ID" min-width="280">
        </el-table-column>
        <el-table-column prop="mname" label="商户名称" min-width="160">
        </el-table-column>
        <el-table-column prop="payTime" label="付款时间" min-width="160">
        </el-table-column>
        <el-table-column prop="goodsPrice" label="交易金额" min-width="120" :formatter="format_goodsPrice">
        </el-table-column>
        <el-table-column prop="status" label="交易状态" :formatter="formatPay2">
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式" :formatter="formatPay1">
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row :span="24" class="toolbar">
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
        }, {
          valueScene: 'DEBIT',
          labelScene: '借记卡'
        }, {
          valueScene: 'CREDIT',
          labelScene: '贷记卡'
        }, {
          valueScene: 'BEST',
          labelScene: '翼支付'
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
            let date = new Date();
            return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.startTime),
              'yyyy-MM-dd')));
            if (time.getTime() < startTimeOne - 3600 * 1000 * 24 || time.getTime() > Date.now()) {
              return true;
            }
          }
        },
        //商户名
        filters: {
          startTime: Date(),
          endTime: Date(),
          mid: '',
          play: '',
          state: '',
        },
        total: 0,
        page: 1,
        users: [],
        listLoading: false,
      }
    },
    methods: {
      //格式化金额
      format_goodsPrice(row, column) {
        return util.number_format(row.goodsPrice, 2, ".", ",")
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
      formatPay2: function (row, column) {
        return row.status == 1 ? '已支付' : row.status == 3 ? '已支付（有退款）' : '未知';
      },
      formatPay1: function (row, column) {
        return row.payWay == 'WX' ? '微信' : row.payWay == 'ALI' ? '支付宝' : row.payWay == 'DEBIT' ? '借记卡' : row.payWay == 'CREDIT' ? '贷记卡' : row.payWay == 'BEST' ? '翼支付' : '未知';
      },
      //获取用户列表
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      getUsers(){
        this.page = 1
        this.getList()
      },
      getList() {
        this.listLoading = true;
        let para = {
          pageNum: this.page,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
          payWay: this.filters.play,
          mid: this.filters.mid,
          status: this.filters.state
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(util.formatDate.format(new Date(para.startTime), 'yyyy-MM-dd')); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(util.formatDate.format(new Date(para.endTime), 'yyyy-MM-dd')); //结束时间
        queryAgentOrder(para).then((res) => {
          let {
            data,
            message,
            status
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.orderList;
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
