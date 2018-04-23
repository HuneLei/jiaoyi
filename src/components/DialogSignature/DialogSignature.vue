<template>
  <div class="dialog-sign">
    <el-dialog :title="signOptions.signTitle" :visible.sync="signVisibleOut" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @open="dialogOpen" top="15px">
      <div class="pdf" v-loading="signOptions.isLoading" :style="signContentStyle">
        <object id="PDFForm" style="display: block; margin: 0 auto" classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" width="1000" height="100%" border="0">
          <!-- <param name="_Version" value="65539">
                                        <param name="_ExtentX" value="20108">
                                        <param name="_ExtentY" value="50">
                                        <param name="_StockProps" value="0"> -->
          <param name="src" value="">
        </object>
      </div>
      <div slot="footer" class="dialog-footer">
        <span class="dialog-btn">
          <el-button size="small" name="signature" type="primary" class="page_btn" :loading="btnIsLoading.signature" :disabled="!authbtn.fileSeal || btnIsDisabled.signature" @click="signContract()">
            <i class="icon iconfont icon-qianzhang"></i>
            合同签章
          </el-button>
          <el-button name="Back" size="small" @click="signDialogClose" class="page_btn">
            <i class="icon iconfont icon-fanhui"></i>返回
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * Created by lqy
 * 合同签章弹框
 */

import { mapActions, mapGetters } from 'vuex';
import config from '../../config';
import netcapki from '../../utils/netcapki';    // 插件地址
import TriContractList from '../../api/Contract/TriContractList';
import cakey from '../../api/cakey';    // 获取插入的ukey的key值

export default {
  activated() {
    this.authbtn = TriContractList.authbtn();
    // console.log(444, this.authbtn);
    this.$bus.$on('data/contractId', this.getContractId);
  },
  deactivated() {
    this.$bus.$off('data/contractId', this.getContractId);
  },
  watch: {
    authList() {
      this.authbtn = TriContractList.authbtn();
    },
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      signDialogVisible: false,
      contractId: '',
      cakey: '',
      contractModel: '',
      pageNumber: null,
      btnloading: false,
      ocert: '',
    }
  },
  computed: {
    ...mapGetters([
      'View_UserInfo',
      'View_UserInfor',
    ]),
    signContentStyle() {
      return `height: ${window.innerHeight - 55 - 57 - 60}px; overflow-y: auto;`;
    },
    uploadHost() {
      return `${config.getUploadHost()}pdf?access_token=${config.getToken()}`;
    },
  },
  props: {
    signVisibleOut: true,
    signOptions: {
      type: Object,
      default() {
        return {
          signTitle: '',                  //  弹出框标题1
          url: null,
        };
      },
    },
    btnIsDisabled: {
      type: Object,
      default() {
        return {
          signature: false,
        };
      },
    },
    btnIsLoading: {
      type: Object,
      default() {
        return {
          signature: false,
        };
      },
    },
  },
  methods: {
    // 预览PDF
    showPdf() {
      setTimeout(() => {
        const path = this.signOptions.url;
        const obj = document.getElementById("PDFForm").object;
        obj.src = `${path}#page=1`;
        // if (this.signOptions.contractStatus !== 2) {
        //   obj.src = `${path}#page=4`;
        // } else {
        //   obj.src = path;
        // }
      }, 100);
    },
    // 获取合同id
    getContractId(contractId, contractModel, pageNumber) {
      this.contractId = contractId;
      this.contractModel = contractModel;
      this.pageNumber = pageNumber;
    },
    // 签章操作
    signContract() {
      // if (this.btnloading) return false;
      // this.btnloading = true;
      // console.log('1111');
      // this.btnIsLoading.signature = true;
      // this.btnIsLoading = {
      //   ...this.btnIsLoading,
      //   signature: true,
      // };
      try {
        var sncode = "";
        if (!netcapki.isPKIInstalled()) {
          throw new Error("控件安装检测:失败!");
        }

        if (!netcapki.isHasCert()) {
          throw new Error("证书检测:不存在,请检查电子密钥是否插入电脑!");
        }

        if (!netcapki.isHasChain()) {
          throw new Error("证书链检测:不存在!");
        }
        // try {
        //   // var oCert = netcapki.getX509Certificate(NETCAPKI_CERT_PURPOSE_SIGN);
        //   var oCert = netcapki.getX509CertificateSign();                    // 获取签名数字证书
        //   if (oCert == null) {
        //     return false;
        //   }
        //   sncode = netcapki.getX509CertificateInfo(oCert, 9);               // 证书序列号
        // }
        // catch (e) {
        //   throw new Error("驱动未安装，或者驱动未兼容到浏览器!");
        // }

        this.ocert = cakey.oCert();  // 获取ocert设为全局变量
        this.cakey = netcapki.getX509CertificateInfo(this.ocert, 9);  // 获取key值
        // console.log('key333', this.cakey, this.contractId);
        TriContractList.signatureCheck(this.contractId, this.cakey).then((res) => {
          // console.log(2222, res);
          if (res.data.code === 0) {
            this.signature();
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
            });
            // this.btnIsLoading.signature = false;
            return false;
          }
        });

      }
      catch (e) {
        this.$message(e.message)
        return false;
      }
    },
    signature() {
      var iPDFSign = new ActiveXObject("Netca.PDFSign");
      self.name = iPDFSign.SelectCert("NETCA", 1);
      iPDFSign.TsaURL = "http://tsa.cnca.net/NETCATimeStampServer/TSAServer.jsp";//时间戳

      var iUtilTool = new ActiveXObject("Netca.UtilTool");
      var image = iUtilTool.GetImageFromDevicByCert(iPDFSign.SignCertBase64Encode);
      iPDFSign.SetImage(image);
      //签名摘要算法
      // var oCert = netcapki.getX509Certificate(2);
      var sAlgo = netcapki.getX509CertificateInfo(this.ocert, 8) == netcapki.NETCAPKI_ALGORITHM_RSA.toString() ? "sha1" : "sm3";
      iPDFSign.HashAlgo = sAlgo;         // sm3
      //选择模型-3代表盖章
      iPDFSign.RenderMode = 3;
      // http:localhost
      var downloadPath = iUtilTool.DownloadFile(this.signOptions.url, null);          // 签章后临时本地路径 C:\Users\yaoling\AppData\Local\Temp\tmp.pdf

      const signedPath = `signed_${new Date().getTime()}_${Math.floor(Math.random() * 10000000)}.pdf`;
      iPDFSign.SrcFileName = downloadPath;
      iPDFSign.DestFileName = downloadPath.replace('tmp.pdf', signedPath);

      /**
       *  memberType === 2 => 当前用户是配送企业
       *  memberType === 3 => 当前用户是医疗机构
       *  memberType === 4 => 当前用户是GPO
       */
      // 根据合同模板判断签章位置， AA为深圳模板， BB 为东莞模板
      const pageNumber = Number(this.pageNumber);
      if (this.contractModel === 'AA') {
        // 如果pageNumber为0，将页码写死，否则签章定位的的页码就用pagNumber
        if (pageNumber) {
          // 如果pageNumber不为0，用pageNumber
          if (this.View_UserInfo.memberType === 2) {
            self.name = iPDFSign.SignPosition(pageNumber, 455, 500, 80, 80);           // 签章位置
          } else if (this.View_UserInfo.memberType === 3) {
            self.name = iPDFSign.SignPosition(pageNumber, 455, 700, 80, 80);           // 签章位置
          } else if (this.View_UserInfo.memberType === 4) {
            self.name = iPDFSign.SignPosition(pageNumber, 455, 600, 80, 80);           // 签章位置
          }
        } else {
          // 如果pageNumber为0，页码固定
          if (this.View_UserInfo.memberType === 2) {
            self.name = iPDFSign.SignPosition(4, 455, 600, 80, 80);           // 签章位置
          } else if (this.View_UserInfo.memberType === 3) {
            self.name = iPDFSign.SignPosition(4, 455, 700, 80, 80);           // 签章位置
          } else if (this.View_UserInfo.memberType === 4) {
            self.name = iPDFSign.SignPosition(4, 455, 500, 80, 80);           // 签章位置
          }
        }
      } else if (this.contractModel === 'BB') {
        if (this.View_UserInfo.memberType === 2) {
          self.name = iPDFSign.SignPosition(5, 455, 600, 80, 80);           // 签章位置
        } else if (this.View_UserInfo.memberType === 3) {
          self.name = iPDFSign.SignPosition(5, 455, 700, 80, 80);           // 签章位置
        } else if (this.View_UserInfo.memberType === 4) {
          self.name = iPDFSign.SignPosition(5, 455, 500, 80, 80);           // 签章位置
        }
      } else {
        this.$message({
          message: '没有对应的合同模板, 请选择合同模板后再操作',
          type: 'error',
        });
      }
      // self.name = iPDFSign.SignPosition(4, 465, 416, 80, 80);           // 签章位置
      try {
        //生成盖章后的文件·
        // console.log(1112, this.uploadHost);
        var uploadFileUrl = iUtilTool.UploadFile(this.uploadHost, iPDFSign.DestFileName);  // 上传地址
        const result = JSON.parse(uploadFileUrl);
        // console.log(111, uploadFileUrl);
        // 判断返回值，根据实际情况
        // console.log('resultaaaaaaaaaaaaaaaaaaa', result);
        if (result.code === 0) {
          // 签章成功后操作
          // setTimeout(() => {
          const path = result.result;
          // console.log('path.result.result', path);
          const obj = document.getElementById("PDFForm").object;
          const pageNumber1 = Number(this.pageNumber);
          if (this.contractModel === 'AA') {
            if (pageNumber1) {
              // 如果pageNumber不为0，用pageNumber
              obj.src = `${path}#page=${pageNumber1}`;
            } else {
              obj.src = `${path}#page=4`;
            }
          } else if (this.contractModel === 'BB') {
            obj.src = `${path}#page=5`;
          } else {
            obj.src = `${path}#page=1`;
          }
          // }, 100);
          // this.$emit('dialog-close', this.fromDialog);
          // console.log('千万张了，要返回地址', result.result);
          this.$emit('to-upload', result.result, this.cakey);
        } else {
          this.$message({
            message: '签章失败',
            type: 'error',
          });
        }
      } catch (e) {
        var message = e.message;
        this.$message(message);
      }
      setTimeout(function () {
        // todo 返回列表页操作
      }, 1)
    },
    signDialogClose() {
      this.$emit('dialog-close', this.fromDialog);
    },
    //  打开dialog触发事件
    dialogOpen() {
      this.showPdf();
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}

.dialog-footer .iconfont {
  margin-right: 5px;
  display: inline-block;
  vertical-align: top;
}

.dialog-page {
  height: 36px;
  float: left;
}

.dialog-btn {
  margin-right: 20px;
}

.btnclass {
  border-radius: 3px;
  font-size: 12px;
}

.el-dialog__body {
  position: relative;
}

.el-dialog--large {
  width: 1200px !important;
}
</style>
<style>
.dialog-sign .el-dialog {
  width: 1200px !important;
}
</style>
