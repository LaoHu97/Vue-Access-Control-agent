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
          <el-col :span="10">
            <el-form-item label="查询日期" prop="dateTime">
              <el-date-picker
                v-model="filters.dateTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
                :clearable="false"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="变更状态" prop="status">
              <el-select v-model="filters.status" placeholder="请选择">
                <el-option
                  v-for="item in optionsPayment"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
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
        <el-table-column prop="mname" label="商户名称"/>
        <el-table-column :formatter="formatCreate_paytype" label="支付方式"/>
         <el-table-column :formatter="formatCreate_isSpecialRate" label="费率类型"/>
        <el-table-column prop="oldRate" label="原始费率（‰）"/>
        <el-table-column prop="newRate" label="变更费率（‰）"/>
        <el-table-column prop="efectiveDate" label="生效时间"/>
        <el-table-column :formatter="formatCreate_statue" label="状态"/>
        <el-table-column :formatter="formatCreate_time" label="创建时间"/>
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
  queryMerNextRate
} from "@/api/agent";


export default {
  data() {
    return {
      filters: {
        startTime: "",
        endTime: "",
        dateTime: [          
          new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate()).getTime(),
          new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),23,59,59).getTime()
        ],
        status: "1"
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,
      optionsPayment:  [
        {
          value: "1",
          label: "预生效"
        },
        {
          value: "2",
          label: "已生效"
        }
      ],
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
    formatCreate_paytype(row, column) {
      return util.formatPayment(row.pay_type)
    },
    formatCreate_isSpecialRate(row, column) {
      return row.reserve1 === 'Y' ? '特殊费率' : '基础费率'
    },
    formatCreate_time(row, column) {
      return util.formatDate.format(
        new Date(row.create_time),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    formatCreate_statue(row, column) {
      return row.status === '1' ? '预生效' : row.status === '2' ? '已生效' : '未知'
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
      let para = this.filters;
      para.pageNum = this.page.toString();
      para.startTime = para.dateTime ? para.dateTime[0].toString() : "";
      para.endTime = para.dateTime ? para.dateTime[1].toString() : "";
      queryMerNextRate(para).then(res => {
        this.listLoading = false
        this.users = res.data.queryNextRateList;
        this.total = res.data.totalCount;
      });
    }
  },
  mounted () {
    this.getUsers()
  }
};
</script>
