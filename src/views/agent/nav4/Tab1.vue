<style scoped>
.search_top {
  background: #f2f2f2;
  margin: 20px 0;
  padding: 20px 10px 0 10px;
}
.top_alert {
  margin-top: 20px;
}
.img_protocol{
  width: 200px;
}
</style>
<style>
.fixed_search_input {
  max-width: 160px;
}
.fixed_search_date {
  max-width: 220px;
}
</style>

<template>
  <section>
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="80px">
      <div class="search_top">
        <el-row>
          <el-col :span="8">
            <el-form-item label="选择日期">
              <el-date-picker
                v-model="filters.selechTime"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                value-format="yyyy-MM">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结算状态">
              <el-select v-model="filters.status" placeholder="请选择结算状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="user_name" label="代理商名称"/>
        <el-table-column prop="settled_date" label="统计月份" :formatter="formatterDate"/>
        <el-table-column prop="sum_total" label="交易笔数"/>
        <el-table-column prop="sum_amt" label="有效交易金额（元）"/>
        <el-table-column prop="rebate_amt" label="返佣金额（元）"/>
        <el-table-column prop="status" label="状态" :formatter="formatterStatus" />
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button type="warning" :disabled="scope.row.status !== '2'" size="mini" @click="clickAgentRebateStatus(scope.$index, scope.row)">修改状态</el-button>
            <el-button type="primary" size="mini" @click="clickAgentRebateDetail(scope.$index, scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="修改代理返佣状态"
      :visible.sync="dialogVisibleAgentRebateStatus"
      :close-on-click-modal="false"
      width="280px">
      <el-select v-model="AgentRebateStatus" placeholder="请选择">
        <el-option
          v-for="item in agentRebateStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAgentRebateStatus = false">取 消</el-button>
        <el-button type="primary" @click="submiltAgentRebateStatusForm()">确 定</el-button>
      </span>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  queryRebate,
  updateAgentRebateStatus
} from "@/api/agent";
import { validateAmount, validateNumber } from "@/util/async-validator.js"

export default {
  data() {
    return {
      filters: {
        selechTime: '',
        status: '2',
        startTime: '',
        endTime: ''
      },
      statusOptions: [ {
        value: '2',
        label: '待结算'
      }, {
        value: '3',
        label: '结算中'
      }, {
        value: '4',
        label: '已结算'
      }],

      dialogVisibleAgentRebateStatus: false,
      AgentRebateStatusId: '',
      AgentRebateStatus: '',
      agentRebateStatusOptions: [{
        value: '2',
        label: '结算中'
      }],
      total: 0,
      page: 1,
      users: [],
      listLoading: false
    };
  },
  methods: {
    formatterDate(row, column){
      return row.settled_date.slice(0, 7)
    },
    formatterStatus(row, column){
      return row.status === '1' ? '待核算' : row.status === '2' ? '待结算' : row.status === '3' ? '结算中' : row.status === '4' ? '已结算' : '未知'
    },
    clickAgentRebateDetail(index, row) {
      this.$router.push({ path: '/index1/tab2', query: { agentId: row.agent_id, date: row.settled_date } })
    },
    clickAgentRebateStatus(index, row) {
      this.dialogVisibleAgentRebateStatus = true
      this.$nextTick(res => {
        let r = util.deepcopy(row)
        this.AgentRebateStatusId = row.id
        this.AgentRebateStatus = ''
      })
    },
    submiltAgentRebateStatusForm(){
      if (!this.AgentRebateStatus) {
        return this.$message({message: '请选择状态', type: 'warning'});
      }
      let para = {
        id: this.AgentRebateStatusId,
        status: this.AgentRebateStatus
      }
      updateAgentRebateStatus(para).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        });
        this.dialogVisibleAgentRebateStatus = false
        this.getUsers()
      })
    },
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    getUsers () {
      this.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      let para = util.deepcopy(this.filters);
      para.startTime = para.selechTime ? para.selechTime[0] : ''
      para.endTime = para.selechTime ? para.selechTime[1] : ''
      para.pageNum = this.page.toString();

      delete para.selechTime
      queryRebate(para).then(res => {
        this.listLoading = false
        this.users = res.data.agentRebateList;
        this.total = res.data.totalCount;
      });
    }
  },
  mounted () {
    this.getUsers()
  }
};
</script>
