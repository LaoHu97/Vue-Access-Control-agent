<template>
  <div>
    <el-row>
      <el-col>
        <div style="height: 60px;background-color: #fff;">
          <img src="../assets/images/webwxgetmsgimg.png" alt="logo" width="227px" height="35px;" style="margin-top: 12px;margin-left: 20px;">
          <div class="topList">
            <a :href="loginNav + '/admin/web/shop.html'">商户登录</a>
            <a :href="loginNav + '/admin/web/store.html'">门店登录</a>
            <a :href="loginNav + '/admin/web/emp.html'">款台登录</a>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="centers" @keyup.enter="show()" :style="{backgroundImage: 'url(' +bImg + ')'}">
      <el-form :model="user" ref="user" label-position="left" label-width="0px" class="login-container">
        <h3 class="title">代理登录</h3>
        <el-form-item prop="account">
          <el-input type="text" v-model.trim="user.account" placeholder="请输入用户名">
            <template slot="prepend">
              <i class="iconfont">&#xe715;</i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model.trim="user.checkPass" placeholder="请输入密码">
            <template slot="prepend">
              <i class="iconfont">&#xe709;</i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="passCode">
          <el-input type="text" v-model="user.passCode" size="medium" placeholder="请输入验证码" style="width:50%;float:left;display:block"></el-input>
          <el-tooltip content="看不清？请点击" placement="top" effect="light">
            <img :src="user.code" @click="clickCode" alt="验证码" style="float:right;width:75px;height:36px;">
          </el-tooltip>
        </el-form-item>
        <el-button type="primary" style="width:100%;background-color:#0066cc;border-color:#0066cc" @click.native.prevent="loginSubmit"
          :loading="isBtnLoading">{{btnText}}</el-button>
        <span style="color:#ff4949;text-align:center;display: inherit;font-size:12px;">{{user.Verification}}</span>
        <span class="title" style="display: block;">忘记密码请联系客服
          <br>0 2 9-8 8 4 4 5 5 3 4</span>
      </el-form>
    </div>
    <div class="news">
      <div class="notice">
        最新公告
      </div>
      <a href="http://www.wandingkeji.cn/newsitem/277761358" target="_blank">1、帮助商家便捷接入微信、支付宝</a>
      <a href="http://www.wandingkeji.cn/newsitem/277185235" target="_blank">2、帮助商家进行微信公众平台开发运营</a>
      <a href="#">3、《商户平台使用手册》即将上线</a>
      <a class="gengduo" href="http://www.wandingkeji.cn">
        查看更多>>
      </a>
    </div>
    <div class="service">
      <h2>商户入驻流程</h2>
      <el-steps space="45%" :active="1" :align-center='true'>
        <el-step title="提交资料" description=""></el-step>
        <el-step title="审核认证" description=""></el-step>
        <el-step title="开始使用" description=""></el-step>
      </el-steps>
    </div>
    <el-row>
      <el-col>
        <div class="grid-content">版权所有：西安万鼎网络科技有限公司 | ICP备 陕17002918号</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as login from '../api/agent';
  import instance from '../api';
  import CryptoJS from "crypto-js";
  import * as util from '../util/util.js';


  export default {
    data() {
      return {
        bImg: require('../assets/images/57be6c6cb3d28_1024.jpg'),
        user: {
          account: '',
          checkPass: '',
          passCode: '',
          code: ''
        },
        isBtnLoading: false,
        loginNav:process.env.API_ROOT
      };
    },
    computed: {
      btnText() {
        if (this.isBtnLoading) return '登录中...';
        return '登录';
      }
    },
    //首次加载验证码
    mounted() {
      let para = {
        timestamp: (new Date()).valueOf()
      }
      this.user.code = `${login.getCode}?timestamp=${para.timestamp}`
    },
    methods: {
      //回车登录
      show: function () {
        this.loginSubmit()
      },
      clickCode() {
        let para = {
          timestamp: (new Date()).valueOf()
        }
        this.user.code = `${login.getCode}?timestamp=${para.timestamp}`
      },
      loginSubmit() {
        var vm = this;
        if (!vm.user.account) {
          vm.$message.error('请填写用户名！！！');
          return;
        }
        if (!vm.user.checkPass) {
          vm.$message.error('请填写密码');
          return;
        }

        let loginParams = {
          maccount: this.user.account,
          mpwd: CryptoJS.MD5(this.user.checkPass + this.user.account).toString(CryptoJS.enc.Hex),
          inCode: this.user.passCode,
          type: "1"
        };
        vm.isBtnLoading = true;
        login.loginVerify(loginParams).then(res => {
          vm.isBtnLoading = false;
          if (res.status === 200) {
            var name = this.user.account;
            var user = res.data.userName;
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('name', JSON.stringify(name));
            sessionStorage.setItem('agentId', JSON.stringify(res.data.userLogin.id));
            sessionStorage.setItem('menu', JSON.stringify(1));
            this.$store.dispatch('top_nav', '2')
            vm.$emit('login', '/index1/table2');
          } else {
            this.clickCode()
          }
        }).catch(util.catchError);
      }
    },
    created() {
      sessionStorage.clear();
    }
  };

</script>
<style lang="css" scoped>
  .login-container {
    -webkit-border-radius: 3px;
    border-radius: 3px;
    -moz-border-radius: 3px;
    background-clip: padding-box;
    background-color: rgba(255, 255, 255, 0.4);
    float: right;
    padding: 14px 35px 0;
    width: 240px;
    margin: 15px 45px 20px 0;
  }

  .title {
    font-weight: normal;
    margin: 0 auto 15px;
    text-align: center;
    color: #fff;
  }

  .grid-content {
    border-top: 1px solid #bfcbd9;
    width: 100%;
    min-height: 60px;
    background-color: #fff;
    text-align: center;
    line-height: 60px;
    color: #333;
    margin-top: 120px;
  }
  .centers {
    overflow: hidden;
    background: center;

  }

  .news {
    overflow: hidden;
    margin-top: 20px;
    padding: 0 6%;
  }

  .news .notice {
    background-color: #F7BA2A;
    padding: 5px 10px;
    border-radius: 3px;
    color: #fff;
    margin-right: 20px;
    float: left;
  }

  .news a {
    line-height: 30px;
    color: #333;
    width: 25%;
    display: block;
    float: left;
    text-decoration: none;
  }

  .news a:hover {
    color: #1D8CE0;
  }

  .gengduo {
    line-height: 30px;
    color: #333;
    float: left;
    display: block;
    width: 80px !important;
  }

  .gengduo:hover {
    color: #1D8CE0;
  }

  .service {
    overflow: hidden;
  }

  .service h2 {
    color: #333;
    padding: 50px 6%;
  }

  .topList {
    float: right;
    line-height: 60px;
    margin-right: 100px;
  }

  .topList a {
    text-decoration: none;
    margin: 0 25px;
    color: #333;
  }

  .topList a:hover {
    color: #1D8CE0;
  }

</style>
