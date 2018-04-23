<template>
  <div v-loading="loading">
    <div :style="formStyle">
      <p style="text-align: center; font-size: 18px;font-weight: 700;">医疗卫生机构医药产品廉洁购销合同</p>
      <br>
      <br>
      <p>
        <span style="font-size: 16px; font-weight: 600;">甲方</span>(医疗卫生机构):&nbsp;&nbsp;
        <span style="font-size: 16px; font-weight: 600;">{{firstPartyName}}</span>
      </p>
      <p>
        <span style="font-size: 16px; font-weight: 600;">乙方</span>(医药生产经营企业及其代理人):&nbsp;&nbsp;
        <span style="font-size: 16px; font-weight: 600;">{{secondPartyName}}</span>
      </p>
      <p style="font-size: 16px;font-weight: 700;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为进一步加强医疗卫生行风建设，规范医疗卫生机构医药购销行为，有效防范商业贿赂行为，营造公平交易、诚实守信的购销环境，经甲、乙双方协商，同意签订本合同，并共同遵守：</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一、甲乙双方按照《合同法》及医药产品购销合同约定购销药品、医用设备、医用耗材等医药产品。</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二、甲方应当严格执行医药产品购销合同验收、入库制度，对采购医药产品及发票进行查验，不得违反有关规定合同外采购、违价采购或从非规定渠道采购。</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;三、甲方严禁接受乙方以任何名义、形式给予的回扣，不得将接受捐赠资助与采购挂钩。甲方工作人员不得参加乙方安排并支付费用的营业性娱乐场所的娱乐活动，不得以任何形式向乙方索要现金、有价证券、支付凭证和贵重礼品等。被迫接受乙方给予的钱物，应予退还，无法退还的，有责任如实向有关纪检监察部门反映情况。</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;四、严禁甲方工作人员利用任何途径和方式，为乙方统计医师个人及临床科室有关医药产品用量信息，或为乙方统计提供便利。</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;五、乙方不得以回扣、宴请等方式影响甲方工作人员采购或使用医药产品的选择权，不得在学术活动中提供旅游、超标准支付食宿费用。</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;六、乙方指定 作为销售代表洽谈业务。销售代表必须在工作时间到甲方指定地点联系商谈，不得到住院部、门诊部、医技科室等推销医药产品，不得借故到甲方相关领导、部门负责人及相关工作人员家中访谈并提供任何好处费。</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;七、乙方如违反本合同，一经发现，甲方有权终止购销合同，并向有关卫生计生行政部门报告。如乙方被列入商业贿赂不良记录，则严格按照《国家卫生计生委关于建立医药购销领域商业贿赂不良记录的规定》（国卫法制发〔2013〕50号）相关规定处理。</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;八、本合同作为医药产品购销合同的重要组成部分，与购销合同一并执行，具有同等的法律效力。</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;九、本合同一式三份，甲、乙双方各执一份，甲方纪检监察部门（基层医疗卫生机构上报上级卫生计生行政部门）执一份，并从签订之日起生效。</p>
      <br>
      <!--<img class="firstImg" :src="img1" :style="formStyle1" />
                    <img class="secondImg" :src="img2" :style="formStyle2" />-->
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <!--<div style="font-size: 14px; font-weight: 600;vertical-align:middle;">甲方(盖章):</div>
                          <img class="firstImg" :src="img1" />-->
            <el-row>
              <el-col :span="4">
                <div style="font-size: 14px; font-weight: 600;line-height: 144px">甲方(盖章):</div>
              </el-col>
              <el-col :span="20">
                <img class="firstImg" :src="img1" :style="formStyle1" />
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <!--<span style="font-size: 14px; font-weight: 600;">乙方(盖章):</span><img class="secondImg" :src="img2" />-->
            <el-row>
              <el-col :span="4">
                <div style="font-size: 14px; font-weight: 600;line-height: 144px">乙方(盖章):</div>
              </el-col>
              <el-col :span="20">
                <img class="secondImg" :src="img2" :style="formStyle2" />
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p style="font-size: 14px; font-weight: 600;">法定代表人(负责人):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{firstLegalPerson}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <p style="font-size: 14px; font-weight: 600;">法定代表人(负责人):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{secondLegalPerson}}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p style="font-size: 14px; font-weight: 600;">经办人签名:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{firstAgentPerson}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <p style="font-size: 14px; font-weight: 600;">经办人签名:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{secondAgentPerson}}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p style="font-size: 14px; font-weight: 600;">签订时间:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{firstSignTime}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <p style="font-size: 14px; font-weight: 600;">签订时间:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{secondSignTime}}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <TradeFooter :authbtn="authbtn" class="trade" :isBackShow="true" :isContractSignature="true" @contract-signture="contractSignture" @order-back="orderBack">
    </TradeFooter>
  </div>
</template>

<script>
//  style="height: 650px;position: relative;padding: 10px"
import { mapActions, mapGetters } from 'vuex';
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件
import signature from '../../../utils/signature';           // 引入底部组件
import upload from '../../../api/upload';           // 引入底部组件
import HonestContact from '../../../api/Contract/HonestContact';
import cakey from '../../../api/cakey';    // 获取插入的ukey的key值
import netcapki from '../../../utils/netcapki';    // 插件地址

export default {
  activated() {
    this.authbtn = HonestContact.authbtn();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Contract',
        name: '合同管理',
        noLink: true,
      },
      {
        path: '/Contract/HonestContract',
        name: '廉洁合同',
        noLink: true,
      },
    ]);
    this.dataList();
  },
  deactivated() {
  },
  components: {
    TradeFooter,
  },
  watch: {
    authList() {
      this.authbtn = HonestContact.authbtn();
    },
    getGpoId() {
      // 当切换gpo时，重定向到列表页
      this.$router.push({ path: '/Contract/HonestContract' });
    },
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'getGpoId',
      'getProjectId',
      'View_UserInfo',
    ]),
    formStyle() {
      return `height: ${window.innerHeight - 200}px;width: ${window.innerWidth - 300}px;overflow: auto;`;
    },
    formStyle1() {
      // return `border: 0px`;
      if (this.img1) {
        return `display:block;`;
      } else {
        return `display: none;`;
      }
    },
    formStyle2() {
      if (this.img2) {
        return `display:block;`;
      } else {
        return `display: none;`;
      }
    },
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      loading: false,
      img1: '',
      img2: '',
      cakey: '',
      firstPartyName: null,
      firstAgentPerson: null,
      firstLegalPerson: null,
      firstSignTime: null,
      secondPartyName: null,
      secondAgentPerson: null,
      secondLegalPerson: null,
      secondSignTime: null,
      fileSealLoading: false,
      fileSealStatus: false,
    };
  },
  methods: {
    // 获取数据列表
    dataList() {
      this.loading = true;
      if (this.$route.query.id) {
        HonestContact.item(this.$route.query.id).then((res) => {
          if (res.data.code === 0) {
            console.log('rrr', res);
            const data = res.data.result;
            const btnDisabled = {
              planContract: false,
            };
            if (this.View_UserInfo.memberType === 3 && data.firstContractFile === null) {
              btnDisabled.planContract = true;
            } else if (this.View_UserInfo.memberType === 2 && data.secondContractFile === null && Number(this.$route.query.contractType) === 3) {
              btnDisabled.planContract = true;
            } else if (this.View_UserInfo.memberType === 4 && data.secondContractFile === null && Number(this.$route.query.contractType) === 2) {
              btnDisabled.planContract = true;
            }
            this.$bus.$emit('data/tradefoot', btnDisabled);
            this.firstPartyName = data.firstPartyName;
            this.firstAgentPerson = data.firstAgentPerson;
            this.firstLegalPerson = data.firstLegalPerson;
            this.firstSignTime = data.firstSignTime;
            this.secondPartyName = data.secondPartyName;
            this.secondAgentPerson = data.secondAgentPerson;
            this.secondLegalPerson = data.secondLegalPerson;
            this.secondSignTime = data.secondSignTime;
            this.img1 = data.firstContractFile;
            this.img2 = data.secondContractFile;
          }
          this.loading = false;
        });
      }
    },
    contractSignture() {
      // if (this.fileSealStatus) return false;
      // this.fileSealStatus = true;
      // this.fileSealLoading = true;
      this.cakey = cakey.key();
      HonestContact.check(this.$route.query.id, this.cakey).then((res) => {
        // console.log(2222, res);
        // const res = {
        //   data: {
        //     code: 0,
        //   },
        // };
        if (res.data.code === 0) {
          const ret = signature.getStamp();
          console.log('res', ret);
          if (ret.status === 0) {
            const imgStamp = ret.result;       //  章的图片
            if (this.View_UserInfo.memberType === 3) {
              this.img1 = imgStamp;
            } else {
              this.img2 = imgStamp;
            }
            this.toUpload(imgStamp);
          } else {
            this.$message({
              message: ret.message,
              type: 'error',
            });
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          });
          // this.fileSealLoading = false;
          return false;
        }
        return true;
      });
    },
    //  上传章的图片
    toUpload(imgStamp) {
      if (imgStamp) {
        console.log('imgStamp', imgStamp);
        const blob = this.convert.baseToBlob(imgStamp);
        if (blob.status === 0) {
          const formData = new FormData();
          console.log('imgStamp', blob);
          formData.append('file', blob.result);
          formData.append('filename', 'fafafafsfas.jpg');
          upload.upload(formData).then((data) => {
            if (data.data.code === 0) {
              const url = data.data.result;
              //  把url传给 /incorruptible/contract/file/seal
              this.fileSeal(url);
            }
          });
        }
      }
    },
    fileSeal(url) {
      if (this.$route.query.id) {
        if (!netcapki.isPKIInstalled()) {
          throw new Error("控件安装检测:失败!");
        }

        if (!netcapki.isHasCert()) {
          throw new Error("证书检测:不存在,请检查电子密钥是否插入电脑!");
        }

        if (!netcapki.isHasChain()) {
          throw new Error("证书链检测:不存在!");
        }
        try {
          var oCert = netcapki.getX509CertificateSign();                    // 获取签名数字证书
          if (oCert == null) {
            return false;
          }
          const sealName = netcapki.getX509CertificateInfo(oCert, 12);               // 证书序列号

          HonestContact.fileSeal(this.$route.query.id, url, sealName, this.cakey).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '签章成功',
              });
              const btnDisabled = {
                planContract: false,
              };
              this.$bus.$emit('data/tradefoot', btnDisabled);
            } else {
              this.$message({
                type: 'error',
                message: res.data.message,
              });
            }
          });
        }
        catch (e) {
          throw new Error("驱动未安装，或者驱动未兼容到浏览器!");
        }
      }
    },
    orderBack() {
      this.$router.push({ path: '/Contract/HonestContract' });
      this.$bus.$emit('data/list');
      // history.back();
    },
  },
};
</script>
