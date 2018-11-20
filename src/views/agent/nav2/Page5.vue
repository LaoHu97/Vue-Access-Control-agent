<template>
<section>
  <!--工具条-->
  <el-row style="padding-bottom: 20px;">
    <el-form :inline="true" :model="whole">
      <el-tag type="primary" style="">商户总数：{{whole.sum}}</el-tag>
    </el-form>
  </el-row>
  <el-row>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-form-item label="商户名称">
        <el-input v-model="filters.mname" class="fixed_search_input" placeholder="商户名称"></el-input>
      </el-form-item>
      <el-form-item label="商户帐号">
        <el-input v-model="filters.maccount" class="fixed_search_input" placeholder="商户帐号"></el-input>
      </el-form-item>
      <el-form-item label="业务员">
        <el-select v-model="filters.parag" class="fixed_search_input" placeholder="业务员" :multiple="false" filterable remote :remote-method="remoteSale" :loading="saleLoading" clearable @visible-change="clickSale">
          <el-option v-for="item in saleOptions" :value="item.id" :label="item.value" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" @click="getUsers"  icon="el-icon-search" round>查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <!--列表-->
  <div v-loading="listLoading">
    <el-table :data="users" border highlight-current-row style="width: 100%;">
      <el-table-column prop="mname" label="商户名称" min-width="240">
      </el-table-column>
      <el-table-column prop="maccount" label="商户帐号" min-width="120">
      </el-table-column>
      <el-table-column prop="status" label="登录状态"  min-width="120" :formatter="formatState">
      </el-table-column>
      <el-table-column label="创建时间" :formatter="formatCreate_time" min-width="160">
      </el-table-column>
      <el-table-column prop="saleName" label="业务员" min-width="120">
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="clickLook(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--工具条-->
  <el-row class="toolbar">
    <el-pagination layout="prev, pager, next" :current-page="page"  @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
</section>
</template>

<script>
import * as util from '../../../util/util.js'
import {
  agentMerEnter,
  queryAgentMer,
  selectSaleByName,
  updateAgentSalesman
} from '../../../api/agent';

export default {
  data() {
    return {
      whole: {
        sum: ''
      },
      //商户名
      filters: {
        mname: '',
        maccount: '',
        parag: ''
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,
      saleOptions: [],
      saleLoading: false
    }
  },
  methods: {
    clickLook (index, row) {
      this.$router.push({ path: '/index2/page12', query: { mid: row.mid.toString(), maccount: row.maccount } })
    },
    formatCreate_time(row,column){
      return row.create_time = util.formatDate.format( new Date(row.create_time), 'yyyy/MM/dd hh:MM:ss' )
    },
    formatState: function(row, column) {
      return row.status == 0 ? "禁止" : row.status == 1 ? "正常" : "未知"
    },
    //业务员远程搜索
    clickSale: function() {
      this.saleLoading = true;
      selectSaleByName().then(res => {
        let { status, data } = res;
        this.saleLoading = false;
        if (status == 200) {
          this.saleOptions = data.salesmanList;
        }
      });
    },
    remoteSale(query) {
      if (query !== "") {
        this.saleOptions = true;
        setTimeout(() => {
          this.saleOptions = false;
          selectSaleByName({
            name: query
          }).then(res => {
            let { status, data } = res;
            this.saleOptions = data.salesmanList;
          });
        }, 200);
      } else {
        this.saleOptions = [];
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers(){
      this.page = 1
      this.getList()
    },
    //获取用户列表
    getList() {
      let para = {
        id: this.filters.parag,
        pageNum: this.page,
        mname: this.filters.mname,
        maccount: this.filters.maccount
      };
      this.listLoading = true;
      queryAgentMer(para).then((res) => {
        let {
          data,
          message,
          status
        } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.filters.time1 = res.data.returnST;
          this.users = res.data.merchantsList;
          this.whole.sum = res.data.totalCount
        }
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>

</style>
