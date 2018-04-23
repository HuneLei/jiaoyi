<template>
  <div>
    <el-dialog title="公告查看" :visible.sync="previewShow" size="large" :close-on-click-modal="false" @close="editClose" class="preview" top="0vh">
      <div>
        <div class="page-main">
          <h4>{{this.form.announcementTitle}}</h4>
          <div class="page-detailed">
            <div class="page-share">
            </div>
            <span>创建时间：{{this.form.createTime}}&nbsp;&nbsp;&nbsp;创建人：{{this.form.createBy}}</span>

          </div>
          <div class="page-text">
            <div v-html="content"></div>
          </div>
          <div>
            <!-- 附件：<y-upload-edit :image="true" :pdf="false" :fileList="uploadData" :isDisabled="true"></y-upload-edit> -->
            <ul class="announcementFileUl">
              <li v-for="(item, index) in announcementFileList" :key="item.url" class="announcementFileLi">
                <span>附件 {{index + 1}} </span>&nbsp;&nbsp;&nbsp;
                <a :href="item.url" target="_blank">{{item.name}}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import convert from '../../../utils/convert'; //  自定义转换js

export default {
  mounted() {
    if (!this.isHaveBus) {
      this.isHaveBus = true;
      this.$bus.$on('data/preview', this.dataPreview);
    }
  },
  activated() {
    if (!this.isHaveBus) {
      this.isHaveBus = true;
      this.$bus.$on('data/preview', this.dataPreview);
    }
  },
  deactivated() {
    if (this.isHaveBus) {
      this.isHaveBus = false;
      this.$bus.$off('data/preview', this.dataPreview);
    }
  },
  beforeDestroy() {
    if (this.isHaveBus) {
      this.isHaveBus = false;
      this.$bus.$off('data/preview', this.dataPreview);
    }
  },
  created() {
    if (this.isHaveBus) {
      this.isHaveBus = false;
      this.$bus.$on('data/preview', this.dataPreview);
    }
  },
  data() {
    return {
      previewShow: false,
      content: null,
      isHaveBus: false,
      form: {
        id: null,
        announcementAbstract: '',
        createBy: '',
        createTime: '',
        announcementFile: [],
        announcementText: '',
        announcementTitle: '',
      },
      announcementFileList: [],
    };
  },
  methods: {
    // 转换日期 YYYY-MM-DD
    convertDate(date, type) {
      return convert.convertDate(date, type);
    },
    dataPreview(item, form) {
      this.previewShow = true;
      this.content = item;
      this.form = form;
      if (this.form.announcementFile) {
        this.announcementFileList = JSON.parse(this.form.announcementFile);
      }
      if (this.form.createTime) {
        this.form.createTime = this.form.createTime.substring(0, 10);
      }
    },
    // 关闭面板
    editClose() {
      this.previewShow = false;
    },
  },
};
</script>

<style>
.preview .el-dialog__body {
  font-size: 14px;
}
</style>
<style scoped>
.page-main {
  margin: 0 auto;
  width: 930px;
  padding: 30px 0 0 0;
}
.page-main h4 {
  color: #000;
  font-size: 28px;
  line-height: 28px;
  text-align: center;
}
.page-detailed {
  padding: 40px 0 12px 0;
  font-size: 13px;
  color: #666;
  border-bottom: 1px solid #dae8f5;
}
.page-text {
  width: 930px;
  padding-bottom: 20px;
  margin: 20px 0;
}
.announcementFileUl {
  margin: 50px 20px;
}
.announcementFileLi {
  margin: 20px;
}
</style>

