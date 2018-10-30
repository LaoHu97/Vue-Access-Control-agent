<style scoped>
.form_header {
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
}
.form_main {
  background-color: #fff;
  margin-top: 20px;
  border-radius: 8px;
}
.form_contron {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
.form_footer {
  text-align: center;
  padding-bottom: 20px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
    width: 78px;
  height: 78px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
}
.box-alert{
  margin-top: 20px;
}
.editBtn{
  float: right;
  margin-top: 10px;
}
</style>

<template lang="html">
  <section>
    <el-steps class="form_header" align-center :active="2" finish-status="success">
      <el-step title="填写商户基本资料"></el-step>
      <el-step title="填写商户结算信息"></el-step>
      <el-step title="上传商户资质和费率"></el-step>
    </el-steps>
    <el-row  class="box-alert">
      <el-col :span="20">
        <div>
          <el-alert :closable="false" title="审核驳回原因：" v-if="imageUrl.merchant_status === '2'" :description="imageUrl.error_msg || '暂无驳回原因，请联系运营人员'" type="error" show-icon>
          </el-alert>
        </div>
      </el-col>
      <el-col :span="imageUrl.merchant_status === '2' ? 4 : 24">
        <el-button type="primary" class="editBtn" v-if="formDisabled" round @click="formDisabled = !formDisabled">修改</el-button>
      </el-col>
    </el-row>
    <div class="form_main">
      <el-form ref="imageUrl" :inline="true" :disabled="formDisabled" :model="imageUrl" :rules="rules" label-width="150px" label-position="top" class="form_contron">
        <el-row>
          <el-col :span="6">
            <el-form-item label="微信费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.wx_rate" :precision="1" :step="0.1" :min="3" :max="50"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付宝费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.ali_rate" :precision="1" :step="0.1" :min="3" :max="50"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="翼支付费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.best_rate" :precision="1" :step="0.1" :min="3"  :max="50"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="showRate" style="margin-top:40px;">银行卡</el-checkbox>
          </el-col>
        </el-row>
        <el-row v-show="showRate">
          <el-col :span="6">
            <el-form-item label="贷记卡费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.crebit_rate" :precision="1" :step="0.1" :min="5.4" :max="500"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="银联费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.unionpay_rate" :precision="1" :step="0.1" :min="3.8" :max="6"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="借记卡费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.debit_rate" :precision="1" :step="0.1" :min="4.2" :max="500"></el-input-number>
            </el-form-item>
            <el-form-item label="借记卡封顶值（元）" label-width="100px">
              <el-input-number v-model="imageUrl.reserve1" :precision="0" size="mini" :step="1" :min="18" :max="25"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" v-if="img_business_license">
            <el-form-item label="营业执照照片" prop="thum_img_business_license" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess1"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_business_license" :src="imageUrl.thum_img_business_license" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="img_idcard_a">
            <el-form-item label="法人身份证正面" prop="thum_img_idcard_a" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess2"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_idcard_a" :src="imageUrl.thum_img_idcard_a" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="img_idcard_b">
            <el-form-item label="法人身份证反面" prop="thum_img_idcard_b" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess3"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_idcard_b" :src="imageUrl.thum_img_idcard_b" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="img_bankcard_a">
            <el-form-item label="银行卡正面照片" prop="thum_img_bankcard_a">
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess4"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_bankcard_a" :src="imageUrl.thum_img_bankcard_a" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="img_bankcard_b">
            <el-form-item label="银行卡反面照片" prop="thum_img_bankcard_b" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess5"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_bankcard_b" :src="imageUrl.thum_img_bankcard_b" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="5" v-if="img_logo">
            <el-form-item label="商户门头照片" prop="thum_img_logo" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess6"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_logo" :src="imageUrl.thum_img_logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="img_indoor">
            <el-form-item label="内部前台照片" prop="thum_img_indoor" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess7"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_indoor" :src="imageUrl.thum_img_indoor" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="img_open_permits">
            <el-form-item label="开户许可证照片" prop="thum_img_open_permits" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess8"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_open_permits" :src="imageUrl.thum_img_open_permits" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="img_relation">
            <el-form-item label="商户关系证明" prop="thum_img_relation" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess9"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_relation" :src="imageUrl.thum_img_relation" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="img_private_idcard_a">
            <el-form-item label="结算人身份证正面" prop="thum_img_private_idcard_a" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess10"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_private_idcard_a" :src="imageUrl.thum_img_private_idcard_a" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" v-if="img_private_idcard_b">
            <el-form-item label="结算人身份证反面" prop="thum_img_private_idcard_b" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess11"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_private_idcard_b" :src="imageUrl.thum_img_private_idcard_b" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="img_mer_relation">
            <el-form-item label="商户总分店关系证明" prop="thum_img_mer_relation" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess12"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_mer_relation" :src="imageUrl.thum_img_mer_relation" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="img_mer_increment">
            <el-form-item label="商户增值协议" prop="thum_img_mer_increment" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess13"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_mer_increment" :src="imageUrl.thum_img_mer_increment" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="img_org_code">
            <el-form-item label="组织机构代码证照片" prop="thum_img_org_code" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess14"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_org_code" :src="imageUrl.thum_img_org_code" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" v-if="img_tax_reg">
            <el-form-item label="税务登记证照片" prop="thum_img_tax_reg" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess15"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_tax_reg" :src="imageUrl.thum_img_tax_reg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="form_footer">
        <el-button size="large" @click.native="retstSubmit">返 回</el-button>
        <el-button type="primary" size="large" @click.native="addSubmit" :loading="addLoading">提 交</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import * as util from '../../../util/util.js'
import * as data from '../../../util/data.js'
import { Loading } from 'element-ui'
import {
  addAgentMerone,
  selectBank,
  addLcShopView,
  showBusinessType,
  getProvince,
  queryCity,
  selectbranch,
  getTokenList,
  selectSaleByName,
  uploadImage,
  addAgentMertwo,
  agentShopPage,
  addAgentMerthree
} from '../../../api/agent';
export default {
  data() {
    return {
      uploadUrl: uploadImage,
      showRate: false,
      imageUrl: {
        id: this.$route.query.id,
        wx_rate: 6.0,
        ali_rate: 6.0,
        best_rate: 3.0,
        debit_rate: 5.0,
        crebit_rate: 6.0,
        unionpay_rate: 3.8,
        reserve1: 18,


        img_business_license: '',
        img_idcard_a: '',
        img_idcard_b: '',
        img_bankcard_a: '',
        img_bankcard_b: '',
        img_logo: '',
        img_indoor: '',
        img_open_permits: '',
        img_relation: '',
        img_private_idcard_a: '',
        img_private_idcard_b: '',
        img_mer_relation: '',
        img_mer_increment: '',
        img_org_code: '',
        img_tax_reg: '',

        thum_img_business_license: '',
        thum_img_idcard_a: '',
        thum_img_idcard_b: '',
        thum_img_bankcard_a: '',
        thum_img_bankcard_b: '',
        thum_img_logo: '',
        thum_img_indoor: '',
        thum_img_open_permits: '',
        thum_img_relation: '',
        thum_img_private_idcard_a: '',
        thum_img_private_idcard_b: '',
        thum_img_mer_relation: '',
        thum_img_mer_increment: '',
        thum_img_org_code: '',
        thum_img_tax_reg: ''
      },
      addLoading: false,
      loading: false,
      rules: {
        thum_img_business_license: [{
          required: true,
          message: '请上传营业执照照片'
        }],
        thum_img_idcard_a: [{
          required: true,
          message: '请上传法人身份证正面'
        }],
        thum_img_idcard_b: [{
          required: true,
          message: '请上传法人身份证反面'
        }],
        thum_img_bankcard_a: [{
          required: true,
          message: '请上传银行卡正面照片'
        }],
        thum_img_bankcard_b: [{
          required: true,
          message: '请上传银行卡反面照片'
        }],
        thum_img_logo: [{
          required: true,
          message: '请上传商户门头照片'
        }],
        thum_img_indoor: [{
          required: true,
          message: '请上传内部前台照片'
        }],
        thum_img_open_permits: [{
          required: true,
          message: '请上传开户许可证照片'
        }],
        thum_img_relation: [{
          required: true,
          message: '请上传商户关系证明'
        }],
        thum_img_private_idcard_a: [{
          required: true,
          message: '请上传结算人身份证正面'
        }],
        thum_img_private_idcard_b: [{
          required: true,
          message: '请上传结算人身份证反面'
        }],
        thum_img_org_code: [{
          required: true,
          message: '组织机构代码证照片'
        }],
        thum_img_tax_reg: [{
          required: true,
          message: '税务登记证照片'
        }]
      },
      img_business_license: false, //营业执照照片
      img_idcard_a: false, //法人身份证正面
      img_idcard_b: false, //法人身份证反面
      img_bankcard_a: false, //银行卡正面照片
      img_bankcard_b: false, //银行卡反面照片
      img_logo: false, //商户门头照片
      img_indoor: false, //内部前台照片
      img_open_permits: false, //开户许可证照片
      img_relation: false, //商户关系证明
      img_private_idcard_a: false, //结算人身份证正面
      img_private_idcard_b: false, //结算人身份证反面
      img_mer_relation: false, //商户总分店关系证明
      img_mer_increment: false, //商户增值协议
      img_org_code: false, //组织机构代码证照片
      img_tax_reg: false, //税务登记证照片
      formDisabled: false
    }
  },
  mounted () {
    let queryType = this.$route.query
    if (queryType.settlement_mer_type === 'QY' && queryType.account_type === '1' && queryType.document_type === 'SZHY') {
      this.img_business_license = true
      this.img_idcard_a = true
      this.img_idcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_open_permits = true
      this.img_mer_relation = true
      this.img_mer_increment = true
    } else if (queryType.settlement_mer_type === 'QY' && queryType.account_type === '1' && queryType.document_type === 'YYZZ') {
      this.img_business_license = true
      this.img_idcard_a = true
      this.img_idcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_open_permits = true
      this.img_mer_relation = true
      this.img_mer_increment = true
      this.img_org_code = true
      this.img_tax_reg = true
    } else if (queryType.settlement_mer_type === 'QY' && queryType.account_type === '2' && queryType.document_type === 'SZHY' && queryType.is_liable_account === '1') {
      this.img_business_license = true
      this.img_idcard_a = true
      this.img_idcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_open_permits = true
      this.img_mer_relation = true
      this.img_mer_increment = true
      this.img_private_idcard_a = true
      this.img_private_idcard_b = true
    } else if (queryType.settlement_mer_type === 'QY' && queryType.account_type === '2' && queryType.document_type === 'YYZZ' && queryType.is_liable_account === '1') {
      this.img_business_license = true
      this.img_bankcard_a = true
      this.img_bankcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_open_permits = true
      this.img_mer_relation = true
      this.img_mer_increment = true
      this.img_private_idcard_a = true
      this.img_private_idcard_b = true
      this.img_org_code = true
      this.img_tax_reg = true
    } else if (queryType.settlement_mer_type === 'QY' && queryType.account_type === '2' && queryType.document_type === 'SZHY' && queryType.is_liable_account === '2') {
      this.img_business_license = true
      this.img_idcard_a = true
      this.img_idcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_open_permits = true
      this.img_mer_relation = true
      this.img_mer_increment = true
      this.img_private_idcard_a = true
      this.img_private_idcard_b = true
      this.img_bankcard_a = true
      this.img_bankcard_b = true
      this.img_relation = true
    } else if (queryType.settlement_mer_type === 'QY' && queryType.account_type === '2' && queryType.document_type === 'YYZZ' && queryType.is_liable_account === '2') {
      this.img_business_license = true
      this.img_idcard_a = true
      this.img_idcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_open_permits = true
      this.img_mer_relation = true
      this.img_mer_increment = true
      this.img_private_idcard_a = true
      this.img_private_idcard_b = true
      this.img_org_code = true
      this.img_tax_reg = true
      this.img_bankcard_a = true
      this.img_bankcard_b = true
      this.img_relation = true
    } else if (queryType.settlement_mer_type === 'GT' && queryType.account_type === '1' && queryType.document_type === 'SZHY') {
      this.img_business_license = true
      this.img_idcard_a = true
      this.img_idcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_open_permits = true
      this.img_mer_relation = true
      this.img_mer_increment = true
    } else if (queryType.settlement_mer_type === 'GT' && queryType.account_type === '1' && queryType.document_type === 'YYZZ') {
      this.img_business_license = true
      this.img_idcard_a = true
      this.img_idcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_open_permits = true
      this.img_mer_relation = true
      this.img_mer_increment = true
      this.img_org_code = true
      this.img_tax_reg = true
    } else if (queryType.settlement_mer_type === 'GT' && queryType.account_type === '2' && queryType.document_type === 'SZHY' && queryType.is_liable_account === '1') {
      this.img_business_license = true
      this.img_bankcard_a = true
      this.img_bankcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_mer_relation = true
      this.img_mer_increment = true
      this.img_private_idcard_a = true
      this.img_private_idcard_b = true
    } else if (queryType.settlement_mer_type === 'GT' && queryType.account_type === '2' && queryType.document_type === 'YYZZ' && queryType.is_liable_account === '1') {
      this.img_business_license = true
      this.img_bankcard_a = true
      this.img_bankcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_org_code  = true
      this.img_tax_reg = true
      this.img_private_idcard_a = true
      this.img_private_idcard_b = true
      this.img_mer_relation = true
      this.img_mer_increment = true
    } else if (queryType.settlement_mer_type === 'GT' && queryType.account_type === '2' && queryType.document_type === 'SZHY' && queryType.is_liable_account === '2') {
      this.img_business_license = true
      this.img_idcard_a = true
      this.img_idcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_bankcard_a = true
      this.img_bankcard_b = true
      this.img_mer_increment = true
      this.img_relation = true
      this.img_mer_relation = true
      this.img_private_idcard_a = true
      this.img_private_idcard_b = true
    } else if (queryType.settlement_mer_type === 'GT' && queryType.account_type === '2' && queryType.document_type === 'YYZZ' && queryType.is_liable_account === '2') {
      this.img_business_license = true
      this.img_bankcard_a = true
      this.img_bankcard_b = true
      this.img_logo = true
      this.img_indoor = true
      this.img_mer_relation = true
      this.img_mer_increment = true
      this.img_private_idcard_a = true
      this.img_private_idcard_b = true
      this.img_relation = true
    }
    if (this.$route.query.id) {
      this.getPageDetails() 
    }
  },
  methods: {
    retstSubmit() {
      this.$router.go(-1)
    },
    getPageDetails() {
      let para = {
        id: this.$route.query.id,
        page: 3
      }
      agentShopPage(para).then(res => {
        if (res.status === 200 && res.data.isEmpty === '1') {
          let imageUrl = util.deepcopy(res.data.agentMap)
          this.imageUrl.id = imageUrl.id || ''
          this.imageUrl.wx_rate = imageUrl.wx_rate || ''
          this.imageUrl.ali_rate = imageUrl.ali_rate || ''
          this.imageUrl.best_rate = imageUrl.best_rate || ''
          this.imageUrl.debit_rate = imageUrl.debit_rate || ''
          this.imageUrl.crebit_rate = imageUrl.crebit_rate || ''
          this.imageUrl.unionpay_rate = imageUrl.unionpay_rate || ''
          this.imageUrl.reserve1 = imageUrl.reserve1 || ''

          this.imageUrl.img_business_license = imageUrl.img_business_license || ''
          this.imageUrl.img_idcard_a = imageUrl.img_idcard_a || ''
          this.imageUrl.img_idcard_b = imageUrl.img_idcard_b || ''
          this.imageUrl.img_bankcard_a = imageUrl.img_bankcard_a || ''
          this.imageUrl.img_bankcard_b = imageUrl.img_bankcard_b || ''
          this.imageUrl.img_logo = imageUrl.img_logo || ''
          this.imageUrl.img_indoor = imageUrl.img_indoor || ''
          this.imageUrl.img_open_permits = imageUrl.img_open_permits || ''
          this.imageUrl.img_relation = imageUrl.img_relation || ''
          this.imageUrl.img_private_idcard_a = imageUrl.img_private_idcard_a || ''
          this.imageUrl.img_private_idcard_b = imageUrl.img_private_idcard_b || ''
          this.imageUrl.img_mer_relation = imageUrl.img_mer_relation || ''
          this.imageUrl.img_mer_increment = imageUrl.img_mer_increment || ''
          this.imageUrl.img_org_code = imageUrl.img_org_code || ''
          this.imageUrl.img_tax_reg = imageUrl.img_tax_reg || ''

          this.imageUrl.thum_img_business_license = imageUrl.thum_img_business_license || ''
          this.imageUrl.thum_img_idcard_a = imageUrl.thum_img_idcard_a || ''
          this.imageUrl.thum_img_idcard_b = imageUrl.thum_img_idcard_b || ''
          this.imageUrl.thum_img_bankcard_a = imageUrl.thum_img_bankcard_a || ''
          this.imageUrl.thum_img_bankcard_b = imageUrl.thum_img_bankcard_b || ''
          this.imageUrl.thum_img_logo = imageUrl.thum_img_logo || ''
          this.imageUrl.thum_img_indoor = imageUrl.thum_img_indoor || ''
          this.imageUrl.thum_img_open_permits = imageUrl.thum_img_open_permits || ''
          this.imageUrl.thum_img_relation = imageUrl.thum_img_relation || ''
          this.imageUrl.thum_img_private_idcard_a = imageUrl.thum_img_private_idcard_a || ''
          this.imageUrl.thum_img_private_idcard_b = imageUrl.thum_img_private_idcard_b || ''
          this.imageUrl.thum_img_mer_relation = imageUrl.thum_img_mer_relation || ''
          this.imageUrl.thum_img_mer_increment = imageUrl.thum_img_mer_increment || ''
          this.imageUrl.thum_img_org_code = imageUrl.thum_img_org_code || ''
          this.imageUrl.thum_img_tax_re = imageUrl.thum_img_tax_re || ''
          if (res.data.timely_sign && res.data.timely_sign === '1') {
            this.formDisabled = true
          }else{
            this.formDisabled = false
          }
        }
      })
    },
    //图片上传
    beforeAvatarUpload(file) {
      this.loading = Loading.service({
        text: '正在上传...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      });
      const isJPG = file.type === 'image/jpeg';
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!');
      }
      return isJPG && isLt3M;
    },
    handleAvatarScucess1(res, file) {
      this.imageUrl.img_business_license = res.data.locationPath
      this.imageUrl.thum_img_business_license = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess2(res, file) {
      this.imageUrl.img_idcard_a = res.data.locationPath
      this.imageUrl.thum_img_idcard_a = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess3(res, file) {
      this.imageUrl.img_idcard_b = res.data.locationPath
      this.imageUrl.thum_img_idcard_b = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess4(res, file) {
      this.imageUrl.img_bankcard_a = res.data.locationPath
      this.imageUrl.thum_img_bankcard_a = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess5(res, file) {
      this.imageUrl.img_bankcard_b = res.data.locationPath
      this.imageUrl.thum_img_bankcard_b = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess6(res, file) {
      this.imageUrl.img_logo = res.data.locationPath
      this.imageUrl.thum_img_logo = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess7(res, file) {
      this.imageUrl.img_indoor = res.data.locationPath
      this.imageUrl.thum_img_indoor = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess8(res, file) {
      this.imageUrl.img_open_permits = res.data.locationPath
      this.imageUrl.thum_img_open_permits = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess9(res, file) {
      this.imageUrl.img_relation = res.data.locationPath
      this.imageUrl.thum_img_relation = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess10(res, file) {
      this.imageUrl.img_private_idcard_a = res.data.locationPath
      this.imageUrl.thum_img_private_idcard_a = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess11(res, file) {
      this.imageUrl.img_private_idcard_b = res.data.locationPath
      this.imageUrl.thum_img_private_idcard_b = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess12(res, file) {
      this.imageUrl.img_mer_relation = res.data.locationPath
      this.imageUrl.thum_img_mer_relation = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess13(res, file) {
      this.imageUrl.img_mer_increment = res.data.locationPath
      this.imageUrl.thum_img_mer_increment = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess14(res, file) {
      this.imageUrl.img_org_code = res.data.locationPath
      this.imageUrl.thum_img_org_code = res.data.thumbnailImage
      this.loading.close();
    },
    handleAvatarScucess15(res, file) {
      this.imageUrl.img_tax_reg = res.data.locationPath
      this.imageUrl.thum_img_tax_reg = res.data.thumbnailImage
      this.loading.close();
    },
    addSubmit: function() {
      this.$refs.imageUrl.validate((valid) => {
        if (valid) {
          let para = this.imageUrl
          para.shop_id = this.$route.query.shop_id,
          para.salesman_id = this.$route.query.salesman_id
          addAgentMerthree(para).then(res => {
            if (res.status === 200) {
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.$router.push({
                path: '/index2/page4'
              });
            }
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>
