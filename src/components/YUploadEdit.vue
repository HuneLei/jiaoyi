<template>
  <div class="el-pload-edit">

    <el-upload ref="upload" class="upload-demo" :action="uploadHost" :accept="acceptString" :multiple="multi" :with-credentials="true" :auto-upload="true" :before-upload="beforUpload" :on-error="errorUpload" :http-request="httpRequest" :file-list="previewFileList" :on-change="onChange" :show-file-list="false" :disabled="isReadonly">
      <div>
        <el-button :disabled="isDisabled" size="small" type="primary">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip" v-if="showBrief" >上传图片不超过4M，PDF文件不超过10M</div> -->
      </div>
    </el-upload>

    <YuploadFiles class="file_preview" :data="fileList" :isDelete="!isDisabled" :previewIndex="initialIndex" :isShow="previewShow" @preview-hide="previewHide"></YuploadFiles>

    <el-button v-if="showtemplate" size="small" type="info" class="file_Template" @click="templateDown(url)">模板下载</el-button>

    <ul class="file-list-preview">
      <li class="file-list-preview-li" v-for="(item, index) in previewFileList" :key="item.url">

        <!-- 附件预览关闭按钮 -->
        <span class="close" :class="item.status === 'success' && !isDisabled && showClose ? 'show' : ''" @click="removeFile(item, previewFileList)">×</span>

        <!-- 进度 -->
        <el-progress class="file-list-preview-li-circle" :class="(item.status === 'success' && item.percentage === 100) || isDisabled ? 'hide' : ''" type="circle" :percentage="item.percentage" :width="50" :stroke-width="4"></el-progress>

        <el-tooltip v-show="item.status === 'success' && item.percentage === 100" effect="dark" :content="item.name" placement="top">
          <span class="file-list-preview-li-img" @click="watchFile(index)">
            <span v-if="item.type === 'pdf'">
              <i class="upload-icon iconfont icon-pdf"></i>
            </span>
            <span v-else-if="item.type === 'word'">
              <i class="upload-icon iconfont icon-word"></i>
            </span>
            <span v-else-if="item.type === 'excel'">
              <i class="upload-icon iconfont icon-exl"></i>
            </span>
            <span v-else-if="item.type === 'ppt'">
              <i class="upload-icon iconfont icon-ppt"></i>
            </span>
            <span v-else-if="item.type === 'rar'">
              <i class="upload-icon iconfont icon-fujianleixingyasuobao"></i>
            </span>
            <span v-else>
              <img class="file-list-preview-img" :src="imageUrl(item)" />
            </span>
          </span>
        </el-tooltip>
      </li>
    </ul>

  </div>
</template>

<script>
import config from '../config';
import upload from '../api/upload';

export default {
  props: {
    // 是否签章
    signature: {
      default: false,
    },
    isDisabled: true,
    isReadonly: false,
    // 初始化文件变量
    fileList: {
      type: Array,
    },
    // 当前文件变量
    UpdateFile: {
      type: Array,
    },
    // 多个上传
    multi: {
      default: true,
    },
    showBrief: {
      default: false,
    },
    data: {
      type: Array,
    },
    fileSize: {
      default: 2 * 1024000,
    },
    image: {     // 图片
      default: true,
    },
    imageSize: {
      default: 2 * 1024000,
    },
    pdf: {      // pdf
      default: true,
    },
    pdfSize: {
      default: 2 * 1024000,
    },
    excel: {    //  excel
      default: false,
    },
    word: {     //  word
      default: false,
    },
    ppt: {      //  ppt
      default: false,
    },
    rar: {      //  rar
      default: false,
    },
    showtemplate: {
      default: false,
    },
    url: {
      default: '',
    },
    all: {      //  所有文件
      default: false,
    },
    isIndex: {
      default: 0,
    },
  },
  computed: {
    showClose() {
      let count = 0;
      for (let i = 0; i < this.previewFileList.length; i += 1) {
        const item = this.previewFileList[i];
        if (Number(item.percentage) === 100) {
          count += 1;
        }
      }
      if (count === this.previewFileList.length) {
        return true;
      }
      return false;
    },
    uploadHost() {
      return `${config.getUploadHost()}?access_token=${config.getToken()}`;
    },
    accept() {
      const ret = [];
      if (this.image) ret.push(this.fileType.image);
      if (this.pdf) ret.push(this.fileType.pdf);
      if (this.excel) ret.push(this.fileType.excel);
      if (this.word) ret.push(this.fileType.word);
      if (this.ppt) ret.push(this.fileType.ppt);
      return ret;
    },
    acceptString() {
      if (!this.all && !this.rar) {
        return this.accept.toString();
      }
      return '';
    },
  },
  watch: {
    fileList() {
      this.previewFileList = this.fileList;
      for (let i = 0; i < this.fileList.length; i += 1) {
        const item = this.fileList[i];
        this.previewFileList[i] = {
          ...item,
          status: !item.percentage || item.percentage < 100 ? 'uploading' : 'success',
          percentage: item.percentage || 0,
        };
      }
    },
  },
  data() {
    return {
      fileType: {
        image: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
        pdf: 'application/pdf',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
        word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
        ppt: 'application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint',
        rar: '',
      },
      previewShow: false,
      previewImg: '',
      previewPdf: '',
      previewFileList: this.fileList,
      indexId: 0,
      initialIndex: 0,
      fileLength: 0,
      fileUploadCount: 0,
      wrongFilesArr: [],
    };
  },
  methods: {
    //  选择附件触发
    onChange(file, fileList) {
      if (this.multi) {
        this.fileLength = fileList.length;
        this.previewFileList = fileList;
        this.indexId = fileList.indexOf(file);
      } else {
        this.fileLength = 1;
        this.indexId = 0;
        this.previewFileList = [file];
      }
      this.previewFileList[this.indexId] = {
        ...this.previewFileList[this.indexId],
        type: file.raw.type,
        percentage: 0,
        status: 'uploading',
      };
      for (let i = 0; i < this.previewFileList.length; i += 1) {
        const item = this.previewFileList[i];
        this.previewFileList[i] = {
          ...item,
          status: !item.percentage || item.percentage < 100 ? 'uploading' : 'success',
          percentage: item.percentage || 0,
        };
      }
    },
    //  自定义上传
    httpRequest(e) {
      const indexId = this.indexId;
      const formData = new FormData();
      formData.append('file', e.file);

      upload.upload(formData, this.onProgress, e.onProgress, indexId, this.errorUpload)
        .then((res) => {
          const itemFile = this.previewFileList[indexId];
          if (res) {
            if (res.data.code === 0) {
              try {
                const arr = this.previewFileList;
                const oldUrl = this.previewFileList[indexId].url;
                this.successUpload(res, arr, oldUrl);
                this.finishUpload();
              } catch (error) {
                return false;
              }
            } else {
              this.errorUpload(indexId, res.data.message);
            }
          }
          return true;
        });
    },
    onProgress(e, fileProgress, index) {
      let percent = parseInt(((e.loaded / e.total) * 100), 0);
      percent = percent === 100 ? 99 : percent;
      for (let i = 0; i < this.previewFileList.length; i += 1) {
        const item = this.previewFileList[i];
        if (i === index) {
          this.$set(this.previewFileList, i, {
            ...item,
            status: !percent || percent < 100 ? 'uploading' : 'success',
            percentage: percent,
          });
        } else {
          this.$set(this.previewFileList, i, {
            ...item,
            status: !item.percentage || item.percentage < 100 ? 'uploading' : 'success',
          });
        }
      }
      fileProgress({ percent: percent === 100 ? 99 : percent });
    },
    // 移除文件
    removeFile(file, fileList) {   // fileList上传的总量   //file当前移除的文件
      const arr = fileList;
      const index = fileList.indexOf(file);
      arr.splice(index, 1);
      this.fileUploadCount -= 1;
      this.returnUploadResult(arr);
    },
    // 上传成功
    successUpload(response, fileList, oldUrl) {    // fileList上传的总量   //file当前上传的文件
      this.returnUploadResult(fileList, response, oldUrl);
    },
    // 返回结果数组
    returnUploadResult(fileList, response, oldUrl) {
      if (this.signature) {
        this.$emit('return-click', fileList, response, oldUrl);
        return;
      }
      let arr = fileList;
      let data = {};
      let url = null;
      if (response) url = response.data.result;
      for (let i = 0; i < fileList.length; i += 1) {
        const item = fileList[i];
        let type = 'other';
        if (this.fileType.image.indexOf(item.type) > -1 || item.type === 'image') {
          type = 'image';
        }
        if (item.type === this.fileType.pdf || item.type === 'pdf') {
          type = 'pdf';
        }
        if (this.fileType.excel.indexOf(item.type) > -1 || item.type === 'excel') {
          type = 'excel';
        }
        if (this.fileType.word.indexOf(item.type) > -1 || item.type === 'word') {
          type = 'word';
        }
        if (this.fileType.ppt.indexOf(item.type) > -1 || item.type === 'ppt') {
          type = 'ppt';
        }
        if (item.type === this.fileType.rar || item.type === 'rar') {
          type = 'rar';
        }
        if (url && oldUrl && oldUrl === item.url) {
          data = {
            type,
            url,
            name: item.name,
            uid: item.uid,
            status: 'success',
            percentage: 100,
          };
          arr[i] = data;
          break;
        }
      }
      try {
        arr = JSON.stringify(arr);
      } catch (error) {
        this.$message({
          type: 'error',
          message: '上传失败',
        });
      }
      this.$emit('upload-result', arr, this.isIndex);
    },
    // 上传失败
    errorUpload(indexId, message) {
      this.wrongFilesArr.push(indexId);
      this.$message({
        type: 'error',
        message,
      });
      this.finishUpload();
    },
    //  上传完成之后的验证
    finishUpload() {
      this.fileUploadCount += 1;
      if (this.fileUploadCount === this.fileLength) {
        const fileArr = [];
        for (let i = 0; i < this.wrongFilesArr.length; i += 1) {
          const item = this.wrongFilesArr[i];
          fileArr.push(this.previewFileList[item]);
        }
        const arr = this.previewFileList;
        for (let i = 0; i < fileArr.length; i += 1) {
          const item = fileArr[i];
          const index = arr.indexOf(item);
          arr.splice(index, 1);
          this.fileUploadCount -= 1;
          this.fileLength -= 1;
        }
        this.returnUploadResult(arr);
        this.wrongFilesArr = [];
      }
    },
    beforeClose(done) {
      this.previewImg = '';
      this.previewPdf = '';
      done();
    },
    // 上传前验证
    beforUpload(file) {
      if (!this.all && file.size < this.imageSize) {
        const patt = new RegExp('image/');
        let message = '请上传2MB大小以内的图片或2MB以内的PDF';
        if (this.image && patt.test(file.type)) {
          if (file.size < this.imageSize) {
            return true;
          }
          message = '请上传2MB大小以内的图片';
        }
        if (this.pdf && file.type === 'application/pdf') {
          if (file.size < this.pdfSize) {
            return true;
          }
          message = '请上传2MB以内的PDF';
        }
        if (this.excel) {
          if (this.fileType.excel.indexOf(file.type) > -1) {
            return true;
          }
          message = '请上传正确的excel文档';
        }
        if (this.word) {
          if (this.fileType.word.indexOf(file.type) > -1) {
            return true;
          }
          message = '请上传正确的word文档';
        }
        if (this.ppt) {
          if (this.fileType.ppt.indexOf(file.type) > -1) {
            return true;
          }
          message = '请上传正确的PPT文档';
        }
        if (this.rar) {
          if (file.type === this.fileType.rar || file.type === 'rar' || file.type === 'application/x-zip-compressed') {
            return true;
          }
          message = '请上传正确的压缩文件';
        }
        this.$message({
          type: 'error',
          message,
        });
        return false;
      } else if (file.size >= this.fileSize) {
        this.$message({
          type: 'error',
          message: '请上传2M以内的文件',
        });
        return false;
      }
      return true;
    },
    //  附件查看
    watchFile(index) {
      this.initialIndex = index;
      const item = this.fileList[index];
      if (this.signature) {
        this.$emit('file-click', item);
        return;
      }
      if (item.type === 'image') {
        this.previewShow = true;
      } else {
        window.open(item.url);
      }
    },
    //  预览隐藏
    previewHide() {
      this.previewShow = false;
    },
    // 附件下载
    templateDown(url) {
      window.open(url);
    },
    //  图片地址，防止打开预览时再加载一遍
    imageUrl(item) {
      return `${item.url}?type=${item.type}&url=${item.url}`;
    },
  },
};
</script>
<style scoped>
.file_preview {
  position: absolute;
  top: 0;
  left: 80px;
}

.file-list-preview {
  width: 100%;
  overflow: hidden;
  padding-top: 10px;
}

.file-list-preview-li {
  float: left;
  border: 2px solid #ccc;
  margin-right: 10px;
  width: 50px;
  height: 50px;
  position: relative;
}

.file-list-preview-li-circle {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 2;
}

.file-list-preview-li-img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.close {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  background-color: #f00;
  color: #fff;
  border-radius: 50%;
  z-index: 2;
  display: none;
}

.close.show {
  display: block;
}

.hide {
  display: none;
}

.file-list-preview-li:hover {
  border: 2px solid #0868cf;
  cursor: pointer;
}

.file-list-preview-img {
  width: 50px;
  height: 50px;
  display: block;
}

.upload-icon {
  display: block;
  width: 50px;
  line-height: 50px;
  font-size: 32px;
  text-align: center;
}

.icon-pdf {
  color: #e9573f;
}

.icon-word {
  color: #2a5699;
}

.icon-exl {
  color: #249e59;
}

.icon-ppt {
  color: #ff3300;
}

.icon-fujianleixingyasuobao {
  color: #efce4a;
}

/* 模板下载 */

.file_Template {
  position: absolute;
  top: 5px;
  left: 145px;
}
</style>

<style>
.el-upload-list__item {
  display: inline-block !important;
  width: 3rem !important;
}

.el-pload-edit .el-upload__tip {
  float: right;
  right: -70px;
  position: relative;
  z-index: -10;
}

.YUload-dialog .el-dialog--small {
  min-width: 500px;
  min-height: 500px;
  width: 80%;
  height: 80%;
  top: 10% !important;
}

.YUload-dialog .el-dialog__body {
  height: 80%;
  margin-top: -26px;
}
</style>
