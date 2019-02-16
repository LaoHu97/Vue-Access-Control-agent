<style scoped>
.form_header {
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
}
.form_main{
  background-color: #fff;
  margin-top: 20px;
  border-radius: 8px;
}
.form_contron{
  width: 600px;
  margin: 0 auto;
  padding: 20px 0;
}
.form_footer{
  text-align: center;
  padding-bottom: 20px;
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
    <el-steps class="form_header" align-center :active="1" finish-status="success">
      <el-step title="填写商户基本资料"></el-step>
      <el-step title="填写商户结算信息"></el-step>
      <el-step title="上传商户资质和费率"></el-step>
    </el-steps>
    <el-row  class="box-alert">
      <el-col :span="20">
        <div>
          <el-alert :closable="false" title="审核驳回原因：" v-if="form.merchant_status === '2'" :description="form.error_msg || '暂无驳回原因，请联系运营人员'" type="error" show-icon>
          </el-alert>
        </div>
      </el-col>
      <el-col :span="form.merchant_status === '2' ? 4 : 24">
        <el-button type="primary" class="editBtn" v-if="formDisabled" round @click="formDisabled = !formDisabled">修改</el-button>
      </el-col>
    </el-row>
    <div class="form_main">
      <el-form ref="form" :model="form" :disabled="formDisabled" :rules="rules" label-width="150px" label-position="left" class="form_contron">
        <el-row>
          <el-col>
            <el-form-item label="业务员：" prop="salesman_id">
              <template>
                <el-select v-model="form.salesman_id" :disabled="editDisabled" placeholder="请输入关键字查询" :multiple="false" filterable remote :remote-method="remoteSale" :loading="saleLoading" clearable @visible-change="clickSale">
                  <el-option v-for="item in optionsSale" :key="item.id" :value="item.id" :label="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="商户结算入网类型" prop="settlement_mer_type">
              <template>
                <el-select v-model="form.settlement_mer_type" :disabled="editDisabled" placeholder="请选择">
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
              <el-input v-model.trim="form.licenseno" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" v-if="form.settlement_mer_type!=='XW'">
            <el-form-item label="证件到期日期：" prop="licensen_expire">
              <el-date-picker
                v-model="form.licensen_expire"
                :picker-options="pickerOptions"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.settlement_mer_type!=='XW'">
            <el-form-item label-width="0">
              <el-checkbox @change="licensen_expire_long_change" v-model="form.licensen_expire_long">长期有效</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="结算账户类型：" prop="account_type">
              <template>
                <el-radio-group v-model="form.account_type" :disabled="form.settlement_mer_type=='XW' || editDisabled">
                  <el-radio label="1">对公</el-radio>
                  <el-radio label="2">对私</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="form.settlement_mer_type!=='XW'">
            <el-form-item label="入网证件类型：" prop="document_type">
              <template>
                <el-select v-model="form.document_type" :disabled="form.settlement_mer_type === 'GT'" placeholder="请选择">
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
            <el-form-item label="是否法人入账：" prop="is_liable_account">
              <template>
                <el-radio-group v-model="form.is_liable_account" :disabled="editDisabled">
                  <el-radio label="1">法人入账</el-radio>
                  <el-radio label="2">非法人入账</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="form.account_type == '1' || form.is_liable_account == '2'">
          <el-col>
            <el-form-item label="法人姓名：" prop="legal_name">
              <el-input v-model.trim="form.legal_name" :disabled="editDisabled" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="form.account_type == '1' || form.is_liable_account == '2'">
          <el-col>
            <el-form-item label="证件类型：" prop="merchant_id_type">
              <el-select
                v-model="form.merchant_id_type"
                placeholder="请输入证件类型关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteMerchantType"
                :loading="MerchantTypeLoading"
                clearable
                @focus="clickMerchantType"
              >
                <el-option
                  v-for="item in optionsMerchantType"
                  :key="item.id"
                  :value="item.code"
                  :label="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="form.account_type == '1' || form.is_liable_account == '2'">
          <el-col>
            <el-form-item label="法人证件号码" prop="merchant_id_no">
              <el-input v-model.trim="form.merchant_id_no" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="form.account_type == '1' || form.is_liable_account == '2'">
          <el-col :span="16">
            <el-form-item label="法人证件有效期" prop="merchant_id_expire">
                <el-date-picker
                  v-model="form.merchant_id_expire"
                  :picker-options="pickerOptions"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0">
              <el-checkbox @change="merchant_id_expire_long_change" v-model="form.merchant_id_expire_long">长期有效</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="form.account_type == '1' || form.is_liable_account == '2'">
          <el-col>
            <el-form-item label="法人手机号：" prop="legal_phone">
              <el-input v-model.trim="form.legal_phone" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="form.account_type == '2'">
          <el-col>
            <el-form-item label="结算人身份证号" prop="settle_id_no">
              <el-input v-model.trim="form.settle_id_no" :disabled="editDisabled" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.account_type == '2'">
          <el-col :span="16">
            <el-form-item label="结算人身份证有效期" prop="settle_id_expire">
                <el-date-picker
                  v-model="form.settle_id_expire"
                  :picker-options="pickerOptions"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0">
              <el-checkbox @change="settle_id_expire_long_change" v-model="form.settle_id_expire_long">长期有效</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="结算人账户开户名：" prop="account_name">
              <el-input v-model.trim="form.account_name" :disabled="editDisabled" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="结算人账户开户号：" prop="account_no">
              <el-input v-model.trim="form.account_no" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="银行卡预留手机号：" prop="account_phone">
              <el-input v-model.trim="form.account_phone" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="结算账户开户行：" prop="bank_zname_no" style="float:left">
                <el-select v-model="form.bank_zname_no" placeholder="请选择银行" @visible-change="bank" @change="bankChange01" :loading="loading"  style="width:150px;">
                  <el-option
                    v-for="item in bankNameList"
                    :label="item.bank_name"
                    :value="item.id"
                    :key="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="bank_addres_pro_no" style="float:left" label-width="10px">
                <el-select v-model="form.bank_addres_pro_no" placeholder="请选择省"  @visible-change="province1" @change="bankChange02" style="width:120px;">
                  <el-option
                    v-for="item in optionsprovince1"
                    :label="item.fullname"
                    :value="item.sid"
                    :key="item.sid">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="bank_addres_city_no" style="float:left" label-width="10px">
                <el-select v-model="form.bank_addres_city_no" placeholder="请选择市" @visible-change="province2" @change="bankChange03" style="width:100px;">
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
            <el-form-item label="结算户开户支行：" prop="bank_no">
              <template>
                <el-select v-model="form.bank_no" placeholder="请输入关键字查询" @visible-change="bankBranch" :multiple="false" filterable remote :remote-method="remoteBranch" :loading="loading">
                  <el-option
                    v-for="item in branchNameList"
                    :key="item.bank_no"
                    :label="item.bank_name"
                    :value="item.bank_no">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.document_type !== 'SZHY'">
          <el-col>
            <el-form-item label="组织机构代码号：" prop="orgcod">
              <el-input v-model.trim="form.orgcod" placeholder="请输入组织机构代码号" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.document_type !== 'SZHY'">
          <el-col>
            <el-form-item label="税务登记号：" prop="taxcod">
              <el-input v-model.trim="form.taxcod" placeholder="请输入税务登记号" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="控制人姓名：" prop="contro_name">
              <el-input v-model.trim="form.contro_name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="控制人证件类型：" prop="contro_id_type">
              <el-select
                v-model="form.contro_id_type"
                placeholder="请输入证件类型关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteMerchantType"
                :loading="MerchantTypeLoading"
                clearable
                @focus="clickMerchantType"
              >
                <el-option
                  v-for="item in optionsMerchantType"
                  :key="item.id"
                  :value="item.code"
                  :label="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="控制人证件号：" prop="contro_id_no">
              <el-input v-model.trim="form.contro_id_no" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="控制人证件有效期" prop="contro_id_expire">
                <el-date-picker
                  v-model="form.contro_id_expire"
                  :picker-options="pickerOptions"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0">
              <el-checkbox @change="contro_id_expire_long_change" v-model="form.contro_id_expire_long">长期有效</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="form_footer">
        <el-button size="large" @click.native="retstSubmit">返 回</el-button>
        <el-button type="primary" size="large" @click.native="addSubmit" :loading="addLoading">下一步</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import * as util from '../../../util/util.js'
import * as data from '../../../util/data.js'
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
  bsbLegalDocumentType
} from '../../../api/agent';
export default {
  data() {
    var merchant_id_no = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入身份证号码'));
      } else if (!/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(value)) {
        callback(new Error('请输入正确的身份证号码'));
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
      form: {
        id: this.$route.query.id,
        settlement_mer_type:'QY',//商户结算入网类型
        licenseno:'',//执照证件号码
        licensen_expire: '',//证件到期日期
        licensen_expire_long: false,
        is_liable_account:'1',//是否为法人入账
        account_type: '1',//结算账户类型
        document_type:'SZHY',//入网证件类型
        legal_name: '',//法人姓名
        merchant_id_type: '',
        merchant_id_no: '',//法人证件号码
        merchant_id_expire: '',//法人证件有效期
        merchant_id_expire_long: false,
        settle_id_no: '',
        settle_id_expire: '',
        settle_id_expire_long: false,
        account_name: '',//结算人账户开户名
        account_no: '',//结算人账户开户号
        bank_zname_no: '',//结算账户开户行
        account_phone:'',//银行卡预留手机号
        bank_addres_pro_no: '',//结算账户开户行省市01
        bank_addres_city_no: '',//结算账户开户行省市02
        bank_no: '',//结算户开户支行
        salesman_id: '',//业务员
        orgcod: '',
        taxcod: '',
        contro_name: '',
        contro_id_type: '',
        contro_id_no: '',
        contro_id_expire: '',
        contro_id_expire_long: false,
        legal_phone:''
      },
      optionsMerchantType: [],
      MerchantTypeLoading: false,
      editDisabled: false,
      addLoading: false,
      loading: false,
      saleLoading: false,
      bankNameList: [],//结算账户开户行列表
      branchNameList: [],//结算户开户支行列表
      optionsprovince1: [],
      optionsprovince2: [],
      optionsSale: [],
      settlementOptions: [{
        value: 'QY',
        label: '企业'
      }, {
        value: 'GT',
        label: '个体工商户'
      }],
      net_networkOptions: [{
        value: 'SZHY',
        label: '三证合一'
      }, {
        value: 'YYZZ',
        label: '营业执照'
      }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 3600 * 1000 * 24 * 90
        }
      },
      rules: {
        orgcod: [
          {
            required: true,
            message: '请输入组织机构代码号',
            trigger: 'blur'
          }
        ],
        taxcod: [
          {
            required: true,
            message: '请输入税务登记号',
            trigger: 'blur'
          }
        ],
        settlement_mer_type: [{
            required: true,
            message: '请选择商户结算入网类型',
            trigger: 'change'
          }
        ],
        licenseno: [{
            required: true,
            message: '请输入执照证件号码',
            trigger: 'blur'
          }, {
          validator: data.regBusinessLicense,
          trigger: 'blur'
          }
        ],
        licensen_expire: [{
          required: true,
          message: '请选择证件到期日期',
          trigger: 'change'
        }],
        account_type: [{
          required: true,
          message: '请选择结算账户类型',
          trigger: 'change'
        }],
        document_type: [{
            required: true,
            message: '请选择入网证件类型',
            trigger: 'change'
          }
        ],
        is_liable_account: [{
          required: true,
          message: '请选择是否法人入账',
          trigger: 'change'
        }],
        legal_name: [{
            required: true,
            message: '请输入法人姓名',
            trigger: 'blur'
          },{
            validator: data.regFont,
            trigger: 'blur'
          }
        ],
        merchant_id_type: [
          {
            required: true,
            message: "请选择法人证件类型",
            trigger: "change"
          }
        ],
        merchant_id_no: [{
          required: true,
          message: '请输入正确的证件号码',
          trigger: 'blur'
        },{
          validator: merchant_id_no,
          trigger: 'blur'
        }],
        settle_id_no: [{
          required: true,
          message: '请输入正确的证件号码',
          trigger: 'blur'
        },{
          validator: merchant_id_no,
          trigger: 'blur'
        }],
        settle_id_expire: [{
          required: true,
          message: '请选择结算人证件有效期',
          trigger: 'change'
        }],
        merchant_id_expire: [{
          required: true,
          message: '请选择结算人证件有效期',
          trigger: 'change'
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
        account_phone: [
          {
            message: '请输入银行卡预留手机号',
            trigger: 'blur'
          },
          {
          validator: data.regPhone,
          trigger: 'blur'
          }
        ],
        legal_phone: [
          {
            message: '请输入法人手机号',
            trigger: 'blur'
          },
          {
          validator: data.regPhone,
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
        bank_zname_no: [{
          required: true,
          message: '请选择开户银行'
        }],
        merchant_province3: [{
          required: true,
          message: '请选择商户所在省'
        }],
        merchant_province4: [{
          required: true,
          message: '请选择商户所在市'
        }],
        bank_addres_pro_no: [{
          required: true,
          message: '请选择开户银行所在省'
        }],
        bank_addres_city_no: [{
          required: true,
          message: '请选择开户银行所在市'
        }],
        salesman_id: [{
          required: true,
          message: '请选择业务员'
        }],
        contro_name: [{
            required: true,
            message: '请输入控制人姓名',
            trigger: 'blur'
          },{
            validator: data.regFont,
            trigger: 'blur'
          }
        ],
        contro_id_type: [
          {
            required: true,
            message: "请选择证件类型",
            trigger: "change"
          }
        ],
        contro_id_no: [{
          required: true,
          message: '请输入正确的证件号码',
          trigger: 'blur'
        }],
        contro_id_expire: [{
          required: true,
          message: '请选择证件有效期',
          trigger: 'change'
        }]
      },
      formDisabled: false
    }
  },
  computed: {
    settlement_mer_type() {
  　　return this.form.settlement_mer_type
  　},
    account_type() {
      return this.form.account_type
    },
    merchant_id_type() {
      return this.form.merchant_id_type
    }
  },
  watch: {
    account_type(curVal,oldVal) {
      this.$refs.form.clearValidate()
    },
    settlement_mer_type(curVal,oldVal) {
      this.$refs.form.clearValidate()
      if(curVal !== 'QY'){
        this.form.document_type = 'SZHY'
      }
    },
    merchant_id_type(curVal,oldVal) {
      this.$refs.form.clearValidate()
      if (curVal !== '01' ) {
        this.rules.merchant_id_no[1] = {}
      } else {
        var merchant_id_no = (rule, value, callback) => {
          if (value === "") {
            callback(new Error("请输入身份证号码"));
          } else if (
            !/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(value)
          ) {
            callback(new Error("请输入正确的身份证号码"));
          } else {
            callback();
          }
        };
        this.rules.merchant_id_no[1] = {
            validator: merchant_id_no,
            trigger: "blur"
        }
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.getPageDetails() 
      this.clickMerchantType()
    }
  },
  methods: {
    clickMerchantType() {
      this.MerchantTypeLoading = true;
      bsbLegalDocumentType({ id: "123" }).then(res => {
        this.MerchantTypeLoading = false;
        this.optionsMerchantType = res.data;
      });
    },
    remoteMerchantType(query) {
      if (query !== "") {
        this.MerchantTypeLoading = true;
        setTimeout(() => {
          this.MerchantTypeLoading = false;
          bsbLegalDocumentType({
            type: query
          }).then(res => {
            this.optionsMerchantType = res.data;
          });
        }, 200);
      } else {
        this.optionsMerchantType = [];
      }
    },
      //业务员远程搜索
      clickSale: function () {
        selectSaleByName().then((res) => {
          let {
            status,
            data
          } = res
          this.optionsSale = data.salesmanList
        })
      },
      remoteSale(query) {
        if (query !== '') {
          this.saleLoading = true;
          setTimeout(() => {
            this.saleLoading = false;
            selectSaleByName({
              name: query
            }).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsSale = data.salesmanList
            })
          }, 200);
        } else {
          this.optionsSale = [];
        }
      },
    bankChange01 () {
      this.form.bank_addres_pro_no = ''
      this.form.bank_addres_city_no = ''
      this.form.bank_no = ''
    },
    bankChange02 () {
      this.form.bank_addres_city_no = ''
      this.form.bank_no = ''
    },
    bankChange03 () {
      this.form.bank_no = ''
    },
    licensen_expire_long_change(change){
      this.rules.licensen_expire[0].required = !change
    },
    merchant_id_expire_long_change(change){
      this.rules.merchant_id_expire[0].required = !change
    },
    settle_id_expire_long_change(change){
      this.rules.settle_id_expire[0].required = !change
    },
    contro_id_expire_long_change(change){
      this.rules.contro_id_expire[0].required = !change
    },
    getPageDetails() {
      let para = {
        id: this.$route.query.id,
        page: 2
      }
      agentShopPage(para).then(res => {
        if (res.status === 200 && res.data.isEmpty === '1') {
          res.data.agentMap.licensen_expire_long = res.data.agentMap.licensen_expire_long === 'Y' ? true : false
          res.data.agentMap.merchant_id_expire_long = res.data.agentMap.merchant_id_expire_long === 'Y' ? true : false
          res.data.agentMap.settle_id_expire_long = res.data.agentMap.settle_id_expire_long === 'Y' ? true : false
          res.data.agentMap.contro_id_expire_long = res.data.agentMap.contro_id_expire_long === 'Y' ? true : false
          this.rules.licensen_expire[0].required = !res.data.agentMap.licensen_expire_long
          this.rules.merchant_id_expire[0].required = !res.data.agentMap.merchant_id_expire_long
          this.rules.settle_id_expire[0].required = !res.data.agentMap.settle_id_expire_long
          this.rules.contro_id_expire[0].required = !res.data.agentMap.contro_id_expire_long
          res.data.agentMap.bank_zname_no = parseInt(res.data.agentMap.bank_zname_no)
          res.data.agentMap.bank_addres_pro_no = parseInt(res.data.agentMap.bank_addres_pro_no)
          res.data.agentMap.bank_addres_city_no = parseInt(res.data.agentMap.bank_addres_city_no)
          this.form = res.data.agentMap
          if (res.data.timely_sign && res.data.timely_sign === '1') {
            this.editDisabled = true
            this.formDisabled = true
          }else{
            this.editDisabled = false
            this.formDisabled = false
          }
          this.optionsSale = [{
            id: res.data.agentMap.salesman_id, 
            value: res.data.agentMap.salesman_name
          }]
          this.bank()
          this.province1()
          this.province2()
          this.remoteBranch()
        }
      })
    },
    //开户银行支行
    bankBranch: function() {
      let para = {
        bank_city_code: this.form.bank_addres_city_no,
        id: this.form.bank_zname_no,
        bank_provice_code: this.form.bank_addres_pro_no
      }
      selectbranch(para).then((res) => {
        this.branchNameList = res.data.bankList
      })
    },
    //支行远程搜索
    remoteBranch(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          let para = {
            bank_city_code: this.form.bank_addres_city_no,
            id: this.form.bank_zname_no,
            bank_provice_code: this.form.bank_addres_pro_no,
            bank_name: query
          }
          selectbranch(para).then((res) => {
            this.branchNameList = res.data.bankList
          })
        }, 200);
      } else {
        this.branchNameList = [];
      }
    },
    //开户银行省市
    province1: function() {
      getProvince({province_code: 3229}).then((res) => {
        this.optionsprovince1 = res.data.provinceList
      })
    },
    province2: function() {
      // this.form.merchant_province2=null
      let para = {
        id: this.form.bank_addres_pro_no
      }
      queryCity(para).then((res) => {
        this.optionsprovince2 = res.data.provinceList
      })
    },
    //开户银行
    bank: function() {
      this.logining = true
      selectBank().then((res) => {
        this.logining = false,
          this.bankNameList = res.data.bankList
      })
    },
    retstSubmit() {
      this.$router.push({ path: "/index2/page6", query: { id: this.$route.query.id } });
    },
    addSubmit: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let para = util.deepcopy(this.form)
          para.licensen_expire_long = para.licensen_expire_long ? 'Y' : 'N'
          para.merchant_id_expire_long = para.merchant_id_expire_long ? 'Y' : 'N'
          para.settle_id_expire_long = para.settle_id_expire_long ? 'Y' : 'N'
          para.contro_id_expire_long = para.contro_id_expire_long ? 'Y' : 'N'
          para.shop_id = this.$route.query.shop_id
          addAgentMertwo(para).then(res => {
            if (res.status === 200) {
              this.$router.push({
                path: '/index2/page10',
                query: {id: res.id, shop_id: res.shop_id, salesman_id: res.salesman_id, account_type: this.form.account_type, is_liable_account: this.form.is_liable_account, settlement_mer_type: this.form.settlement_mer_type, document_type: this.form.document_type}
              }); 
            }
          })
        } else {
          return
        }
      });
    }
  }
}
</script>
