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
            <el-checkbox v-model="imageUrl.wx_open" true-label="Y" false-label="N" style="margin:40px 0;"><h3>微信</h3></el-checkbox>
          </el-col>
        </el-row>
        <el-row v-if="imageUrl.wx_open === 'Y'" >
          <el-col :span="6">
            <el-form-item label="微信费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.wx_rate" :disabled="editDisabled" :precision="1" :step="0.1" :min="3" :max="50"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人微信账号" prop="wx_contid" label-width="100px">
              <el-input v-model="imageUrl.wx_contid" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-checkbox v-model="imageUrl.ali_open" true-label="Y" false-label="N" style="margin:40px 0;"><h3>支付宝</h3></el-checkbox>
          </el-col>
        </el-row>
        <el-row v-if="imageUrl.ali_open === 'Y'">
          <el-col :span="6">
            <el-form-item label="支付宝费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.ali_rate" :disabled="editDisabled" :precision="1" :step="0.1" :min="3" :max="50"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合作伙伴在支付宝的PID" prop="ali_source" label-width="100px">
              <el-input v-model="imageUrl.ali_source" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经营类目" prop="ali_ctgyid" label-width="100px">
              <el-cascader
                v-model="imageUrl.ali_ctgyid"
                :options="optionsAliBusiness"
                @active-item-change="businessItemAliChange"
                :props="businessAliProps"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <h3>费率设置</h3>
        <el-row>
          <el-col :span="5">
            <el-form-item label="翼支付费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.best_rate" :precision="1" :step="0.1" :min="3"  :max="50"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="贷记卡费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.crebit_rate" :precision="1" :step="0.1" :min="5.4" :max="500"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="银联费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.unionpay_rate" :precision="1" :step="0.1" :min="3.8" :max="6"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="借记卡费率（‰）" label-width="100px">
              <el-input-number v-model="imageUrl.debit_rate" :precision="1" :step="0.1" :min="4.2" :max="500"></el-input-number>
            </el-form-item>
            <el-form-item label="借记卡封顶值（元）" label-width="100px">
              <el-input-number v-model="imageUrl.reserve1" :precision="0" size="mini" :step="1" :min="18" :max="25"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <h3>上传照片</h3>
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
          <el-col :span="5">
            <el-form-item label="联系人身份证正面" prop="img_person_a" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess16"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_person_a	" :src="imageUrl.thum_img_person_a	" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="联系人身份证反面" prop="img_person_b" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarScucess17"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl.thum_img_person_b" :src="imageUrl.thum_img_person_b" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="附件" prop="img_other" >
              <el-upload
                class="avatar-uploader"
                :data="{id:imageUrl.id}"
                :action="uploadZIP"
                :show-file-list="false"
                :on-success="handleAvatarScucess18"
                :before-upload="beforeAvatarUploadOther">
                <i v-if="imageUrl.img_other" class="el-icon-document avatar" style="font-size:28px;line-height:78px;"></i>
                <!-- <img v-if="imageUrl.img_other" :src="imageUrl.img_other" class="avatar"> -->
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
  addAgentMerthree,
  uploadZIP
} from '../../../api/agent';
export default {
  data() {
    return {
      uploadZIP: uploadZIP,
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

        wx_open: "Y",
        wx_mchrmk: "",
        wx_conttp: "type_wechatid",
        wx_contid: "",

        ali_open: "Y",
        ali_source: "",
        ali_ctgyid: [],

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
        img_person_a: '',
        img_person_b: '',

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
        thum_img_tax_reg: '',
        thum_img_person_a: '',
        thum_img_person_b: '',
        img_other: ''
      },
      addLoading: false,
      loading: false,
      rules: {
        wx_busins: [
         {
            type: "array",
            required: true,
            message: "请选择经营类目",
            trigger: "change"
          }
        ],
        wx_conttp: [
          {
            required: true,
            message: "请输入联系人微信账号类型",
            trigger: "blur"
          }
        ],
        wx_contid: [
          {
            required: true,
            message: "请输入联系人微信账号",
            trigger: "blur"
          }
        ],
        ali_source: [
          {
            required: true,
            message: "请输入合作伙伴在支付宝的PID",
            trigger: "blur"
          }
        ],
        ali_orgpid: [
          {
            required: true,
            message: "请输入收单机构在支付宝的PID",
            trigger: "blur"
          }
        ],
        ali_ctgyid: [
         {
            type: "array",
            required: true,
            message: "请选择经营类目",
            trigger: "change"
          }
        ],
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
      formDisabled: false,
      editDisabled: false,
      optionsBusiness: [],
      businessProps: {
        value: "id",
        label: "name",
        children: "cities"
      },
      optionsAliBusiness: [],
      businessAliProps: {
        value: "id",
        label: "name",
        children: "cities"
      }
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
      this.img_bankcard_a = true
      this.img_bankcard_b = true
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
    showBusinessType({ id: "0", type: "ALI" }).then(res => {
      let list = [];
      for (let i = 0; i < res.data.BusinessList.length; i++) {
        let e = res.data.BusinessList[i];
        e.cities = [];
        list.push(e);
      }
      this.optionsAliBusiness = list;
    });
  },
  methods: {
    retstSubmit() {
      this.$router.go(-1)
    },
    businessItemAliChange(val) {
      showBusinessType({ id: val[0], type: "ALI" }).then(res => {
        this.optionsAliBusiness.findIndex(function(obj) {
          if (val[0] == obj.id) {
            let list = [];
            for (let i = 0; i < res.data.BusinessList.length; i++) {
              let e = res.data.BusinessList[i];
              e.cities = [];
              list.push(e);
            }
            obj.cities = res.data.BusinessList;
            if (val[1]) {
              showBusinessType({ id: val[1], type: "ALI" }).then(res => {
                obj.cities.findIndex(function(params) {
                  if (val[1] == params.id) {
                    params.cities = res.data.BusinessList;
                  }
                });
              });
            }
          }
        });
      });
    },
    getPageDetails() {
      let para = {
        id: this.$route.query.id,
        page: 3
      }
      agentShopPage(para).then(res => {
        if (res.status === 200 && res.data.isEmpty === '1') {
          let imageUrl = util.deepcopy(
            Object.assign(res.data.bsbPay, res.data.agentMap)
          );
          console.log(imageUrl);
          this.imageUrl.ali_open = imageUrl.ali_open
          this.imageUrl.wx_open = imageUrl.wx_open
          this.imageUrl.wx_contid = imageUrl.wx_contid;

          this.imageUrl.ali_source = imageUrl.ali_source;
          this.imageUrl.ali_mcccod = imageUrl.ali_mcccod;
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
          this.imageUrl.img_person_a = imageUrl.img_person_a || ''
          this.imageUrl.img_person_b = imageUrl.img_person_b || ''

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
          this.imageUrl.thum_img_tax_reg = imageUrl.thum_img_tax_reg || ''
          this.imageUrl.thum_img_person_a = imageUrl.thum_img_person_a || ''
          this.imageUrl.thum_img_person_b = imageUrl.thum_img_person_b || ''
          
          if (res.data.timely_sign && res.data.timely_sign === '1') {
            this.formDisabled = true
            this.editDisabled = true
          }else{
            this.formDisabled = false
            this.formDisabled = false
          }
          if (imageUrl.ali_ctgyid.length) {
            this.imageUrl.ali_ctgyid = JSON.parse(imageUrl.ali_ctgyid);
            this.businessItemAliChange(this.imageUrl.ali_ctgyid); 
          }
        }
      })
    },
    //图片上传
    beforeAvatarUpload(file) {
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
    beforeAvatarUploadOther(file) {
      console.log(file.type);
      // const isJPG = file.type === 'application/x-zip-compressed';
      const isLt3M = file.size / 1024 / 1024 < 20;
      // if (!isJPG) {
      //   this.$message.error('上传附件只能是 ZIP 格式!');
      // }
      if (!isLt3M) {
        this.$message.error('上传附件大小不能超过 20MB!');
      }
      // return isJPG && isLt3M;
      return isLt3M;
    },
    handleAvatarScucess1(res, file) {
      this.imageUrl.img_business_license = res.data.locationPath
      this.imageUrl.thum_img_business_license = res.data.thumbnailImage
    },
    handleAvatarScucess2(res, file) {
      this.imageUrl.img_idcard_a = res.data.locationPath
      this.imageUrl.thum_img_idcard_a = res.data.thumbnailImage
    },
    handleAvatarScucess3(res, file) {
      this.imageUrl.img_idcard_b = res.data.locationPath
      this.imageUrl.thum_img_idcard_b = res.data.thumbnailImage
    },
    handleAvatarScucess4(res, file) {
      this.imageUrl.img_bankcard_a = res.data.locationPath
      this.imageUrl.thum_img_bankcard_a = res.data.thumbnailImage
    },
    handleAvatarScucess5(res, file) {
      this.imageUrl.img_bankcard_b = res.data.locationPath
      this.imageUrl.thum_img_bankcard_b = res.data.thumbnailImage
    },
    handleAvatarScucess6(res, file) {
      this.imageUrl.img_logo = res.data.locationPath
      this.imageUrl.thum_img_logo = res.data.thumbnailImage
    },
    handleAvatarScucess7(res, file) {
      this.imageUrl.img_indoor = res.data.locationPath
      this.imageUrl.thum_img_indoor = res.data.thumbnailImage
    },
    handleAvatarScucess8(res, file) {
      this.imageUrl.img_open_permits = res.data.locationPath
      this.imageUrl.thum_img_open_permits = res.data.thumbnailImage
    },
    handleAvatarScucess9(res, file) {
      this.imageUrl.img_relation = res.data.locationPath
      this.imageUrl.thum_img_relation = res.data.thumbnailImage
    },
    handleAvatarScucess10(res, file) {
      this.imageUrl.img_private_idcard_a = res.data.locationPath
      this.imageUrl.thum_img_private_idcard_a = res.data.thumbnailImage
    },
    handleAvatarScucess11(res, file) {
      this.imageUrl.img_private_idcard_b = res.data.locationPath
      this.imageUrl.thum_img_private_idcard_b = res.data.thumbnailImage
    },
    handleAvatarScucess12(res, file) {
      this.imageUrl.img_mer_relation = res.data.locationPath
      this.imageUrl.thum_img_mer_relation = res.data.thumbnailImage
    },
    handleAvatarScucess13(res, file) {
      this.imageUrl.img_mer_increment = res.data.locationPath
      this.imageUrl.thum_img_mer_increment = res.data.thumbnailImage
    },
    handleAvatarScucess14(res, file) {
      this.imageUrl.img_org_code = res.data.locationPath
      this.imageUrl.thum_img_org_code = res.data.thumbnailImage
    },
    handleAvatarScucess15(res, file) {
      this.imageUrl.img_tax_reg = res.data.locationPath
      this.imageUrl.thum_img_tax_reg = res.data.thumbnailImage
    },
    handleAvatarScucess16(res, file) {
      this.imageUrl.img_person_a = res.data.locationPath
      this.imageUrl.thum_img_person_a = res.data.thumbnailImage
    },
    handleAvatarScucess17(res, file) {
      this.imageUrl.img_person_b = res.data.locationPath
      this.imageUrl.thum_img_person_b = res.data.thumbnailImage
    },
    handleAvatarScucess18(res, file) {
      this.imageUrl.img_other = res.data.locationPath
    },

    addSubmit: function() {
      this.$refs.imageUrl.validate((valid) => {
        if (valid) {
          let para = util.deepcopy(this.imageUrl)
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
