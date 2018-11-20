<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-form :inline="true" :model="filters">
				<el-form-item label="终端名称">
					<el-input v-model="filters.printname" placeholder="打印机名称"></el-input>
				</el-form-item>
				<el-form-item style="float: right;">
					<el-button type="primary" @click="getUsers" round>查询</el-button>
					<el-button type="primary" @click="printAdd" round>新增</el-button>
				</el-form-item>
			</el-form>
		</el-row>
		<!--列表-->
		<div v-loading="listLoading">
			<el-table :data="users" border="" style="width: 100%;">
				<el-table-column prop="printname" label="打印机名称" min-width="120"></el-table-column>
				<el-table-column prop="machineCode" label="终端号" min-width="120"></el-table-column>
				<el-table-column prop="machineKey" label="终端密钥" min-width="120"></el-table-column>
				<el-table-column prop="phone" label="电话" min-width="120"></el-table-column>
				<el-table-column prop="pnum" label="打印份数"></el-table-column>
				<el-table-column align="center" label="状态">
					<template slot-scope="scope">
						<el-switch
							:active-value="1"
							:inactive-value="0"
							v-model="scope.row.isOpen"
							@change="editStatus(scope.$index, scope.row)"
						></el-switch>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="160">
					<template slot-scope="scope">
						<el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
						<el-button type="info" size="mini" @click="handleDet(scope.$index, scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--工具条-->
		<el-row>
			<el-pagination
				layout="prev, pager, next"
				@current-change="handleCurrentChange"
				:page-size="20"
				:total="total"
				style="text-align:center;background:#fff;padding:15px;"
			></el-pagination>
		</el-row>
		<!--详情界面-->
		<el-dialog title="打印配置详情" :visible.sync="detFormVisible" width="30%">
			<el-form :model="detForm" label-width="120px" label-position="left">
				<el-form-item label="打印机名称：">
					<span>{{detForm.printname}}</span>
				</el-form-item>
				<el-form-item label="终端号：">
					<span>{{detForm.machineCode}}</span>
				</el-form-item>
				<el-form-item label="终端密钥：">
					<span>{{detForm.machineKey}}</span>
				</el-form-item>
				<el-form-item label="电话：">
					<span>{{detForm.phone}}</span>
				</el-form-item>
				<el-form-item label="打印份数：">
					<span>{{detForm.pnum}}</span>
				</el-form-item>
				<el-form-item label="所属款台：">
					<span>{{detForm.ename}}</span>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click.native="detFormVisible = false">关 闭</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog :title="dialogType ? '新增打印配置' : '修改打印配置'" :visible.sync="editFormVisible" width="35%">
			<el-form
				:model="editForm"
				:rules="editFormRules"
				ref="editForm"
				label-width="120px"
				label-position="left"
			>
				<el-form-item label="打印机名称" prop="printname">
					<el-input v-model="editForm.printname" placeholder="请输入打印机名称"></el-input>
				</el-form-item>
				<el-form-item label="终端号" prop="mCode">
					<el-input v-model="editForm.mCode" placeholder="请输入终端号"></el-input>
				</el-form-item>
				<el-form-item label="终端密钥" prop="mKey">
					<el-input v-model="editForm.mKey" placeholder="请输入终端密钥"></el-input>
				</el-form-item>
				<el-form-item label="选择款台" prop="eid">
					<template>
						<el-select
							v-model="editForm.eid"
							placeholder="款台名称"
							:multiple="false"
							filterable
							remote
							:remote-method="remoteEmp"
							:loading="empLoading"
							clearable
							@focus="clickEmp"
						>
							<el-option v-for="item in optionsEmp" :key="item.eid" :value="item.eid" :label="item.value"></el-option>
						</el-select>
					</template>
				</el-form-item>
				<el-form-item label="打印份数" prop="pnum">
					<el-input-number v-model="editForm.pnum" :precision="0" :min="1"></el-input-number>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="editForm.phone" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="打印模板" prop="pformat">
					<el-input type="textarea" :rows="6" :disabled="true" v-model="editForm.pformat"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" v-if="dialogType" :loading="editLoading">添加</el-button>
				<el-button type="primary" @click.native="editSubmit" v-else :loading="editLoading">修改</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  queryPrintcfg,
  deletePrintNew,
  addPrintcfg,
  lookupUser,
  updatePrintcfg,
  updatePStatus,
  selectEmpsBySid
} from "../../../api/agent";
export default {
  data() {
    var regPhone = (rule, value, callback) => {
      if (!/^1(3|4|5|7|8)\d{9,10}$/.test(value) && value !== "") {
        callback(new Error("请输入正确的联系人手机号"));
      } else {
        callback();
      }
    };
    return {
      filters: {
        printname: ""
      },
      users: [],
      total: 1,
      page: 1,
      listLoading: false,
      detFormVisible: false,
      detLoading: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editForm: {
        printname: "",
        mCode: "",
        mKey: "",
        pnum: 1,
        eid: "",
        phone: "",
        pformat:
          "店铺名称：${sname}\n款台名称：${ename}\n消费描述：${desc}\n下单时间：${paytime}\n消费金额：${price}\n订单号：${orderid}\n支付方式：${paytype}\n打印时间：${printtime}\n※※※※※※※※※※※※※※※※\n商务热线：029-88445534\n技术支持：西安万鼎网络科技有限公司！"
      },
      detForm: {},
      empLoading: false,
      optionsEmp: [],
      dialogType: false,
      editFormRules: {
        printname: [
          {
            required: true,
            message: "请输入打印机名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 18,
            message: "请输入正确的打印机名称",
            trigger: "blur"
          }
        ],
        mCode: [
          {
            required: true,
            message: "请输入终端号",
            trigger: "blur"
          }
        ],
        mKey: [
          {
            required: true,
            message: "请输入终端密钥",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: false,
            message: "请输入联系人手机号",
            trigger: "blur"
          },
          {
            validator: regPhone,
            trigger: "blur"
          }
        ],
        eid: [
          {
            required: true,
            message: "请选择款台",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    //款台远程搜索
    clickEmp: function() {
      this.empLoading = true;
      let para = {
        mid: this.$route.query.mid,
        ename: ""
      };
      selectEmpsBySid(para).then(res => {
        this.empLoading = false;
        let { status, data } = res;
        this.optionsEmp = data.emplyeeList;
      });
    },
    remoteEmp(query) {
      if (query !== "") {
        this.empLoading = true;
        setTimeout(() => {
          this.empLoading = false;
          let para = {
            mid: this.$route.query.mid,
            ename: query
          };
          selectEmpsBySid(para).then(res => {
            this.optionsEmp = res.data.emplyeeList;
          });
        }, 200);
      } else {
        this.optionsEmp = [];
      }
    },
    editStatus(index, row) {
      this.$confirm("此操作将修改款台状态, 确定修改?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          let para = {
            printId: row.id,
            isOpen: row.isOpen
          };
          updatePStatus(para)
            .then(res => {
              this.$message({
                type: "success",
                message: res.subMsg
              });
            })
            .catch(() => {
              this.getUsers();
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
    //状态显示转换
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
        mid: this.$route.query.mid,
        printname: this.filters.printname
      };
      this.listLoading = true;
      queryPrintcfg(para).then(res => {
        this.listLoading = false;
        if (res.code === "000000") {
          this.total = res.data.totalCount;
          this.users = res.data.printList;
        }
      });
    },
    //显示详情界面
    handleDet: function(index, row) {
      this.detFormVisible = true;
      this.detForm = util.deepcopy(row);
    },
    //显示编辑界面
    handleEdit(index, row) {
      this.dialogType = false;
      this.editFormVisible = true;
      let form = util.deepcopy(row);
      form.mCode = form.machineCode;
      form.mKey = form.machineKey;
      this.editForm = form;
      this.optionsEmp = [{ eid: form.eid, value: form.ename }];
    },
    //显示新增界面
    printAdd() {
      this.editFormVisible = true;
      this.dialogType = true;
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields();
      }
    },
    //编辑
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = util.deepcopy(this.editForm);
            updatePrintcfg(para).then(res => {
              this.editLoading = false;
              this.editFormVisible = false;
              this.getUsers();
              this.$message({
                type: "success",
                message: res.subMsg
              });
            });
          });
        }
      });
    },
    //新增
    addSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示").then(() => {
            this.editLoading = true;
            let para = util.deepcopy(this.editForm);
            para.eid = para.eid.toString();
            para.pnum = para.pnum.toString();
            para.mid = this.$route.query.mid;
            addPrintcfg(para).then(res => {
              this.editLoading = false;
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
};
</script>