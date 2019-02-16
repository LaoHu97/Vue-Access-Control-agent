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
  width: 600px;
  margin: 0 auto;
  padding: 20px 0;
}
.form_footer {
  text-align: center;
  padding-bottom: 20px;
}
.box-alert {
  margin-top: 20px;
}
.editBtn {
  float: right;
  margin-top: 10px;
}
</style>

<template lang="html">
  <section>
    <el-steps class="form_header" align-center :active="0" finish-status="success">
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
      <el-form ref="form" :disabled="formDisabled" :model="form" :rules="rules" label-width="150px" label-position="left" class="form_contron">
        <el-row>
          <el-col>
            <el-form-item label="商户名称：" prop="merchant_name">
              <el-input v-model.trim="form.merchant_name" :disabled="$route.query.id ? true : false" placeholder="全局唯一不可重复"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="商户简称：" prop="merchant_alias">
              <el-input v-model.trim="form.merchant_alias"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="注册名称：" prop="merchant_company">
              <el-input v-model.trim="form.merchant_company" placeholder="经营实体名称，须与营业执照名称保持一致"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="商户所在省/市/县：" prop="merchant_city">
              <el-cascader
                v-model="form.merchant_city"
                :options="optionsCity"
                @active-item-change="cityItemChange"
                :props="cityProps"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="商户详细地址：" prop="merchant_address">
              <el-input v-model.trim="form.merchant_address" placeholder="不包含省/市/区"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="商户联系人：" prop="merchant_person">
              <el-input v-model.trim="form.merchant_person" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="联系人身份证号：" prop="person_id_no">
              <el-input v-model.trim="form.person_id_no" placeholder="请输入联系人身份证号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="联系人证件有效期" prop="person_id_expire">
                <el-date-picker
                  v-model="form.person_id_expire"
                  :picker-options="pickerOptions"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0">
              <el-checkbox @change="person_id_expire_long_change" true-label="Y" false-label="N" v-model="form.person_id_expire_long">长期有效</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="联系人电话：" prop="merchant_phone">
              <el-input v-model.trim="form.merchant_phone" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="联系人邮箱：" prop="merchant_email">
              <el-input v-model.trim="form.merchant_email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="行业类目：" prop="business">
              <el-cascader
                v-model="form.business"
                :options="optionsBusiness"
                @active-item-change="businessItemChange"
                :props="businessProps"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="客服电话：" prop="merchant_service_phone">
              <el-input v-model.trim="form.merchant_service_phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="商户类型：" prop="merchant_type">
              <el-select v-model="form.merchant_type" placeholder="请选择">
                <el-option
                  v-for="item in merchant_typeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="form_footer">
        <!-- <el-button size="large" @click.native="retstSubmit">返 回</el-button> -->
        <el-button type="primary" size="large" @click.native="addSubmit" :loading="addLoading">下一步</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import * as data from "../../../util/data.js";
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
  agentShopPage
} from "../../../api/agent";
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
    var number_phone = (rule, value, callback) => {
      if (!/^\d{7,15}$/.test(value) && value !== "") {
        callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };
    return {
      form: {
        merchant_name: "", //商户名称
        merchant_alias: "", //商户简称
        merchant_company: "", //注册名称
        merchant_city: [],
        merchant_address: "", //商户地址
        merchant_person: "", //商户联系人
        person_id_no: "",
        merchant_phone: "", //联系人电话
        merchant_email: "", //联系人邮箱
        merchant_service_phone: "", //客服电话
        business: [], //行业类目
        merchant_type: '',
        person_id_expire: '',
        person_id_expire_long: 'N'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 3600 * 1000 * 24 * 90
        }
      },
      addLoading: false,
      optionsCity: [],
      cityProps: {
        value: "sid",
        label: "fullname",
        children: "cities"
      },
      optionsBusiness: [],
      businessProps: {
        value: "id",
        label: "name",
        children: "cities"
      },
      merchant_typeoptions: [{
          value: '1',
          label: '一级商户'
        }, {
          value: '2',
          label: '二级商户'
        }],
      rules: {
        merchant_type: [
          {
            required: true,
            message: "请选择商户类型",
            trigger: "change"
          }
        ],
        merchant_name: [
          {
            required: true,
            message: "请输入商户名称",
            trigger: "blur"
          },
          {
            max: 30,
            message: "请输入正确的商户名称",
            trigger: "blur"
          }
        ],
        merchant_alias: [
          {
            required: true,
            message: "请输入商户简称",
            trigger: "blur"
          },
          {
            max: 20,
            message: "请输入正确的商户简称",
            trigger: "blur"
          }
        ],
        merchant_company: [
          {
            required: true,
            message: "请输入注册名称",
            trigger: "blur"
          },
          {
            max: 60,
            message: "请输入正确的注册名称",
            trigger: "blur"
          }
        ],
        merchant_address: [
          {
            required: true,
            message: "请输入营业执照地址",
            trigger: "blur"
          },
          {
            max: 60,
            message: "请输入正确的营业执照地址",
            trigger: "blur"
          }
        ],
        merchant_person: [
          {
            required: true,
            message: "请输入负责人姓名",
            trigger: "blur"
          },
          {
            validator: data.regFont,
            trigger: "blur"
          }
        ],
        person_id_no: [{
          required: true,
          message: '请输入正确的证件号码',
          trigger: 'blur'
        },{
          validator: merchant_id_no,
          trigger: 'blur'
        }],
        person_id_expire: [{
          required: true,
          message: '请选择证件到期日期',
          trigger: 'change'
        }],
        merchant_phone: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur"
          },
          {
            validator: data.regPhone,
            trigger: "blur"
          }
        ],
        merchant_email: [
          {
            type: "email",
            required: true,
            message: "请输入正确的负责人邮箱",
            trigger: "blur"
          }
        ],
        merchant_city: [
          {
            type: "array",
            required: true,
            message: "请选择省市区",
            trigger: "change"
          }
        ],
        business: [
          {
            type: "array",
            required: true,
            message: "请选择行业类别",
            trigger: "change"
          }
        ],
        merchant_service_phone: [
          {
            message: "请输入客服电话",
            trigger: "blur"
          },
          {
            validator: number_phone,
            trigger: "blur"
          }
        ]
      },
      formDisabled: false
    };
  },
  mounted() {
    getProvince({ province_code: "0" }).then(res => {
      let list = [];
      for (let i = 0; i < res.data.provinceList.length; i++) {
        let e = res.data.provinceList[i];
        e.cities = [];
        list.push(e);
      }
      this.optionsCity = list;
    });
    showBusinessType({id: '0', type: ''}).then(res => {
      let list = [];
      for (let i = 0; i < res.data.BusinessList.length; i++) {
        let e = res.data.BusinessList[i];
        e.cities = [];
        list.push(e);
      }
      this.optionsBusiness = list;
    });
    if (this.$route.query.id) {
      this.getPageDetails();
    }
  },
  methods: {
    getPageDetails() {
      let para = {
        id: this.$route.query.id,
        page: 1
      };
      agentShopPage(para).then(res => {
        if (res.status === 200 && res.data.isEmpty === "1") {
          this.form = res.data.agentMap;
          this.rules.person_id_expire[0].required = !res.data.agentMap.person_id_expire_long
          if (res.data.timely_sign && res.data.timely_sign === "1") {
            this.formDisabled = true;
          } else {
            this.formDisabled = false;
          }
          if (res.data.agentMap.merchant_city_code) {
            this.form.merchant_city = [
              parseInt(res.data.agentMap.merchant_province_code),
              parseInt(res.data.agentMap.merchant_city_code),
              parseInt(res.data.agentMap.merchant_county_code)
            ];
            this.cityItemChange(this.form.merchant_city);
          }
          if (res.data.agentMap.business_type1_code) {
            this.form.business = [
              parseInt(res.data.agentMap.business_type1_code),
              parseInt(res.data.agentMap.business_type2_code),
              parseInt(res.data.agentMap.business_type3_code)
            ];
            this.businessItemChange(this.form.business);
          }
        }
      });
    },
    person_id_expire_long_change(change){
      if (change === 'Y') {
        this.rules.person_id_expire[0].required = false
      }else{
        this.rules.person_id_expire[0].required = true
      }
    },
    cityItemChange(val) {
      queryCity({ id: val[0] }).then(res => {
        this.optionsCity.findIndex(function(obj) {
          if (val[0] == obj.sid) {
            let list = [];
            for (let i = 0; i < res.data.provinceList.length; i++) {
              let e = res.data.provinceList[i];
              e.cities = [];
              list.push(e);
            }
            obj.cities = res.data.provinceList;
            if (val[1]) {
              queryCity({ id: val[1] }).then(res => {
                obj.cities.findIndex(function(params) {
                  if (val[1] == params.sid) {
                    params.cities = res.data.provinceList;
                  }
                });
              });
            }
          }
        });
      });
    },
    businessItemChange(val) {
      showBusinessType({ id: val[0], type: "" }).then(res => {
        this.optionsBusiness.findIndex(function(obj) {
          if (val[0] == obj.id) {
            let list = [];
            for (let i = 0; i < res.data.BusinessList.length; i++) {
              let e = res.data.BusinessList[i];
              e.cities = [];
              list.push(e);
            }
            obj.cities = res.data.BusinessList;
            if (val[1]) {
              showBusinessType({ id: val[1], type: "" }).then(res => {
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
    // retstSubmit() {
    //   this.$router.go(-1)
    // },
    addSubmit: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let para = this.form;
          para.shop_id = "";
          para.business_type1_id = this.form.business[0].toString();
          para.business_type2_id = this.form.business[1].toString();
          para.business_type3_id = this.form.business[2].toString();
          para.merchant_province_code = this.form.merchant_city[0];
          para.merchant_city_code = this.form.merchant_city[1];
          para.merchant_county_code = this.form.merchant_city[2];
          addAgentMerone(para).then(res => {
            if (res.status === 200) {
              this.$router.push({
                path: "/index2/page9",
                query: { id: res.id, shop_id: res.shop_id }
              });
            }
          });
        } else {
          return;
        }
      });
    }
  }
};
</script>
