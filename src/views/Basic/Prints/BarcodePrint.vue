<template>
  <div :loading="loading">
    <div class="barcode-print page-break">
      <el-row class="frow">
        <el-col :span="24" class="fcol">
          <span>配送商：</span>
        </el-col>
        <el-col :span="24" class="mcol">
          <span>{{deliveryMemberName}}</span>
        </el-col>
        <el-col :span="24" class="bcol">
          <span>医院：{{hospitalMemberName}}</span>
          <span>创建时间：{{convert.convertDate(convert.dateTime(), 1)}}</span>
        </el-col>
      </el-row>
      <el-row class="mrow" v-show="this.$route.query.type == 0">
        <el-col v-for="(value, index) in svgList" :span="12" :key="index">
          <div :style="index<2?'':'margin-top: 50px'">
            <svg :id="`code${index}`">
            </svg>
          </div>
        </el-col>
      </el-row>
      <el-row class="mrow" v-show="this.$route.query.type != 0">
        <el-col v-for="(value, index) in qrcodeList" :span="6" :offset="5" :key="index">
          <div :style="index<2?'':'margin-top: 70px'">
            <div :id="`qrcode${index}`"></div>
          </div>
        </el-col>
      </el-row>
      <div class="foot-button not-print">
        <el-button size="large" class="not-print" type="primary" @click.native="dataSubmit">点击打印</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import convert from '../../../utils/convert';                            // 引入js公共方法
  import Prints from '../../../api/Prints/Prints';  // 打印api

  export default {
    data() {
      return {
        loading: false,
        svgList: [],
        qrcodeList: [],
        hospitalMemberName: '',
        deliveryMemberName: '',
      };
    },
    mounted() {
      if (this.$route.query.id) {
        const ids = this.$route.query.id.split(',');
        this.dataItem(ids);
      }
    },
    methods: {
      dataSubmit() {
        window.print();
      },
      dataItem(ids) {
        this.loading = true;
        this.qrcodeList = [];
        this.svgList = [];
        Prints.barcode(ids).then((res) => {
          if (res.data.code === 0) {
            const resultList = res.data.result;
            this.svgList = Object.keys(resultList);
            this.hospitalMemberName = res.data.result[`${this.svgList[0]}`][0].hospitalMemberName;
            this.deliveryMemberName = res.data.result[`${this.svgList[0]}`][0].deliveryMemberName;
            for (let i = 0; i < this.svgList.length; i += 1) {
              const svgListOne = res.data.result[`${this.svgList[i]}`];
              let qrcodeList = '';
              for (let y = 0; y < svgListOne.length; y += 1) {
                const qrcodeOne = `${svgListOne[y].code || ' '}&${svgListOne[y].remarks || ' '}&${svgListOne[y].hospitalInnerCode || ' '}&${svgListOne[y].batchNo || ' '}&${svgListOne[y].drugsNum || ' '}`;
                if (qrcodeList) {
                  qrcodeList = `${qrcodeOne} || ${qrcodeList}`;
                } else {
                  qrcodeList = `${qrcodeOne}`;
                }
                if (Number(this.$route.query.type) === 2) {
                  this.qrcodeList.push(qrcodeOne);
                }
              }
              if (Number(this.$route.query.type) === 1) {
                this.qrcodeList.push(qrcodeList);
              }
            }
            this.loading = false;
          }
          let widths = 2;
          this.$nextTick(() => {
            const reg = /^\+?[1-9][0-9]*$/;
            for (let i = 0; i < this.svgList.length; i += 1) {
              widths = 2;
              if (this.svgList[i].length === 1) {
                widths = 6;
              }
              if (this.svgList[i].length === 2 && !reg.test(this.svgList[i])) {
                widths = 5;
              }
              if (this.svgList[i].length === 2 && reg.test(this.svgList[i])) {
                widths = 6;
              }
              if (this.svgList[i].length === 3) {
                widths = 4;
              }
              if (this.svgList[i].length === 4 && !reg.test(this.svgList[i])) {
                widths = 3.5;
              }
              if (this.svgList[i].length === 4 && reg.test(this.svgList[i])) {
                widths = 5;
              }
              if (this.svgList[i].length === 5) {
                widths = 3;
              }
              if (this.svgList[i].length === 6 && reg.test(this.svgList[i])) {
                widths = 4;
              }
              if (this.svgList[i].length === 6 && !reg.test(this.svgList[i])) {
                widths = 3;
              }
              if (this.svgList[i].length === 7 && reg.test(this.svgList[i])) {
                widths = 3;
              }
              if (this.svgList[i].length === 7 && !reg.test(this.svgList[i])) {
                widths = 2.7;
              }
              if (this.svgList[i].length === 8 && reg.test(this.svgList[i])) {
                widths = 3;
              }
              if (this.svgList[i].length === 8 && !reg.test(this.svgList[i])) {
                widths = 2.5;
              }
              if (this.svgList[i].length === 9 && !reg.test(this.svgList[i])) {
                widths = 2;
              }
              if (this.svgList[i].length === 9 && reg.test(this.svgList[i])) {
                widths = 2.5;
              }
              if (this.svgList[i].length === 10 && !reg.test(this.svgList[i])) {
                widths = 2;
              }
              if (this.svgList[i].length === 10 && reg.test(this.svgList[i])) {
                widths = 3;
              }
              convert.JsBarcode(`#code${i}`, `${this.svgList[i]}`, {
                format: 'code128',
                height: 60,
                fontSize: 18,
                width: widths,
              });
            }
            for (let i = 0; i < this.qrcodeList.length; i += 1) {
              const qrcode = new convert.QRCode(`qrcode${i}`, {
                text: this.qrcodeList[i],
                width: 160,
                height: 160,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: convert.QRCode.CorrectLevel.H,
              });
            }
          });
        });
      },
    },
  };
</script>
<style>
  html {
    background-color: #f0f0f0;
  }
  .barcode-print {
    margin: 30px auto;
    width: 900px;
    height: 100%;
    text-align: center;
    border-radius: 10px;
    background-color: #fff;
    padding-top: 48px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  .fcol span {
    color: #999;
    font-size: 16px;
  }
  .mcol span {
    color: #333333;
    font-size: 18px;
  }
  .mcol {
    margin-top: 3px;
  }
  .bcol {
    margin-top: 8px;
  }
  .bcol span {
    color: #999;
    font-size: 16px;
    margin-left: 30px;
  }
  .frow {
    text-align: center;
    width: 750px;
    margin: 0 auto;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 30px;
  }
  .mrow {
    padding: 40px 15px 30px 0;
  }
  .foot-button {
    padding: 15px 0;
    border-top: 1px solid #e8e8e8;
    background-color: #fafafa;
    text-align: center;
  }
  @media print {
    .not-print {
      opacity: 0
    }
    .app-print {
      min-width: 0 !important;
      position: static;
    }
    .barcode-print {
      width: 100%;
    }
  }
</style>
