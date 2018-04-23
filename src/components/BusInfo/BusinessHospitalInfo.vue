<template>
  <div class="w_businessInfo" v-loading="loading">
    <div class="wq_title">
      <span class="form_title">医疗机构编码 :
        <span style="margin-left: 15px;color: black;">{{form.hospitalCode}}</span>
      </span>
      <span class="form_title" style="margin-left: 220px;">医疗机构 :
        <span style="margin-left: 15px;color: black;">{{form.hospitalName}}</span>
      </span>
    </div>
    <el-form :model="form" ref="form" label-width="120px">
      <FormEditsCom class="edits-coms" :message="editMessage" :from-edit="form" :is-readonly="true" :is-go-back-show="true" @edit-close="goBack" :height-style="240">
        <el-form-item label="附件 :" slot="dEnclosure">
          <YuploadFiles :data="convert.getJSON(form.dEnclosure)"></YuploadFiles>
        </el-form-item>
        <el-form-item label="附件 :" slot="oEnclosure">
          <YuploadFiles :data="convert.getJSON(form.oEnclosure)"></YuploadFiles>
        </el-form-item>
      </FormEditsCom>
    </el-form>
  </div>
</template>

<script>
import FormEditsCom from './../FormEditsCom'; //  表单组件
import Hospital from '../../api/BasicInfo/Hospital'; // api -- 医疗机构

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
        path: '/BasicInfo/Hospital',
        name: '医疗机构',
        noLink: true,
      },
      {
        path: '/BusinessHospitalInfo',
        name: '医疗机构详情',
        noLink: true,
      },
    ]);
    this.loading = true;
    if (!this.$route.query.id) {
      this.loading = false;
      return;
    }
    Hospital.item(this.$route.query.id).then((res) => {
      if (res.data.code === 0) {
        this.loading = false;
        const data = res.data.result;
        this.form = data;
        this.form.MydBusinessFrom = `${data.dBusinessFrom || ''} ── ${data.dBusinessTerm || ''}`;
        if (data.oOrganizationDate) {
          this.form.oOrganizationDate = JSON.parse(data.oOrganizationDate);
          this.form.oOrganizationDate = `${this.form.oOrganizationDate[0]} ── ${this.form.oOrganizationDate[1]}`;
        }
      }
    });
  },
  components: {
    FormEditsCom,
  },
  data() {
    return {
      loading: true,
      editMessage: {
        tabTitle: '',
        selects: [
          { label: 'CPublic', key: 'PageSubtitle1', span: 24, type: 'PageSubtitle', subTitle: { name: '详细信息', icon: 'fa fa-address-book' } },
          { label: '设备 :', key: 'equipment', type: 'el-input', noborder: true },
          { label: '日门诊量 :', key: 'dayOutpatientVolume', type: 'el-input', noborder: true },
          { label: '机构定位经度 :', key: 'longitude', type: 'el-input', noborder: true },
          { label: '机构定位纬度 :', key: 'latitude', type: 'el-input', noborder: true },
          { label: '法定代表人 :', key: 'legalPerson', type: 'el-input', noborder: true },
          { label: '法定代表人电话 :', key: 'legalPersonNo', type: 'el-input', noborder: true },
          { label: '主要负责人 :', key: 'owner', type: 'el-input', noborder: true },
          { label: '主要负责人电话 :', key: 'ownerNo', type: 'el-input', noborder: true },
          { label: '联系电话 :', key: 'phone', type: 'el-input', noborder: true },
          { label: '传真电话 :', key: 'fax', type: 'el-input', noborder: true },
          { label: '邮编 :', key: 'zipCode', type: 'el-input', noborder: true },
          { label: '网址 :', key: 'url', type: 'el-input', noborder: true },
          { label: '联系人 :', key: 'contacter', type: 'el-input', noborder: true },
          { label: '联系人电话 :', key: 'contactPhone', type: 'el-input', noborder: true },
          { label: 'CPublic', key: 'PageSubtitle2', span: 24, type: 'PageSubtitle', subTitle: { name: '医疗机构执业许可证', icon: 'fa fa-vcard-o' } },
          { label: '登记号 :', key: 'dNumber', type: 'el-input', noborder: true },
          { label: '诊疗科目 :', key: 'dEdicalSubjects', type: 'el-input', noborder: true },
          { label: '经营性质 :', key: 'dManagement', type: 'el-input', noborder: true },
          { label: '发证日期 :', key: 'dFoundDate', type: 'el-input', noborder: true },
          { label: '有效期限 :', key: 'MydBusinessFrom', type: 'el-input', noborder: true },
          { label: '发证机关 :', key: 'dRegistrationAuthority', type: 'el-input', noborder: true },
          { label: '附件 :', type: 'custom', value: 'dEnclosure', span: 24 },
          { label: 'CPublic', key: 'PageSubtitle3', span: 24, type: 'PageSubtitle', subTitle: { name: '组织机构代码证', icon: 'fa fa-pinterest' } },
          { label: '组织机构代码 :', key: 'oOrganizationCode', type: 'el-input', noborder: true },
          { label: '有效期 :', key: 'oOrganizationDate', type: 'el-input', noborder: true },
          { label: '附件 :', type: 'custom', value: 'oEnclosure', span: 24 },
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
</style>

<style>
.w_businessInfo .fromtemp .is-disabled .el-input__inner {
  cursor: pointer;
  background-color: white !important;
  font-size: 13px;
}

.w_businessInfo .fromtemp .el-textarea.is-disabled .el-textarea__inner {
  cursor: pointer;
  background-color: white !important;
  resize: none;
}
</style>
