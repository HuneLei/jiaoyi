<template>
  <div>
    <div class="editBox">
      <el-form ref="form" :model="form" :rules="formRules" label-width="100px" v-loading="editLoading" :style="bodyHeight" style="padding-right: 10px">
        <el-form-item label="公告标题" prop="announcementTitle">
          <el-input v-model="form.announcementTitle" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="公告摘要" prop="announcementAbstract">
          <el-input v-model="form.announcementAbstract" placeholder="请输入公告摘要"></el-input>
        </el-form-item>
        <el-form-item label="期间" prop="announcementDate">
          <el-date-picker v-model="announcementDate" format="yyyy-MM-dd" type="datetimerange" :picker-options="pickerOptions2" placeholder="选择期间"></el-date-picker>
        </el-form-item>
        <el-form-item label="附件">
          <!-- <y-upload-edit :fileList="form.announcementFile" @upload-result="oEnclosureResult" :video="true" :multi="false"></y-upload-edit> -->
          <y-upload-edit :excel="true" :ppt="true" :word="true" :pdf="true" :rar="true" :fileList="uploadData" @upload-result="uploadResult"></y-upload-edit>
        </el-form-item>
        <el-form-item label="公告内容" prop="announcementText">
          <div class="edit_container">
            <Ueditor @ueditorText="ueditorText" :disabled="false"></Ueditor>
          </div>
          <!-- <el-input type="textarea" :rows="20" v-model="form.announcementText" placeholder="请输入公告内容"></el-input> -->
        </el-form-item>
      </el-form>
      <div style="padding: 10px 0;">
        <el-button style="padding-top: 0.1rem;" @click="editClose()">返回</el-button>
        <el-button style="padding-top: 0.1rem;" type="primary" @click="dataSubmit('form')">保存</el-button>
        <el-button style="padding-top: 0.1rem;" type="success" @click="dataPreview()">预览</el-button>
      </div>
    </div>
    <Preview></Preview>
  </div>

</template>

<script>
/**
 * Created by linyiping on 2017/10/24.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import Ueditor from '../../../components/Ueditor';
import NoticeList from '../../../api/BasicInfo/NoticeList';
import Preview from './Preview';
import convert from '../../../utils/convert'; //  自定义转换js

export default {
  activated() {
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/',
        name: '基础信息',
        noLink: true,
      },
      {
        path: '/',
        name: '公告列表',
        noLink: true,
      },
    ]);
    if (this.$route.query.id) {
      this.ID = this.$route.query.id;
      this.dataUpdate();
    } else {
      this.dataCreate();
    }
  },
  components: {
    Ueditor,
    Preview,
  },
  computed: {
  },
  watch: {
    announcementDate() {
      return this.form.announcementDate;
    },
  },
  data() {
    // 期间
    const validateAnnouncementDate = (rule, value, callback) => {
      let error = '';
      if (this.$data.announcementDate) {
        if (!this.$data.announcementDate[0] || !this.$data.announcementDate[1]) {
          this.$data.editMessage.rules.announcementDate[0].trigger = 'blur,change';
          error = callback(new Error('请选择期间范围'));
        } else {
          error = callback();
        }
      } else {
        error = callback(new Error('请选择期间范围'));
      }
      return error;
    };
    return {
      editType: '',
      uploadData: [],
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 7));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 30));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 90));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '无穷大',
          onClick(picker) {
            const end = new Date((new Date('9999-12-31').getTime() - (3600 * 1000 * 8)));
            const start = picker.minVisibleDate ?
              new Date(new Date(picker.minVisibleDate).getTime() - (3600 * 1000 * 8)) : new Date();
            picker.$emit('pick', [start, end]);
          },
        }],
      },
      editor: null,
      form: {
        id: null,
        announcementAbstract: '',
        announcementBDate: '',
        announcementEDate: '',
        announcementFile: [],
        announcementText: '',
        announcementTitle: '',
      },
      editLoading: false,
      bodyHeight: `height: ${window.innerHeight - 220}px; overflow-y: auto;`,
      formRules: {
        announcementTitle: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
        ],
        // announcementText: [
        //   { required: true, message: '请输入公告内容', trigger: 'blur' },
        // ],
        announcementDate: [
          { required: true, message: '请选择展示期间', validator: validateAnnouncementDate, trigger: 'change, blur' },
        ],
      },
      ID: null,
      oEnclosure: [], // 附件
      announcementDate: [],
    };
  },
  methods: {
    ...mapActions([
      'isBack',
    ]),
    // 上传
    uploadResult(res) {
      this.form.announcementFile = res;
      this.uploadData = this.convert.getJSON(this.form.announcementFile);
    },
    ueditorText(value) {
      this.editor = value;
    },
    // 预览
    dataPreview() {
      this.form.announcementBDate = this.announcementDate[0];
      this.form.announcementEDate = this.announcementDate[1];
      // this.$bus.$emit('data/preview', this.form.announcementText, this.form);
      this.$bus.$emit('data/preview', this.editor.getContent(), this.form);
    },
    dataCreate() {
      this.editType = '新增';
      this.$refs.form.resetFields();
      this.announcementDate = '';
      this.uploadData = [];
      // 编辑器插入内容  需实例化完成后调用
      this.editor.ready(() => {
        this.editor.setContent('');
      });
    },
    // 编辑
    dataUpdate() {
      this.editType = '编辑';
      // this.editLoading = true;
      this.uploadData = [];
      NoticeList.item(this.ID).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.form = data;
          this.announcementDate = [];
          if (data.announcementBtime && data.announcementEtime) {
            this.announcementDate = [data.announcementBtime, data.announcementEtime];
          }
          // 编辑器插入内容  需实例化完成后调用
          this.editor.ready(() => {
            this.editor.setContent(data.announcementText || '');
          });
          // 附件
          // 附件信息
          this.form.announcementFile = data.announcementFile;
          if (!this.form.announcementFile) {
            this.form.announcementFile = 0;
          }
          if (typeof (this.toJSON(data.announcementFile)) === 'object') {
            this.uploadData = this.toJSON(data.announcementFile);
          }
        }
        this.editLoading = false;
      });
    },
    // 转换日期 YYYY-MM-DD
    convertDate(date, type) {
      return convert.convertDate(date, type);
    },
    //  json字符串转json，否则还是返回字符串
    toJSON(str) {
      return convert.toJSON(str);
    },
    // 附件
    oEnclosureResult(res) {
      this.form.announcementFile = res;
      this.uploadData = this.convert.getJSON(this.form.announcementFile);
    },
    // 保存
    dataSubmit(formName) {
      this.editLoading = true;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.editLoading = false;
          return false;
        }
        this.editor.ready(() => {
          this.form.announcementText = this.editor.getContent();
        });
        this.dataSubmitUpdate();
        return true;
      });
    },
    // 提交更新
    dataSubmitUpdate() {
      this.editLoading = true;
      if (this.editType === '新增') {
        this.form.id = 0;
      } else {
        this.form.id = this.$route.query.id;
      }
      if (typeof (this.form.announcementFile) === 'object') {
        this.form.announcementFile = this.toJSON(this.form.announcementFile.announcementFile);
      }
      this.form.announcementDate = `${this.convertDate(this.announcementDate[0])} - ${this.convertDate(this.announcementDate[1])}`;
      NoticeList.update(this.form).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '编辑成功',
          });
          this.editClose();
        }
        this.editLoading = false;
      });
    },
    // 转换日期
    toDate(str) {
      return convert.convertDate(str, 2);
    },
    // 关闭面板
    editClose() {
      // 清空编辑器
      this.form.announcementFile = [];
      this.$refs.form.resetFields();
      this.editor.ready(() => {
        this.editor.execCommand('cleardoc');
      });
      history.back();
    },
  },
};
</script>

<style scoped>
.textarea-box {
  position: relative;
}

.textarea-tip {
  position: absolute;
  right: 20px;
  bottom: -8px;
  font-size: 12px;
  color: #878888;
}
.titleC {
  font-size: 12px;
  color: #9e9e9e;
  margin-top: -11px;
}
</style>

<style>
.editer-article .ql-container {
  height: 340px !important;
}

.editer-article .ql-snow.ql-toolbar button,
.ql-snow .ql-toolbar button {
  border: 1px solid #eee;
  margin-right: 5px;
}

.editer-article .ql-snow .ql-picker {
  line-height: 24px;
  border: 1px solid #eee;
}
</style>

