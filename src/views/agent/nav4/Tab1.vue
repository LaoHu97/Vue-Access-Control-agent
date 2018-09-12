<template>
  <section>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-row>
        <el-form-item label="日期时间">
          <el-date-picker v-model="filters.startTime" class="fixed_search_input_date" type="month" :clearable="false" placeholder="选择月" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.endTime" class="fixed_search_input_date" type="month" :clearable="false" placeholder="选择月" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算状态">
          <template>
            <el-select v-model="filters.status" class="fixed_search_input" placeholder="结算状态" clearable>
              <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="settled_date" label="结算月份" min-width="80" :formatter="format_settled_date">
        </el-table-column>
        <el-table-column prop="sum_total" label="有效笔数" min-width="120">
        </el-table-column>
        <el-table-column prop="sum_amt" label="有效金额（￥）" min-width="120" :formatter="format_sum_amt">
        </el-table-column>
        <el-table-column prop="rebate_amt" label="提成金额（￥）" min-width="120" :formatter="format_rebate_amt">
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.status == 1 ? '待结算' : scope.row.status == 2 ? '结算中' : '已结算'}}</span>
            <el-button v-if="scope.row.status==1" type="success" size="mini" @click="handleYes(scope.$index, scope.row)">确认</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="handleSee(scope.$index, scope.row)">查看</el-button>
          </template>
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
  import * as util from "../../../util/util.js";
  import {
    queryAgentRebate,
    updateRebateStatus
  } from "../../../api/agent";

  export default {
    data() {
      return {
        //状态查询
        options: [{
            value: 1,
            label: "待结算"
          },
          {
            value: 2,
            label: "结算中"
          },
          {
            value: 3,
            label: "已结算"
          }
        ],
        //商户名
        filters: {
          startTime: Date(),
          endTime: Date(),
          status: ""
        },
        total: 0,
        page: 1,
        users: [],
        listLoading: false,
        sels: [], //列表选中列

        editFormVisible: false, //编辑界面是否显示
        editLoading: false,
        //编辑界面数据
        editForm: {
          orderId: "",
          transactionId: "",
          goodsPrice: "",
          payTime: "",
          status: "",
          storeName: "",
          refundAmount: "",
          payWay: ""
        },

        addFormVisible: false, //新增界面是否显示
        addLoading: false
      };
    },
    methods: {
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
      //结算状态
      handleYes: function (index, row) {
        this.$confirm("确认结算返佣金额？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info"
          })
          .then(() => {
            let para = {
              id: row.id
            };
            updateRebateStatus(para).then(res => {
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.getUsers();
                this.$message({
                  message: message,
                  type: "success"
                });
              } else {
                this.$message({
                  message: message,
                  type: "warning"
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
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
        sessionStorage.removeItem("rid"); //删除session
        let para = {
          pageNum: this.page,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
          status: this.filters.status
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : util.formatDate.format(new Date(para.startTime),
          'yyyy-MM'); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime),
          'yyyy-MM'); //开始时间
        this.listLoading = true;
        queryAgentRebate(para).then(res => {
          let {
            data,
            message,
            status
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.agentRebateList;
          }
          this.listLoading = false;
        });
      },
      //显示查看界面
      handleSee: function (index, row) {
        var rid = row.id;
        sessionStorage.setItem("rid", JSON.stringify(rid));
        this.$router.push("/index1/tab2");
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.getUsers();
    }
  };

</script>
