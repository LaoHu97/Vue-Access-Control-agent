<style scoped>
.box-card {
  margin-top: 20px;
}
.box-card-text span {
  color: #909399;
  line-height: 2;
}
.box-card-pay span {
  line-height: 2;
  width: 150px;
  display: inline-block;
}
.box-card-switch {
  border-top: 1px #ebeef5 solid;
}
.icon {
  margin: 0 5px;
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.3em;
  fill: currentColor;
  overflow: hidden;
}
.box-card-pay-icon {
  margin: 0 5px;
  width: 3.5em;
  height: 3.5em;
  vertical-align: -1.4em;
  fill: currentColor;
  overflow: hidden;
}
.box_card_img {
  width: 100px;
  height: 120px;
  border: 1px solid #999;
  padding: 4px;
  border-radius: 4px;
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xinxi"></use>
        </svg>
        <span>商户信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="clickMerEdit">修改</el-button>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="8">
            <span>商户名称：</span>
            {{ boxCardText.merchant_name }}
          </el-col>
          <el-col :span="8">
            <span>商户联系人：</span>
            {{ boxCardText.merchant_person }}
          </el-col>
          <el-col :span="8">
            <span>开户名：</span>
            {{ boxCardText.account_name }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>注册名称：</span>
            {{ boxCardText.merchant_company }}
          </el-col>
          <el-col :span="8">
            <span>联系人电话：</span>
            {{ boxCardText.merchant_phone }}
          </el-col>
          <el-col :span="8">
            <span>账户性质：</span>
            {{ boxCardText.account_type === '1' ? '对公' : '对私' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>行业类别：</span>
            {{ boxCardText.business_name }}
          </el-col>
          <el-col :span="8">
            <span>联系人邮箱：</span>
            {{ boxCardText.merchant_email }}
          </el-col>
          <el-col :span="8">
            <span>开户账号：</span>
            {{ boxCardText.account_no }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>商户地址：</span>
            {{ boxCardText.merchant_address }}
          </el-col>
          <el-col :span="8">
            <span>客服电话：</span>
            {{ boxCardText.merchant_service_phone }}
          </el-col>
          <el-col :span="8">
            <span>银行预留号码：</span>
            {{ boxCardText.account_phone }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>创建时间：</span>
            {{ formatCreate_time(boxCardText.gmt_create) }}
          </el-col>
          <el-col :span="8">
            <span>业务员：</span>
            {{ boxCardText.salesman_name }}
          </el-col>
          <el-col :span="8">
            <span>开户支行：</span>
            {{ boxCardText.bank_name }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="8">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="8">
            <el-button type="text" @click="dialogPhoneVisible = true">资质证照预览</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- <el-card class="box-card">
      <div slot="header">
        <svg
          class="icon"
          aria-hidden="true">
          <use xlink:href="#icon-saomazhifu"/>
        </svg>
        <span>支付配置</span>
      </div>
      <div class="box-card-pay">
        <el-row>
          <el-col :span="8">
            <svg
              class="box-card-pay-icon"
              aria-hidden="true">
              <use xlink:href="#icon-weixin"/>
            </svg>
            <span>微信支付
              <b :style="{ color: switchValue ? '#19C862' :'#F56C6C' }">（{{ switchValue ? '开启' : '关闭' }}）</b>
            </span>
            <el-switch
              v-model="switchValue"
              active-color="#19C862"/>
          </el-col>
          <el-col :span="8">
            <svg
              class="box-card-pay-icon"
              aria-hidden="true">
              <use xlink:href="#icon-big-Pay"/>
            </svg>
            <span>支付宝支付
              <b :style="{ color: switchValue ? '#19C862' :'#F56C6C' }">（{{ switchValue ? '开启' : '关闭' }}）</b>
            </span>
            <el-switch
              v-model="switchValue"
              active-color="#13ce66"/>
          </el-col>
          <el-col :span="8">
            <svg
              class="box-card-pay-icon"
              aria-hidden="true">
              <use xlink:href="#icon-weixin"/>
            </svg>
            <span>微信支付（打开）</span>
            <el-switch
              v-model="switchValue"
              active-color="#13ce66"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <svg
              class="box-card-pay-icon"
              aria-hidden="true">
              <use xlink:href="#icon-weixin"/>
            </svg>
            <span>微信支付（打开）</span>
            <el-switch
              v-model="switchValue"
              active-color="#13ce66"/>
          </el-col>
          <el-col :span="8">
            <svg
              class="box-card-pay-icon"
              aria-hidden="true">
              <use xlink:href="#icon-weixin"/>
            </svg>
            <span>微信支付（打开）</span>
            <el-switch
              v-model="switchValue"
              active-color="#13ce66"/>
          </el-col>
          <el-col :span="8">
            <svg
              class="box-card-pay-icon"
              aria-hidden="true">
              <use xlink:href="#icon-weixin"/>
            </svg>
            <span>微信支付（打开）</span>
            <el-switch
              v-model="switchValue"
              active-color="#13ce66"/>
          </el-col>
        </el-row>
      </div>
    </el-card>-->

    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-_mendian"></use>
        </svg>
        <span>商户配置</span>
      </div>
      <div class="box-card-pay">
        <el-row>
          <el-col :span="8">
            <svg class="box-card-pay-icon" aria-hidden="true">
              <use xlink:href="#icon-mendian"></use>
            </svg>
            <router-link :to="{path: '/index2/page7', query: { mid: $route.query.mid }}">
              <el-button type="text" size="medium">查看门店</el-button>
            </router-link>
          </el-col>
          <el-col :span="8">
            <svg class="box-card-pay-icon" aria-hidden="true">
              <use xlink:href="#icon-qian"></use>
            </svg>
            <router-link :to="{path: '/index2/page8', query: { mid: $route.query.mid }}">
              <el-button type="text" size="medium">查看款台</el-button>
            </router-link>
          </el-col>
          <el-col :span="8">
            <svg class="box-card-pay-icon" aria-hidden="true">
              <use xlink:href="#icon-bangongdianhuayewu"></use>
            </svg>
            <el-button type="text" size="medium" @click="allotSale">分配业务员</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <svg class="box-card-pay-icon" aria-hidden="true">
              <use xlink:href="#icon-zhongzhi"></use>
            </svg>
            <el-button type="text" size="medium" @click="resetPassWord">重置密码</el-button>
          </el-col>
          <el-col :span="8">
            <svg class="box-card-pay-icon" aria-hidden="true">
              <use xlink:href="#icon-zhongduan"></use>
            </svg>
            <router-link :to="{path: '/index2/page14', query: { mid: $route.query.mid }}">
              <el-button type="text" size="medium">查看终端</el-button>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-caidan"></use>
        </svg>
        <span>硬件配置</span>
      </div>
      <div class="box-card-pay">
        <el-row>
          <el-col :span="8">
            <svg class="box-card-pay-icon" aria-hidden="true">
              <use xlink:href="#icon-dayinji"></use>
            </svg>
            <el-button type="text" size="medium" @click="clickPrint">云打印</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!--修改分配业务员界面-->
    <el-dialog title="分配业务员" :visible.sync="editFormVisible" width="30%">
      <el-form :model="editSaleForm">
        <el-form-item label="业务员：">
          <el-select
            v-model="editSaleForm.sale"
            placeholder="请选择业务员"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteSale"
            :loading="saleLoading"
            clearable
            @visible-change="clickSale"
          >
            <el-option
              v-for="item in saleOptions"
              :value="item.id"
              :label="item.value"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 资质证照预览 -->
    <el-dialog
      :title="`资质证照（${boxCardText.merchant_name}）`"
      :visible.sync="dialogPhoneVisible"
      width="45%"
    >
      <el-form :model="boxCardText" :inline="true" label-width="150px" label-position="left">
        <el-form-item label="营业执照照片" v-if="boxCardText.img_business_license">
          <a :href="boxCardText.img_business_license" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_business_license" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="法人身份证正面" v-if="boxCardText.img_idcard_a">
          <a :href="boxCardText.img_idcard_a" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_idcard_a" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="法人身份证反面" v-if="boxCardText.img_idcard_b">
          <a :href="boxCardText.img_idcard_b" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_idcard_b" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="银行卡正面照片" v-if="boxCardText.img_bankcard_a">
          <a :href="boxCardText.img_bankcard_a" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_bankcard_a" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="银行卡反面照片" v-if="boxCardText.img_bankcard_b">
          <a :href="boxCardText.img_bankcard_b" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_bankcard_b" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="商户门头照片" v-if="boxCardText.img_logo">
          <a :href="boxCardText.img_logo" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_logo" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="内部前台照片" v-if="boxCardText.img_indoor">
          <a :href="boxCardText.img_indoor" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_indoor" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="开户许可证照片" v-if="boxCardText.img_open_permits">
          <a :href="boxCardText.img_open_permits" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_open_permits" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="商户关系证明" v-if="boxCardText.img_relation">
          <a :href="boxCardText.img_relation" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_relation" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="结算人身份证正面" v-if="boxCardText.img_private_idcard_a">
          <a :href="boxCardText.img_private_idcard_a" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_private_idcard_a" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="结算人身份证反面" v-if="boxCardText.img_private_idcard_b">
          <a :href="boxCardText.img_private_idcard_b" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_private_idcard_b" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="商户总分店关系证明" v-if="boxCardText.img_mer_relation">
          <a :href="boxCardText.img_mer_relation" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_mer_relation" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="商户增值协议" v-if="boxCardText.img_mer_increment">
          <a :href="boxCardText.img_mer_increment" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_mer_increment" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="组织机构代码证照片" v-if="boxCardText.img_org_code">
          <a :href="boxCardText.img_org_code" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_org_code" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="税务登记证照片" v-if="boxCardText.img_tax_reg">
          <a :href="boxCardText.img_tax_reg" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_tax_reg" alt="证件照片">
          </a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPhoneVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  selectSaleByName,
  updateAgentSalesman,
  queryAgentShopMer,
  resetMerMpwd
} from "../../../api/agent";
import CryptoJS from "crypto-js";
import * as util from "../../../util/util.js";
export default {
  data() {
    return {
      boxCardText: {},
      switchValue: false,
      editFormBoxCard: {},
      editFormVisible: false,
      saleLoading: false,
      editLoading: false,
      saleOptions: [],
      editSaleForm: {
        sale: ""
      },
      dialogPhoneVisible: false
    };
  },
  mounted() {
    this.getMerDetails();
  },
  methods: {
    formatCreate_time(row) {
      return (row = util.formatDate.format(
        new Date(row),
        "yyyy/MM/dd hh:MM:ss"
      ));
    },
    //云打印
    clickPrint() {
      this.$router.push({
        path: "/index2/page13",
        query: { mid: this.$route.query.mid }
      });
    },
    // //重置密码
    resetPassWord() {
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "密码格式不正确",
        inputValue: "123456"
      }).then(({ value }) => {
        let para = {
          password: CryptoJS.MD5(value + this.$route.query.maccount).toString(
            CryptoJS.enc.Hex
          ),
          mid: this.$route.query.mid
        };
        resetMerMpwd(para).then(res => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
          }
        });
      });
    },
    clickMerEdit() {
      this.$router.push({
        path: "/index2/page6",
        query: { id: this.boxCardText.id }
      });
    },
    getMerDetails() {
      const loading = this.$loading({
        lock: true,
        text: "正在请求数据",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      queryAgentShopMer({ mid: this.$route.query.mid }).then(res => {
        this.boxCardText = res.data.returnMap;
        loading.close();
      });
    },
    //显示修改业务员界面
    allotSale: function(index, row) {
      this.editFormVisible = true;
    },
    //业务员远程搜索
    clickSale: function() {
      this.saleLoading = true;
      selectSaleByName().then(res => {
        let { status, data } = res;
        this.saleLoading = false;
        if (status == 200) {
          this.saleOptions = data.salesmanList;
        }
      });
    },
    remoteSale(query) {
      if (query !== "") {
        this.saleOptions = true;
        setTimeout(() => {
          this.saleOptions = false;
          selectSaleByName({
            name: query
          }).then(res => {
            let { status, data } = res;
            this.saleOptions = data.salesmanList;
          });
        }, 200);
      } else {
        this.saleOptions = [];
      }
    },
    editSubmit: function() {
      if (!this.editSaleForm.sale) {
        return this.$message({ message: "请选择业务员", type: "warning" });
      }
      this.$confirm("确认提交吗？", "提示").then(() => {
        this.editLoading = true;
        let para = {
          mid: this.$route.query.mid,
          id: this.editSaleForm.sale
        };
        updateAgentSalesman(para).then(res => {
          this.editLoading = false;
          this.editFormVisible = false;
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getMerDetails();
          } else {
            this.$message.error(res.message);
          }
        });
      });
    }
  }
};
</script>
