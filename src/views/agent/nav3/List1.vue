<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-form-item label="业务员姓名">
        <el-input v-model="filters.name" class="fixed_search_input" placeholder="业务员姓名"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
        <el-button type="primary" @click="handleAdd" round>新增</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <el-table :data="users" border highlight-current-row v-loading="listLoading" style="width: 100%;">
    <el-table-column prop="name" label="姓名" min-width="120">
    </el-table-column>
    <el-table-column prop="phone" label="联系电话" min-width="120">
    </el-table-column>
    <el-table-column prop="address" label="住址" min-width="120">
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template slot-scope="scope">
        <!-- <el-button type="danger" size="mini" @click="handleReset(scope.$index, scope.row)">密码重置</el-button> -->
				<el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
				</template>
    </el-table-column>
  </el-table>

  <!--工具条-->
  <el-row class="toolbar">
    <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
  <!--修改界面-->
  <el-dialog title="修改信息" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="editForm" :rules="editFormRules" ref="editForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="editForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="editForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="editForm.address"></el-input>
      </el-form-item>
      <!-- <el-form-item label="底价费率(‰)" prop="salesmanRate">
        <el-input v-model.number="editForm.salesmanRate" placeholder="请输入底价费率"></el-input>
      </el-form-item>
      <el-form-item label="分成比例" prop="commossion">
        <el-input v-model.number="editForm.commossion" placeholder="请输入分成比例( 0 到 1 )"></el-input>
      </el-form-item>
      <el-form-item label="零费率商户提成费率(‰)" prop="zeroRate">
        <el-input v-model.number="editForm.zeroRate" placeholder="请输入零费率商户提成费率"></el-input>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>

  <!--新增界面-->
  <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入业务员姓名" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input type="phone" v-model="addForm.phone" placeholder="请输入业务员联系电话" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="addForm.address" placeholder="请输入业务员详细住址"></el-input>
      </el-form-item>
      <!-- <el-form-item label="底价费率(‰)" prop="salesmanRate">
        <el-input v-model.number="addForm.salesmanRate" placeholder="请输入底价费率"></el-input>
      </el-form-item>
      <el-form-item label="分成比例" prop="commossion">
        <el-input v-model.number="addForm.commossion" placeholder="请输入分成比例( 0 到 1 )"></el-input>
      </el-form-item>
      <el-form-item label="零费率商户提成费率(‰)" prop="zeroRate">
        <el-input v-model.number="addForm.zeroRate" placeholder="请输入零费率商户提成费率"></el-input>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    </div>
  </el-dialog>
</section>
</template>

<script>
import * as util from "../../../util/util.js";
import CryptoJS from "crypto-js";
import {
  querySalesman,
  resetPwd,
  deleteSalesman,
  addSalesman,
  updateSalesmanStatus,
  updateAgSalesman
} from "../../../api/agent";

export default {
  data() {
    var phone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入业务员手机号"));
      } else if (!/^1(3|4|5|7|8)\d{9,10}$/.test(value)) {
        callback(new Error("请输入正确的业务员手机号"));
      } else {
        callback();
      }
    };
    return {
      filters: {
        name: ""
      },
      startTime: "",
      endTime: "",
      users: [],
      total: 1,
      page: 1,
      listLoading: false,

      stateFormVisible: false,
      stateLoading: false,

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [
          {
            required: true,
            message: "请输入业务员姓名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 5,
            message: "请输入正确的业务员姓名",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入业务员联系电话",
            trigger: "blur"
          },
          { validator: phone, trigger: "blur" }
        ],
        address: [
          {
            required: true,
            message: "请输入业务员详细地址",
            trigger: "blur"
          },
          {
            max: 60,
            message: "请输入正确的业务员详细地址",
            trigger: "blur"
          }
        ],
        // salesmanRate: [
        //   { required: true, message: '请输入底价费率'},
        //   { type: 'number', max: 10, message: '底价费率必须为数字值且小于10'}
        // ],
        // commossion: [
        //   { required: true, message: '请输入成比例'},
        //   { type: 'number', max: 1, message: '分成比例必须为数字值且小于1'}
        // ],
        // zeroRate: [
        //   { required: true, message: '请输入零费率商户提成费率'},
        //   { type: 'number', max: 10, message: '零费率商户提成费率必须为数字值且小于10'}
        // ]
      },
      stateForm: {},
      //编辑界面数据
      editForm: {
        name: "",
        address: "",
        telephone: "",
        salesmanRate:'',
        commossion:'',
        zeroRate:''
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          {
            required: true,
            message: "请输入业务员姓名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 5,
            message: "请输入正确的业务员姓名",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入业务员联系电话",
            trigger: "blur"
          },
          { validator: phone, trigger: "blur" }
        ],
        address: [
          {
            required: true,
            message: "请输入业务员详细地址",
            trigger: "blur"
          },
          {
            max: 60,
            message: "请输入正确的业务员详细地址",
            trigger: "blur"
          }
        ],
        // salesmanRate: [
        //   { required: true, message: '请输入底价费率'},
        //   { type: 'number', min:0, max: 10, message: '底价费率必须为数字值且小于10'}
        // ],
        // commossion: [
        //   { required: true, message: '请输入成比例'},
        //   { type: 'number', min:0, max: 1, message: '分成比例必须为数字值且小于1'}
        // ],
        // zeroRate: [
        //   { required: true, message: '请输入零费率商户提成费率'},
        //   { type: 'number', min:0, max: 10, message: '零费率商户提成费率必须为数字值且小于10'}
        // ]
      },
      //新增界面数据
      addForm: {
        name: "",
        phone: "",
        address: "",
        salesmanRate:'',
        commossion:'',
        zeroRate:''
      }
    };
  },
  methods: {
    test: function(index, row) {
      this.$confirm("此操作将修改业务员状态, 确定修改?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            id: row.id,
            status:
              row.status == true ? "1" : row.status == false ? "0" : "未知"
          };
          updateSalesmanStatus(para).then(res => {
            let { status } = res;
            if (status == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
            } else {
              this.$message({
                type: "success",
                message: "修改失败!"
              });
            }
          });
        })
        .catch(() => {
          this.getUsers();
          this.$message({
            type: "info",
            message: "取消修改"
          });
        });
    },
    handle: function(index, row) {
      this.stateFormVisible = true;
      this.stateForm = Object.assign({}, row);
      this.radio = this.stateForm.state;
    },
    //状态显示转换
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
        pageNum: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      querySalesman(para).then(res => {
        let { status, data } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.users = res.data.salesmanList;
        }
        var sta;
        for (var i = 0; i < this.users.length; i++) {
          sta = this.users[i];
          if (sta.status == 1) {
            sta.status = true;
          } else {
            sta.status = false;
          }
        }
        this.listLoading = false;
      });
    },
    //重置密码
    handleReset: function(index, row) {
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "密码格式不正确",
        inputValue: "123456"
      })
        .then(({ value }) => {
          let para = {
            password: CryptoJS.MD5(value + row.saccount).toString(CryptoJS.enc.Hex),
            sid: row.id
          };
          resetPwd(para).then(res => {
            var _this = this;
            let { status, message } = res;
            if (status == 200) {
              this.$notify({
                title: "成功",
                message: message,
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //删除
    // handleDel: function (index, row) {
    //     this.$confirm('确认删除该记录吗?', '提示', {
    //         type: 'warning'
    //     }).then(() => {
    //         this.listLoading = true;
    //         NProgress.start();
    //         let para = { id: row.id };
    //         deleteSalesman(para).then((res) => {
    //             this.listLoading = false;
    //             NProgress.done();
    //             let {status,message}=res;
    //             if(status==200){
    // 							this.$notify({
    // 								title: '成功',
    // 								message: message,
    // 								type: 'success'
    // 							});
    //             }else {
    //                 this.$notify({
    //                     title: '失败',
    //                     message: message,
    //                     type: 'success'
    //                 });
    // 							}
    //             this.getUsers();
    //         });
    //     }).catch(() => {
    //
    //     });
    // },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      this.editForm.zeroRate = row.zero_rate
      this.editForm.salesmanRate = Number(row.reserve1) || ''
      this.editForm.commossion = Number(row.reserve2) || ''
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        phone: "",
        address: "",
        salesmanRate:'',
        commossion:'',
        zeroRate:''
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = {
              id: this.editForm.id,
              name: this.editForm.name,
              address: this.editForm.address,
              phone: this.editForm.phone,
              salesmanRate: this.editForm.salesmanRate,
              commossion: this.editForm.commossion,
              zeroRate: this.editForm.zeroRate
            };
            updateAgSalesman(para).then(res => {
              this.editLoading = false;
              let { status, message } = res;
              if (status == 200) {
                this.$notify({
                  title: "成功",
                  message: message,
                  type: "success"
                });
              } else {
                this.$notify({
                  title: "失败",
                  message: message,
                  type: "success"
                });
              }
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = {
              name: this.addForm.name,
              phone: this.addForm.phone,
              address: this.addForm.address,
              salesmanRate: this.addForm.salesmanRate,
              commossion: this.addForm.commossion,
              zeroRate: this.addForm.zeroRate
            };
            addSalesman(para).then(res => {
              this.addLoading = false;
              let { status, message } = res;
              if (status == 200) {
                this.$notify({
                  title: "成功",
                  message: message,
                  type: "success"
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: message
                });
              }
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style scoped>

</style>
