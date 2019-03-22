<template>
  <section>
    <!--工具条-->
    <el-form :inline="true" :model="whole">
      <el-row>
        <el-tag type="primary" style="margin:0 10px 20px 0;">商户总数：{{whole.sum}}</el-tag>
      </el-row>
    </el-form>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-row>
        <el-form-item label="商户名称">
          <el-input v-model="filters.mname" placeholder="请输入商户名称关键字" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="filters.status" clearable placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
          <el-button type="primary" @click="getShop" round>新增商户</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="merchant_name" label="商户名称" min-width="100">
        </el-table-column>
        <el-table-column prop="gmt_create" label="创建时间" min-width="100" :formatter="formatterDate">
        </el-table-column>
        <el-table-column prop="business_name" label="行业类目" min-width="120">
        </el-table-column>
        <el-table-column prop="merchant_person" label="负责人">
        </el-table-column>
        <el-table-column prop="merchant_phone" label="负责人电话" min-width="120">
        </el-table-column>
        <el-table-column align="center" label="审核状态" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.merchant_status === '0' ? 'info' : scope.row.merchant_status === '1' ? 'warning': scope.row.merchant_status === '2' ? 'danger' : 'success'" disable-transitions>{{formatMerchantStatus(scope.row, scope.$index)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleModify(scope.$index, scope.row)">查看</el-button>
            <!-- <el-button type="info" size="mini" v-show="scope.row.merchant_status === '2'" @click="showErrMessage(scope.$index, scope.row)">驳回原因</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row class="toolbar">
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  agentMerEnter,
  addAgentMer,
  addLcShopView,
  showBusinessType,
  getProvince,
  queryCity,
  selectBank,
  selectbranch,
  updateAgentMer,
  updateAgentMerView,
  queryAgentLc,
  uploadImage
} from "../../../api/agent";

export default {
  data() {
    return {
      whole: {
        sum: ""
      },
      //商户名
      filters: {
        mname: "",
        status: "1"
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,
      statusOptions: [
        {
          value: "0",
          label: "未提交"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "4",
          label: "审核驳回"
        }
      ]
    };
  },
  methods: {
    formatterDate(row, column) {
      return (row.gmt_create = util.formatDate.format(
        new Date(row.gmt_create),
        "yyyy/MM/dd hh:mm:ss"
      ));
    },
    // showErrMessage(index, row) {
    //   this.$alert(row.error_msg, "驳回原因", {
    //     type: 'warning'
    //   });
    // },
    //新增商户
    getShop: function() {
      this.$router.push("/index2/page6");
    },
    handleModify(index, row) {
      this.$router.push({ path: "/index2/page6", query: { id: row.id } });
    },
    //状态转换
    formatMerchantStatus: function(row, column) {
      return row.merchant_status === '0' ? '未提交' : row.merchant_status === '1' ? '审核中' : row.merchant_status === '2' ? '审核驳回' : '审核通过'
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers() {
      this.page = 1;
      this.getList();
    },
    //获取用户列表
    getList() {
      let para = {
        pageNum: this.page,
        merchant_name: this.filters.mname,
        merchant_status: this.filters.status
      };
      this.listLoading = true;
      agentMerEnter(para).then(res => {
        let { data, message, status } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.filters.time1 = res.data.returnST;
          this.users = res.data.shopList;
          this.whole.sum = res.data.totalCount;
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

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
