<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters" label-position="left" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="所属门店">
              <el-select
                v-model="filters.sid"
                class="fixed_search_input"
                placeholder="门店名称"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteStore"
                :loading="storeLoading"
                clearable
                @focus="clickStore"
              >
                <el-option
                  v-for="item in optionsStore"
                  :key="item.id"
                  :value="item.id"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属款台">
              <el-select
                v-model="filters.eid"
                class="fixed_search_input"
                placeholder="款台名称"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteEmp"
                :loading="empLoading"
                clearable
                @focus="clickEmp"
              >
                <el-option
                  v-for="item in optionsEmp"
                  :key="item.eid"
                  :value="item.eid"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端类型">
              <el-select
                v-model="filters.terminal_type"
                class="fixed_search_input"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in terminalTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select
                v-model="filters.apply_type"
                class="fixed_search_input"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in applyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="日期时间">
              <el-date-picker
                v-model="filters.queryDateTime"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round>查 询</el-button>
              <el-button type="primary" @click="printAdd" round>申 请</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border="" style="width: 100%;">
        <el-table-column prop="store_name" label="门店名称" min-width="120"></el-table-column>
        <el-table-column prop="emp_name" label="款台名称" min-width="120"></el-table-column>
        <el-table-column
          prop="terminal_type"
          label="终端类型"
          min-width="120"
          :formatter="formatterTerminalType"
        ></el-table-column>
        <el-table-column prop="terminal_version" label="终端型号" min-width="120"></el-table-column>
        <el-table-column
          prop="gmt_create"
          label="创建时间"
          min-width="120"
          :formatter="formatterGmtCreate"
        ></el-table-column>
        <el-table-column align="center" label="审核状态" min-width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.apply_type === '1' ? 'warning' : scope.row.apply_type === '2' ? 'info': scope.row.apply_type === '3' ? 'success' : 'danger'"
              disable-transitions
            >{{formatterApplyType(scope.row, scope.$index)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <!-- <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">修 改</el-button> -->
            <el-button type="info" size="mini" @click="handleDet(scope.$index, scope.row)">详 情</el-button>
            <el-button
              type="warning"
              size="mini"
              :disabled="scope.row.apply_type !== '3'"
              @click="unBind(scope.$index, scope.row)"
            >解 绑</el-button>
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
    <el-dialog title="终端配置详情" :visible.sync="detFormVisible" width="30%">
      <el-form :model="detForm" label-width="120px" label-position="left">
        <el-form-item label="所属门店：">
          <span>{{detForm.store_name}}</span>
        </el-form-item>
        <el-form-item label="所属款台：">
          <span>{{detForm.emp_name}}</span>
        </el-form-item>
        <el-form-item label="审核状态：">
          <span>{{formatterApplyType(detForm)}}</span>
        </el-form-item>
        <el-form-item label="终端类型：">
          <span>{{formatterTerminalType(detForm)}}</span>
        </el-form-item>
        <el-form-item label="SN设备编号：">
          <span>{{detForm.SN}}</span>
        </el-form-item>
        <el-form-item label="型号：">
          <span>{{detForm.terminal_version}}</span>
        </el-form-item>
        <el-form-item label="设备激活码：" v-if="detForm.active_code">
          <span>{{detForm.active_code}}</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          <span>{{detForm.active_code}}</span>
        </el-form-item>
        <el-form-item label="账号：" v-if="detForm.terminal_type === '14'">
          <span>{{detForm.accountNum}}</span>
        </el-form-item>
        <el-form-item label="密码：" v-if="detForm.terminal_type === '14'">
          <span>{{detForm.password}}</span>
        </el-form-item>
        <el-form-item label="工号：" v-if="detForm.terminal_type === '14'">
          <span>{{detForm.jobNum}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click.native="detFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="新增终端配置" :visible.sync="editFormVisible" width="35%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="终端类型" prop="terminal_type">
          <el-select v-model="editForm.terminal_type" placeholder="请选择">
            <el-option
              v-for="item in terminalTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SN设备编号" prop="SN">
          <el-input v-model="editForm.SN" placeholder="请输入SN设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="terminal_version">
          <el-select v-model="editForm.terminal_version" placeholder="请选择">
            <el-option
              v-for="item in terminalVersionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择门店" prop="sid">
          <template>
            <el-select
              v-model="editForm.sid"
              placeholder="门店名称"
              :multiple="false"
              filterable
              remote
              :remote-method="remoteStore"
              :loading="storeLoading"
              clearable
              @focus="clickStore"
            >
              <el-option
                v-for="item in optionsStore"
                :key="item.id"
                :value="item.id"
                :label="item.value"
              ></el-option>
            </el-select>
          </template>
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
              <el-option
                v-for="item in optionsEmp"
                :key="item.eid"
                :value="item.eid"
                :label="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">添加</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  queryTerminals,
  deletePrintNew,
  addTerminal,
  lookupUser,
  updatePrintcfg,
  updatePStatus,
  selectEmpsBySid,
  selectStoreList,
  queryTerminal,
  updateTerminal
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
        queryDateTime: "",
        sid: "",
        eid: "",
        terminal_type: "",
        apply_type: ""
      },
      users: [],
      total: 1,
      page: 1,
      listLoading: false,
      detFormVisible: false,
      editFormVisible: false, //编辑界面是否显示
      terminalTypeOptions: [
        {
          value: "11",
          label: "富友POS"
        },
        {
          value: "12",
          label: "新大陆"
        },
        {
          value: "13",
          label: "微收银"
        },
        {
          value: "14",
          label: "钱客多"
        }
      ],
      terminalVersionOptions: [
        {
          value: "A8",
          label: "A8"
        },
        {
          value: "波普",
          label: "波普"
        },
        {
          value: "N910(POS)",
          label: "N910(POS)"
        },
        {
          value: "WSY",
          label: "WSY"
        }
      ],
      applyTypeOptions: [
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "2",
          label: "已解绑"
        },
        {
          value: "3",
          label: "已绑定"
        }
      ],
      editForm: {
        terminal_type: "",
        SN: "",
        terminal_version: "",
        sid: "",
        eid: ""
      },
      detForm: {},
      empLoading: false,
      storeLoading: false,
      optionsEmp: [],
      optionsStore: [],
      editFormRules: {
        terminal_type: [
          { required: true, message: "请选择终端类型", trigger: "change" }
        ],
        SN: [{ required: false, message: "请选择设备编号", trigger: "change" }],
        terminal_version: [
          { required: true, message: "请选择设备型号", trigger: "change" }
        ],
        sid: [{ required: true, message: "请选择门店", trigger: "change" }],
        eid: [{ required: true, message: "请选择款台", trigger: "change" }]
      }
    };
  },
  computed: {
    terminal_type() {
      return this.editForm.terminal_type;
    }
  },
  watch: {
    terminal_type(newVal, oldVal) {
      if (newVal == "11") {
        this.editForm.terminal_version = "A8";
        this.editFormRules.SN[0].required = true;
        this.terminalVersionOptions = [
          {
            value: "A8",
            label: "A8"
          },
          {
            value: "波普",
            label: "波普"
          }
        ];
      } else if (newVal == "12") {
        this.editForm.terminal_version = "N910(POS)";
        this.editFormRules.SN[0].required = true;
        this.terminalVersionOptions = [
          {
            value: "N910(POS)",
            label: "N910(POS)"
          },
          {
            value: "蜻蜓",
            label: "蜻蜓"
          }
        ];
      } else if (newVal == "13") {
        this.editForm.terminal_version = "WSY";
        this.editFormRules.SN[0].required = false;
        this.terminalVersionOptions = [
          {
            value: "WSY",
            label: "WSY"
          }
        ];
      } else if (newVal == "14") {
        this.editForm.terminal_version = "QD21";
        this.editFormRules.SN[0].required = false;
        this.terminalVersionOptions = [
          {
            value: "QD21",
            label: "QD21"
          }
        ];
      }
    }
  },
  methods: {
    formatterApplyType(row, column) {
      return row.apply_type === "1"
        ? "审核中"
        : row.apply_type === "2"
          ? "已解绑"
          : row.apply_type === "3"
            ? "已绑定"
            : row.apply_type === "4"
              ? "撤销"
              : "未知";
    },
    formatterTerminalType(row, column) {
      return row.terminal_type === "11"
        ? "富友POS"
        : row.terminal_type === "12"
          ? "新大陆"
          : row.terminal_type === "13"
            ? "微收银"
            : row.terminal_type === "14"
            ? "钱客多"
            : "未知";
    },
    formatterGmtCreate(row, column) {
      return (row.gmt_create = util.formatDate.format(
        new Date(row.gmt_create),
        "yyyy/MM/dd hh:mm:ss"
      ));
    },
    // 解绑
    unBind(index, row) {
      this.$confirm("此操作将解除终端绑定, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateTerminal({
            id: row.id,
            apply_type: "2",
            terminal_type: row.terminal_type
          }).then(res => {
            this.$message({
              type: "success",
              message: res.subMsg
            });
            this.getUsers();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //款台远程搜索
    clickEmp: function() {
      this.empLoading = true;
      let para = {
        mid: this.$route.query.mid,
        storeId: this.editFormVisible
          ? this.editForm.sid.toString() || ""
          : this.filters.sid.toString() || "",
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
            storeId: this.editFormVisible
              ? this.editForm.sid.toString() || ""
              : this.filters.sid.toString() || "",
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
    clickStore() {
      this.storeLoading = true;
      selectStoreList({ mid: this.$route.query.mid }).then(res => {
        this.storeLoading = false;
        let { status, data } = res;
        this.optionsStore = data.storeList;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.storeLoading = true;
        setTimeout(() => {
          this.storeLoading = false;
          selectStoreList({
            sname: query
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.storeList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
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
      this.listLoading = true;
      let para = util.deepcopy(this.filters);
      para.pageNum = this.page;
      para.mid = this.$route.query.mid;
      para.start_time = para.queryDateTime ? para.queryDateTime[0] : "";
      para.end_time = para.queryDateTime ? para.queryDateTime[1] : "";
      queryTerminals(para).then(res => {
        this.listLoading = false;
        if (res.code === "000000") {
          this.total = res.data.totalCount;
          this.users = res.data.terminalsList;
        }
      });
    },
    //显示详情界面
    handleDet: function(index, row) {
      this.detFormVisible = true;
      queryTerminal({ id: row.id }).then(res => {
        if (res.code === "000000") {
          this.detForm = res.data;
        }
      });
    },
    //显示编辑界面
    handleEdit(index, row) {
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
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields();
      }
    },
    //新增
    addSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示").then(() => {
            let para = util.deepcopy(this.editForm);
            para.mid = this.$route.query.mid;
            addTerminal(para).then(res => {
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
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>