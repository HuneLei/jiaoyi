<template>
  <div class="index-box" :style="indexHeight">
    <!--头部-->
    <div class="head">
      <div class="head_box">
        <div class="head_left">
          <i class="icon iconfont icon-icon04" style="font-size: 18px;"></i> 系统公告
          <span style="margin-left: 10%;color: #EEEEEE;">|</span>
        </div>
        <transition-group name="list-complete" tag="ul" class="head_right">
          <li style="display: flex;justify-content: space-between" v-for="(item,index) in NoticeData" :key="item.id" v-if="index===selectNoticeIndex">
            <a style="cursor:pointer;" @click="linkNotice(item)">{{item.announcementTitle}}{{item.announcementAbstract}}</a>
            <p style="margin-left: 100px;">{{item.createTime.substring(0, 10)}}</p>
          </li>
        </transition-group>
      </div>
    </div>

    <!--管理员可见-->
    <div style="text-align: center;color: #ddd;margin-top: 20%;" v-if="getPrincipal.memberType === 5">
      <p>欢迎来到交易系统</p>
    </div>

    <!--中间-->
    <!--非管理员可见-->
    <div v-else>
      <div class="middle_one">

        <el-row class="middle_one_box" v-if="getPrincipal.memberType !== 1">
          <el-col :span="3" v-for="item in getNumList" :key="item.key">
            <div class="circle" :class="item.class">
              <i class="icon iconfont" :class="item.icon"></i>
            </div>
            <p class="circle-num" @click="workLink(item)">{{item.value}}</p>
            <p class="circle-title">{{item.name}}</p>
          </el-col>
        </el-row>

      </div>

      <!--新-->
      <div class="middle">
        <div class="middle-content-box">
          <div class="work-box" style="width: 29.2%;">
            <div class="title-box">
              <p class="title-left">
                <i class="icon iconfont icon-yaopin2"></i> 订单金额 （元）
              </p>
              <p class="title-right">
                <span class="typedate" v-for="item in TypeDate" :key="item.index" v-text="item.name" @click="getOrdersMoney(item.stauts)" :class="{ 'typedate--avtive': item.stauts === TypeOrdersActive }"></span>
              </p>
            </div>
            <div class="content-box">
              <div class="circle-box" style="padding: 0 5px;">
                <div class="circle circle-d" style="margin-top: 20px;margin-bottom: 15px;width: 80px;height: 80px;line-height: 80px;">
                  <i class="icon iconfont icon-yaopin2" style="font-size: 30px;"></i>
                </div>
                <p class="middle-content-money">￥{{numOrdersData.ordersNum ? Number(this.numOrdersData.ordersNum).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,') : 0.00}}</p>
                <div id="echart5" ref="mychart5" style="height: 66px;"></div>
              </div>
            </div>
          </div>

          <div class="work-box" style="width: 29.2%;">
            <div class="title-box">
              <p class="title-left">
                <i class="icon iconfont icon-qian"></i> 金额
                <span v-if="!Million">（元）</span>
                <span v-else>（万元）</span>
              </p>
              <p class="title-right">
                <span class="typedate" v-for="item in TypeDate" :key="item.index" v-text="item.name" @click="getContrctMoney(item.stauts)" :class="{ 'typedate--avtive': item.stauts === TypeContrctActive }"></span>
              </p>
            </div>
            <div class="content-box">
              <div class="circle-box">
                <div style="float: left;width: 50%;">
                  <div class="circle circle-zy" style="margin-top: 20px;margin-bottom: 15px;width: 80px;height: 80px;line-height: 80px;">
                    <i class="icon iconfont icon-qian" style="font-size: 30px;"></i>
                  </div>
                  <p class="middle-content-money" v-if="!Million">￥{{numContrctData.contractNum ? Number(this.numContrctData.contractNum).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,') : 0.00}}</p>
                  <p class="middle-content-money" v-else>￥{{numContrctData.contractNum ? (Number(numContrctData.contractNum)/10000).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,') : 0.00}}</p>
                  <p style="color: black;font-size: 14px;margin-bottom: 20px;">总合同金额</p>
                </div>
                <div style="float: right;width: 50%;">
                  <div class="circle circle-xy" style="margin-top: 20px;margin-bottom: 15px;width: 80px;height: 80px;line-height: 80px;">
                    <i class="icon iconfont icon-qian" style="font-size: 30px;"></i>
                  </div>
                  <div v-if="getPrincipal.memberType === 2">
                    <p class="middle-content-money" v-if="!Million">￥{{numContrctData.deliverNum ? Number(this.numContrctData.deliverNum).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,') : 0.00 }}</p>
                    <p class="middle-content-money" v-else>￥{{numContrctData.deliverNum ? (Number(numContrctData.deliverNum)/10000).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,') : 0.00}}</p>
                    <p style="color: black;font-size: 14px;margin-bottom: 20px;">总配送单金额</p>
                  </div>
                  <div v-else>
                    <p class="middle-content-money" v-if="!Million">￥{{numContrctData.ordersNum ? Number(this.numContrctData.ordersNum).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,') : 0.00}}</p>
                    <p class="middle-content-money" v-else>￥{{numContrctData.ordersNum ? (Number(numContrctData.ordersNum)/10000).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,') : 0.00}}</p>
                    <p style="color: black;font-size: 14px;margin-bottom: 20px;">总订单金额</p>
                  </div>
                </div>
                <p style="font-size: 12px;text-align: center;">最新提交订单时间：{{numContrctData.ordersTime}}</p>
              </div>
            </div>
          </div>

          <div class="work-box" style="width: 40%;">
            <div class="title-box">
              <p class="title-left" v-if="getPrincipal.memberType === 2">
                <i class="icon iconfont icon-zhanbi"></i> 配送单药品占比
              </p>
              <p class="title-left" v-else>
                <i class="icon iconfont icon-zhanbi"></i> 订单药品占比
              </p>
            </div>
            <div class="content-box">
              <div class="circle-box" style="padding: 0 5px;">
                <div style="width: 100%;">
                  <div class="circle_box_left" style="width: 47%;height: 100%;float: left;">
                    <div id="echart3" ref="mychart3" style="height: 240px;"></div>
                  </div>
                  <div class="circle_box_right" style="width: 53%;height: 100%;float: left;">
                    <div id="echart2" ref="mychart2" style="height: 240px;"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!--底部-->
      <div class="footer" style="margin-top: 10px;">
        <div class="footer_left" style="width: 49.6%;float: left; margin-right: 0.4%;">
          <div class="title-box">
            <p class="title-left">
              <i class="icon iconfont icon-hetong"></i> 合同进度
            </p>
          </div>
          <div class="footer-content-box" style="padding: 10px;">
            <div style="height: 290px;width: 100%;padding:0 15px;">
              <div class="footer_box_left" style="width: 40%;height: 100%;float: left;">
                <div id="echart" ref="mychart" style="height: 100%;"></div>
              </div>
              <div class="footer_box_right" style="width: 60%;height: 100%;float: left;">
                <div id="echart4" ref="mychart4" style="height: 100%;"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer_right" style="width: 49.6%;float: left;margin-left: 0.4%;">
          <div class="title-box">
            <p class="title-left">
              <i class="icon iconfont icon-tongji2"></i> 订单统计 （金额）
            </p>
            <p class="title-right">
              <span class="typedate" v-for="item in TypeDateTwo" :key="item.index" v-text="item.name" @click="getAllOrderNum(item.stauts)" :class="{ 'typedate--avtive': item.stauts === AllOrderActive }"></span>
            </p>
          </div>
          <div class="footer-content-box" style="padding: 10px;">
            <div id="echart1" ref="mychart1" style="height:290px;text-align: center;"></div>
          </div>
        </div>
      </div>
    </div>
    <Preview></Preview>
  </div>
</template>

<script>
/**
 * Created by linyiping on 2017/10/19.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapGetters } from 'vuex';
import echarts from '../../../utils/echartsImport';   //  按需引入echarts，降低打包体积
import Notice from '../../../api/BasicInfo/Notice'; // 公告管理APi
import NoticeList from '../../../api/BasicInfo/NoticeList'; // 公告管理APi
import Home from '../../../api/home'; // 公告管理APi
import convert from '../../../utils/convert'; // 引入js公共方法
import Preview from '../../BasicInfo/NoticeList/Preview';

import baseList from '../baseList';

export default {
  activated() {
    this.getNotice();
    if (this.getGpoId && this.getPrincipal.memberType !== 5) {
      this.getNum();
      this.getOrdersMoney(2);
      this.getContrctMoney(2);
      this.getAllOrderNum(3);
      this.getOrderDrugs();
      this.getOrderCont();
      window.onresize = () => {
        this.myChart5.resize();
        this.myChart4.resize();
        this.myChart.resize();
        this.myChart1.resize();
        this.myChart2.resize();
        this.myChart3.resize();
      };
    }
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
        noLink: true,
      },
      {
        path: '/',
        name: '首页',
        noLink: true,
      },
    ]);
  },
  components: {
    Preview,
  },
  watch: {
    getGpoId(data, olddata) {
      if (this.getPrincipal.memberType !== 5) {
        this.getNum();
        this.getOrdersMoney(2);
        this.getContrctMoney(2);
        this.getAllOrderNum(3);
        this.getOrderDrugs();
        this.getOrderCont();
      }
    },
  },
  data() {
    return {
      indexHeight: `height: ${window.innerHeight - 110}px; overflow-y: auto;`,
      mouthAll: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      TypeDate: [{ name: '年', stauts: 1 }, { name: '月', stauts: 2 }, { name: '周', stauts: 3 }], // 点击切换统计维度，下方图形/数据相应变化
      TypeDateTwo: [{ name: '年', stauts: 1 }, { name: '周', stauts: 3 }], // 点击切换统计维度，下方图形/数据相应变化
      NoticeData: [],
      selectNoticeIndex: 0,
      numData: {},
      numOrdersData: {}, // 订单金额
      TypeOrdersActive: 2,
      myChart5: null,
      numContrctData: {}, // 合同金额
      TypeContrctActive: 2,
      allOrderData: {}, // 订单统计
      AllOrderActive: 3,
      myChart1: null,
      orderDrugsData: {}, // 订单药品占比
      OrderContData: {}, // 合同进度
      myChart2: null,
      myChart3: null,
      Million: false, // 判断合同金额是否到达万元
    };
  },
  mounted() {
    if (this.getPrincipal.memberType !== 5) {
      this.myChart5 = echarts.init(this.$refs.mychart5);
      this.myChart1 = echarts.init(this.$refs.mychart1);
      this.myChart3 = echarts.init(this.$refs.mychart3); //    百分比扇形图
      this.myChart2 = echarts.init(this.$refs.mychart2); //    条形图
      this.myChart = echarts.init(this.$refs.mychart); //    扇形图
      this.myChart4 = echarts.init(this.$refs.mychart4);
    }
    setInterval(this.changeNotice, 8000); // 定时调用
  },
  methods: {
    linkNotice(row) {
      NoticeList.item(row.id).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.$bus.$emit('data/preview', data.announcementText, data);
        }
      });
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    // 首页公告栏
    getNotice() {
      Notice.homeList().then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.NoticeData = [];
          // 公告播放按公告管理列表顺序
          for (let i = 0; i < data.length; i += 1) {
            this.NoticeData.unshift(data[i]);
          }
          // this.NoticeData = res.data.result;
        }
      });
    },
    // 首页公告定时数据轮播
    changeNotice() {
      if (this.selectNoticeIndex === this.NoticeData.length - 1) {
        this.selectNoticeIndex = 0;
      } else {
        this.selectNoticeIndex = this.selectNoticeIndex + 1;
      }
    },
    // 首页数量
    getNum() {
      Home.pageItem(this.getGpoId).then((res) => {
        if (res.data.code === 0) {
          this.numData = res.data.result;
        }
      });
    },
    // 首页订单金额
    getOrdersMoney(stauts) {
      this.TypeOrdersActive = stauts;
      Home.pageOrdersItem(this.getGpoId, stauts).then((res) => {
        if (res.data.code === 0) {
          this.numOrdersData = res.data.result;
          this.myChart5.setOption(this.opt5); // 图表
        }
      });
    },
    // 首页合同总金额
    getContrctMoney(stauts) {
      this.TypeContrctActive = stauts;
      Home.pageContrctItem(this.getGpoId, stauts).then((res) => {
        if (res.data.code === 0) {
          this.numContrctData = res.data.result;
          if (this.getPrincipal.memberType === 2 && this.numContrctData.deliverNum > 1000000) {
            this.Million = true;
          } else if (this.getPrincipal.memberType === 2 &&
            this.numContrctData.contractNum > 1000000) {
            this.Million = true;
          } else if (this.getPrincipal.memberType !== 2 &&
            this.numContrctData.ordersNum > 1000000) {
            this.Million = true;
          } else if (this.getPrincipal.memberType !== 2 &&
            this.numContrctData.contractNum > 1000000) {
            this.Million = true;
          } else {
            this.Million = false;
          }
        }
      });
    },
    // 首页合同进度
    getOrderCont() {
      Home.orderContItem(this.getGpoId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const first = data[0];
          const second1 = [];
          const second2 = [];
          const second3 = [];
          const threes1 = [];
          const threes2 = [];
          for (let i = data[1].length - 1; i >= 0; i -= 1) {
            second1.push(data[1][i].purchasebfb);
            second2.push(data[1][i].drugsName);
            const aa = {
              name: data[1][i].purchaseNum,
              value: 100,
            };
            second3.push(aa);
          }
          const second = {
            value: second1,
            name: second2,
            all: second3,
          };
          for (let i = 0; i < data[2].length; i += 1) {
            threes1.push(this.convert.stringAdd(data[2][i].hospitalMemberName, 4, '\n'));
            threes2.push(data[2][i].aumt);
          }
          const threes = {
            value: threes2,
            name: threes1,
          };
          first.purchasecNum = data[0].purchaseNum - data[0].purchasedNum;
          this.OrderContData = {
            one: first,
            two: second,
            three: threes,
          };
          this.myChart.setOption(this.opt6); // 图表
          if (this.getPrincipal.memberType === 3) {
            this.myChart4.setOption(this.opt8); // 图表
          } else {
            this.myChart4.setOption(this.opt7); // 图表
          }
        }
      });
    },
    // 首页订单药品占比
    getOrderDrugs() {
      Home.orderDrugsItem(this.getGpoId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const a = [];
          const b = [];
          const c = [];
          const d = [];
          const all = data[0].ordersPrice;
          for (let i = 0; i < data[1].length; i += 1) {
            a.push({
              name: data[1][i].formName || '',
              value: data[1][i].ordersPrice || 0,
            }); // 订单药品占比值
            b.push(data[1][i].formName);
          }
          for (let i = data[2].length - 1; i >= 0; i -= 1) {
            if (data[2][i].ordersPrice) {
              data[2][i].ordersPrice = (((data[2][i].ordersPrice) * 100) / all).toFixed(2);
            } else {
              data[2][i].ordersPrice = 0;
            }
            c.push({
              value: data[2][i].ordersPrice || 0,
            }); // 订单药品占比值
            d.push(data[2][i].drugsName);
          }
          this.orderDrugsData = {
            name: b,
            value: a,
            num: c,
            label: d,
          };
          this.myChart3.setOption(this.opt3); // 图表
          this.myChart2.setOption(this.opt4); // 图表
        }
      });
    },
    // 首页订单统计
    getAllOrderNum(stauts) {
      this.AllOrderActive = stauts;
      Home.pageOrderItem(this.getGpoId, stauts).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.allOrderData = {
            date: [],
            value: [],
          };
          const date = this.convertDate(new Date());  // 获取当前日期
          for (let i = data.length - 1; i >= 0; i -= 1) {
            if (date >= data[i].mont) {  // 只显示当年本月份及之前的数据
              this.allOrderData.date.push(data[i].mont);
              this.allOrderData.value.push(data[i].ordersNum);
            }
          }
          if (stauts === 1) {
            this.allOrderData.date = this.mouthAll;
          }
          this.myChart1.setOption(this.opt1); // 图表
        }
      });
    },
    // 待处理事务跳转
    workLink(item) {
      if (item.isGo) {
        if (item === '待发货订单') {
          this.$router.push({ path: item.path, query: { add: 'indexs' } });
        } else {
          this.$router.push({ path: item.path, query: { from: 'index', name: item.name } });
        }
      }
    },
  },
  computed: {
    getPrincipal() {
      return this.$store.state.view.principal;
    },
    getMenuList() {
      return this.$store.state.view.menuList;
    },
    getNumList() {  //  主页图标数量列表
      const numKeys = Object.keys(baseList.indexList);
      const menuListString = JSON.stringify(this.getMenuList);
      const retList = [];

      for (let i = 0; i < numKeys.length; i += 1) {
        const key = numKeys[i];
        const item = baseList.indexList[key];
        if (item.memberType.indexOf(this.getPrincipal.memberType) > -1) {
          retList.push({
            ...item,
            key,
            value: this.numData[key] || 0,
            isGo: menuListString.indexOf(item.functionName) > -1 && this.numData[key],
          });
        }
      }

      return retList;
    },
    ...mapGetters([
      'getGpoId',
    ]),
    // 订单金额
    opt5() {
      const obj = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}订单: {c1}%',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              opacity: '0',
            },
          },
        },
        color: ['#9AB9F9'],
        grid: {
          top: 0,
          left: 10,
          right: 0,
          height: 80,
          width: '85%',
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
            position: 'left',
            data: ['已发货', '已确认'],
          },
        ],
        series: [
          {
            name: '50',
            type: 'bar',
            barWidth: '10px',
            legendHoverLink: false,
            silent: true,
            itemStyle: {
              normal: {
                color: '#F0F4F6',
                barBorderRadius: 50,
              },
              emphasis: {
                color: '#F0F4F6',
              },
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter(data) {
                  return `${data.data.name}%`;
                },
                color: 'black',
              },
            },
            barGap: '-100%',
            barCategoryGap: '50%',
            data: [{
              name: this.numOrdersData.sendbfb,
              value: 100,
            }, {
              name: this.numOrdersData.conbfb,
              value: 100,
            }],
          }, {
            name: '利润',
            type: 'bar',
            barWidth: '10px',
            legendHoverLink: false,
            itemStyle: {
              normal: {
                barBorderRadius: 50,
              },
            },
            data: [this.numOrdersData.sendbfb, this.numOrdersData.conbfb],
          },
        ],
      };
      return obj;
    },
    // 订单统计
    opt1() {
      const obj = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#81B0E4',
            },
          },
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '3%',
          top: '10%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.allOrderData.date,
            axisLine: {
              lineStyle: {
                color: '#6D80A4',
              },
            },
            axisLabel: {
              color: 'black',
            },
          },
        ],
        yAxis: [
          {
            name: '( 元  )',
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#6D80A4',
              },
            },
            axisLabel: {
              color: 'black',
            },
          },
        ],
        series: [
          {
            name: '订单统计（金额）',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#20a0ff',
              },
            },
            lineStyle: {
              normal: {
                color: '#6490C7',
              },
            },
            areaStyle: {
              normal: {
                color: '#81B0E4',
              },
            },
            data: this.allOrderData.value,
          },
        ],
      };
      return obj;
    },
    //  订单药品占比 top6
    opt3() {
      const obj = {
        color: ['#3399FF', '#66B3FF', '#7DBEFF', '#97CBFF', '#B9DCFF', '#E4E4E4'],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          width: '80%',
          height: 60,
          bottom: 20,
          left: '8%',
          data: this.orderDrugsData.name,
          containLabel: true,
          itemWidth: 17,
          itemHeight: 12,
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '60%',
            center: ['40%', '30%'],
            selectedMode: 'single',
            legendHoverLink: false,
            hoverAnimation: false,
            avoidLabelOverlap: false,
            selectedOffset: 0,
            data: this.orderDrugsData.value,
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      return obj;
    },
    //  订单药品占比 top11
    opt4() {
      const orderDrugsLabel = this.orderDrugsLabel;
      const obj = {
        tooltip: {
          trigger: 'axis',
          formatter(data) {
            let ret = '';
            for (let i = 0; i < orderDrugsLabel.length; i += 1) {
              const item = orderDrugsLabel[i];
              if (data[0].name === item.value && data[0].dataIndex === i) {
                ret = `${item.label}（${data[0].value}%）`;
                break;
              }
            }
            return ret;
          },
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              opacity: '0',
            },
          },
        },
        color: ['#82B1E5'],
        grid: {
          top: 0,
          left: 0,
          right: 0,
          height: 240,
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
            position: 'right',
            data: this.orderDrugsLabel,
          },
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barGap: '30%',
            barWidth: '10px',
            legendHoverLink: false,
            label: {
              normal: {
                show: true,
                position: 'insideLeft',
                formatter: '{c}%',
                color: 'black',
              },
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                barBorderRadius: 50,
              },
            },
            data: this.orderDrugsData.num,
          },
        ],
      };
      return obj;
    },
    // 已签约效期内的合同
    opt6() {
      const obj = {
        title: {
          text: '已签约效期内的合同',
          textStyle: {
            fontSize: 15,
            fontWeight: 500,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        color: ['#20A0FF', '#EFF5F5'],
        textStyle: {
          color: 'black',
          fontWeight: 'bold',
        },
        series: [
          {
            name: '已签约效期内的合同',
            type: 'pie',
            legendHoverLink: true,
            hoverOffset: 2,
            radius: ['60%', '80%'],
            center: ['40%', '55%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'center',
              },
              emphasis: {
                show: true,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: this.OrderContData.one.purchasedNum,
                name: '合同已采率',
                label: {
                  normal: {
                    padding: [0, 0, 25, 0],
                    formatter: '{d}%',
                    position: 'center',
                    textStyle: {
                      color: '#fe8b53',
                      fontSize: 25,
                      fontWeight: 'bold',
                    },
                  },
                },
                itemStyle: {
                  emphasis: {
                    color: '#20A0FF',
                  },
                },
              },
              {
                value: this.OrderContData.one.purchasecNum,
                itemStyle: {
                  emphasis: {
                    color: '#EFF5F5',
                  },
                },
                tooltip: {
                  show: false,
                },
              },
              {
                tooltip: {
                  show: false,
                },
                label: {
                  normal: {
                    formatter: '\n\n合同已采率',
                    textStyle: {
                      fontSize: 14,
                    },
                  },
                },
              },
            ],
          },
        ],
      };
      return obj;
    },
    // 医疗机构配送单金额TOP5
    opt7() {
      const obj = {
        title: {
          text: '医疗机构配送单金额TOP5',
          textStyle: {
            fontSize: 15,
            fontWeight: 500,
          },
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'cross',        // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '1.2%',
          height: '230',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.OrderContData.three.name,
            axisTick: {
              interval: 0,
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              show: true,
              fontSize: 12,
            },
          },
        ],
        yAxis: [
          {
            name: '( 元  )',
            type: 'value',
          },
        ],
        series: [
          {
            name: '配送单金额',
            type: 'bar',
            barWidth: '30px',
            data: this.OrderContData.three.value,
          },
        ],
      };
      return obj;
    },
    // 药品金额5
    opt8() {
      const obj = {
        title: {
          text: '药品已采TOP5',
          textStyle: {
            fontSize: 15,
            fontWeight: 500,
          },
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>{a1}: {c1}%',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              opacity: '0',
            },
          },
        },
        color: ['#8FCFFE'],
        grid: {
          top: 35,
          left: 10,
          height: 270,
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
            position: 'right',
            data: this.OrderContData.two.name,
          },
        ],
        series: [
          {
            name: '合同总数量',
            type: 'bar',
            barWidth: '24px',
            legendHoverLink: false,
            silent: true,
            itemStyle: {
              normal: {
                color: '#F0F4F6',
                barBorderRadius: 50,
              },
              emphasis: {
                color: '#F0F4F6',
              },
            },
            barGap: '-100%',
            barCategoryGap: '50%',
            data: this.OrderContData.two.all,
          }, {
            name: '已采百分比',
            type: 'bar',
            barWidth: '24px',
            legendHoverLink: false,
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: '{c}%',
              },
            },
            itemStyle: {
              normal: {
                barBorderRadius: 50,
              },
            },
            data: this.OrderContData.two.value,
          },
        ],
      };
      return obj;
    },
    //  订单药品占比label
    orderDrugsLabel() {
      const data = [];
      for (let i = 0; i < this.orderDrugsData.label.length; i += 1) {
        const item = this.orderDrugsData.label[i];
        data.push({
          value: item.length < 6 ? item : `${item.substr(0, 5)}...`,
          label: item,
        });
      }
      return data;
    },
  },
};
</script>

<style scoped>
.index-box {
  min-width: 1000px;
}

.head {
  width: 100%;
}

.head_box {
  display: flex;
  border: 1px solid #eeeeee;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  border-radius: 3px;
}

.head_left {
  float: left;
  width: 110px;
  margin-left: 10px;
  font-size: 14px;
  color: #0868cf;
}

.head_right {
  font-size: 14px;
  float: left;
  color: black;
  padding-top: -5px;
}

.head_right a {
  display: block;
  height: 40px;
  overflow: hidden;
}

.head_right p {
  display: block;
  height: 40px;
  overflow: hidden;
}

.head::after {
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}

.middle_one {
  width: 100%;
}

.middle_one_box {
  border: 1px solid #eeeeee;
  padding: 8px 20px;
  margin-bottom: 10px;
  border-radius: 3px;
  height: 116px;
}

.middle {
  margin-top: 10px;
  width: 100%;
}

.middle-content-money {
  font-size: 21px;
  margin-bottom: 15px;
}

.middle-content-box::after {
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}

.typedate {
  cursor: pointer;
  margin-left: 5px;
}

.typedate--avtive {
  border-radius: 50%;
  background: #196dbd;
  padding: 1px 3px;
  text-align: center;
  line-height: 20px;
  color: white;
}

.title-box {
  position: relative;
  height: 38px;
  background-color: #f0f5f8;
}

.title-left {
  position: absolute;
  left: 10px;
  line-height: 38px;
  font-size: 14px;
  color: #0868cf;
}

.title-left i {
  font-size: 18px;
}

.title-right {
  position: absolute;
  right: 10px;
  line-height: 38px;
  font-size: 12px;
}

.title-right i {
  font-size: 14px;
}

.content-box {
  height: 230px;
  padding: 10px;
  text-align: center;
}

.content-box::after {
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}

.circle-box {
  padding: 0 15px;
}

.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  color: white;
  line-height: 50px;
  margin: 0 auto;
}

.circle i {
  font-size: 22px;
}

.circle-num {
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  color: black;
  cursor: pointer;
}

.circle-num:hover {
  font-size: 20px;
  color: #0868cf;
}

.circle-nums {
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  color: black;
}

.circle-title {
  font-size: 12px;
}

.circle-m {
  background-color: #3a74f9;
}

.circle-s {
  background-color: #1da0fc;
}

.circle-a {
  background-color: #3398db;
}

.circle-g {
  background-color: #0868cf;
}

.circle-d {
  background-color: #3b72fb;
}

.circle-xy {
  background-color: #13ce64;
}

.circle-zy {
  background-color: #13c7ce;
}

.circle-q {
  background-color: #6359f4;
}

.work-box:nth-child(3) {
  margin-right: 0%;
}

.work-box {
  float: left;
  margin-right: 0.8%;
  /*width: 32.8%;*/
  box-sizing: border-box;
  border: 1px solid #eeeeee;
  border-radius: 3px;
  height: 100%;
}

.work-content {
  position: relative;
  height: 33px;
  line-height: 33px;
}

.work-name {
  position: absolute;
  left: 10px;
  font-size: 14px;
}

.work-num {
  position: absolute;
  right: 10px;
  font-size: 12px;
}

.work-num-color {
  color: #0868cf;
}

.member {
  margin-top: 10px;
}

.footer-content-box {
  border: 1px solid #eeeeee;
  border-radius: 3px;
}

.middle_one .el-row {
  text-align: center;
  border-radius: 3px;
}

.middle_one .el-col {
  text-align: center;
}

.middle_one .el-col:nth-child(6) {
  border-right: none;
}

.footer_box_one .el-progress__text {
  float: right;
  font-size: 12px;
}
</style>
<style>
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 15px;
  transform: translateY(15px);
}

.list-complete-enter {
  opacity: 0;
  transition: all 2s;
  padding-top: 10px;
}

.list-complete-leave-to {
  opacity: 0;
  transition: all 2s;
  transform: translateY(15px);
}

.list-complete-enter-active,
.list-complete-leave-active {
  transition: all 1s;
}

.list-complete-enter-active {
  transform: translateY(0px);
}

.list-complete-leave-active {
  position: absolute;
  transform: translateY(-10px);
}
</style>
