<template>
  <el-container style="height:100%">
    <el-header style="background: #fff;height:auto">
      <el-row>
        <el-col :span="5">
          <div class="top_logo">
            <img src="../../assets/images/logo4.png" />
            <span>万 鼎 科 技</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="navmenu_horizontal">
            <el-menu :default-active="activeIndex" class="el_menu_horizontal" mode="horizontal" @select="handleSelect" background-color="#fff">
              <el-menu-item index="1">首页</el-menu-item>
              <el-menu-item index="2">交易中心</el-menu-item>
              <el-menu-item index="3">服务商功能</el-menu-item>
              <el-menu-item index="4">产品中心</el-menu-item>
              <el-menu-item index="5">营销中心</el-menu-item>
              <el-menu-item index="6">帮助中心</el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="7" style="line-height: 60px;text-align: right;">
          <span>{{sysUserName}} ，欢迎登录代理平台 </span>
          <el-dropdown split-button size="mini" type="danger" @click="logout">
            退出登录
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleEdit">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <!--修改密码-->
    <el-dialog :visible.sync="editFormVisible" :close-on-click-modal="false" width="400px">
      <span style="font-size:10px;color:#20a0ff;line-height: 1;width: 100%;">提示：密码修改成功后需重新登录</span>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="旧密码" prop="usedPass">
          <el-input type="password" v-model="ruleForm.usedPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editFormVisible=false">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-main>
      <div class="notonline_main">
        <h1>敬请期待</h1>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import instance from "../../api";
  import CryptoJS from "crypto-js";
  import * as util from '../../assets/util'
  import {
    updateSysPwd,
    loginOut,
    showAgentDate,
    getNotices
  } from '../../api/agent';
  import {
    LineChart
  } from '../../components'
  export default {
    components: {
      LineChart
    },
    data() {
      //  修改密码
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error('旧密码不能为空'));
        } else {
          callback()
        }
      };
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!/^[a-zA-Z0-9]{6,18}$/.test(value)) {
          callback(new Error('请输入不含汉字和空格的6到18位密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        user: {},
        sysUserName: '',
        editFormVisible: false, //修改密码弹窗是否显示
        editLoading: false,
        logining: false,
        //修改密码弹窗数据
        ruleForm: {
          pass: '',
          checkPass: '',
          usedPass: ''
        },
        rules: {
          usedPass: [{
              required: true,
              validator: validatePass,
              trigger: 'blur'
            },
            {
              min: 6,
              max: 18,
              message: '密码为6到18位数字或字母',
              trigger: 'blur'
            }
          ],
          pass: [{
              required: true,
              validator: validatePass1,
              trigger: 'blur'
            },
            {
              min: 6,
              max: 18,
              message: '密码为6到18位数字或字母',
              trigger: 'blur'
            }
          ],
          checkPass: [{
              required: true,
              validator: validatePass2,
              trigger: 'blur'
            },
            {
              min: 6,
              max: 18,
              message: '密码为6到18位数字或字母',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    computed: {
      activeIndex() {
        return this.$store.state.perMission.activeIndex
      }
    },
    watch: {

    },
    methods: {
      //修改密码提交按钮
      submitForm() {
        let name = sessionStorage.getItem('name');
        if (name) {
          name = JSON.parse(name);
          this.maccount = name || '';
        }
        var _this = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.logining = false;
            var oldPwd = CryptoJS.MD5(this.ruleForm.usedPass + this.maccount).toString(CryptoJS.enc.Hex);
            var mpwd = CryptoJS.MD5(this.ruleForm.pass + this.maccount).toString(CryptoJS.enc.Hex);
            var mpwd2 = CryptoJS.MD5(this.ruleForm.checkPass + this.maccount).toString(CryptoJS.enc.Hex);
            var modifypass = {
              oldPwd,
              mpwd,
              mpwd2
            };
            //console.log(modifypass);
            updateSysPwd(modifypass).then(res => {
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
                _this.$emit("logout");
              } else if (status == 301) {
                this.$notify({
                  title: '警告',
                  message: message,
                  type: 'warning'
                });
                _this.$emit("logout");
              } else {
                this.$notify.error({
                  title: '错误',
                  message: message
                });
              }
            });
          } else {
            return false;
          }
        });
      },
      //修改密码弹框是否弹出
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //退出登录
      logout: function () {
        this.$confirm("确定退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(() => {
          this.$emit("logout");
        }).catch(() => {});
      },
      //切换顶部导航
      handleSelect(change) {
        if (this.activeIndex === change) {
          return
        }
        sessionStorage.setItem('activeIndex', JSON.stringify(change));
        //切换头部导航
        this.$store.dispatch('top_nav', change)
        //清除动态标签
        this.$store.dispatch('delAllViews')

        switch (parseInt(change)) {
          case 1:
            this.$router.push({
              path: "/home"
            });
            break;
          case 2:
            sessionStorage.setItem('menu', JSON.stringify(1));
            this.$emit('login', '/index1/table2');
            break;
          case 3:
            sessionStorage.setItem('menu', JSON.stringify(2));
            this.$emit('login', '/index2/page4');
            break;
          default:
            this.$router.push({
              path: "/notonline"
            });
            break;
        }
      },
    },
    mounted() {
      let activeIndex = JSON.parse(sessionStorage.getItem('activeIndex'));
      if (activeIndex) {
        //切换头部导航
        this.$store.dispatch('top_nav', activeIndex)
      }
      //用户名
      let user = sessionStorage.getItem('user');
      if (user) {
        user = JSON.parse(user);
        this.sysUserName = user || '';
      }
    }
  };

</script>
<style scoped lang="scss">
  .top_logo {
    width: 180px;
    float: left;
  }

  .top_logo img {
    width: 30%;
    margin-top: 17px;
    float: left;
  }

  .top_logo span {
    font-size: 18px;
    font-weight: bolder;
    color: #284890;
    line-height: 60px;
  }

  .notonline_main {
    text-align: center
  }

  .el_menu_horizontal {
    border: none;
    float: right;
  }

</style>
