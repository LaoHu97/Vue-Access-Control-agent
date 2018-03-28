<template>
	<section>
			<el-form :inline="true" :model="filters"  ref="filters">
				<el-row>
					<el-form-item prop="time1">
	          <el-date-picker
	            v-model="filters.time1"
	            type="month"
	            :clearable="false"
	            placeholder="选择月"
							:editable='false'>
	          </el-date-picker>
					</el-form-item>
					<el-form-item prop="time2">
	          <el-date-picker
	            v-model="filters.time2"
	            type="month"
	            :clearable="false"
	            placeholder="选择月"
							:editable='false'>
	          </el-date-picker>
					</el-form-item>
					<el-form-item prop="status">
						<template>
						  <el-select v-model="filters.status" placeholder="请选择结算状态" clearable>
						    <el-option
						      v-for="item in options"
						      :label="item.label"
						      :value="item.value"
									:key="item.value">
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
        <el-table-column prop="settled_date" label="结算时间" min-width="80">
        </el-table-column>
        <el-table-column prop="sum_total" label="有效笔数" min-width="120">
        </el-table-column>
        <el-table-column prop="sum_amt" label="有效金额（￥）" min-width="120">
        </el-table-column>
        <el-table-column prop="rebate_amt" label="提成金额（￥）" min-width="120">
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.status == 1 ? '待结算' : scope.row.status == 2 ? '结算中' : '已结算'}}</span>
            <el-button v-if="scope.row.status==1" type="success" size="mini" @click="handleYes(scope.$index, scope.row)">确认</el-button>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="handleSee(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


		<!--工具条-->
		<el-row class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
			</el-pagination>
		</el-row>
	</section>
</template>

<script>
import * as util from "../../../assets/util.js";
import { queryAgentRebate, updateRebateStatus } from "../../../api/agent";

export default {
  data() {
    return {
      //状态查询
      options: [
        {
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
        time1: Date(),
        time2: Date(),
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
    //结算状态
    handleYes: function(index, row) {
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
            let { status, message } = res;
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
      this.getUsers();
    },
    getUsers() {
      sessionStorage.removeItem("rid"); //删除session
      if (this.filters.time1 !== "") {
        var d = new Date(this.filters.time1);
        var a1 = d.getFullYear();
        var a2 = d.getMonth() + 1;
        var a3 = d.getDate();
        if (a2 < 10 && a3 < 10) {
          a2 = "0" + a2;
          a3 = "0" + a3;
        } else if (a2 < 10) {
          a2 = "0" + a2;
        }
        var starttime = a1 + "-" + a2;
      } else {
        this.filters.time1 = "";
      }
      if (this.filters.time2 !== "") {
        var e = new Date(this.filters.time2);
        var b1 = e.getFullYear();
        var b2 = e.getMonth() + 1;
        var b3 = e.getDate();
        if (b2 < 10 && b3 < 10) {
          b2 = "0" + b2;
          b3 = "0" + b3;
        } else if (b2 < 10) {
          b2 = "0" + b2;
        } else if (b3 < 10) {
          b3 = "0" + b3;
        }
        var endtime = b1 + "-" + b2;
      } else {
        this.filters.time2 = "";
      }
      let para = {
        pageNum: this.page,
        startTime: starttime,
        endTime: endtime,
        status: this.filters.status
      };
      this.listLoading = true;
      queryAgentRebate(para).then(res => {
        let { data, message, status } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.users = res.data.agentRebateList;
          var sta;
          for (var i = 0; i < this.users.length; i++) {
            sta = this.users[i];
            sta.settled_date = util.formatDate.format(
              new Date(sta.settled_date),
              "yyyy-MM"
            );
          }
        }
        this.listLoading = false;
      });
    },
    //显示查看界面
    handleSee: function(index, row) {
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

<style scoped>

</style>
