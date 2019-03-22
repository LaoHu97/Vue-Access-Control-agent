<style scoped lang="scss">
  .navmenu {
    background-color: #DCDFE6
  }

  .navmenu_vertical {
    height: 100%;
    background-color: #DCDFE6;
    float: left;
  }

  .container_elMenu {
    float: left\9;
    height: 100%\9;
    background-color: rgb(65, 79, 97);
  }
  .ie9_elcontainer{
    height: 100%\9;
  }
  .ie9_elmain{
    display: block\9;
  }

  .el_menu_vertical {
    margin-top: -36px;
    border: none;
  }

  .el_menu_vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    margin-top: -36px;
  }

  .template_tabs {
    float: right
  }

  .top_logo {
    width: 150px;
    float: left;
  }

  .top_logo img {
    width: 100%;
    height: auto;
    margin-top: 19px;
    float: left;
  }

  .top_logo span {
    font-size: 18px;
    font-weight: bolder;
    color: #284890;
    line-height: 60px;
  }

  .menu_icon {
    margin-top: 10px;
  }

  .menu_icon span i {
    font-size: 18px;
  }

  .route_icon {
    color: #fff;
  }

  .el_menu_horizontal {
    border: none;
    float: right;
  }

</style>
<template>
  <div>
    <el-container style="height:100%">
      <el-header style="background: #fff;height:auto">
        <el-row>
          <el-col :span="5">
            <div class="top_logo">
              <img src="../assets/images/webwxgetmsgimg.png" />
            </div>
            <el-button type="text" @click="isCollapse=!isCollapse" class="menu_icon">
              <i class="iconfont icon-weibiaoti12" v-if="!isCollapse"></i>
              <i class="iconfont icon-weibiaoti12-copy" v-else></i>
            </el-button>
          </el-col>
          <el-col :span="12">
            <div class="navmenu_horizontal">
              <el-menu :default-active="activeIndex" class="el_menu_horizontal" mode="horizontal" @select="handleSelect" background-color="#fff">
                <el-menu-item index="1">首页</el-menu-item>
                <el-menu-item index="3">商户中心</el-menu-item>
                <el-menu-item index="2">交易中心</el-menu-item>
                <el-menu-item index="4">运营中心</el-menu-item>
                <!-- <el-menu-item index="5">营销中心</el-menu-item>
                <el-menu-item index="6">帮助中心</el-menu-item> -->
              </el-menu>
            </div>
          </el-col>
          <el-col :span="7" style="line-height: 60px;text-align: right;">
            <span>{{sysUserName}} ，欢迎登录渠道商平台 </span>
            <el-dropdown split-button size="mini" type="danger" @click="logout">
              退出登录
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleEdit">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <TagsView v-bind:style="{ marginLeft: isCollapseSty }"></TagsView>
      <!--修改密码-->
      <el-dialog :visible.sync="editFormVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" width="400px">
        <el-alert title="提示：密码修改成功后需重新登录" type="warning" center show-icon :closable="false"></el-alert>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="旧密码" prop="usedPass">
            <el-input type="password" v-model.trim="ruleForm.usedPass"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model.trim="ruleForm.pass"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model.trim="ruleForm.checkPass"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button :disabled="doneEditPassword" @click="editFormVisible=false">取消</el-button>
          <el-button type="primary" :loading="submitFormLogining" @click="submitForm('ruleForm')">提交</el-button>
        </div>
      </el-dialog>
      <el-container class="ie9_elcontainer">
        <div class="container_elMenu">
          <el-menu :default-active="activeMenu" class="el_menu_vertical" unique-opened :collapse="isCollapse" router background-color="#414F61"
            text-color="#fff" active-text-color="#409EFF">
            <template v-for="(route, index) in menus">
              <template v-if="route.children">
                <el-submenu :key="index" :index="route.name">
                  <template slot="title">
                    <i class="iconfont route_icon" v-bind:class="[route.meta.icon]"></i>
                    <span slot="title">{{route.meta.name || route.name}}</span>
                  </template>
                  <el-menu-item v-for="(cRoute, cIndex) in route.children" :key="cIndex" :index="cRoute.name" :route="cRoute" v-if="!cRoute.meta.hidden">
                    {{cRoute.meta.name || cRoute.name}}
                  </el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :key="index" :route="route" :index="route.name">
                  <i class="iconfont route_icon" v-bind:class="[route.meta.icon]"></i>
                  <span slot="title">{{route.meta.name || route.name}}</span>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </div>
        <el-main class="ie9_elmain">
          <template>
              <keep-alive>
                <router-view v-if="!$route.meta.noCache"></router-view>
              </keep-alive>
              <router-view v-if="$route.meta.noCache"></router-view>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import {
    TagsView,
    ErrorPage
  } from '../components'
  import instance from "../api";
  import CryptoJS from "crypto-js";
  import {
    updateSysPwd,
    batchRemoveUser,
    checkPermission
  } from '../api/agent';

  export default {
    components: {
      TagsView,
      ErrorPage
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
        let regex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,18}');
        let han = new RegExp("[\\u4E00-\\u9FFF]+","g");
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!regex.test(value)) {
          callback(new Error('请输入包含大小写字母、数字、特殊字符的8到18位密码'));
        } else if (han.test(value)) {
          callback(new Error('请输入包含大小写字母、数字、特殊字符的8到18位密码'));
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
        isCollapse: false,
        sysUserName: '',
        accessPerMission: false,
        editFormVisible: false, //修改密码弹窗是否显示
        submitFormLogining: false,
        doneEditPassword: false,
        isCollapseSty: '200px',
        doneEditPassword: false,
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
            }
          ],
          pass: [{
              required: true,
              validator: validatePass1,
              trigger: 'blur'
            },
            {
              min: 8,
              max: 18,
              message: '请输入包含大小写字母、数字、特殊字符的8到18位密码',
              trigger: 'blur'
            }
          ],
          checkPass: [{
              required: true,
              validator: validatePass2,
              trigger: 'blur'
            }
          ]
        }
      };
    },
    computed: {
      activeMenu: function () {
        return this.$route.name
      },
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      activeIndex() {
        return this.$store.state.perMission.activeIndex
      },
      menus() {
        return this.$store.state.perMission.sideMenus
      }
    },
    watch: {
      $route(curVal, oldVal) {
        this.isTab()
      },
      isCollapse(curVal, oldVal) {
        if (curVal) {
          this.isCollapseSty = '65px'
        } else {
          this.isCollapseSty = '200px'
        }
      }
    },
    methods: {
      isTab() {
        checkPermission({
          code: this.$route.meta.code
        }).then(res => {
          if (res.status === 200) {
            this.accessPerMission = false
          } else {
            this.accessPerMission = true
          }
        })
      },
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
            var oldPwd = CryptoJS.MD5(this.ruleForm.usedPass + this.maccount).toString(CryptoJS.enc.Hex);
            var mpwd = CryptoJS.MD5(this.ruleForm.pass + this.maccount).toString(CryptoJS.enc.Hex);
            var mpwd2 = CryptoJS.MD5(this.ruleForm.checkPass + this.maccount).toString(CryptoJS.enc.Hex);
            var modifypass = {
              oldPwd,
              mpwd,
              mpwd2
            };
            this.submitFormLogining = true;
            updateSysPwd(modifypass).then(res => {
              this.submitFormLogining = false;
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.$message({
                  message: message,
                  type: 'success'
                });
                //清除菜单权限
                this.$root.hashMenus = {};
                //回到登录页
                this.$router.replace({
                  path: '/login'
                });
                //清除动态标签
                this.$store.dispatch('delAllViews')
              }
            }).catch(() => {
              this.submitFormLogining = false;
            });
          } else {
            return false;
          }
        });
      },
      //修改密码弹框是否弹出
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields()
        })
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
        if (this.activeIndex===change) {
          return
        }
        sessionStorage.setItem('activeIndex', JSON.stringify(change));
        //清空当前路由
        this.$store.dispatch('del_menu')
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
            this.$emit('login', '/index1/table');
            break;
          case 3:
            sessionStorage.setItem('menu', JSON.stringify(2));
            this.$emit('login', '/index2/page4');
            break;
          case 4:
            sessionStorage.setItem('menu', JSON.stringify(3));
            this.$emit('login', '/index3/list1');
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
      this.isTab()
      //用户名
      let user = sessionStorage.getItem('user');
      if (user) {
        user = JSON.parse(user);
        this.sysUserName = user || '';
      }
    },
    created() {
      let first = JSON.parse(sessionStorage.getItem('first'))
      if (first === 0) {
        this.editFormVisible = true;
        this.doneEditPassword = true
      }
    }
  };

</script>
