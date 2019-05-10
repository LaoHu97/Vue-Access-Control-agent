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
          <!-- <el-col :span="8">
            <el-form-item label="选择日期">
              <el-date-picker
                v-model="filters.settledDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col> -->
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="settled_date" label="统计时间" :formatter="formatterDate" />
        <el-table-column prop="sum_amt" label="有效交易金额（元）"/>
        <el-table-column prop="sum_total" label="交易笔数"/>
        <el-table-column prop="rebate_amt" label="返佣金额（元）"/>
        <el-table-column prop="pay_way" label="支付方式" :formatter="formatterPayway" />
        <!-- <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="clickAgentRebate(scope.$index, scope.row)">修改返佣</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <el-dialog
      title="修改代理返佣"
      :visible.sync="dialogVisibleAgentRebate"
      :close-on-click-modal="false"
      width="350px">
      <el-form ref="updataAgentRebateForm" :model="updataAgentRebateForm" :rules="updataAgentRebateRules" label-width="80px">
        <el-form-item label="交易金额" prop="sumAmount">
          <el-input v-model="updataAgentRebateForm.sumAmount"></el-input>
        </el-form-item>
        <el-form-item label="交易笔数" prop="sumTotal">
          <el-input v-model="updataAgentRebateForm.sumTotal"></el-input>
        </el-form-item>
        <el-form-item label="返佣金额" prop="rebateAmount">
          <el-input v-model="updataAgentRebateForm.rebateAmount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAgentRebate = false">取 消</el-button>
        <el-button type="primary" @click="submiltAgentRebateForm('updataAgentRebateForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--工具条-->
    <!-- <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row> -->
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  queryAgentRebateDetail
} from "@/api/agent";
import { validateAmount, validateNumber } from "@/util/async-validator.js"

export default {
  data() {
    return {
      filters: {
        settledDate: ''
      },

      dialogVisibleAgentRebate: false,
      updataAgentRebateForm: {
        id: '',
        sumAmount: '',
        sumTotal: '',
        rebateAmount: ''
      },
      updataAgentRebateRules: {
        sumAmount: [
          { validator: validateAmount, trigger: 'blur' }
        ],
        sumTotal: [
          { validator: validateNumber, trigger: 'blur' }
        ],
        rebateAmount: [
          { validator: validateAmount, trigger: 'blur' }
        ]
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false
    };
  },
  methods: {
    formatterPayway(row, column){
      return util.formatPayment(row.pay_way)
    },
    formatterDate(row, column){
      return util.formatDate.format(new Date(row.settled_date), 'yyyy/MM')
    },
    // clickAgentRebate(index, row) {
    //   this.dialogVisibleAgentRebate = true
    //   this.$nextTick(res => {
    //     let r = util.deepcopy(row)
    //     this.updataAgentRebateForm = {
    //       id: r.id,
    //       sumAmount: r.sum_amt,
    //       sumTotal: r.sum_total,
    //       rebateAmount: r.rebate_amt,
    //     }
    //   })
    // },
    // submiltAgentRebateForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       let para = this.updataAgentRebateForm
    //       updateAgentRebateDetail(para).then(res => {
    //         this.$message({
    //           message: res.message,
    //           type: 'success'
    //         });
    //         this.dialogVisibleAgentRebate = false
    //         this.getUsers()
    //       })
    //     } else {
    //       console.log('error submit!!');
    //       return false;
    //     }
    //   });
    // },
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
      let para = {
        agentId: this.$route.query.agentId,
        settledDate: this.$route.query.date
      }
      para.agentId = this.$route.query.agentId
      queryAgentRebateDetail(para).then(res => {
        this.listLoading = false
        this.users = res.data.detailList;
        this.total = res.data.totalCount;
      });
    }
  },
  mounted () {
    this.getUsers()
  }
};
</script>
