<style scoped>
.search_top {
  background: #f2f2f2;
  margin: 20px 0;
  padding: 20px 10px 0 10px;
}
.top_alert {
  margin-top: 20px;
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
          <el-col :span="6">
            <el-form-item label="商户号" prop="merchant_no">
              <el-input v-model="filters.merchant_no" class="fixed_search_input" placeholder="请输入商户号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称" prop="mid">
              <el-select
                v-model="filters.mid"
                class="fixed_search_input"
                placeholder="请输入商户关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteMer"
                :loading="merLoading"
                @visible-change="changeMer"
                clearable
              >
                <el-option
                  v-for="item in optionsMer"
                  :key="item.mid"
                  :value="item.mid"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算日期" prop="startTime">
              <el-date-picker
                v-model="filters.startTime"
                class="fixed_search_input"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                :clearable ="false"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item>至</el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="filters.endTime"
                class="fixed_search_input"
                type="date"
                placeholder="选择日期"
                :clearable ="false"
                :picker-options="pickerOptions"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item style="float:right">
            <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="business_no" label="商户号"/>
        <el-table-column prop="mname" label="商户名称"/>
        <el-table-column :formatter="formatCreate_time2" label="交易日期"/>
        <el-table-column :formatter="formatCreate_time" label="结算日期"/>
        <el-table-column prop="settlement_amount" label="结算金额"/>
      </el-table>
    </div>
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
  selectMersByName,
  queryStatementList
} from "@/api/agent";

export default {
  data() {
    return {
      filters: {
        startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime(),
        endTime: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),23,59,59).getTime(),
        mid: "",
        merchant_no: ''
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,
      merLoading: false,
      optionsMer: [],
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() >
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            )
          );
        }
      }
    };
  },
  methods: {
    formatCreate_time(row, column) {
      return util.formatDate.format(
        new Date(row.settlement_date),
        "yyyy/MM/dd"
      );
    },
    formatCreate_time2(row, column) {
      return util.formatDate.format(
        new Date(row.trade_date),
        "yyyy/MM/dd"
      );
    },
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    getUsers () {
      this.page = 1
      this.getList()
    },
    changeMer() {
      this.merLoading = true;
      selectMersByName({ mname: "" }).then(res => {
        this.merLoading = false;
        this.optionsMer = res.data.merchantList;
      });
    },
    remoteMer(query) {
      if (query !== "") {
        this.merLoading = true;
        setTimeout(() => {
          this.merLoading = false;
          selectMersByName({
            mname: query
          }).then(res => {
            this.optionsMer = res.data.merchantList;
          });
        }, 200);
      } else {
        this.optionsMer = [];
      }
    },
    getList() {
      this.listLoading = true
      let para = this.filters;
      para.pageNum = this.page.toString();
      queryStatementList(para).then(res => {
        this.listLoading = false
        this.users = res.data.queryStatementList;
        this.total = res.data.totalCount;
      });
    }
  },
  mounted () {
    this.getUsers()
  }
};
</script>
