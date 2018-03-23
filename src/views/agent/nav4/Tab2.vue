<template>
	<section>
		<!--工具条-->
	<el-row>
      <h3 style="padding:10px 20px">概览</h3>
      <el-form :inline="true" :model="Overview" style="padding:0 20px">
        <el-col :span="12">
  				<el-form-item label="统计时间：">
  					<span name="name">{{Overview.settled_date}}</span>
  				</el-form-item>
        </el-col>
        <el-col :span="12">
  				<el-form-item label="提成金额（元）：">
  					<span name="name">{{Overview.rebate_amt}}</span>
  				</el-form-item>
        </el-col>
        <el-col :span="12">
  				<el-form-item label="有效金额（元）：">
  					<span name="name">{{Overview.sum_amt}}</span>
  				</el-form-item>
        </el-col>
        <el-col :span="12">
  				<el-form-item label="有效笔数（笔）：">
  					<span name="name">{{Overview.sum_total}}</span>
  				</el-form-item>
        </el-col>
        <el-col :span="12">
  				<el-form-item label="状态：">
  					<span name="name">{{Overview.status=="1"?"待结算":Overview.status=="2"?"结算中":"已结算"}}</span>
  				</el-form-item>
        </el-col>
				 <el-button type="primary" icon="arrow-left" style="float:right" @click="Return">返回</el-button>
  		</el-form>
    </el-row>
		<!--列表-->
		<el-table :data="users" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="mname" label="商户名称" min-width="100">
			</el-table-column>
			<el-table-column prop="sum_amt" label="有效金额" min-width="100">
			</el-table-column>
			<el-table-column prop="sum_total" label="有效笔数" min-width="100">
			</el-table-column>
			<el-table-column prop="rebate_rate" label="返佣费率（千分比）" min-width="100">
			</el-table-column>
			<el-table-column prop="commission" label="返佣金额" min-width="100">
			</el-table-column>
			<el-table-column prop="rebate_amt" label="提成金额" min-width="100">
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
import * as util from "../../../assets/util.js";
import { queryMerRebate } from "../../../api/agent";

export default {
  data() {
    return {
      Overview: {
        settled_date: "",
        status: ""
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false
    };
  },
  methods: {
    //返回上一页
    Return: function() {
      sessionStorage.removeItem("rid"); //删除session
      this.$router.push("/tab1");
    },
    //获取用户列表
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    getUsers() {
      let rid = JSON.parse(sessionStorage.getItem("rid"));
      let para = {
        pageNum: this.page,
        id: rid
      };
      this.listLoading = true;
      queryMerRebate(para).then(res => {
        let { data, message, status } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.users = res.data.merRebateList;
          this.Overview = res.data.agentRebate;
          this.Overview.settled_date = util.formatDate.format(
            new Date(this.Overview.settled_date),
            "yyyy-MM-dd"
          );
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
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style scoped>

</style>
