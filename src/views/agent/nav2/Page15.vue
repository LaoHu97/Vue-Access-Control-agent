
<style scoped>
.box_card{
  margin-top: 25px;
}
.box-card-pay-icon {
  margin: 0 5px;
  width: 4.5em;
  height: 4.5em;
  vertical-align: -1.6em;
  fill: currentColor;
  overflow: hidden;
}
.box-card-pay-right{
  display: inline-block;
}
.box-card-pay{
  display: flex;
  align-items: center;
}
  .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
</style>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
</style>


<template>
  <section>
    <el-button size="small" round @click="historyGo">返回</el-button>
    <el-card class="box_card">
      <div slot="header">
        <span>通道配置</span>
      </div>
      <div class="box-card-pay">
        <svg class="box-card-pay-icon" aria-hidden="true">
          <use xlink:href="#icon-caidan"/>
        </svg>
        <div class="box-card-pay-right">
          <p>官方通道</p>
          <el-button type="text" @click="clickArgument">参数配置</el-button>
          <el-button type="text" @click="clickRate">费率配置</el-button>
        </div>
      </div>
    </el-card>


    <el-dialog title="费率配置" :visible.sync="dialogFormVisibleRate" width="450px">
      <el-form :model="formRate" :rules="formRateRules" ref="formRate" label-width="100px" label-position="left">
        <el-form-item label="费率（‰）" prop="rate">
          <el-input v-model="formRate.rate"></el-input>
        </el-form-item>
        <el-form-item label="图片附件" prop="imgProtocol">
          <el-upload
            class="avatar-uploader"
            :data="{id: agentShopId}"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="formRate.imgProtocol" :src="formRate.imgProtocol" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRate = false">取 消</el-button>
        <el-button type="primary" @click="submiltRate('formRate')">确 定</el-button>
      </div>
    </el-dialog>



    <el-dialog title="参数配置" :visible.sync="dialogFormVisibleArgument" width="30%">
      <el-form :model="formArgument" :rules="formArgumentRules" ref="formArgument" label-width="160px" label-position="left">
        <el-form-item label="商户类型" prop="mtype">
          <el-select v-model="formArgument.mtype" placeholder="请选择商户类型">
            <el-option
              v-for="item in optionsMtype"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公众号appid">
          <el-input v-model="formArgument.sysAppid"></el-input>
        </el-form-item>
        <el-form-item label="公众号appSecret">
          <el-input v-model="formArgument.appSecret"></el-input>
        </el-form-item>
        <el-form-item label="公众号encodingAESKey">
          <el-input v-model="formArgument.encodingAESKey"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleArgument = false">取 消</el-button>
        <el-button type="primary" @click="submiltArgument('formArgument')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import * as util from "@/util/util.js";
import {
  queryMerPayConfig,
  updateMerPayConfig,
  queryRateConfig,
  updateRateConfig,
  uploadImage
} from "@/api/agent";

export default {
  data() {
      var validaterate = (rule, value, callback) => {
        if (!/^(\-)?\d+(\.\d{1})?$/.test(value)) {
          callback(new Error('请输入正确的商户费率'));
        } else {
          callback();
        }
      };
    return {
      uploadUrl: uploadImage,
      dialogFormVisibleArgument: false,
      optionsMtype: [{
        value: '21',
        label: '包商微信'
      }],
      formArgumentRules: {
        mtype: [
          { required: true, message: '请选择商户类型', trigger: 'change' }
        ]
      },
      formArgument: {
        mtype: '21',
        thirdMid: '',
        thirdMkey: '',
        sysAppid: '',
        appSecret: '',
        encodingAESKey: ''
      },

      agentShopId: '',
      dialogFormVisibleRate: false,
      formRateRules: {
        rate: [
          { required: true, message: '请输入商户费率', trigger: 'blur' },
          { validator: validaterate, trigger: 'blur' }
        ]
      },
      formRate: {
        rate: '',
        imgProtocol: ''
      }
    };
  },
  methods: {
    historyGo() {
      this.$router.go(-1)
    },
    clickArgument() {
      this.dialogFormVisibleArgument = true
      this.$nextTick(() => {
        this.$refs.formArgument.resetFields()
        queryMerPayConfig({mid: parseInt(this.$route.query.mid), payType: '010'}).then(res => {
          if (res.data.queryMerPayConfig) {
            this.formArgument.thirdMid = res.data.queryMerPayConfig.thirdMid
            this.formArgument.thirdMkey = res.data.queryMerPayConfig.thirdMkey
            this.formArgument.sysAppid = res.data.sysAppid 
          }
        })
      })
    },
    submiltArgument(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let para = util.deepcopy(this.formArgument)
          para.mid = parseInt(this.$route.query.mid)
          para.pay_type = '010'
          updateMerPayConfig(para).then(res => {
            this.dialogFormVisibleArgument = false
            this.$message({
              message: res.message,
              type: 'success'
            });
          })
        } else {
          return
        }
      });
    },
      handleAvatarSuccess(res, file) {
        this.formRate.imgProtocol = res.data.locationPath;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    clickRate() {
      this.dialogFormVisibleRate = true
      this.$nextTick(() => {
        this.$refs.formRate.resetFields()
        queryRateConfig({mid: parseInt(this.$route.query.mid), payType: '010'}).then(res => {
          this.agentShopId = res.data.agentShopId
          this.formRate.rate = res.data.rate
          this.formRate.imgProtocol = res.data.imgProtocol
        })
      })
    },
    submiltRate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let para = util.deepcopy(this.formRate)
          para.mid = parseInt(this.$route.query.mid)
          para.payType = '010'
          para.rate = para.rate.toString()
          updateRateConfig(para).then(res => {
            this.dialogFormVisibleRate = false
            this.$message({
              message: res.message,
              type: 'success'
            });
          })
        } else {
          return
        }
      });
    }
  }
};
</script>
