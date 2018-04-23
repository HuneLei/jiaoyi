<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :message="editMessage" :from-dialog="form" :isReadonly="false" :isSaveShow="isSaveShow" :saveLoading="saveLoading" :isFormConfirm="isFormConfirm" @data-save="dataSave">
      <el-form-item label="会员" prop="memberId" slot='memberId' label-width="115px">
        <el-select v-model.number="form.memberId" filterable placeholder="请选择会员" @change="changeMember">
          <el-option v-for="item in memberOption" :key="item.id" :label="item.memberName" :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="省" prop="provinceId" slot='provinceId' label-width="115px">
        <el-select v-model.number="form.provinceId" filterable placeholder="请选择省" @change="changeProvince">
          <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="cityId" slot='cityId' label-width="115px">
        <el-select v-model.number="form.cityId" filterable placeholder="请选择市" @change="changeCity">
          <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区" prop="countyId" slot='countyId' label-width="115px">
        <el-select v-model.number="form.countyId" filterable placeholder="请选择区">
          <el-option v-for="item in countyOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </DialogForm>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import Address from '../../../api/BasicInfo/Address';    // 接口API
import DialogForm from '../../../components/DialogForm'; // 表单弹出框
import district from '../../../api/district';            // 省市区接口

export default {
  activated() {
    // 监听数据创建
    this.$bus.$on('data/page/do', this.dataCreate);
    // 监听数据更新
    this.$bus.$on('data/update', this.dataUpdate);
    // 获取省的选项，默认父ID位88888
    this.getProvince();
    this.getMember();
  },
  deactivated() {
    // 移除监听数据创建
    this.$bus.$off('data/page/do', this.dataCreate);
    // 移除监听数据更新
    this.$bus.$off('data/update', this.dataUpdate);
  },
  components: {
    DialogForm,
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'View_UserInfo',
    ]),
    cityOptions() {
      return this.districtJSON[this.provinceId] || [];
    },
    countyOptions() {
      return this.districtJSON[this.cityId] || [];
    },
  },
  data() {
    // 不能为空的验证
    const verifyNull = (rule, value, callback) => {
      this.$data.editMessage.rules.memberId[0].trigger = 'blur,change';
      this.$data.editMessage.rules.provinceId[0].trigger = 'blur,change';
      this.$data.editMessage.rules.cityId[0].trigger = 'blur,change';
      this.$data.editMessage.rules.countyId[0].trigger = 'blur,change';
      let error = '';
      if (!value) {
        error = callback(new Error('不能为空'));
      } else {
        error = callback();
      }
      return error;
    };
    const isNaN = (rule, value, callback) => {
      this.$data.editMessage.rules.zipCode[0].trigger = 'blur,change';
      this.$data.editMessage.rules.contacterPhone[0].trigger = 'blur,change';
      if (!Number(value)) {
        this.$data.editMessage.rules.zipCode[0].message = '123';
        this.$data.editMessage.rules.contacterPhone[0].message = '123';
      } else {
        callback();
      }
    };
    return {
      districtJSON: {}, //  省市区的json
      districtKeys: [], //  省市区已经调用过的id
      provinceId: null,
      cityId: null,
      countyId: null,

      isProvinceFirst: true,
      isCityFirst: true,
      isMemberChange: false,

      dialogVisible: false,
      editType: '',         // 弹出窗新增编辑判断 0:新增  1:编辑
      editLoading: false,   // 加载
      memberOption: [],  // 会员下拉
      provinceOptions: [],  // 省

      isFormConfirm: false,       // 确定按钮显示控制
      formConfirmLoading: false,  // 确定按钮loading显示控制
      isSaveShow: true,           // 保存按钮显示控制
      saveLoading: false,         // 保存按钮loading显示控制
      isSubmitShow: false,        // 提交按钮显示控制
      submitLoading: false,       // 提交按钮loading显示控制
      // 需要提交的字段
      form: {
        id: '',                         // 地址ID
        memberId: null,                         // 地址ID
        addressName: '',                // 地址名称，不为空
        provinceId: null,               // 省，不为空
        // provinceName: null,             // 省名，不为空
        cityId: null,                   // 市，不为空
        // cityName: null,                 // 市，不为空
        countyId: null,                 // 县，不为空
        // countyName: null,               // 县，不为空
        zipCode: null,                  // 邮政编码
        addressFull: '',                // 详细地址，不为空
        contacter: '',                  // 联系人，不为空
        contacterPhone: '',    // 联系人电话，不为空
        outAddressCode: null,
      },
      dialogFormShow: false,      // 弹出框显示隐藏控制
      editMessage: {
        IsTrue: true,
        // 写入表单组件的数据
        selects: [
          { value: 'memberId', type: 'custom' },
          { label: '地址名称', key: 'addressName', type: 'el-input', placeholder: '请输入地址名称' },
          { value: 'provinceId', type: 'custom' },
          { value: 'cityId', type: 'custom' },
          { value: 'countyId', type: 'custom' },
          { label: '邮政编码', key: 'zipCode', type: 'el-input', placeholder: '请输入邮政编码' },
          { label: '详细地址', key: 'addressFull', type: 'el-input', placeholder: '请输入详细地址' },
          { label: '联系人', key: 'contacter', type: 'el-input', placeholder: '请输入联系人' },
          { label: '联系电话', key: 'contacterPhone', type: 'el-input', placeholder: '请输入联系电话' },
          { label: '外部地址编码', key: 'outAddressCode', type: 'el-input', placeholder: '请输入外部地址编码' },
        ],
        // 弹出框标题
        dialogTitle: '地址新增',
        options: {
          // 省下拉选项
          provinceOption: [],
          // 市下拉选项
          cityOption: [],
          // 区下拉选项
          areaOption: [],
          // 会员下拉
          memberOption: [],
        },
        // checkbox选项值
        checkbox: {},
        // radios选项值
        radios: {},
        // 验证规则
        rules: {
          memberId: [
            { required: true, validator: window.validator.dialogInput, message: '请选择会员名称', trigger: 'blur' },
          ],
          addressName: [
            { required: true, message: '请输入地址名称', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          provinceId: [
            { required: true, type: 'number', message: '请选择省', trigger: 'blur', validator: verifyNull },
          ],
          cityId: [
            { required: true, type: 'number', message: '请选择市', trigger: 'blur' },
          ],
          countyId: [
            { required: true, type: 'number', message: '请选择区', trigger: 'blur' },
          ],
          zipCode: [
            { required: true, message: '请输入数字类型的邮政编码', trigger: 'blur', validator: window.validator.verifyNumberOnlyz },
            { message: '不得超过256位字符', max: 256 },
          ],
          addressFull: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          contacter: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          contacterPhone: [
            { required: true, message: '请输入数字类型的联系电话', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          outAddressCode: [
            { required: false, message: '不得超过256位字符', max: 256 },
          ],
        },
        styleObject: {},
      },
      OldValue: {
        memberId: null,
      },
    };
  },
  methods: {
    getMember() {
      if (this.View_UserInfo.memberType !== 4 && this.View_UserInfo.memberType !== 5) {
        this.memberOption = [
          {
            memberName: this.View_UserInfo.memberName, id: this.View_UserInfo.memberId,
          }];
      } else {
        Address.member().then((res) => {
          if (res.data.code === 0) {
            this.memberOption = res.data.result;
          }
        });
      }
    },
    // 点击新增触发事件
    dataCreate() {
      this.editType = 0;  // 新增
      this.editMessage.dialogTitle = '地址新增';
      this.form.memberId = this.View_UserInfo.memberId;
      Address.memberid().then((res) => {
        if (res.data.code === 0 && res.data.result) {
          const data = res.data.result[0] || {};

          this.form = {
            ...this.form,
            provinceId: data.provinceId || '',
            cityId: data.cityId || '',
            countyId: data.countyId || '',
          };

          if (data.provinceId) {
            this.isProvinceFirst = true;
            this.isCityFirst = true;
            this.isMemberChange = false;

            this.changeProvince(data.provinceId);
            this.changeCity(data.cityId);

            this.provinceId = data.provinceId || '';
            this.cityId = data.cityId || '';
            this.countyId = data.countyId || '';
          } else {
            this.isMemberChange = true;
          }
        } else {
          this.form = {
            ...this.form,
            provinceId: '',
            cityId: '',
            countyId: '',
          };

          this.provinceId = '';
          this.cityId = '';
          this.countyId = '';

          this.isMemberChange = true;
        }
      });
      this.dialogFormShow = true;             // 打开弹出框
    },
    // 点击保存后的触发事件
    dataSave(formName) {
      this.saveLoading = false;      // 保存按钮loading开启
      // 判断类型是新增还是编辑  新增 = 0， 编辑 = 1
      if (this.editType === 1) {
        this.dataSubmitUpdate();
      } else {
        this.dataSubmitCreate();
      }
    },
    // 点击编辑后的触发事件   item
    dataUpdate(row) {
      Address.item(row.id).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.editType = 1;  // 编辑 === 1
          this.editMessage.dialogTitle = '地址编辑';
          // 给表单赋值
          this.form = {
            ...data,
            provinceId: data.provinceId || '',            // 省，不为空
            cityId: data.cityId || '',                    // 市，不为空
            countyId: data.countyId || '',                // 县，不为空
          };

          if (data.provinceId) {
            this.isProvinceFirst = true;
            this.isCityFirst = true;
            this.isMemberChange = false;

            this.changeProvince(data.provinceId);
            this.changeCity(data.cityId);

            this.provinceId = data.provinceId || '';
            this.cityId = data.cityId || '';
            this.countyId = data.countyId || '';
          }

          if (this.form.provinceId) {
            this.dialogFormShow = true;             // 打开弹出框
          }
          // 旧值
          this.OldValue = {
            memberId: data.memberId,
          };
          let index = 0;
          // 判断会员是否存在下拉里
          if (data.memberId) {
            for (let i = 0; i < this.memberOption.length; i += 1) {
              if (this.memberOption[i].id === data.memberId) {
                index = 1;
              }
            }
          }
          // 平台管理员时，同样没有参与的会员下拉选项
          if (index === 0 || this.View_UserInfo.memberType === 5) {
            this.form.memberId = data.memberName;
          }
        }
      });
    },
    // 提交创建  create
    dataSubmitCreate() {
      Address.create(this.form).then((res) => {
        if (res.data.code === 0) {
          this.$bus.$emit('data/list');
          this.$message({
            type: 'success',
            message: '新增成功',
          });
          this.CloseDialog();  // 关闭窗口
        } else {
          this.saveLoading = false; // 关闭保存Loading
        }
        this.editLoading = false;
      });
    },
    // 提交更新  update
    dataSubmitUpdate() {
      if (typeof (this.form.memberId) !== 'number') {
        this.form.memberId = this.OldValue.memberId;
      }
      Address.update(this.form).then((res) => {
        if (res.data.code === 0) {
          this.$bus.$emit('data/list');
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.CloseDialog();  // 关闭窗口
          this.editShow = false;
        }
        this.editLoading = false;
      });
    },
    // 获取省
    getProvince() {
      // 获取省的选项，默认父ID位88888
      district.cityList(88888).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.provinceOptions = data;
          for (let i = 0; i < data.length; i += 1) {
            if (data[i].id === -1) {
              data[i].disabled = true;
            }
          }
        }
      });
    },
    // 改变会员
    changeMember(val) {
      if (typeof val === 'number' && this.isMemberChange) {
        Address.memberid(val).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result[0] || {};
            this.form = {
              ...this.form,
              provinceId: data.provinceId || '',
              cityId: data.cityId || '',
              countyId: data.countyId || '',
            };

            if (data.provinceId) {
              this.isProvinceFirst = true;
              this.isCityFirst = true;
              this.isMemberChange = false;

              this.changeProvince(data.provinceId);
              this.changeCity(data.cityId);

              this.provinceId = data.provinceId || '';
              this.cityId = data.cityId || '';
              this.countyId = data.countyId || '';
            }
          }
        });
      }
    },
    // 改变省
    changeProvince(value) {
      this.provinceId = value;

      if (!this.isProvinceFirst && !this.isCityFirst) {
        this.form.cityId = '';
        this.form.countyId = '';
      }

      if (value) {
        this.getCity(value);
      }
    },
    // 获取市
    getCity(value) {
      // 获取市的选项
      if (this.districtKeys.indexOf(value.toString()) === -1) {
        district.cityList(value).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.isProvinceFirst = false;

            if (!this.isProvinceFirst && !this.isCityFirst) {
              this.isMemberChange = true;
            }

            const json = {};
            json[value] = data;

            this.districtJSON = {
              ...this.districtJSON,
              ...json,
            };

            this.districtKeys = Object.keys(this.districtJSON);
          }
        });
      } else {
        setTimeout(() => {
          this.isProvinceFirst = false;

          if (!this.isProvinceFirst && !this.isCityFirst) {
            this.isMemberChange = true;
          }
        }, 0);
      }
    },
    // 改变市，获取区
    changeCity(value) {
      this.cityId = value;

      if (!this.isProvinceFirst && !this.isCityFirst) {
        this.form.countyId = '';
      }

      if (value) {
        this.getCounty(value);
      }
    },
    // 获取区
    getCounty(value) {
      // 获取区的选项
      if (this.districtKeys.indexOf(value.toString()) === -1) {
        district.cityList(value).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.isCityFirst = false;

            if (!this.isProvinceFirst && !this.isCityFirst) {
              this.isMemberChange = true;
            }

            const json = {};
            json[value] = data;

            this.districtJSON = {
              ...this.districtJSON,
              ...json,
            };

            this.districtKeys = Object.keys(this.districtJSON);
          }
        });
      } else {
        setTimeout(() => {
          this.isCityFirst = false;

          if (!this.isProvinceFirst && !this.isCityFirst) {
            this.isMemberChange = true;
          }
        }, 0);
      }
    },
    //  改变区
    changeCounty(value) {
      this.countyId = value;
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 表单清空
      this.form = {
        provinceId: '',
        cityId: '',
        countyId: '',
      };

      // 关闭保存Loading
      this.saveLoading = false;
      // 关闭弹出表单
      this.dialogFormShow = false;
    },
  },
};
</script>
