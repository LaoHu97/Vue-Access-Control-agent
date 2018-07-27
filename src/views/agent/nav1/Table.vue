<template>
  <section>
    <!--工具条-->
    <el-form :inline="true" :model="filters" ref="filters" size="medium">
      <el-row>
        <el-form-item prop="startTime">
          <el-date-picker v-model="filters.startTime" type="datetime" class="fixed_search_input_datetime" placeholder="选择开始日期" :picker-options="pickerOptions1"
            :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="filters.endTime" type="datetime" class="fixed_search_input_datetime" placeholder="选择结束日期" :picker-options="pickerOptions2"
            :clearable="false" :editable='false' default-time="23:59:59">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="mid" class="fixed_search_input">
          <el-select v-model="filters.mid" placeholder="商户名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="midLoading"
            clearable @visible-change="clickShop">
            <el-option v-for="item in optionsMers" :key="item.mid" :value="item.mid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state" class="fixed_search_input">
          <el-select v-model="filters.state" clearable placeholder="支付状态">
            <el-option v-for="item in optionsPayState" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
          <el-button @click="resetForm('filters')" size="medium" round>重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="play" class="fixed_search_input">
          <el-select v-model="filters.play" clearable placeholder="支付方式">
            <el-option v-for="item in optionsScene" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cardType" class="fixed_search_input">
          <el-select v-model="filters.cardType" clearable placeholder="银行卡类型" :disabled="this.filters.play!=='BANK'">
            <el-option v-for="item in optionsBank" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsprice" class="fixed_search_input">
          <el-input v-model.trim="filters.goodsprice" placeholder="交易金额">
            <i slot="prefix" class="iconfont icon-50"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="orderId" class="fixed_search_input">
          <el-input v-model.trim="filters.orderId" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item prop="transaction_id" class="fixed_search_input">
          <el-input v-model.trim="filters.transaction_id" placeholder="第三方订单号"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-alert title="查询区间最多为3个月" type="warning" center close-text="知道了" show-icon>
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
                <span>{{ props.row.username }}</span>
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
                <span>{{ formatPay2(props.row) }} </span>
              </el-form-item>
              <el-form-item label="支付方式：">
                <span>{{ formatPay1(props.row) }}</span>
              </el-form-item>
              <el-form-item label="支付类型：">
                <span>{{ props.row.payType == 'JSAPI' ? '公众号支付' : props.row.payType == 'NATIVE' ? '扫码支付' : props.row.payType ==
                  'MICRO' ? '刷卡支付' : '未知' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单ID" min-width="280">
        </el-table-column>
        <el-table-column prop="username" label="商户名称" min-width="160">
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
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  import * as data from '../../../util/data.js'
  import {
    queryAgentOrder,
    selectMersByName,
    selectSaleByName,
    downloadQueryAgentOrder
  } from '../../../api/agent';

  export default {
    data() {
      var myDate = new Date();
      return {
        //支付方式
        optionsScene: data.optionsPaymentCopy,
        //银行卡类型
        optionsBank: data.optionsBank,
        //支付状态
        optionsPayState: data.optionsPayState,
        //商户查询
        optionsMers: [],
        midLoading: false,
        //时间控制
        pickerOptions1: {
          disabledDate(time) {
            let date = new Date();
            return time.getTime() > Date.now()
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.startTime),
              'yyyy-MM-dd')));
            if (time.getTime() < startTimeOne - 3600 * 1000 * 24 || time.getTime() > this.dateNow) {
              return true;
            }
          }
        },
        //商户名
        filters: {
          startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()),
          endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(),23, 59, 59),
          mid: '',
          play: '',
          state: 'SUCCESS',
          goodsprice: '',
          transaction_id: '',
          cardType: ''
        },
        dateNow: Date.now(),
        total: 0,
        page: 1,
        users: [],
        listLoading: false,
      }
    },
    computed: {
      startTime() {
    　　return this.filters.startTime
    　},
      play() {
        return this.filters.play
      }
    },
    watch: {
      play(newVal, oldVal) {
        this.filters.cardType = ''
      },
      startTime(newVal,oldVal) {
        let myDate = new Date()
        let dateN = Date.parse(new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()))
        if ( Date.parse(newVal) > dateN - 3600 * 1000 * 24 * 90 && Date.parse(newVal) < dateN) {
          this.dateNow = Date.now() - 3600 * 1000 * 24
          this.filters.endTime = new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()-1,23, 59, 59)
        } else if (Date.parse(newVal) < dateN - 3600 * 1000 * 24 * 90 && Date.parse(newVal) < dateN) {
          this.dateNow = Date.parse(newVal) + 3600 * 1000 * 24 * 90
          this.filters.endTime = ''
        } else {
          this.dateNow = Date.now()
          this.filters.endTime = new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(),23, 59, 59)
        }
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
          this.midLoading = true;
          setTimeout(() => {
            this.midLoading = false;
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
        return util.formatPayStatus(row.status, row.orderType)
      },
      formatPay1: function (row, column) {
        return util.formatPayment(row.payWay)
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
        this.listLoading = true;
        let para = {
          agentId: sessionStorage.getItem('agentId'),
          pageNum: this.page,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
          payWay: this.filters.play,
          mid: this.filters.mid,
          status: this.filters.state,
          orderId: this.filters.orderId,
          transactionId: this.filters.transaction_id,
          goodsPrice: this.filters.goodsprice,
          cardType: this.filters.cardType,
        };
        let myDate = new Date()
        let dateN = Date.parse(new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()))
        para.startTime = (!para.startTime || para.startTime == '') ? '' : Date.parse(util.formatDate.format(new Date(para.startTime), 'yyyy-MM-dd hh:ss:mm')).toString(); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : Date.parse(util.formatDate.format(new Date(para.endTime), 'yyyy-MM-dd hh:ss:mm')).toString(); //结束时间

        if (Date.parse(this.filters.startTime) < dateN) {
          downloadQueryAgentOrder(para).then((res) => {
            let {
              data,
              message,
              status
            } = res;
            if (status == 200) {
              this.total = res.data.totalCount;
              this.users = res.data.summaryCopyList;
            }
            this.listLoading = false;
          });
        } else {
          queryAgentOrder(para).then((res) => {
            let {
              data,
              message,
              status
            } = res;
            if (status == 200) {
              this.total = res.data.totalCount;
              this.users = res.data.summaryCopyList;
            }
            this.listLoading = false;
          });
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
