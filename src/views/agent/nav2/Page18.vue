<template>
  <section>
    <!--工具条-->
    <div class="top_header">
      <p class="top_header_text">特殊费率申请</p>
      <el-form :model="filters" ref="filters" label-width="120px" label-position="left">
        <el-row>
          <el-form-item label="选择特殊费率">
            <el-select v-model="filters.speRateId" placeholder="请选择">
              <el-option
                v-for="item in optionsSpeRate"
                :key="item.id"
                :label="item.speName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="附件资料">
              <el-upload
                class="avatar-uploader"
                :action="uploadZIP"
                :data="{id: $route.query.mid}"
                :show-file-list="false"
                :on-success="handleAvatarScucess"
                :before-upload="beforeAvatarUploadOther">
                <i v-if="filters.material" class="el-icon-document avatar" style="font-size:28px;line-height:100px;"></i>
                <!-- <img v-if="imageUrl.img_other" :src="imageUrl.img_other" class="avatar"> -->
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="submileRate" size="medium" round>提 交</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="mname" label="商户名称" min-width="100">
        </el-table-column>
        <el-table-column prop="gmt_create" label="创建时间" min-width="100" :formatter="formatterDate">
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" min-width="120" :formatter="formatterPayType">
        </el-table-column>
        <el-table-column prop="rate" label="费率（‰）">
        </el-table-column>
        <el-table-column prop="status1" label="审核状态" min-width="120" :formatter="formatterStatus1">
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row class="toolbar">
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  querySpeRateList,
  uploadZIP,
  applicationSpecialRate,
  queryChangeSpecialRate
} from "../../../api/agent";

export default {
  data() {
    return {
      uploadZIP: uploadZIP,
      //商户名
      filters: {
        speRateId: '',
        material: '123123123'
      },
      optionsSpeRate: [],
      total: 0,
      page: 1,
      users: [],
      listLoading: false
    };
  },
  methods: {
    formatterStatus1(row, column) {
      return row.status1 === '1' ? '审核中' : row.status1 === '2' ? '驳回' : row.status1 === '3' ? '通过' : '未知'
    },
    formatterDate(row, column) {
      return (row.gmt_create = util.formatDate.format(
        new Date(row.gmt_create),
        "yyyy/MM/dd hh:mm:ss"
      ));
    },
    formatterPayType(row, column) {
      return util.formatPayment(row.payType)
    },
    submileRate() {
      if (!this.filters.speRateId) {
        return this.$message({
          message: '请选择特殊费率',
          type: 'warning'
        })
      }
      let para = this.filters
      para.mid = parseInt(this.$route.query.mid)
      applicationSpecialRate(para).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getUsers();
      })
    },
    handleAvatarScucess(res, file) {

    },
    beforeAvatarUploadOther(file) {
      const isZIP = file.name.substring(file.name.lastIndexOf('.') + 1)	 === 'zip'
      const isLt3M = file.size / 1024 / 1024 < 20;
      if (!isZIP) {
        this.$message.error('上传附件只能是 ZIP 格式!');
      }
      if (!isLt3M) {
        this.$message.error('上传附件大小不能超过 20MB!');
      }
      return isZIP && isLt3M;
    },
    getSpeRateList() {
      querySpeRateList().then(res => {
        this.optionsSpeRate = res.data
      })
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers() {
      this.page = 1;
      this.getList();
    },
    //获取用户列表
    getList() {
      let para = {
        pageNum: this.page.toString(),
        mid: parseInt(this.$route.query.mid)
      };
      this.listLoading = true;
      queryChangeSpecialRate(para).then(res => {
        this.total = res.data.totalCount;
        this.users = res.data.changeRateByPager;
        this.listLoading = false;
      });
    }
  },

  mounted() {
    this.getUsers();
    this.getSpeRateList()
  }
};
</script>

<style scoped>
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
.top_header{
  width: 350px;
  margin: auto;
}
.top_header_text{
  text-align: center;
  font-size: 20px;
}
</style>
