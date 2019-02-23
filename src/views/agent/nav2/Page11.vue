<style scoped>
.search_top {
  background: #f2f2f2;
  margin: 20px 0;
  padding: 24px 10px 0 10px;
}
.top_alert {
  margin-top: 20px;
}
.box-card{
  margin-top: 10px;
}
.box-alert{
  margin-bottom: 10px;
}
.box_card_img{
  width: 100px;
  height: 100px;
}
</style>
<style>
.fixed_search_input {
  max-width: 160px;
}
.fixed_search_date {
  max-width: 220px;
}
</style>

<template>
  <section>
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="80px">
      <div class="search_top">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商户名称" prop="merchant_name">
              <el-input v-model="filters.merchant_name" placeholder="请输入商户名称关键字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核状态" prop="merchant_status">
              <el-select v-model="filters.merchant_status" clearable placeholder="请选择状态审核状态">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  style="float: right;">
              <el-button type="primary" v-on:click="getUsers" round icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row>
        <el-table-column prop="userName" align="center" label="渠道商名称" min-width="120">
        </el-table-column>
        <el-table-column prop="merchant_name" align="center" label="商户名称" min-width="120">
        </el-table-column>
        <el-table-column prop="gmt_create" align="center" label="创建时间" min-width="120" :formatter="formatterDate">
        </el-table-column>
        <el-table-column align="center" label="审核状态" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.merchant_status === '0' ? 'info' : scope.row.merchant_status === '1' ? 'warning': scope.row.merchant_status === '2' ? 'danger' : scope.row.merchant_status === '3' ? 'success' : ''" disable-transitions>{{formatMerchantStatus(scope.row, scope.$index)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button type="info" plain size="mini" @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="商户详情" :visible.sync="dialogDetailVisible" width="800px">
      <el-form :model="formDetail" :inline="true" label-width="150px" label-position="left">
        <el-alert  class="box-alert" :closable="false" v-if="formDetail.merchant_status === '2'" title="审核驳回原因：" :description="formDetail.error_msg || '暂无驳回原因，请联系运营人员'" type="error" show-icon>
        </el-alert>
        <h2 style="text-align: center;">商户名称：{{formDetail.merchant_name}}</h2>
        <el-card>
          <div slot="header">
            <span>基本信息</span>
          </div>
          <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户简称">
              <span>{{formDetail.merchant_alias}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册名称">
              <span>{{formDetail.merchant_company}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户所在省/市/县">
              <span>{{formDetail.merchant_province}} {{formDetail.merchant_province ? '/' : ''}} {{formDetail.merchant_city}} {{formDetail.merchant_city ? '/' : ''}} {{formDetail.merchant_county}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户详细地址">
              <span>{{formDetail.merchant_address}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="商户联系人">
              <span>{{formDetail.merchant_person}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话">
              <span>{{formDetail.merchant_phone}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="联系人证件号">
              <span>{{formDetail.person_id_no}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人证件有效期">
              <span>{{formatDateperson_id_no(formDetail)}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="联系人邮箱">
              <span>{{formDetail.merchant_email}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业类目">
              <span>{{formDetail.business_name}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="客服电话">
              <span>{{formDetail.merchant_service_phone}}</span>
            </el-form-item>
          </el-col>
              <el-col :span="12">
                <el-form-item label="商户类型">
                  <span>{{ formDetail.merchant_type === '1' ? '一级商户' : formDetail.merchant_type === '2' ? '二级商户' : '未知' }}</span>
                </el-form-item>
              </el-col>
        </el-row>
          </div>
        </el-card>

        <!-- 第二页 -->
        <el-card class="box-card">
          <div slot="header">
            <span>结算信息</span>
          </div>
          <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户结算入网类型">
              <span>{{formDetail.settlement_mer_type === 'QY' ? '企业' : formDetail.settlement_mer_type === 'GT' ? '个体' : formDetail.settlement_mer_type === 'XW' ? '小微' : ''}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执照证件号码">
              <span>{{formDetail.licenseno}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="证件到期日期">
              <span>{{formatDateLicensen_expire(formDetail)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算账户类型">
              <span>{{formDetail.account_type === '1' ? '对公' : formDetail.account_type === '2' ? '对私' : ''}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="入网证件类型">
              <span>{{formDetail.document_type === 'SZHY' ? '三证合一' : formDetail.document_type === 'YYZZ' ? '营业执照' : ''}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否法人入账">
              <span>{{formDetail.is_liable_account === '1' ? '法人入账' : formDetail.is_liable_account === '2' ? '非法人入账' : ''}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="法人姓名">
              <span>{{formDetail.legal_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人证件号">
              <span>{{formDetail.merchant_id_no}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="法人证件有效期">
              <span>{{formatDatemerchant_id_expire(formDetail)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人手机号">
              <span>{{formDetail.legal_phone}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算人身份证号">
              <span>{{formDetail.settle_id_no}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算人身份证有效期">
              <span>{{formatDatesettle_id_expire(formDetail)}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算人账户开户名">
              <span>{{formDetail.account_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算人账户开户号">
              <span>{{formDetail.account_no}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行卡预留手机号">
              <span>{{formDetail.account_phone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算账户开户行">
              <span>{{formDetail.bank_zname}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算户开户支行">
              <span>{{formDetail.bank_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务员">
              <span>{{formDetail.salesman_name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="控制人姓名">
              <span>{{formDetail.contro_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制人证件类型">
              <span>{{formDetail.contro_id_type}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="控制人证件号">
              <span>{{formatDatecontro_id_expire(formDetail)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制人证件有效期">
              <span>{{formDetail.contro_id_type}}</span>
            </el-form-item>
          </el-col>
        </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span>微信</span>
            <el-tag :type="formDetail.wx_open === 'Y' ? 'success' : 'warning'" style="float: right;">{{formDetail.wx_open === 'Y' ? '开启' : formDetail.wx_open === 'N' ? '关闭' : '未知'}}</el-tag>
          </div>
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="微信费率（‰）">
                  <span>{{ formDetail.wx_rate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人微信账号">
                  <span>{{ bsbPay.wx_contid }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span>支付宝</span>
            <el-tag :type="formDetail.ali_open === 'Y' ? 'success' : 'warning'" style="float: right;">{{formDetail.ali_open === 'Y' ? '开启' : formDetail.ali_open === 'N' ? '关闭' : '未知'}}</el-tag>
          </div>
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付宝费率（‰）">
                  <span>{{ formDetail.ali_rate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="支付宝的PID">
                  <span>{{ bsbPay.ali_source }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="行业类目">
                  <span>{{ bsbPay.reserve1 }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span>商户费率（‰）</span>
          </div>
          <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="翼支付费率">
              <span>{{formDetail.best_rate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="借记卡费率">
              <span>{{formDetail.debit_rate}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<el-tag>费率峰值：{{formDetail.reserve1}}元</el-tag>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="贷记卡费率">
              <span>{{formDetail.crebit_rate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银联费率">
              <span>{{formDetail.unionpay_rate}}</span>
            </el-form-item>
          </el-col>
        </el-row>
          </div>
        </el-card>

        <!-- 商户照片 -->
        <el-card class="box-card">
          <div slot="header">
            <span>证件照片</span>
            <a :href="formDetail.img_other" style="float: right; padding: 3px 0" type="text">附件下载</a>
          </div>
          <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="营业执照照片">
              <a :href="formDetail.img_business_license" v-if="formDetail.img_business_license" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_business_license" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人身份证正面">
              <a :href="formDetail.img_idcard_a" v-if="formDetail.img_idcard_a" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_idcard_a" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="法人身份证反面">
              <a :href="formDetail.img_idcard_b" v-if="formDetail.img_idcard_b" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_idcard_b" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行卡正面照片">
              <a :href="formDetail.img_bankcard_a" v-if="formDetail.img_bankcard_a" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_bankcard_a" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="银行卡反面照片">
              <a :href="formDetail.img_bankcard_b" v-if="formDetail.img_bankcard_b" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_bankcard_b" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户门头照片">
              <a :href="formDetail.img_logo" v-if="formDetail.img_logo" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_logo" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="内部前台照片">
              <a :href="formDetail.img_indoor" v-if="formDetail.img_indoor" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_indoor" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户许可证照片">
              <a :href="formDetail.img_open_permits" v-if="formDetail.img_open_permits" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_open_permits" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="商户关系证明">
              <a :href="formDetail.img_relation" v-if="formDetail.img_relation" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_relation" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算人身份证正面">
              <a :href="formDetail.img_private_idcard_a" v-if="formDetail.img_private_idcard_a" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_private_idcard_a" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算人身份证反面">
              <a :href="formDetail.img_private_idcard_b" v-if="formDetail.img_private_idcard_b" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_private_idcard_b" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户总分店关系证明">
              <a :href="formDetail.img_mer_relation" v-if="formDetail.img_mer_relation" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_mer_relation" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户增值协议">
              <a :href="formDetail.img_mer_increment" v-if="formDetail.img_mer_increment" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_mer_increment" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织机构代码证照片">
              <a :href="formDetail.img_org_code" v-if="formDetail.img_org_code" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_org_code" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="税务登记证照片">
              <a :href="formDetail.img_tax_reg" v-if="formDetail.img_tax_reg" target='_blank'>
                <img class="box_card_img" :src="formDetail.thum_img_tax_reg" alt="证件照片">
              </a>
            </el-form-item>
          </el-col>
              <el-col :span="12">
                <el-form-item label="联系人身份证正面">
                  <a
                    :href="formDetail.img_person_a"
                    v-if="formDetail.img_person_a"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_person_a"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
        </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系人身份证反面">
                  <a
                    :href="formDetail.img_person_b"
                    v-if="formDetail.img_person_b"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_person_b"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-form>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
import { changeAgentMerEnter, ChangeAgentShop } from "@/api/agent";
import * as util from '../../../util/util.js'

export default {
  data() {
    return {
      filters: {},
      dialogDetailVisible: false,
      statusOptions: [
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "2",
          label: "审核驳回"
        },
        {
          value: "4",
          label: "初次审核驳回"
        },
        {
          value: "3",
          label: "审核通过"
        }
      ],
      formDetail: {},
      bsbPay: {},
      total: 0,
      page: 1,
      users: [],
      listLoading: false
    };
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    //状态转换
    formatMerchantStatus: function(row, column) {
      return row.merchant_status === "0" ? "未提交" : row.merchant_status === "1" ? "审核中" : row.merchant_status === "3" ? "审核通过" : (row.merchant_status === "2" && row.timely_sign === '0') ? "初次审核驳回" : (row.merchant_status === "2" && row.timely_sign === '1') ? "审核驳回" : "未知"
    },
    formatterDate (row, column) {
      return row.gmt_create = util.formatDate.format(new Date(row.gmt_create), 'yyyy/MM/dd hh:mm:ss')
    },
    formatDate(val){
      return util.dateFormat(parseInt(val), 'yyyy-MM-dd hh:mm:ss')
    },
    formatDateLicensen_expire(val){
      return val.licensen_expire_long === 'Y' ? '长期有效' : val.licensen_expire ? util.dateFormat(parseInt(val.licensen_expire), 'yyyy-MM-dd hh:mm:ss') : '' 
    },
    formatDatemerchant_id_expire(val){
      return val.merchant_id_expire_long === 'Y' ? '长期有效' : val.merchant_id_expire ? util.dateFormat(parseInt(val.merchant_id_expire), 'yyyy-MM-dd hh:mm:ss') : '' 
    },
    formatDatesettle_id_expire(val){
      return val.settle_id_expire_long === 'Y' ? '长期有效' : val.settle_id_expire ? util.dateFormat(parseInt(val.settle_id_expire), 'yyyy-MM-dd hh:mm:ss') : '' 
    },
    formatDateperson_id_no(val){
      return val.person_id_expire_long === 'Y' ? '长期有效' : val.person_id_expire ? util.dateFormat(parseInt(val.person_id_expire), 'yyyy-MM-dd hh:mm:ss') : '' 
    },
    formatDatecontro_id_expire(val){
      return val.contro_id_expire_long === 'Y' ? '长期有效' : val.contro_id_expire ? util.dateFormat(parseInt(val.contro_id_expire), 'yyyy-MM-dd hh:mm:ss') : '' 
    },
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    getUsers () {
      this.page = 1
      this.getList()
    },
    getList() {
      let para = this.filters;
      para.pageNum = this.page;
      this.listLoading = true;
      changeAgentMerEnter(para).then(res => {
        this.listLoading = false;
        this.users = res.data.shopList;
        this.total = res.data.totalCount;
      });
    },
    getListDetail(change, val) {
      ChangeAgentShop({ id: change, shop_id: val }).then(res => {
        this.formDetail = res.data.changeAgentShop 
        this.bsbPay = res.data.bsbPay
      });
    },
    handleDetail(index, row) {
      this.dialogDetailVisible = true;
      this.getListDetail(row.id, row.shop_id);
    }
  }
};
</script>
