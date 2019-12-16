<template lang="html">
  <div class="">
    <div class="bill1-top">
      <h3>交易账单</h3>
    </div>
    <el-form :model="excelForm" :rules="ruleForm" ref="excelForm" label-width="100px" class="demo-excelForm">
      <el-row>
        <el-form-item label="账单类型">
          <el-radio-group v-model="excelForm.excel_type">
            <el-radio v-for="recson in optionsExcel" :label="recson.value" :key="recson.value">{{recson.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="交易类型">
          <el-radio-group v-model="excelForm.accountType" :disabled="excelForm.excel_type!=='od'">
            <el-radio v-for="recson in optionsPayType" :label="recson.value" :key="recson.value">{{recson.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="支付方式">
          <el-radio-group v-model="excelForm.recsonId">
            <el-radio v-for="recson in optionsScene" :label="recson.value" :key="recson.value">{{recson.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="商户名称" prop="mid">
            <el-select v-model="excelForm.mid" placeholder="商户名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="shopLoading"
              clearable @focus="clickShop" @change="selectShopChange">
              <el-option v-for="item in optionsShop" :key="item.mid" :value="item.mid" :label="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门店名称">
            <el-select v-model="excelForm.storeName" placeholder="门店名称" :multiple="false" filterable remote :remote-method="remoteStore"
              :loading="storeLoading" clearable @focus="clickStore" @change="selectStoreChange">
              <el-option v-for="item in optionsStore" :key="item.key" :value="item.key" :label="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="款台名称">
            <el-select v-model="excelForm.empName" placeholder="款台名称" :disabled="excelForm.excel_type!=='od'" :multiple="false" filterable
              remote :remote-method="remoteEmp" :loading="empLoading" clearable @focus="clickEmp">
              <el-option v-for="item in optionsEmp" :key="item.eid" :value="item.eid" :label="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择时间" prop="resource">
            <el-date-picker v-model="excelForm.startTime" :editable="false" :clearable="false" :type="dateType" @change="changTime" :picker-options="pickerOptions1"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label-width="0">
            至
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="endTime" label-width="0px">
            <el-date-picker v-model="excelForm.endTime" :editable="false" :clearable="false" :type="dateType" :picker-options="pickerOptions2"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="注：">
          <span style="color:#999;">每次下载区间最多为3个月。如果下载出现乱码，请选择office2003打开</span><br>
          <span style="color:#f00;">* 系统每日中午12点前进行对账及汇总统计，请于每日中午12点之后下载前一日对账单明细；</span><br>
          <span style="color:#f00;">* 如部分商户无法下载2019年11月之前的交易数据，请致电400-888-5400咨询客服。</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('excelForm')">立即下载</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import * as util from '../../../util/util.js'
  import * as data from '../../../util/data.js'
  import {
    selectEmpsBySid,
    selectStoreList,
    selectMersByName,
    checkDataExcel,
    selectStoreListByPhone
  } from '../../../api/agent';
  export default {
    data() {
      var myDate = new Date();
      return {
        //时间控制
        pickerOptions1: {
          disabledDate: (time) => {
            if (time.getTime() > Date.now() - 3600 * 1000 * 24) {
              return true;
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.excelForm.startTime),
              'yyyy-MM-dd')));
            if (time.getTime() > startTimeOne + 3600 * 1000 * 24 * 90 || time.getTime() < startTimeOne - 3600 * 1000 *
              24 * 1 || time.getTime() > Date.now() - 3600 * 1000 * 24) {
              return true;
            }
          }
        },
        shopLoading: false,
        storeLoading: false,
        empLoading: false,
        dateType: 'datetime',
        //选择门店
        optionsShop: [],
        optionsStore: [],
        optionsEmp: [],
        excelForm: {
          parag: '',
          excel_type: 'od',
          accountType: '0',
          recsonId: 'WX',
          storeName: '',
          empName: '',
          mid: '',
          startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate() - 1),
          endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate() - 1, 23, 59, 59),
        },
        ruleForm: {
          endTime: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          mid: [{
            required: true,
            message: '请选择商户',
            trigger: 'change'
          }]
        },
        //账单类型
        optionsExcel: [{
          value: 'od',
          label: '交易明细'
        }, {
          value: 'sd',
          label: '门店日汇总'
        }, {
          value: 'ss',
          label: '门店汇总'
        }],
        //账单类型
        optionsPayType: [{
          value: '0',
          label: '支付成功'
        }, {
          value: '1',
          label: '退款成功'
        }],
        //支付方式
        optionsScene: data.optionsPaymentExcel
      };
    },
    computed: {
      excel_type() {　　
        return this.excelForm.excel_type　
      }
    },
    watch: {
      excel_type(curVal, oldVal) {
        let myDate = new Date(this.excelForm.endTime)
        if (curVal !== 'od') {
          this.excelForm.accountType = '0'
          this.dateType = 'date'
          this.excelForm.empName = ''
        } else {
          this.dateType = 'datetime'
          this.excelForm.endTime = new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59)
        }
      }
    },
    methods: {
      changTime(date) {
        let end_time = Date.parse(new Date(util.formatDate.format(new Date(this.excelForm.endTime), 'yyyy-MM-dd')))
        let date_time = Date.parse(new Date(util.formatDate.format(new Date(date), 'yyyy-MM-dd')))
        if (date_time < end_time - 3600 * 1000 * 24 * 90) {
          this.excelForm.endTime = ''
        }
      },
      //款台远程搜索
      clickEmp: function () {
        this.empLoading = true;
        let para = {
          mid: this.excelForm.mid.toString(),
          storeId: this.excelForm.storeName.toString(),
          ename: ''
        }
        selectEmpsBySid(para).then((res) => {
          this.empLoading = false;
          let {
            status,
            data
          } = res
          this.optionsEmp = data.emplyeeList
        })
      },
      remoteEmp(query) {
        if (query !== '') {
          this.empLoading = true;
          setTimeout(() => {
            this.empLoading = false;
            let para = {
              mid: sessionStorage.getItem('mid'),
              storeId: this.excelForm.storeName.toString(),
              ename: query
            }
            selectEmpsBySid(para).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsEmp = data.emplyeeList
            })
          }, 200);
        } else {
          this.optionsEmp = [];
        }
      },
      selectShopChange() {
        this.excelForm.empName = ''
        this.excelForm.storeName = ''
        this.optionsStore = []
      },
      //门店远程搜索
      selectStoreChange() {
        this.excelForm.empName = ''
      },
      clickStore: function () {
        if (!this.excelForm.mid) {
          return  this.$message({
            message: '请先选择商户',
            type: 'warning'
          });
        }
        this.storeLoading = true;
        let para = {
          mid: this.excelForm.mid.toString()
        }
        selectStoreListByPhone(para).then((res) => {
          this.storeLoading = false;
          let {
            status,
            data
          } = res
          this.optionsStore = data.storeList
        })
      },
      remoteStore(query) {
        if (query !== '') {
          this.storeLoading = true;
          setTimeout(() => {
            this.storeLoading = false;
            let para = {
              mid: this.excelForm.mid.toString(),
              sname: query
            }
            selectStoreListByPhone(para).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsStore = data.storeList
            })
          }, 200);
        } else {
          this.optionsStore = [];
        }
      },
      //商户远程搜索
      clickShop: function () {
        selectMersByName().then((res) => {
          let {
            status,
            data
          } = res
          this.optionsShop = data.merchantList
        })
      },
      remoteShop(query) {
        if (query !== '') {
          this.midLoading = true;
          setTimeout(() => {
            this.midLoading = false;
            selectMersByName({
              mname: query
            }).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsShop = data.merchantList
            })
          }, 200);
        } else {
          this.optionsShop = [];
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = {
              agentId: sessionStorage.getItem('agentId'),
              mid: this.excelForm.mid,
              order_type: String(this.excelForm.accountType),
              payWay: this.excelForm.recsonId,
              startTime: this.excelForm.startTime,
              endTime: this.excelForm.endTime,
              storeId: String(this.excelForm.storeName),
              eid: String(this.excelForm.empName),
              excel_type: this.excelForm.excel_type
            }
            para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(
              new Date(para.startTime), 'yyyy-MM-dd hh:mm:ss')));
            para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(
              new Date(para.endTime), 'yyyy-MM-dd hh:mm:ss')));
            checkDataExcel(para).then(res => {
              if (res.data.status === 200) {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
              }
            })
          }
        });
      },
    }
  }

</script>
<style media="screen">
  .bill1-top {
    padding: 0 25px;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
  }

  .demo-excelForm {
    padding: 0 25px;
    width: 750px;
    margin: auto;
  }

</style>
