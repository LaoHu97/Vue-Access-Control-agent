<template lang="html">
  <section>
    <h2 style="padding-left:50px">新增商户</h2>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" label-position="left" style="padding-left:100px">
    <el-row>
      <el-col>
        <span class="title_text">商户入网信息</span>
        <el-form-item label="商户名称：" prop="merchant_name">
          <el-input v-model="form.merchant_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="商户简称：" prop="merchant_alias">
          <el-input v-model="form.merchant_alias" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="注册名称：" prop="merchant_company">
          <el-input v-model="form.merchant_company" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="所在省市：" prop="merchant_province3" style="float: left;">
          <el-select v-model="form.merchant_province3" placeholder="请选择" @change="provInce"  @visible-change="province3" style="width:160px;">
            <el-option
              v-for="item in optionsprovince3"
              :label="item.fullname"
              :value="item.sid"
              :key="item.sid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="merchant_province4" style="float: left;" label-width="10px">
          <el-select v-model="form.merchant_province4" placeholder="请选择" style="width:160px;">
            <el-option
              v-for="item in optionsprovince4"
              :label="item.fullname"
              :value="item.sid"
              :key="item.sid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="商户地址" prop="merchant_address">
          <el-input v-model="form.merchant_address" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="商户联系人：" prop="merchant_person">
          <el-input v-model="form.merchant_person" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="联系人电话：" prop="merchant_phone">
          <el-input v-model="form.merchant_phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="联系人邮箱：" prop="merchant_email">
          <el-input v-model="form.merchant_email" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="客服电话：" prop="mer_service_phone">
          <el-input v-model="form.mer_service_phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="行业类目：" prop="business1" style="float:left">
          <el-select v-model="form.business1" placeholder="请选择" @visible-change="testSalenew1" @change="testSalenew2" style="width:100px;">
            <el-option
              v-for="item in optionsbuiness1"
              :label="item.name"
              :value="item.id"
              :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="business2" style="float:left" label-width="10px">
          <el-select v-model="form.business2" placeholder="请选择"  style="width:120px;" @change="testSalenew3">
            <el-option
              v-for="item in optionsbuiness2"
              :label="item.name"
              :value="item.id"
              :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="business3" style="float:left" label-width="10px">
          <el-select v-model="form.business3" placeholder="请选择" style="width:150px;">
            <el-option
              v-for="item in optionsbuiness3"
              :label="item.name"
              :value="item.id"
              :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>



    <!-- 商户结算信息 -->
    <el-row>
      <el-col>
        <span class="title_text">商户结算信息</span>
        <el-form-item label="商户结算入网类型" prop="settlement_mer_type">
          <template>
            <el-select v-model="form.settlement_mer_type" placeholder="请选择">
              <el-option
                v-for="item in settlementOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="form.settlement_mer_type!=='XW'">
        <el-form-item label="执照证件号码：" prop="licenseno">
          <el-input v-model="form.licenseno" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="form.settlement_mer_type!=='XW'">
        <el-form-item label="证件到期日期：" prop="licensen_expire">
          <el-date-picker
            v-model="form.licensen_expire"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="结算账户类型：" prop="account_type">
          <template>
            <el-radio-group v-model="form.account_type" :disabled="form.settlement_mer_type=='XW'">
              <el-radio label="1">对公</el-radio>
              <el-radio label="2">对私</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="form.settlement_mer_type!=='XW'">
        <el-form-item label="入网证件类型：" prop="net_network_type">
          <template>
            <el-select v-model="form.net_network_type" :disabled="form.settlement_mer_type !== 'QY' && form.account_type == '2'" placeholder="请选择">
              <el-option
                v-for="item in net_networkOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.account_type == '2'&&form.settlement_mer_type!=='XW'">
      <el-col>
        <el-form-item label="是否法人入账：">
          <template>
            <el-radio-group v-model="form.is_liable_account">
              <el-radio label="1">法人入账</el-radio>
              <el-radio label="2">非法人入账</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row  v-if="form.is_liable_account == '2' || form.account_type == '1'">
      <el-col>
        <el-form-item label="法人姓名：" prop="artif_nm">
          <el-input v-model="form.artif_nm" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item :label="form.is_liable_account == '2' ? '法人证件类型' : '结算人证件类型' " prop="merchant_id_type">
          <template>
            <el-select v-model="form.merchant_id_type" placeholder="请选择">
              <el-option
                v-for="item in merchant_id_type"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item :label="form.is_liable_account == '2' ? '法人证件号码' : '结算人证件号码' " prop="merchant_id_no">
          <el-input v-model="form.merchant_id_no" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item :label="form.is_liable_account == '2' ? '法人证件有效期' : '结算人证件有效期' " prop="merchant_id_expire">
            <el-date-picker
              v-model="form.merchant_id_expire"
              type="date"
              :editable='false'
              placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="结算人账户开户名：" prop="account_name">
          <el-input v-model="form.account_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="结算人账户开户号：" prop="account_no">
          <el-input v-model.trim="form.account_no" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="银行卡预留手机号：" prop="account_phone">
          <el-input v-model.trim="form.account_phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="结算账户开户行：" prop="bank_name" style="float:left">
            <el-select v-model="form.bank_name" placeholder="请选择银行" @visible-change="bank" :loading="logining"  style="width:150px;">
              <el-option
                v-for="item in bank_name"
                :label="item.bank_name"
                :value="item.id"
                :key="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="merchant_province1" style="float:left" label-width="10px">
            <el-select v-model="form.merchant_province1" placeholder="请选择省"  @visible-change="province1" @change="province2" style="width:120px;">
              <el-option
                v-for="item in optionsprovince1"
                :label="item.fullname"
                :value="item.sid"
                :key="item.sid">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="merchant_province2" style="float:left" label-width="10px">
            <el-select v-model="form.merchant_province2" placeholder="请选择市" style="width:100px;">
              <el-option
                v-for="item in optionsprovince2"
                :label="item.fullname"
                :value="item.sid"
                :key="item.sid">
              </el-option>
            </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="结算户开户支行：" prop="branch">
          <template>
            <el-select v-model="form.branch" placeholder="请选择" @visible-change="bankBranch" :multiple="false" filterable remote :remote-method="remoteBranch" :loading="loading">
              <el-option
                v-for="item in branchname"
                :key="item.bank_no"
                :label="item.bank_name"
                :value="item.bank_no">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="业务员：" prop="nowrap">
          <template>
            <el-select v-model="form.nowrap" placeholder="请选择" @visible-change="nowrapsubm">
              <el-option
                v-for="item in nowrap"
                :label="item.value"
                :value="item.id"
                :key="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <span class="title_text">商户汇率信息</span>
        <el-form-item label="费率（千分比）：" prop="rate_code">
          <template>
            <el-select v-model="form.rate_code" placeholder="请选择">
              <el-option
                v-for="item in rate_code"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="商户类型：" prop="merchant_type">
          <template>
            <el-radio-group v-model="form.merchant_type">
              <el-radio label="1">普通</el-radio>
              <el-radio label="2">二级</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>


  
  <el-form ref="imageUrl" :model="imageUrl" :rules="rules" label-width="240px" label-position="top" style="padding: 20px 60px;">
    <el-row>
      <el-col :span="5">
        <el-form-item label="负责人身份证正面：" prop="file1" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess1"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file1" :src="imageUrl.file1" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="负责人身份证反面：" prop="file2" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess2"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file2" :src="imageUrl.file2" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="商户门头照片：" prop="file4" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess4"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file4" :src="imageUrl.file4" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="银行卡正面：" prop="file5" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess5"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file5" :src="imageUrl.file5" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="负责人手持身份证：" prop="file3" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess3"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file3" :src="imageUrl.file3" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <el-form-item label="银行卡反面：" prop="file6" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess6"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file6" :src="imageUrl.file6" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="内部前台照片：" prop="file7" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess7"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file7" :src="imageUrl.file7" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="营业执照：" prop="file8" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess8"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file8" :src="imageUrl.file8" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="其他证明材料：" prop="file9" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess9"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file9" :src="imageUrl.file9" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="持证合影：" prop="file10" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess10"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file10" :src="imageUrl.file10" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>




    <el-row>
      <el-col :span="5">
        <el-form-item label="开户许可证照片：" prop="file11" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess11"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file11" :src="imageUrl.file11" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label=" 组织机构代码证照片：" prop="file12" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess12"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file12" :src="imageUrl.file12" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="税务登记证照片：" prop="file13" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess13"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file13" :src="imageUrl.file13" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="入账非法人证明照片 ：" prop="file14" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess14"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file14" :src="imageUrl.file14" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="对私账户身份证正面照片：" prop="file15" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess15"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file15" :src="imageUrl.file15" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <el-form-item label="对私账户身份证反面照片 ：" prop="file16" label-width="160px">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarScucess16"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl.file16" :src="imageUrl.file16" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" size="large" @click.native="addSubmit" :loading="addLoading" style="margin-left:45%;">确认提交</el-button>
  </div>
  </section>
</template>

<script>
import * as util from '../../../util/util.js'
import {
  addAgentMer,
  selectBank,
  addLcShopView,
  showBusinessType,
  getProvince,
  queryCity,
  selectbranch,
  getTokenList,
  selectSaleByName,
  uploadImage
} from '../../../api/agent';
export default {
  data() {
    var merchant_id_no = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入身份证号码'));
      } else if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)) {
        callback(new Error('请输入正确的身份证号码'));
      } else {
        callback();
      }
    };
    var merchant_phone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else if (!/^1(3|4|5|7|8)\d{9,10}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    var account_no = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入开户帐号'));
      } else if (!/^[0-9]*$/.test(value)) {
        callback(new Error('请输入正确的开户帐号'));
      } else {
        callback();
      }
    };
    return {
      uploadUrl: uploadImage,
      logining: false,
      imageUrl: {
        file1: '',
        file2: '',
        file3: '',
        file4: '',
        file5: '',
        file6: '',
        file7: '',
        file8: '',
        file9: '',
        file10: '',
        file11: '',
        file12: '',
        file13: '',
        file14: '',
        file15: '',
        file16: ''
      },
      form: {
        merchant_name: '',//商户名称
        merchant_alias: '',//商户简称
        merchant_company: '',//注册名称
        merchant_province3: '',//所在省市
        merchant_province4: '',//所在省市
        merchant_address: '',//商户地址
        merchant_person: '',//商户联系人
        merchant_phone: '',//联系人电话
        merchant_email: '',//联系人邮箱
        mer_service_phone:'',//客服电话
        business1: '',//行业类目01
        business2: '',//行业类目02
        business3: '',//行业类目03

        settlement_mer_type:'QY',//商户结算入网类型
        licenseno:'',//执照证件号码
        licensen_expire:'',//证件到期日期
        is_liable_account:'1',//是否为法人入账
        account_type: '1',//结算账户类型
        net_network_type:'SZHY',//入网证件类型
        artif_nm: '',//法人姓名
        merchant_id_type: '',//结算人证件类型
        merchant_id_no: '',//结算人证件号码
        merchant_id_expire: '',//结算人证件有效期
        account_name: '',//结算人账户开户名
        account_no: '',//结算人账户开户号
        bank_name: '',//结算账户开户行
        account_phone:'',//银行卡预留手机号
        merchant_province1: '',//结算账户开户行省市01
        merchant_province2: '',//结算账户开户行省市02
        branch: '',//结算户开户支行
        nowrap: '',//业务员
        rate_code: 'M0060',
        merchant_type: '1'
      },
      settlementOptions: [{
        value: 'QY',
        label: '企业'
      }, {
        value: 'GT',
        label: '个体工商户'
      }, {
        value: 'XW',
        label: '小微商户'
      }],
      net_networkOptions: [{
        value: 'SZHY',
        label: '三证合一'
      }, {
        value: 'YYZZ',
        label: '营业执照'
      }],
      merchant_id_type: [{
          value: '0',
          label: '身份证'
        },
        // {value:'1',label:'护照'},
        // {value:'2',label:'军官证'},
        // {value:'3',label:'士兵证'},
        // {value:'4',label:'回乡证'},
        // {value:'5',label:'户口本'},
        // {value:'6',label:'其他'}
      ],
      rate_code: [{
          value: 'M0030',
          label: '3.0'
        },
        {
          value: 'M0031',
          label: '3.1'
        },
        {
          value: 'M0032',
          label: '3.2'
        },
        {
          value: 'M0033',
          label: '3.3'
        },
        {
          value: 'M0034',
          label: '3.4'
        },
        {
          value: 'M0035',
          label: '3.5'
        },
        {
          value: 'M0036',
          label: '3.6'
        },
        {
          value: 'M0037',
          label: '3.7'
        },
        {
          value: 'M0038',
          label: '3.8'
        },
        {
          value: 'M0039',
          label: '3.9'
        },
        {
          value: 'M0040',
          label: '4.0'
        },
        {
          value: 'M0041',
          label: '4.1'
        },
        {
          value: 'M0042',
          label: '4.2'
        },
        {
          value: 'M0043',
          label: '4.3'
        },
        {
          value: 'M0044',
          label: '4.4'
        },
        {
          value: 'M0045',
          label: '4.5'
        },
        {
          value: 'M0046',
          label: '4.6'
        },
        {
          value: 'M0047',
          label: '4.7'
        },
        {
          value: 'M0048',
          label: '4.8'
        },
        {
          value: 'M0049',
          label: '4.9'
        },
        {
          value: 'M0050',
          label: '5.0'
        },
        {
          value: 'M0051',
          label: '5.1'
        },
        {
          value: 'M0052',
          label: '5.2'
        },
        {
          value: 'M0053',
          label: '5.3'
        },
        {
          value: 'M0054',
          label: '5.4'
        },
        {
          value: 'M0055',
          label: '5.5'
        },
        {
          value: 'M0056',
          label: '5.6'
        },
        {
          value: 'M0057',
          label: '5.7'
        },
        {
          value: 'M0058',
          label: '5.8'
        },
        {
          value: 'M0059',
          label: '5.9'
        },
        {
          value: 'M0060',
          label: '6.0'
        },
        {
          value: 'M0070',
          label: '7.0'
        },
        {
          value: 'M0080',
          label: '8.0'
        },
        {
          value: 'M0090',
          label: '9.0'
        },
        {
          value: 'M0100',
          label: '10.0'
        },
        {
          value: 'M0120',
          label: '12.0'
        },
        {
          value: 'M0150',
          label: '15.0'
        },
        {
          value: 'M0500',
          label: '50.0'
        },
      ],
      addLoading: false,
      optionsbuiness1: [],
      optionsbuiness2: [],
      optionsbuiness3: [],
      optionsprovince1: [],//结算账户开户行省市列表
      optionsprovince2: [],//结算账户开户行省市列表
      optionsprovince3: [],
      optionsprovince4: [],
      loading: false,
      bank_name: [],//结算账户开户行列表
      branchname: [],//结算户开户支行列表
      nowrap: [],//业务员列表
      rules: {
        merchant_name: [{
            required: true,
            message: '请输入商户名称',
            trigger: 'blur'
          },
          {
            max: 30,
            message: '请输入正确的商户名称',
            trigger: 'blur'
          }
        ],
        merchant_alias: [{
            required: true,
            message: '请输入商户简称',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '请输入正确的商户简称',
            trigger: 'blur'
          }
        ],
        merchant_company: [{
            required: true,
            message: '请输入营业执照名称',
            trigger: 'blur'
          },
          {
            max: 60,
            message: '请输入正确的营业执照名称',
            trigger: 'blur'
          }
        ],
        merchant_address: [{
            required: true,
            message: '请输入营业执照地址',
            trigger: 'blur'
          },
          {
            max: 60,
            message: '请输入正确的营业执照地址',
            trigger: 'blur'
          }
        ],
        rate_code: [{
          required: true,
          message: '请选择费率',
          trigger: 'change'
        }],
        merchant_person: [{
          required: true,
          message: '请输入负责人姓名',
          trigger: 'blur'
        }],
        merchant_phone: [
          {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
          },
          {
          validator: merchant_phone,
          trigger: 'blur'
          }
        ],
        merchant_email: [{
          type: 'email',
          required: true,
          message: '请输入正确的负责人邮箱',
          trigger: 'blur'
        }],
        merchant_id_type: [{
          required: true,
          message: '请选择证件类型',
          trigger: 'change'
        }],
        artif_nm:[{
          required: true,
          message: '请输入法人姓名',
          trigger: 'blur'
        }],
        merchant_id_expire: [{
          type: 'date',
          required: true,
          message: '请选择证件有效期',
          trigger: 'change'
        }],
        merchant_id_no: [
          {
              required: true,
              message: '请输入正确的证件号码',
              trigger: 'blur'
          },
          {
          validator: merchant_id_no,
          trigger: 'blur'
          }],
        account_name: [{
            required: true,
            message: '请输入开户名',
            trigger: 'blur'
          },
          {
            max: 30,
            message: '请输入正确的开户名',
            trigger: 'blur'
          }
        ],
        account_no: [{
            required: true,
            message: '请输入开户帐号',
            trigger: 'blur'
          },
          {
          validator: account_no,
          trigger: 'blur'
          }
        ],
        business1: [{
          required: true,
          message: '请选择行业类目'
        }],
        business2: [{
          required: true,
          message: '请选择行业类目'
        }],
        business3: [{
          required: true,
          message: '请选择行业类目'
        }],
        bank_name: [{
          required: true,
          message: '请选择开户银行'
        }],
        branch: [{
          required: true,
          message: '请选择开户支行'
        }],
        merchant_province3: [{
          required: true,
          message: '请选择商户所在省'
        }],
        merchant_province4: [{
          required: true,
          message: '请选择商户所在市'
        }],
        merchant_province1: [{
          required: true,
          message: '请选择开户银行所在省'
        }],
        merchant_province2: [{
          required: true,
          message: '请选择开户银行所在市'
        }],
        nowrap: [{
          required: true,
          message: '请选择业务员'
        }],
        file1: [{
          required: true,
        }],
        file2: [{
          required: true
        }],
        file4: [{
          required: true
        }],
        file5: [{
          required: true
        }],
      },
    }
  },
  computed: {
    settlement_mer_type() {
  　　return this.form.settlement_mer_type
  　},
    account_type() {
      return this.form.account_type
    }
  },
  watch: {
    settlement_mer_type(curVal,oldVal) {
      if(curVal !== 'QY' && this.form.account_type == '2'){
        this.form.net_network_type = 'SZHY'
      }
      if(curVal == 'XW'){
        this.form.account_type = '2'
      }
    },
    account_type(curVal,oldVal) {
      if (curVal == '2' && this.form.settlement_mer_type !== 'QY') {
        this.form.net_network_type = 'SZHY'
      }
    }
  },
  methods: {
    //支行远程搜索
    remoteBranch(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          let para = {
            bank_city_code: this.form.merchant_province2,
            id: this.form.bank_name,
            bank_name: query
          }
          selectbranch(para).then((res) => {
            this.branchname = res.data.bankList
          })
        }, 200);
      } else {
        this.optionsMers = [];
      }
    },
    //行业类目1
    testSalenew1: function() {
      addLcShopView().then((res) => {
        this.optionsbuiness1 = res.data.TypeList
      })
    },
    //行业类目2
    testSalenew2: function() {
      this.form.business2=null;
      let para = {
        id: this.form.business1
      }
      showBusinessType(para).then((res) => {
        this.optionsbuiness2 = res.data.BusinessList
      })
    },
    //行业类目3
    testSalenew3: function() {
      this.form.business3=null;
      let para = {
        id: this.form.business2
      }
      showBusinessType(para).then((res) => {
        this.optionsbuiness3 = res.data.BusinessList
      })
    },
    //开户银行
    bank: function() {
      this.logining = true
      selectBank().then((res) => {
        this.logining = false,
          this.bank_name = res.data.bankList
      })
    },
    //开户银行省市
    province1: function() {
      getProvince().then((res) => {
        this.optionsprovince1 = res.data.provinceList
      })
    },
    province2: function() {
      this.form.merchant_province2=null
      let para = {
        id: this.form.merchant_province1
      }
      queryCity(para).then((res) => {
        this.optionsprovince2 = res.data.provinceList
      })
    },
    //商户所在省市
    province3: function() {
      getProvince().then((res) => {
        this.optionsprovince3 = res.data.provinceList
      })
    },
    provInce: function() {
      this.form.merchant_province4=null;
      let para = {
        id: this.form.merchant_province3
      }
      queryCity(para).then((res) => {
        this.optionsprovince4 = res.data.provinceList
      })
    },
    //开户银行支行
    bankBranch: function() {
      let para = {
        bank_city_code: this.form.merchant_province2,
        id: this.form.bank_name,
      }
      selectbranch(para).then((res) => {
        this.branchname = res.data.bankList
      })

    },
    addSubmit: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let para = {
            merchant_name: this.form.merchant_name,//商户名称
            merchant_alias: this.form.merchant_alias,//商户简称
            merchant_company: this.form.merchant_company,//注册名称
            merchant_province: this.form.merchant_province3,//所在省市
            merchant_city: this.form.merchant_province4,//所在省市
            merchant_address: this.form.merchant_address,//商户地址
            merchant_person: this.form.merchant_person,//商户联系人
            merchant_phone: this.form.merchant_phone,//联系人电话
            merchant_email: this.form.merchant_email,//联系人邮箱
            mer_service_phone:this.form.mer_service_phone,
            business_id: this.form.business3,//行业类目03

            // 商户结算信息
            settlement_mer_type:this.form.settlement_mer_type,
            licenseno:this.form.licenseno,
            licensen_expire:this.form.licensen_expire,
            is_liable_account:this.form.is_liable_account,
            account_phone:this.form.account_phone,


            account_type: this.form.account_type,//结算账户类型
            artif_nm: this.form.artif_nm,//法人姓名
            merchant_id_type: this.form.merchant_id_type,//结算人证件类型
            merchant_id_no: this.form.merchant_id_no,//结算人证件号码
            merchant_id_expire: this.form.merchant_id_expire,//结算人证件有效期
            account_name: this.form.account_name,//结算人账户开户名
            account_no: this.form.account_no,//结算人账户开户号
            bank_no: this.form.branch,//结算户开户支行
            id: this.form.nowrap,//业务员
            rate_code: this.form.rate_code,
            merchant_type: this.form.merchant_type,


            file1: this.imageUrl.file1,
            file2: this.imageUrl.file2,
            file3: this.imageUrl.file3,
            file4: this.imageUrl.file4,
            file5: this.imageUrl.file5,
            file6: this.imageUrl.file6,
            file7: this.imageUrl.file7,
            file8: this.imageUrl.file8,
            file9: this.imageUrl.file9,
            file10: this.imageUrl.file10,

            img_open_permits:this.imageUrl.file11,
            img_org_code:this.imageUrl.file12,
            img_tax_reg:this.imageUrl.file13,
            img_unincorporated:this.imageUrl.file14,
            img_private_idcard_a:this.imageUrl.file15,
            img_private_idcard_b:this.imageUrl.file16,

          }
          para.merchant_id_expire = (!para.merchant_id_expire || para.merchant_id_expire == '') ? '' : util.formatDate.format(new Date(para.merchant_id_expire), 'yyyyMMdd'); //开始时间
          para.licensen_expire = (!para.licensen_expire || para.licensen_expire == '') ? '' : util.formatDate.format(new Date(para.licensen_expire), 'yyyyMMdd'); //开始时间
          if (!this.imageUrl.file1) {
            this.$notify.error({
              title: '错误',
              message: '请上传负责人身份证正面照片'
            });
            return
          }else if (!this.imageUrl.file2) {
            this.$notify.error({
              title: '错误',
              message: '请上传负责人身份证反面照片'
            });
            return
          }else if (!this.imageUrl.file4) {
            this.$notify.error({
              title: '错误',
              message: '请上传商户门头照片'
            });
            return
          }else if (!this.imageUrl.file5) {
            this.$notify.error({
              title: '错误',
              message: '请上传银行卡正面'
            });
            return
          }
          addAgentMer(para).then((res) => {
            let {
              status,
              message
            } = res
            if (status == 200) {
              this.$router.push({
                path: '/index2/page4'
              });
              this.$notify({
                title: '添加成功',
                message: message,
                type: 'success'
              });
            } else {
              this.$notify.error({
                title: '添加失败',
                message: message
              });
            }
          })
        } else {
          return false;
        }
      });

    },
    //图片上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!');
      }
      return isJPG && isLt2M;
    },
    handleAvatarScucess1(res, file) {
      this.imageUrl.file1 = res.data.locationPath
    },
    handleAvatarScucess2(res, file) {
      this.imageUrl.file2 = res.data.locationPath
    },
    handleAvatarScucess3(res, file) {
      this.imageUrl.file3 = res.data.locationPath
    },
    handleAvatarScucess4(res, file) {
      this.imageUrl.file4 = res.data.locationPath
    },
    handleAvatarScucess5(res, file) {
      this.imageUrl.file5 = res.data.locationPath
    },
    handleAvatarScucess6(res, file) {
      this.imageUrl.file6 = res.data.locationPath
    },
    handleAvatarScucess7(res, file) {
      this.imageUrl.file7 = res.data.locationPath
    },
    handleAvatarScucess8(res, file) {
      this.imageUrl.file8 = res.data.locationPath
    },
    handleAvatarScucess9(res, file) {
      this.imageUrl.file9 = res.data.locationPath
    },
    handleAvatarScucess10(res, file) {
      this.imageUrl.file10 = res.data.locationPath
    },

    handleAvatarScucess11(res, file) {
      this.imageUrl.file11 = res.data.locationPath
    },
    handleAvatarScucess12(res, file) {
      this.imageUrl.file12 = res.data.locationPath
    },
    handleAvatarScucess13(res, file) {
      this.imageUrl.file13 = res.data.locationPath
    },
    handleAvatarScucess14(res, file) {
      this.imageUrl.file14 = res.data.locationPath
    },
    handleAvatarScucess15(res, file) {
      this.imageUrl.file15 = res.data.locationPath
    },
    handleAvatarScucess16(res, file) {
      this.imageUrl.file16 = res.data.locationPath
    },
    nowrapsubm: function() {
      selectSaleByName().then((res) => {
        this.nowrap = res.data.salesmanList
      })
    }
  }
}
</script>

<style lang="css">
  .title_text{
    display: block;
    color: #8492a6;
    font-size: 18px;
    margin-bottom: 25px;
    line-height: 45px;
    border-bottom: 1px solid #DCDFE6;
  }
  .avatar{
    width: 100px;
    height: 100px;
  }
  .el-icon-plus{
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    
  }
</style>
