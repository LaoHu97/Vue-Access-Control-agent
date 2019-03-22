<template>
<section>
  <el-button size="small" round @click="historyGo" style="margin-bottom:15px;">返回</el-button>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-form-item label="门店名称">
        <el-input v-model="filters.storeName" class="fixed_search_input" placeholder="门店名称"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
        <el-button type="primary" @click="handleAdd" round>新增</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <el-table :data="users" border highlight-current-row v-loading="listLoading" style="width: 100%;">
    <el-table-column prop="saccount" label="门店编号" min-width="120">
    </el-table-column>
    <el-table-column prop="storeName" label="门店名称" min-width="120">
    </el-table-column>
    <el-table-column prop="address" label="门店地址" min-width="180">
    </el-table-column>
    <el-table-column prop="revsere2" label="联系人" min-width="120">
    </el-table-column>
    <el-table-column prop="telephone" label="联系电话" min-width="120">
    </el-table-column>
    <!-- <el-table-column label="门店状态" min-width="80">
      <template slot-scope="scope">
          <el-switch
            name="value"
            @change="test(scope.$index, scope.row)"
            v-model="scope.row.state">
          </el-switch>
      </template>
    </el-table-column> -->
    <el-table-column label="操作" width="280">
      <template slot-scope="scope">
          <!-- <el-button type="danger" size="mini" @click="handleReset(scope.$index, scope.row)">密码重置</el-button> -->
					<el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="info" size="mini" @click="handleDet(scope.$index, scope.row)">详情</el-button>
          <el-button type="info" size="mini" @click="lookEmp(scope.$index, scope.row)">查看款台</el-button>
				</template>
    </el-table-column>
  </el-table>

  <!--工具条-->
  <el-row class="toolbar">
    <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
  <!--详情界面-->
  <el-dialog title="门店详情" :visible.sync="detFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="detForm" label-width="120px" ref="detForm" label-position="left">
      <el-form-item label="门店名称：">
        <span>{{detForm.storeName}}</span>
      </el-form-item>
      <el-form-item label="联系电话：">
        <span>{{detForm.telephone}}</span>
      </el-form-item>
      <el-form-item label="详细地址：">
        <span>{{detForm.address}}</span>
      </el-form-item>
      <el-form-item label="门店编号：">
        <span>{{detForm.storeName}}</span>
      </el-form-item>
      <el-form-item label="营业时间：">
        <span>{{detForm.shopHours}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--修改界面-->
  <el-dialog title="修改信息" :visible.sync="editFormVisible" :close-on-click-modal="false" width="450px">
    <el-form :model="editForm" :rules="editFormRules" ref="editForm">
      <el-form-item label="门店名称" prop="storeName">
        <el-input v-model="editForm.storeName"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="revsere2">
        <el-input v-model="editForm.revsere2"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="editForm.telephone"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="editForm.address"></el-input>
      </el-form-item>
      <el-form-item label="营业时间" prop="startTime">
        <template>
						<el-time-select
							placeholder="起始时间"
							v-model="editForm.startTime"
							:picker-options="{
								start: '08:30',
								step: '00:15',
								end: '18:30'
							}">
						</el-time-select>
					</template>
      </el-form-item>
      <el-form-item label="" prop="endTime" style="margin-left:68px;">
        <template>
						<el-time-select
								placeholder="结束时间"
								v-model="editForm.endTime"
								:picker-options="{
									start: '00:00',
									step: '00:15',
									end: '24:00'
								  }"
								>
						</el-time-select>
					</template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit">提交</el-button>
    </div>
  </el-dialog>

  <!--新增界面-->
  <el-dialog title="新增门店" :visible.sync="addFormVisible" :close-on-click-modal="false" width="450px">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm">
      <el-form-item label="门店名称" prop="storeName">
        <el-input v-model="addForm.storeName"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="revsere2">
        <el-input v-model="addForm.revsere2"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="addForm.telephone"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="addForm.address"></el-input>
      </el-form-item>
      <el-form-item label="营业时间" prop="startTime">
        <template>
						<el-time-select
								placeholder="起始时间"
								v-model="addForm.startTime"
								:picker-options="{
									start: '00:00',
									step: '00:15',
									end: '24:00'
								  }"
								>
						</el-time-select>
					</template>
      </el-form-item>
      <el-form-item label="" prop="endTime" style="margin-left:68px;">
        <template>
						<el-time-select
								placeholder="结束时间"
								v-model="addForm.endTime"
								:picker-options="{
									start: '00:00',
									step: '00:15',
									end: '24:00'
								  }"
								>
						</el-time-select>
					</template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit">提交</el-button>
    </div>
  </el-dialog>
</section>
</template>

<script>
import * as util from '../../../util/util.js'

import CryptoJS from "crypto-js";
import {
  queryStoresShop,
  updateStore,
  addStore,
  deleteStore,
  updateStoreState,
  resetStorePwd
} from '../../../api/agent';
export default {
  data() {
    var telephone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话'));
      } else if (!/^\d{5,12}$/.test(value)) {
        callback(new Error('请输入正确的联系电话'));
      } else {
        callback();
      }
    };
    return {
      filters: {
        storeName: ''
      },
      users: [],
      total: 1,
      page: 1,
      listLoading: false,

      detFormVisible: false,
      detLoading: false,

      editFormVisible: false, //编辑界面是否显示
      editFormRules: {
        storeName: [{
            required: true,
            message: '请输入门店名称',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '请输入正确的门店名称',
            trigger: 'blur'
          }
        ],
        revsere2: [{
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          }
        ],
        address: [{
            required: false,
            message: '请输入门店地址',
            trigger: 'blur'
          },
          {
            max: 60,
            message: '请输入正确的门店地址',
            trigger: 'blur'
          }
        ],
        telephone: [{
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          },
          {
            validator: telephone,
            trigger: 'blur'
          }
        ]
      },
      detForm: {},
      //编辑界面数据
      editForm: {
        id: '',
        storeName: '',
        address: '',
        telephone: '',
        startTime: '',
        endTime: '',
        revsere2: ''
      },

      addFormVisible: false, //新增界面是否显示
      addFormRules: {
        storeName: [{
            required: true,
            message: '请输入门店名称',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '请输入正确的门店名称',
            trigger: 'blur'
          }
        ],
        revsere2: [{
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          }
        ],
        address: [{
            required: false,
            message: '请输入门店地址',
            trigger: 'blur'
          },
          {
            max: 60,
            message: '请输入正确的门店地址',
            trigger: 'blur'
          }
        ],
        telephone: [{
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          },
          {
            validator: telephone,
            trigger: 'blur'
          }
        ]
      },
      //新增界面数据
      addForm: {
        mname: '',
        storeName: '',
        address: '',
        telephone: '',
        startTime: '',
        endTime: '',
        revsere2: ''
      }

    }
  },
  methods: {
    historyGo() {
      this.$router.go(-1)
    },
    lookEmp(index, row){
      this.$router.push({ path: '/index2/page8', query: { id: row.id, mid: this.$route.query.mid } })
    },
    test: function(index, row) {
      this.$confirm('此操作将修改门店状态, 确定修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        let para = {
          id: row.id,
          status: row.state == true ? "Y" : row.state == false ? "N" : "未知"
        }
        updateStoreState(para).then((res) => {
          let {
            status
          } = res
          if (status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          } else {
            this.$message({
              type: 'success',
              message: '修改失败!'
            });
          }
        })
      }).catch(() => {
        this.getUsers();
        this.$message({
          type: 'info',
          message: '取消修改'
        });
      });
    },
    handleDet: function(index, row) {
      this.detFormVisible = true;
      this.detForm = Object.assign({}, row);
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
        mid:this.$route.query.mid,
        pageNum: this.page,
        storeName: this.filters.storeName
      };
      this.listLoading = true;
      queryStoresShop(para).then((res) => {
        var _this = this;
        let {
          data,
          message,
          status
        } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.users = res.data.storeList;
          var sta;
          for (var i = 0; i < this.users.length; i++) {
            sta = this.users[i];
            if (sta.state == "Y") {
              sta.state = true
            } else {
              sta.state = false
            }
          }
        }
        this.listLoading = false;
      });
    },
    // //重置密码
    handleReset: function(index, row) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '密码格式不正确',
        inputValue: '123456'
      }).then(({
        value
      }) => {
        let para = {
          password: CryptoJS.MD5(value + row.saccount).toString(CryptoJS.enc.Hex),
          sid: row.id
        };
        resetStorePwd(para).then((res) => {
          var _this = this;
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
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '系统错误'
        });
      });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.$nextTick(() => {
        this.$refs.editForm.resetFields()
        let f = util.deepcopy(row)
        this.editForm.id = f.id
        this.editForm.storeName = f.storeName
        this.editForm.address = f.address
        this.editForm.telephone = f.telephone
        this.editForm.revsere2 = f.revsere2
        if (f.shopHours !== '-' && f.shopHours !== 'null-null' ) {
          let s = f.shopHours.slice(0, 5);
          this.editForm.startTime = s
          let e = f.shopHours.slice(6, 11);
          this.editForm.endTime = e 
        }
      })
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            let para = {
              id: this.editForm.id,
              storeName: this.editForm.storeName,
              address: this.editForm.address,
              telephone: this.editForm.telephone,
              linkman: this.editForm.revsere2,
              shopHours: this.editForm.startTime + "-" + this.editForm.endTime
            };
            updateStore(para).then((res) => {
              this.$message({
                message: res.message,
                type: 'success',
                showClone: true
              });
              this.$refs['editForm'].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            let para = {
              mid: this.$route.query.mid,
              storeName: this.addForm.storeName,
              address: this.addForm.address,
              telephone: this.addForm.telephone,
              linkman: this.addForm.revsere2,
              shopHours: this.addForm.startTime + "-" + this.addForm.endTime
            };
            addStore(para).then((res) => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              });
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
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
