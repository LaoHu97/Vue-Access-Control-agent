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
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <svg
          class="icon"
          aria-hidden="true">
          <use xlink:href="#icon-xinxi"/>
        </svg>
        <span>商户信息</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="boxCardVisible = true">修改</el-button>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="12">
          <span>商户名称：</span>{{ boxCardText.text }}</el-col>
          <el-col :span="12">
          <span>商户名称：</span>{{ boxCardText.text }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <span>商户名称：</span>{{ boxCardText.text }}</el-col>
          <el-col :span="12">
          <span>商户名称：</span>{{ boxCardText.text }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <span>商户名称：</span>{{ boxCardText.text }}</el-col>
          <el-col :span="12">
          <span>商户名称：</span>{{ boxCardText.text }}</el-col>
        </el-row>
      </div>
    </el-card>

    <el-dialog
      title="修改商户信息"
      :visible.sync="boxCardVisible"
      width="580px">
      <el-form
        :model="editFormBoxCard"
        label-position="left"
        label-width="95px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户名称">
              <el-input
                v-model="editFormBoxCard.name"
                placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="boxCardVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="boxCardVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
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
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <svg
          class="icon"
          aria-hidden="true">
          <use xlink:href="#icon-_mendian"/>
        </svg>
        <span>商户配置</span>
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
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      boxCardText: {},
      switchValue: false,
      boxCardVisible: false,
      editFormBoxCard: {}
    };
  }
};
</script>
