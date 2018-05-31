<template>
<section>
  <!--工具条-->
  <el-form :inline="true" :model="whole">
    <el-row>
      <el-tag type="primary" style="margin:0 10px 20px 0;">商户总数：{{whole.sum}}</el-tag>
    </el-row>
  </el-form>
  <el-form :inline="true" :model="filters" ref="filters" size="medium">
    <el-row>
      <el-form-item>
        <el-input v-model="filters.mname" placeholder="商户名称" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
        <el-button type="primary" @click="getShop" size="medium" round>新增商户</el-button>
      </el-form-item>
    </el-row>
  </el-form>
  <!--列表-->
  <div v-loading="listLoading">
    <el-table :data="users" border highlight-current-row style="width: 100%;">
      <el-table-column prop="merchant_alias" label="商户简称" min-width="100">
      </el-table-column>
      <el-table-column prop="business_name" label="行业类目" min-width="120">
      </el-table-column>
      <el-table-column prop="merchant_person" label="负责人">
      </el-table-column>
      <el-table-column prop="merchant_phone" label="负责人电话" min-width="120">
      </el-table-column>
      <el-table-column prop="merchant_status" label="审核状态" min-width="100" :formatter="merchant_status">
      </el-table-column>
      <el-table-column prop="error_msg" label="返回信息" min-width="100">
      </el-table-column>
      <!-- <el-table-column label="操作" width="150">
        <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleModify(scope.$index, scope.row)">修改</el-button>
            <el-button type="info" size="mini" @click="handleDetails(scope.$index, scope.row)">详情</el-button>
          </template>
      </el-table-column> -->
    </el-table>
  </div>
  <!--工具条-->
  <el-row class="toolbar">
    <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
  <!--修改界面-->
  <el-dialog title="修改信息" :visible.sync="modFormVisible" :close-on-click-modal="false">
    <el-form :model="modForm" label-width="140px" :rules="modFormRules" ref="modForm" label-position="left">
      <el-row>
        <el-col :span="22">
          <el-form-item label="商户全称：" prop="merchant_name">
            <el-input v-model="modForm.merchant_name" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="商户简称：" prop="merchant_alias">
            <el-input v-model="modForm.merchant_alias" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="营业执照名称：" prop="merchant_company">
            <el-input v-model="modForm.merchant_company"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="营业执照地址：" prop="merchant_address">
            <el-input v-model="modForm.merchant_address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="商户费率（千分比）：" prop="rate_code">
            <template>
		            <el-select v-model="modForm.rate_code" placeholder="请选择">
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
        <el-col :span="22">
          <el-form-item label="商户所在省市：" prop="merchant_province">
            <el-select v-model="modForm.merchant_province" placeholder="请选择">
              <el-option v-for="item in optionsprovince" :label="item.fullname" :value="item.sid" :key="item.sid">
              </el-option>
            </el-select>
            <el-select v-model="modForm.merchant_city" placeholder="请选择" @visible-change="province4" style="width:160px;">
              <el-option v-for="item in optionscity" :label="item.fullname" :value="item.sid" :key="item.sid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="负责人：" prop="merchant_person">
            <el-input v-model="modForm.merchant_person"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="证件类型：" prop="merchant_id_type">
            <template>
		            <el-select v-model="modForm.merchant_id_type" placeholder="请选择">
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
        <el-col :span="22">
          <el-form-item label="负责电话：" prop="merchant_phone">
            <el-input v-model="modForm.merchant_phone" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="负责邮箱：" prop="merchant_email">
            <el-input v-model="modForm.merchant_email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="负责身份证号：" prop="merchant_id_no">
            <el-input v-model="modForm.merchant_id_no"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="身份证有效期：" prop="merchant_id_expire">
            <template>
							    <el-date-picker
										format="yyyy-MM-dd"
                    :editable="false"
                    :clearable="false"
							      v-model="modForm.merchant_id_expire"
							      type="date"
							      placeholder="选择日期">
							    </el-date-picker>
							</template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="行业类目名称：">
            <span>{{modForm.business_name}}</span>
            <el-button type="primary" icon="edit" size="small" @click="show = !show">修改</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-collapse-transition>
            <div v-show="show">
              <el-form-item>
                <el-select v-model="modForm.business1" placeholder="请选择" @visible-change="testSalenew3" style="width:100px;">
                  <el-option v-for="item in optionsbuiness1" :label="item.name" :value="item.id" :key="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="modForm.business2" placeholder="请选择" @visible-change="testSalenew1" style="width:120px;">
                  <el-option v-for="item in optionsbuiness2" :label="item.name" :value="item.id" :key="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="modForm.business_name1" placeholder="请选择" @visible-change="testSalenew2" style="width:150px;">
                  <el-option v-for="item in optionsbuiness3" :label="item.name" :value="item.id" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-collapse-transition>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="账户类型：" prop="account_type">
            <template>
								<el-radio-group v-model="modForm.account_type" @change="merchantAccount_type">
									<el-radio label="1">对公</el-radio>
									<el-radio label="2">对私</el-radio>
								</el-radio-group>
		          </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="法人姓名：" prop="artif_nm">
            <el-input v-model="modForm.artif_nm" auto-complete="off" :disabled="artif_nm"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="开户名：" prop="account_name">
            <el-input v-model="modForm.account_name" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="开户帐号：" prop="account_no">
            <el-input v-model="modForm.account_no"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-collapse-transition>
            <div v-show="showBank">
              <el-form-item>
                <template>
    		            <el-select v-model="modForm.bankname" filterable placeholder="请选择开户银行" @visible-change="bank">
    		              <el-option
    		                v-for="item in bankname"
    		                :label="item.bank_name"
    		                :value="item.id"
                        :key="item.id">
    		              </el-option>
    		            </el-select>
                    <el-select v-model="modForm.merchant_province1" placeholder="请选择省" @visible-change="province1">
                      <el-option v-for="item in optionsprovince1" :label="item.fullname" :value="item.sid" :key="item.id">
                      </el-option>
                    </el-select>
                    <el-select v-model="modForm.merchant_province2" placeholder="请选择市" @visible-change="province2">
                      <el-option v-for="item in optionsprovince2" :label="item.fullname" :value="item.sid" :key="item.sid">
                      </el-option>
                    </el-select>
    		          </template>
              </el-form-item>
            </div>
          </el-collapse-transition>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="开户银行支行：" prop="bank_name">
            <template>
		            <el-select v-model="modForm.value8" placeholder="请选择" @visible-change="bankBranch"  :multiple="false" filterable remote :remote-method="remoteBranch" :loading="loading">
		              <el-option
									v-for="item in querySource"
									:label="item.bank_name"
									:value="item.bank_no"
                  :key="item.bank_no">
		              </el-option>
		            </el-select>
                <el-button type="primary" icon="edit" size="small" @click="showBank = !showBank">修改</el-button>
		          </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form ref="imageUrl" :model="imageUrl" label-width="240px" label-position="top">
      <el-row>
        <el-col :span="5">
          <el-form-item label="身份证正面：" prop="img_idcard_a" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess1" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_idcard_a" :src="imageUrl.img_idcard_a" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="身份证反面：" prop="img_idcard_b" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess2" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_idcard_b" :src="imageUrl.img_idcard_b" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="商户门头照片：" prop="img_logo" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess4" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_logo" :src="imageUrl.img_logo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="银行卡正面：" prop="img_indoor" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess5" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_indoor" :src="imageUrl.img_indoor" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="负责人手持身份证：" prop="img_bankcard_a" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess3" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_bankcard_a" :src="imageUrl.img_bankcard_a" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="银行卡反面：" prop="img_contract" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess6" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_contract" :src="imageUrl.img_contract" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="内部前台照片：" prop="img_license" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess7" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_license" :src="imageUrl.img_license" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="营业执照：" prop="img_bankcard_b" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess8" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_bankcard_b" :src="imageUrl.img_bankcard_b" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="其他证明材料：" prop="img_other" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess9" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_other" :src="imageUrl.img_other" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="持证合影：" prop="img_idcard_holding" label-width="160px">
            <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarScucess10" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl.img_idcard_holding" :src="imageUrl.img_idcard_holding" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="modFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="modLoading">提交</el-button>
    </div>
  </el-dialog>
  <!--详情界面-->
  <el-dialog title="商户资料详情" :visible.sync="detailsFormVisible" :close-on-click-modal="false">
    <el-form :model="detailsForm" label-width="160px" label-position="left" ref="detailsForm" style="padding:0 0 20px 100px">
      <el-col :span="18">
        <el-form-item label="商户名称 ：">
          <span>{{detailsForm.merchant_name}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="商户简称 ：">
          <span>{{detailsForm.merchant_alias}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="商户营业执照名称 ：">
          <span>{{detailsForm.merchant_company}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="商户营业执照地址：">
          <span>{{detailsForm.merchant_address}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="商户费率(千分比):">
          <span>{{detailsForm.rate_code}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="负责人：">
          <span>{{detailsForm.merchant_person}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="负责电话：">
          <span>{{detailsForm.merchant_phone}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="负责邮箱：">
          <span>{{detailsForm.merchant_email}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="负责身份证号：">
          <span>{{detailsForm.merchant_id_no}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="身份证有效期：">
          <span>{{detailsForm.merchant_id_expire}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="行业类目名称：">
          <span>{{detailsForm.business_name}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="账户类型：">
          <span>{{detailsForm.account_type=="1"?"对公":detailsForm.account_type=="2"?"对私":"未知"}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="法人姓名：">
          <span>{{detailsForm.artif_nm}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="开户名：">
          <span>{{detailsForm.account_name}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="开户账号：">
          <span>{{detailsForm.account_no}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="开户行：">
          <span>{{detailsForm.bank_name}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="所在省市 ：">
          <span>{{detailsForm.merchant_province}} {{detailsForm.merchant_city}}</span>
        </el-form-item>
      </el-col>
    </el-form>
    <el-form :model="detailsForm" ref="detailsForm" label-position="top">
      <el-col :span="6">
        <el-form-item label="负责人身份证正面：">
          <img :src="detailsForm.img_idcard_a" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="负责人身份证反面：">
          <img :src="detailsForm.img_idcard_b" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="银行卡正面：">
          <img :src="detailsForm.img_indoor" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="商户门头照片：">
          <img :src="detailsForm.img_logo" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="内部前台照片：">
          <img :src="detailsForm.img_license" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="营业执照：">
          <img :src="detailsForm.img_bankcard_b" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="持证合影：">
          <img :src="detailsForm.img_idcard_holding" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="银行卡反面：">
          <img :src="detailsForm.img_contract" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="负责人手持身份证：">
          <img :src="detailsForm.img_bankcard_a" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="其他证明材料：">
          <img :src="detailsForm.img_other" alt="" width="120px;" height="120px">
        </el-form-item>
      </el-col>
    </el-form>
  </el-dialog>

</section>
</template>

<script>
import * as util from '../../../assets/util.js'
import {
  agentMerEnter,
  addAgentMer,
  addLcShopView,
  showBusinessType,
  getProvince,
  queryCity,
  selectBank,
  selectbranch,
  updateAgentMer,
  updateAgentMerView,
  queryAgentLc,
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
      uploadImage: uploadImage,
      whole: {
        sum: ''
      },
      show: false,
      showBank: false,
      artif_nm: '',
      //商户名
      filters: {
        parag: '',
      },
      imageUrl: {

      },
      options: [],
      total: 0,
      page: 1,
      users: [],
      listLoading: false,
      detailsForm: false,
      detailsFormVisible: false,
      detailsForm: {},
      modLoading: false,
      modFormVisible: false,
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
      optionsbuiness1: [],
      optionsbuiness2: [],
      optionsbuiness3: [],
      optionsprovince1: [],
      optionsprovince2: [],
      optionsprovince: [],
      optionsprovince3: [],
      optionscity: [],
      optionscity3: [],
      nowrap: [],
      bankname: [],
      loading: false,
      value8: '',
      querySource: [],
      source: [],
      modForm: {
        merchant_name: '',
        merchant_alias: '',
        merchant_company: '',
        merchant_address: '',
        rate_code: 'M0060',
        merchant_person: '',
        merchant_phone: '',
        merchant_email: '',
        merchant_id_type: '',
        merchant_id_expire: '',
        merchant_id_no: '',
        account_type: '2',
        merchant_type: '1',
        account_name: '',
        account_no: '',
        account_phone: '',
        business1: '',
        business2: '',
        business_name1: '',
        bank_namess: '',
        branch: '',
        merchant_province1: '',
        merchant_province2: '',
        merchant_province: '',
        merchant_city: '',
        parent_no: '',
        branch: '',
        artif_nm: ''

      },
      modFormRules: {
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
        merchant_phone: [{
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
        merchant_id_expire: [{
          type: 'date',
          required: true,
          message: '请选择证件有效期',
          trigger: 'change'
        }],
        merchant_id_no: [{
            required: true,
            message: '请输入正确的证件号码',
            trigger: 'blur'
          },
          {
            validator: merchant_id_no,
            trigger: 'blur'
          }
        ],
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
        parent_no: [{
          required: false,
          message: '请选择富有大商户号'
        }],
        nowrap: [{
          required: true,
          message: '请选择业务员'
        }],
        img_idcard_a: [{
          required: true,
        }],
        img_idcard_b: [{
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
  methods: {
    //支行远程搜索
    remoteBranch(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          let para = {
            bank_city_code: this.modForm.merchant_province2,
            id: this.modForm.bankname,
            bank_name: query
          }
          selectbranch(para).then((res) => {
            this.querySource = res.data.bankList
          })
        }, 200);
      } else {
        this.optionsMers = [];
      }
    },
    //新增商户
    getShop: function() {
      this.$router.push('/index2/page6');
    },
    //状态转换
    merchant_status: function(row, column) {
      return row.merchant_status == "01" ? "审核通过" : row.merchant_status == "02" ? "审核驳回" : row.merchant_status == "03" ? "审核中" : ""
    },
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
        pageNum: this.page,
        merchant_alias: this.filters.mname
      };
      this.listLoading = true;
      agentMerEnter(para).then((res) => {
        let {
          data,
          message,
          status
        } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.filters.time1 = res.data.returnST;
          this.users = res.data.shopList;
          this.whole.sum = res.data.totalCount
        }
        this.listLoading = false;
      });
    },
    //显示修改界面
    handleModify: function(index, row) {
      this.modFormVisible = true;
      this.modForm = Object.assign({}, row);
      this.imageUrl = Object.assign({}, row);
      if (row.account_type == 2) {
        this.artif_nm = true
      } else {
        this.artif_nm = false
      }
      var Times1 = row.merchant_id_expire.slice(0, 4);
      var Times2 = row.merchant_id_expire.slice(4, 6);
      var Times3 = row.merchant_id_expire.slice(6, 8);
      var date = new Date(Date.parse(Times1 + "/" + Times2 + "/" + Times3));
      this.modForm.merchant_id_expire = date;
      //商户省市
      getProvince().then((res) => {
        this.optionsprovince = res.data.provinceList;
      })
      this.optionsprovince = this.optionsprovince3.filter(() => {
        return true
      })
      this.modForm.merchant_province = parseInt(row.merchant_province_code);
      let para = {
        id: this.modForm.merchant_province
      }
      queryCity(para).then((res) => {
        this.optionscity = res.data.provinceList
      })
      this.optionscity = this.optionscity3.filter(() => {
        return true
      })
      this.modForm.merchant_city = parseInt(row.merchant_city_code)
      this.source = new Array({
        bank_no: row.bank_no,
        bank_name: row.bank_name
      })
      this.querySource = this.source.filter(() => {
        return true
      })
      this.modForm.value8 = row.bank_no;

    },
    //显示行业类目
    testSalenew3: function() {
      addLcShopView().then((res) => {
        this.optionsbuiness1 = res.data.TypeList
      })
    },
    testSalenew1: function() {
      let para = {
        id: this.modForm.business1
      }
      showBusinessType(para).then((res) => {
        this.optionsbuiness2 = res.data.BusinessList
      })
    },
    testSalenew2: function() {
      let para = {
        id: this.modForm.business2
      }
      showBusinessType(para).then((res) => {
        this.optionsbuiness3 = res.data.BusinessList
      })
    },
    province4: function() {
      let para = {
        id: this.modForm.merchant_province
      }
      queryCity(para).then((res) => {
        this.optionscity = res.data.provinceList
      })
    },
    //开户银行
    bank: function() {
      selectBank().then((res) => {
        this.bankname = res.data.bankList
      })
    },
    //显示银行省市
    province1: function() {
      getProvince().then((res) => {
        this.optionsprovince1 = res.data.provinceList
      })
    },
    province2: function() {
      let para = {
        id: this.modForm.merchant_province1
      }
      queryCity(para).then((res) => {
        this.optionsprovince2 = res.data.provinceList
      })
    },
    //显示开户银行支行
    bankBranch: function() {
      let para = {
        bank_city_code: this.modForm.merchant_province2,
        id: this.modForm.bankname,
      }
      selectbranch(para).then((res) => {
        this.querySource = res.data.bankList
      })
    },
    //账户类型
    merchantAccount_type: function() {
      if (this.modForm.account_type == 1) {
        this.artif_nm = false
      } else {
        this.artif_nm = true
      }
    },
    //显示详情界面
    handleDetails: function(index, row) {
      this.detailsFormVisible = true;
      let para = {
        id: row.id
      }
      queryAgentLc(para).then((res) => {
        this.detailsForm = res.data.shop;
        this.detailsForm.rate_code = res.data.rate_code;
      })

    },
    editSubmit: function() {
      this.modForm.merchant_id_expire = util.formatDate.format(new Date(this.modForm.merchant_id_expire), 'yyyyMMdd');
      let para = {
        lcshopId: this.modForm.id,
        merchant_name: this.modForm.merchant_name,
        merchant_alias: this.modForm.merchant_alias,
        merchant_company: this.modForm.merchant_company,
        merchant_address: this.modForm.merchant_address,
        rate_code: this.modForm.rate_code,
        merchant_person: this.modForm.merchant_person,
        merchant_phone: this.modForm.merchant_phone,
        merchant_email: this.modForm.merchant_email,
        merchant_id_type: this.modForm.merchant_id_type,
        merchant_id_no: this.modForm.merchant_id_no,
        merchant_id_expire: this.modForm.merchant_id_expire,
        account_type: this.modForm.account_type,
        merchant_type: this.modForm.merchant_type,
        account_name: this.modForm.account_name,
        account_no: this.modForm.account_no,
        account_phone: '',
        business_id: this.modForm.business_name1,
        merchant_province: this.modForm.merchant_province,
        merchant_city: this.modForm.merchant_city,
        bank_no: this.modForm.value8,
        parent_no: this.modForm.parent_no,
        id: this.modForm.nowrap,
        artif_nm: this.modForm.artif_nm,
        file1: this.imageUrl.img_idcard_a,
        file2: this.imageUrl.img_idcard_b,
        file3: this.imageUrl.img_bankcard_a,
        file4: this.imageUrl.img_logo,
        file5: this.imageUrl.img_indoor,
        file6: this.imageUrl.img_contract,
        file7: this.imageUrl.img_license,
        file8: this.imageUrl.img_bankcard_b,
        file9: this.imageUrl.img_other,
        file10: this.imageUrl.img_idcard_holding,
      }
      updateAgentMer(para).then((res) => {
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.getUsers();
          this.modFormVisible = false;
          this.$notify({
            title: '成功',
            message: message,
            type: 'success'
          });
        }
      })
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
      this.imageUrl.img_idcard_a = res.data.locationPath
    },
    handleAvatarScucess2(res, file) {
      this.imageUrl.img_idcard_b = res.data.locationPath
    },
    handleAvatarScucess3(res, file) {
      this.imageUrl.img_bankcard_a = res.data.locationPath
    },
    handleAvatarScucess4(res, file) {
      this.imageUrl.img_logo = res.data.locationPath
    },
    handleAvatarScucess5(res, file) {
      this.imageUrl.img_indoor = res.data.locationPath
    },
    handleAvatarScucess6(res, file) {
      this.imageUrl.img_contract = res.data.locationPath
    },
    handleAvatarScucess7(res, file) {
      this.imageUrl.img_license = res.data.locationPath
    },
    handleAvatarScucess8(res, file) {
      this.imageUrl.img_bankcard_b = res.data.locationPath
    },
    handleAvatarScucess9(res, file) {
      this.imageUrl.img_other = res.data.locationPath
    },
    handleAvatarScucess10(res, file) {
      this.imageUrl.img_idcard_holding = res.data.locationPath
    },

  },

  mounted() {
    this.getUsers();
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
