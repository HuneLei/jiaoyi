<template>
  <div class="w_businessInfo" v-loading="loading">
    <div class="wq_title">
      <span class="form_title">经营企业编码 :
        <span style="margin-left: 15px;color: black;">{{form.enterpriseCode}}</span>
      </span>
      <span class="form_title" style="margin-left: 220px;">经营企业 :
        <span style="margin-left: 15px;color: black;">{{form.enterpriseName}}</span>
      </span>
    </div>
    <el-form :model="form" ref="form" label-width="120px">
      <FormEditsCom class="edits-coms" :message="editMessage" :from-edit="form" :is-readonly="true" :is-go-back-show="true" @edit-close="goBack" :height-style="240">
        <!--<div slot="mStoreAddress">
          <el-col :span="6" v-for="item in form.mStoreAddress" :key="item.value">
            <el-form-item :label="item.label">
              <el-input v-model="item.value" class="no-border" disabled></el-input>
            </el-form-item>
          </el-col>
        </div>-->
        <!--三证合一-->
        <el-form-item label="附件 :" slot="iEnclosure" v-if="!isShowEnclosure">
          <YuploadFiles :data="convert.getJSON(form.iEnclosure)"></YuploadFiles>
        </el-form-item>
        <!--工商营业执照-->
        <el-form-item label="附件 :" slot="cEnclosure" v-if="isShowEnclosure">
          <YuploadFiles :data="convert.getJSON(form.cEnclosure)"></YuploadFiles>
        </el-form-item>
        <!--组织机构代码-->
        <el-form-item label="附件 :" slot="oEnclosure" v-if="isShowEnclosure">
          <YuploadFiles :data="convert.getJSON(form.oEnclosure)"></YuploadFiles>
        </el-form-item>
        <!--税务登记号-->
        <el-form-item label="附件 :" slot="tEnclosure" v-if="isShowEnclosure">
          <YuploadFiles :data="convert.getJSON(form.tEnclosure)"></YuploadFiles>
        </el-form-item>
        <!--药品经营许可证-->
        <el-form-item label="附件 :" slot="mEnclosure">
          <YuploadFiles :data="convert.getJSON(form.mEnclosure)"></YuploadFiles>
        </el-form-item>
        <!--企业规模-->
        <el-form-item label="附件 :" slot="enclosure">
          <YuploadFiles :data="convert.getJSON(form.enclosure)"></YuploadFiles>
        </el-form-item>
      </FormEditsCom>
    </el-form>
  </div>
</template>

<script>
import FormEditsCom from './../FormEditsCom'; //  表单组件
import Delivery from '../../api/BasicInfo/Delivery'; // api -- 经营企业

export default {
  activated() {
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/BasicInfo',
        name: '基础信息',
        noLink: true,
      },
      {
        path: '/BasicInfo/Delivery',
        name: '经营企业',
        noLink: true,
      },
      {
        path: '/BusinessDeliveyInfo',
        name: '经营企业详情',
        noLink: true,
      },
    ]);
    this.loading = true;
    if (!this.$route.query.id) {
      this.loading = false;
      return;
    }
    Delivery.item(this.$route.query.id).then((res) => {
      if (res.data.code === 0) {
        this.loading = false;
        const data = res.data.result;
        this.form = data;
        this.form.iMyDate = `${data.iStartDate || ''} ── ${data.iEndDate || ''}`;
        // 仓库地址
        // if (this.form.mStoreAddress) {
        //   console.log(33333);
        //   const mStoreAddressArr = [];
        //   if (JSON.parse(this.form.mStoreAddress).length > 0) {
        //     console.log(this.form.mStoreAddress);
        //     for (let i = 0; i < JSON.parse(this.form.mStoreAddress).length; i += 1) {
        //       mStoreAddressArr.push({
        //         label: `仓库地址${i + 1} :`,
        //         value: JSON.parse(this.form.mStoreAddress)[i].value,
        //       });
        //     }
        //     this.form.mStoreAddress = mStoreAddressArr;
        //   }
        // }
        // 判断是否三证合一
        if (data.iCode) {
          this.isShowEnclosure = false;
          this.editMessage.selects[10].fromShow = false;
          this.editMessage.selects[11].fromShow = false;
          this.editMessage.selects[12].fromShow = false;
          this.editMessage.selects[13].fromShow = false;
          this.editMessage.selects[14].fromShow = false;
          this.editMessage.selects[15].fromShow = false;
          this.editMessage.selects[16].fromShow = true;
          this.editMessage.selects[17].fromShow = true;
          this.editMessage.selects[18].fromShow = true;
          this.editMessage.selects[19].fromShow = true;
          this.editMessage.selects[20].fromShow = true;
          this.editMessage.selects[21].fromShow = true;
          this.editMessage.selects[22].fromShow = true;
          this.editMessage.selects[23].fromShow = true;
          this.editMessage.selects[24].fromShow = true;
          this.editMessage.selects[25].fromShow = true;
          this.editMessage.selects[26].fromShow = true;
          this.editMessage.selects[27].fromShow = true;
          this.editMessage.selects[28].fromShow = true;
          this.editMessage.selects[29].fromShow = true;
          this.editMessage.selects[30].fromShow = true;
        } else {
          this.isShowEnclosure = true;
          this.editMessage.selects[10].fromShow = true;
          this.editMessage.selects[11].fromShow = true;
          this.editMessage.selects[12].fromShow = true;
          this.editMessage.selects[13].fromShow = true;
          this.editMessage.selects[14].fromShow = true;
          this.editMessage.selects[15].fromShow = true;
          this.editMessage.selects[16].fromShow = false;
          this.editMessage.selects[17].fromShow = false;
          this.editMessage.selects[18].fromShow = false;
          this.editMessage.selects[19].fromShow = false;
          this.editMessage.selects[20].fromShow = false;
          this.editMessage.selects[21].fromShow = false;
          this.editMessage.selects[22].fromShow = false;
          this.editMessage.selects[23].fromShow = false;
          this.editMessage.selects[24].fromShow = false;
          this.editMessage.selects[25].fromShow = false;
          this.editMessage.selects[26].fromShow = false;
          this.editMessage.selects[27].fromShow = false;
          this.editMessage.selects[28].fromShow = false;
          this.editMessage.selects[29].fromShow = false;
          this.editMessage.selects[30].fromShow = false;
        }
      }
    });
  },
  components: {
    FormEditsCom,
  },
  data() {
    return {
      isShowEnclosure: false,
      loading: true,
      editMessage: {
        tabTitle: '',
        selects: [
          // 详细信息
          { label: 'CPublic', key: 'PageSubtitle1', span: 24, type: 'PageSubtitle', subTitle: { name: '详细信息', icon: 'fa fa-address-book' } },
          { label: '注册资本 :', key: 'registeredCapital', type: 'el-input', noborder: true },
          { label: '法定代表人 :', key: 'legalPerson', type: 'el-input', noborder: true },
          { label: '法定代表人电话 :', key: 'legalPersonPhone', type: 'el-input', noborder: true },
          { label: '企业电话 :', key: 'companyPhone', type: 'el-input', noborder: true },
          { label: '企业邮箱 :', key: 'companyEmail', type: 'el-input', noborder: true },
          { label: '企业网址 :', key: 'companyUrl', type: 'el-input', noborder: true },
          { label: '联系人 :', key: 'contacter', type: 'el-input', noborder: true },
          { label: '联系人电话 :', key: 'contactPhone', type: 'el-input', noborder: true },
          // 营业执照
          { label: 'CPublic', key: 'PageSubtitle2', span: 24, type: 'PageSubtitle', subTitle: { name: '营业执照', icon: 'fa fa-vcard-o' } },
          // 三证合一
          { label: '统一社会信用代码 :', key: 'iCode', type: 'el-input', noborder: true, fromShow: true },
          { label: '成立日期 :', key: 'iFoundDate', type: 'el-input', noborder: true, fromShow: true },
          { label: '营业期限 :', key: 'iMyDate', type: 'el-input', noborder: true, fromShow: true },
          { label: '经营范围 :', key: 'iScope', type: 'el-input', noborder: true, fromShow: true },
          { label: '登记机关 :', key: 'iRegistrationAuthority', type: 'el-input', noborder: true, fromShow: true },
          { label: '附件 :', type: 'custom', value: 'iEnclosure', span: 24, fromShow: true },
          // 非三证合一
          // 工商营业执照
          { label: 'CPublic', key: 'aa1', span: 24, type: 'thirdTitle', thirdTitle: { name: '工商营业执照' }, fromShow: true },
          { label: '营业执照注册号 :', key: 'cNo', type: 'el-input', noborder: true, fromShow: true },
          { label: '成立日期 :', key: 'cFoundDate', type: 'el-input', noborder: true, fromShow: true },
          { label: '营业期限 :', key: 'cMyDate', type: 'el-input', noborder: true, fromShow: true },
          { label: '经营范围 :', key: 'cScope', type: 'el-input', noborder: true, fromShow: true },
          { label: '登记机关 :', key: 'cRegistrationAuthority', type: 'el-input', noborder: true, fromShow: true },
          { label: '附件 :', type: 'custom', value: 'cEnclosure', span: 24, fromShow: true },
          // 组织机构代码
          { label: 'CPublic', key: 'aa2', span: 24, type: 'thirdTitle', thirdTitle: { name: '组织机构代码' }, fromShow: true },
          { label: '组织机构代码 :', key: 'oOrganizationCode', type: 'el-input', noborder: true, fromShow: true },
          { label: '代码证有效期 :', key: 'oOrganizationDate', type: 'el-input', noborder: true, fromShow: true },
          { label: '附件 :', type: 'custom', value: 'oEnclosure', span: 24, fromShow: true },
          // 税务登记号
          { label: 'CPublic', key: 'aa3', span: 24, type: 'thirdTitle', thirdTitle: { name: '税务登记号' }, fromShow: true },
          { label: '税务登记号 :', key: 'tRegistrationCode', type: 'el-input', noborder: true, fromShow: true },
          { label: '税务登记证有效期 :', key: 'tRegistrationDate', type: 'el-input', noborder: true, fromShow: true },
          { label: '附件 :', type: 'custom', value: 'tEnclosure', span: 24, fromShow: true },
          // 药品经营许可证
          { label: 'CPublic', key: 'PageSubtitle3', span: 24, type: 'PageSubtitle', subTitle: { name: '药品经营许可证', icon: 'fa fa-university' } },
          { label: '证号 :', key: 'mDrugNumber', type: 'el-input', noborder: true },
          { label: '质量授权人 :', key: 'mNegotiatingAuthority', type: 'el-input', noborder: true },
          { label: '经营方式 :', key: 'mBusinessMode', type: 'el-input', noborder: true },
          { label: '经营范围 :', key: 'mBusinessScope', type: 'el-input', noborder: true },
          // { label: '仓库地址 :', key: 'mStoreAddress', type: 'el-input', noborder: true, span: 24 },
          // { label: '仓库地址 :', type: 'custom', value: 'mStoreAddress', noborder: true, span: 24 },
          { label: '有效期至 :', key: 'mBusinessTerm', type: 'el-input', noborder: true },
          { label: '发证日期 :', key: 'mFoundDate', type: 'el-input', noborder: true },
          { label: '发证机关 :', key: 'mRegistrationAuthority', type: 'el-input', noborder: true },
          { label: '附件 :', type: 'custom', value: 'mEnclosure', span: 24 },
          // 企业规模
          { label: 'CPublic', key: 'PageSubtitle3', span: 24, type: 'PageSubtitle', subTitle: { name: '企业规模', icon: 'fa fa-pinterest' } },
          { label: '年度 :', key: 'salesDate', type: 'el-input', noborder: true },
          { label: '销售额 :', key: 'salesVolume', type: 'el-input', noborder: true },
          { label: '附件 :', type: 'custom', value: 'enclosure', span: 24 },
          { label: '备注 :', key: 'remarks', type: 'el-input', fromType: 'textarea', span: 24, rows: 2, noborder: true },
        ],
        styleObject: {},
        options: {},
        radios: {},
        parameters: {},
      },
      form: {},
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.wq_title {
  height: 40px;
  background-color: #f0f5f8;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.wq_title .form_title {
  display: inline-block;
  line-height: 40px;
  margin-left: 30px;
}

.edits_medical {
  width: 100%;
  position: relative;
  top: 80px;
}

.edits_medical .page-title {
  width: 11.5rem;
  margin: auto;
  display: block;
  height: 26px;
}

.edits_medical .audit-status {
  width: 12rem;
  margin: 5px auto;
}

.slot_el {
  width: 300px;
}

.edit-form-title {
  font-size: 16px;
  padding: 0.1rem;
  margin-bottom: 0.2rem;
  border-bottom: 0.01rem solid #eee;
}

.el-form-item {
  margin-bottom: 5px;
}

.edit-subtitle {
  margin-left: 1rem;
  padding: 0.05rem 0.2rem;
  font-size: 16px;
}

.el-form-item__error {
  left: 200px !important;
}

.edit-subtitle {
  margin-left: 0.1rem;
}

.el-button.is-disabled,
.el-button.is-disabled:hover,
.el-button.is-disabled:focus {
  color: rgb(191, 200, 217);
  cursor: not-allowed;
  background-image: none;
  background-color: rgb(238, 240, 246);
  border: #f4f6f6;
}

.w_businessInfo .el-form-item {
  margin-bottom: 10px !important;
}
</style>

<style>
.w_businessInfo .fromtemp .is-disabled .el-input__inner {
  cursor: pointer;
  background-color: white !important;
  font-size: 13px;
  /*text-overflow: ellipsis;*/
}

.w_businessInfo .fromtemp .el-textarea.is-disabled .el-textarea__inner {
  cursor: pointer;
  background-color: white !important;
  resize: none;
}
</style>
