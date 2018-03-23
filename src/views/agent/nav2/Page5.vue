<template>
<section>
  <!--工具条-->
  <el-row :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="whole">
      <el-tag type="primary" style="">商户总数：{{whole.sum}}</el-tag>
    </el-form>
  </el-row>
  <el-row :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters" ref="filters">
      <el-form-item>
        <el-input v-model="filters.mname" placeholder="商户名称" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.maccount" placeholder="商户帐号" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item prop="parag">
        <el-select v-model="filters.parag" placeholder="请选择业务员" :multiple="false" filterable remote :remote-method="remoteSale" :loading="loading" clearable @visible-change="clickSale">
          <el-option v-for="item in options" :value="item.id" :label="item.value" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <!--列表-->
  <el-table :data="users" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
    <el-table-column prop="mid" label="商户号" width="80">
    </el-table-column>
    <el-table-column prop="mname" label="商户名称" min-width="120">
    </el-table-column>
    <el-table-column prop="maccount" label="商户帐号" width="120">
    </el-table-column>
    <el-table-column prop="rate" label="商户费率（千分比）" width="180">
    </el-table-column>
    <el-table-column prop="status" label="登录状态" width="120" :formatter="formatState">
    </el-table-column>
    <el-table-column prop="saleName" label="业务员" width="120">
    </el-table-column>
    <el-table-column label="操作" min-width="310">
      <template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">分配业务员</el-button>
          <el-button size="mini" @click="lookStore(scope.$index, scope.row)">查看门店</el-button>
          <el-button size="mini" @click="lookEmp(scope.$index, scope.row)">查看款台</el-button>
			</template>
    </el-table-column>
  </el-table>
  <!--修改分配业务员界面-->
  <el-dialog title="分配业务员" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="editForm" ref="editForm">
      <el-form-item prop="sale">
        <el-select v-model="editForm.sale" placeholder="请选择业务员" :multiple="false" filterable remote :remote-method="remoteSale" :loading="loading" clearable @visible-change="clickSale" >
          <el-option v-for="item in options" :value="item.id" :label="item.value" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>
  <!--工具条-->
  <el-col :span="24" class="toolbar">
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
    </el-pagination>
  </el-col>

</section>
</template>

<script>
import * as util from '../../../assets/util.js'
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
      editFormVisible: false,
      editLoading: false,
      editForm: {
        sale: '',
        mid: '',
        id: ''
      },
      loading: false,
      optionsSale: [],
      options: [],
      total: 0,
      page: 1,
      users: [],
      listLoading: false,

    }
  },
  methods: {
    //业务员远程搜索
    clickSale:function () {
      selectSaleByName().then((res) => {
        let {
          status,
          data
        } = res
        if (status == 200) {
          this.options = data.salesmanList
        }
      })
    },
    remoteSale(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          selectSaleByName({
            name: query
          }).then((res) => {
            let {
              status,
              data
            } = res
            this.options = data.salesmanList
          })
        }, 200);
      } else {
        this.optionsMers = [];
      }
    },
    lookStore(index, row){
      this.$router.push({ path: '/index/page7', query: { mid: row.mid } })
    },
    lookEmp(index, row){
      this.$router.push({ path: '/index/page8', query: { mid: row.mid } })
    },
    formatState: function(row, column) {
      return row.status == 0 ? "禁止" : row.status == 1 ? "正常" : "未知"
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
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
    },
    //显示修改业务员界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm.mid = row.mid
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            let para = {
              mid: this.editForm.mid,
              id: this.editForm.sale
            };
            updateAgentSalesman(para).then((res) => {
              var _this = this;
              this.editLoading = false;
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.$notify({
                  title: '成功',
                  message: message,
                  type: 'success'
                });
              }
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
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
