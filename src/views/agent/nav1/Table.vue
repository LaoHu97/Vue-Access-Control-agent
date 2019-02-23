<template>
  <section>
    <!--工具条-->
    <el-form :inline="true" :model="filters" ref="filters" label-position="left" label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="所属商户" prop="mid">
            <el-select v-model="filters.mid" placeholder="请输入关键字查询" class="fixed_search_input" :multiple="false" filterable remote :remote-method="remoteShop" :loading="midLoading"
              clearable @focus="clickShop" @change="changeMer">
              <el-option v-for="item in optionsMers" :key="item.mid" :value="item.mid" :label="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="所属门店" prop="sid">
              <el-select
                v-model="filters.sid"
                class="fixed_search_input"
                placeholder="请输入关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteStore"
                :loading="storeLoading"
                clearable
                @focus="clickStore"
                @change="changeStore"
              >
                <el-option
                  v-for="item in optionsStore"
                  :key="item.id"
                  :value="item.id"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属款台" prop="eid">
              <el-select
                v-model="filters.eid"
                class="fixed_search_input"
                placeholder="请输入关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteEmp"
                :loading="empLoading"
                clearable
                @focus="clickEmp"
              >
                <el-option
                  v-for="item in optionsEmp"
                  :key="item.eid"
                  :value="item.eid"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        <el-col :span="6">
          <el-form-item label="支付方式" prop="play">
            <el-select v-model="filters.play" class="fixed_search_input" clearable placeholder="支付方式">
              <el-option v-for="item in optionsScene" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="支付状态" prop="state">
            <el-select v-model="filters.state" class="fixed_search_input" clearable placeholder="支付状态">
              <el-option v-for="item in optionsPayState" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交易金额" prop="goodsprice">
            <el-input v-model.trim="filters.goodsprice" class="fixed_search_input" placeholder="交易金额">
              <i slot="prefix" class="iconfont icon-50"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单号" prop="orderId">
            <el-input v-model.trim="filters.orderId" class="fixed_search_input" placeholder="订单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="第三方订单号" prop="transaction_id">
            <el-input v-model.trim="filters.transaction_id" class="fixed_search_input" placeholder="第三方订单号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="交易时间" prop="startTime">
            <el-date-picker v-model="filters.startTime" type="datetime" @change="changTime" class="fixed_search_input_datetime" placeholder="选择开始日期" :picker-options="pickerOptions1"
              :clearable="false" :editable='false'>
            </el-date-picker>
          </el-form-item>
          <el-form-item>至</el-form-item>
          <el-form-item prop="endTime">
            <el-date-picker v-model="filters.endTime" type="datetime" class="fixed_search_input_datetime" placeholder="选择结束日期" :picker-options="pickerOptions2"
              :clearable="false" :editable='false' default-time="23:59:59">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="getUsers" round>查询</el-button>
            <el-button @click="resetForm('filters')" round>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-alert title="查询区间最多为31天" type="warning" center close-text="知道了" show-icon>
        </el-alert>
      </el-row>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row>
        <el-table-column prop="orderId" label="订单号" min-width="280">
        </el-table-column>
        <el-table-column prop="payTime" label="交易时间" min-width="160">
        </el-table-column>
        <el-table-column prop="goodsPrice" label="交易金额" min-width="120" :formatter="format_goodsPrice">
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式" :formatter="formatPay1">
        </el-table-column>
        <el-table-column prop="status" label="支付状态" :formatter="formatPay2">
        </el-table-column>
        <el-table-column prop="username" label="商户名称" min-width="160">
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleDetail(scope.$index, scope.row)">交易详情</el-button>
          </template>
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
    downloadQueryAgentOrder,
    selectStoreList,
    selectEmpsBySid
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
          disabledDate: (time) => {
            if (time.getTime() > Date.now()) {
              return true;
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.startTime),
              'yyyy-MM-dd')));
            if (time.getTime() > startTimeOne + 3600 * 1000 * 24 * 30 || time.getTime() < startTimeOne - 3600 * 1000 *
              24 * 1) {
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
          cardType: '',
          sid: '',
          eid: ''
        },
        dateNow: Date.now(),
        total: 0,
        page: 1,
        users: [],
        listLoading: false,
        empLoading: false,
        storeLoading: false,
        optionsEmp: [],
        optionsStore: [],
      }
    },
    methods: {
      handleDetail(index, row) {
        this.$router.push({
          path: "/index1/table1",
          query: { id: row.id }
        });
      },
      changTime(date) {
        let end_time = Date.parse(new Date(util.formatDate.format(new Date(this.filters.endTime), 'yyyy-MM-dd')))
        let date_time = Date.parse(new Date(util.formatDate.format(new Date(date), 'yyyy-MM-dd')))
        if (date_time < end_time - 3600 * 1000 * 24 * 30) {
          this.filters.endTime = new Date(this.filters.startTime.getFullYear(), this.filters.startTime.getMonth(), this.filters.startTime.getDate(), 23, 59, 59)
        }
      },
      //格式化金额
      format_goodsPrice(row, column) {
        return util.number_format(row.goodsPrice, 2, ".", ",")
      },
      changeStore() {
        this.filters.eid = "";
      },
      changeMer() {
        this.filters.sid = "";
        this.filters.eid = "";
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
    //款台远程搜索
    clickEmp: function() {
      this.empLoading = true;
      let para = {
        mid: this.$route.query.mid,
        storeId: this.filters.sid.toString() || ''
      };
      selectEmpsBySid(para).then(res => {
        this.empLoading = false;
        let { status, data } = res;
        this.optionsEmp = data.emplyeeList;
      });
    },
    remoteEmp(query) {
      if (query !== "") {
        this.empLoading = true;
        setTimeout(() => {
          this.empLoading = false;
          let para = {
            mid: this.$route.query.mid,
            storeId: this.filters.sid.toString() || ''
          };
          selectEmpsBySid(para).then(res => {
            this.optionsEmp = res.data.emplyeeList;
          });
        }, 200);
      } else {
        this.optionsEmp = [];
      }
    },
    clickStore() {
      this.storeLoading = true;
      selectStoreList({ mid: this.filters.mid }).then(res => {
        this.storeLoading = false;
        let { status, data } = res;
        this.optionsStore = data.storeList;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.storeLoading = true;
        setTimeout(() => {
          this.storeLoading = false;
          selectStoreList({
            sname: query,
            mid: this.filters.mid
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.storeList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
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
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.startTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.endTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间

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
