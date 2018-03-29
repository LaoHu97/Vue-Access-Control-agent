<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-form-item prop="name">
        <el-input v-model="filters.name" placeholder="请输入业务员姓名"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
        <el-button type="primary" @click="handleAdd" size="medium" round>新增</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <el-table :data="users" border highlight-current-row v-loading="listLoading" style="width: 100%;">
    <el-table-column prop="id" label="编号" min-width="80">
    </el-table-column>
    <el-table-column prop="name" label="姓名" min-width="120">
    </el-table-column>
    <el-table-column prop="saccount" label="登录帐号" min-width="120">
    </el-table-column>
    <el-table-column prop="phone" label="手机号" min-width="120">
    </el-table-column>
    <el-table-column prop="address" label="住址" min-width="120">
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
          <el-switch
            name="value"
            @change="test(scope.$index, scope.row)"
            v-model="scope.row.status">
          </el-switch>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template slot-scope="scope">
        <el-button type="danger" size="mini" @click="handleReset(scope.$index, scope.row)">密码重置</el-button>
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
      <el-form-item label="电话" prop="phone">
        <el-input v-model="editForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="editForm.address"></el-input>
      </el-form-item>
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
      <el-form-item label="手机" prop="phone">
        <el-input type="phone" v-model="addForm.phone" placeholder="请输入业务员手机号" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="addForm.address" placeholder="请输入业务员详细住址" auto-complete="off" value="number"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    </div>
  </el-dialog>
</section>
</template>

<script>
import * as util from "../../../assets/util.js";
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
            message: "请输入业务员手机号",
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
        ]
      },
      stateForm: {},
      //编辑界面数据
      editForm: {
        storeName: "",
        address: "",
        telephone: ""
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
            message: "请输入业务员手机号",
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
        ]
      },
      //新增界面数据
      addForm: {
        name: "",
        phone: "",
        address: ""
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
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        phone: "",
        address: ""
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
              phone: this.editForm.phone
            };
            //para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
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
              address: this.addForm.address
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
