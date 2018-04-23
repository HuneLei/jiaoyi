<template>
  <div v-loading="loading">
    <div class="content_pie" style="height: 320px;border: 1px solid rgb(223, 228, 236);margin-bottom: 10px;">
      <div class="content_left" style="width: 100%;height: 100%;float: left;padding-top: 20px;">
        <div id="echart1" ref="mychart1" style="height: 100%;"></div>
      </div>
    </div>
    <div v-show="filterForm.objectType === 1">
      <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
        </el-table-column>
        <el-table-column prop="levelsName" label="对象名称" align="left" min-width="160" sortable="custom" class-name="table_right" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersPrice" label="销售金额" align="right" fixed="right" min-width="160" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.ordersPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proportion" label="占比(%)" align="right" fixed="right" min-width="160" sortable show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.proportion.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="filterForm.objectType === 2">
      <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
        </el-table-column>
        <el-table-column prop="hospitalMemberCode" label="医院编码" align="left" width="80" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalMemberName" label="医院名称" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="levelsName" label="机构级别" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalCatalogName" label="机构类型" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="所在地区" align="left" min-width="160" sortable="custom" class-name="table_right" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersPrice" label="销售金额" align="right" fixed="right" min-width="160" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.ordersPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proportion" label="占比(%)" align="right" fixed="right" min-width="160" sortable show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.proportion.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="filterForm.objectType === 3">
      <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
        </el-table-column>
        <el-table-column prop="deliveryMemberCode" label="企业编码" align="left" width="80" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" label="企业名称" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="所在地区" align="left" min-width="160" sortable="custom" class-name="table_right" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersPrice" label="销售金额" align="right" fixed="right" min-width="160" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.ordersPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proportion" label="占比(%)" align="right" fixed="right" sortable min-width="160" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.proportion.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="filterForm.objectType === 4">
      <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
        </el-table-column>
        <el-table-column prop="salerMemberCode" label="企业编码" align="left" width="80" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerMemberName" label="企业名称" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="所在地区" align="left" min-width="160" sortable="custom" class-name="table_right" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersPrice" label="销售金额" align="right" fixed="right" min-width="160" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.ordersPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proportion" label="占比(%)" align="right" fixed="right" min-width="160" sortable show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.proportion.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="filterForm.objectType === 5">
      <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
        </el-table-column>
        <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" label="商品名" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" label="剂型" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersNum" label="数量" align="right" min-width="80" sortable="custom" class-name="table_right" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersPrice" label="销售金额" align="right" fixed="right" min-width="160" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.ordersPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proportion" label="占比(%)" align="right" fixed="right" min-width="160" sortable show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.proportion.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="filterForm.objectType === 6">
      <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
        </el-table-column>
        <el-table-column prop="formName" label="剂型" align="left" min-width="100" sortable="custom" class-name="table_right" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersPrice" label="销售金额" align="right" fixed="right" min-width="160" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.ordersPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proportion" label="占比(%)" align="right" fixed="right" min-width="160" sortable show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.proportion.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="filterForm.objectType === 7">
      <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
        </el-table-column>
        <el-table-column prop="quality_level" label="质量层次" align="left" min-width="100" sortable="custom" class-name="table_right" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersPrice" label="销售金额" align="right" fixed="right" min-width="160" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.ordersPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proportion" label="占比(%)" align="right" fixed="right" min-width="160" sortable show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.proportion.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="filterForm.objectType === 8">
      <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
        </el-table-column>
        <el-table-column prop="month" label="月份" align="left" min-width="100" sortable="custom" class-name="table_right" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ordersPrice" label="销售金额" align="right" fixed="right" min-width="160" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.ordersPrice.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proportion" label="占比(%)" align="right" fixed="right" min-width="160" sortable show-overflow-tooltip>
          <template scope="scope">
            <span>{{scope.row.proportion.toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>销售金额汇总：</span>
        {{ordersPriceAlls.toFixed(2)}}
        <span>元</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import echarts from '../../../utils/echartsImport';   //  按需引入echarts，降低打包体积
import ComponentAnalysis from '../../../api/General/ComponentAnalysis';
import convert from '../../../utils/convert'; // 引入js公共方法

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('data/getprojectid', this.getprojectid);
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('export/data', this.dataExport); // 导出
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    if (this.getGpoId) {
      this.dataList();
    }
    window.onresize = () => {
      this.myChart1.resize();
    };
    this.tableHeightRun();
  },
  deactivated() {
    this.$bus.$off('data/getprojectid', this.getprojectid);
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('export/data', this.dataExport); // 导出
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
    // this.dataList();
  },
  mounted() {
    this.myChart1 = echarts.init(this.$refs.mychart1);
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'View_UserInfo',
    ]),
    opt1() {
      const list = this.orderDrugsData.value;
      const obj = {
        color: ['#339944', '#66B3FF', '#7DBEFF', '#97CBFF', '#B9DCFF', '#E4E4E4'],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          width: '80%',
          height: 300,
          bottom: 20,
          y: 20,
          left: '50%',
          data: this.orderDrugsData.name,
          containLabel: true,
          itemWidth: 20,
          itemHeight: 12,
          formatter(name) {
            let index = 0;
            for (let i = 0; i < list.length; i += 1) {
              if (list[i].name === name) {
                index = i;
              }
            }
            return name + '   (' + list[index].value + ')';
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '70%',
            center: ['30%', '40%'],
            // selectedMode: 'single',
            legendHoverLink: false,
            hoverAnimation: false,   // 是否开启 hover 在扇区上的放大动画效果。
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
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/General/ComponentAnalysis') {
        this.dataList();
      }
    },
  },
  data() {
    return {
      tableHeight: 650,
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      selectData: [],
      filterForm: {
        gpoMemberId: null,
        objectType: 2,
        hospitalMemberName: null,
        drugsCode: null,
        drugsName: null,
        tradeName: null,
        deliveryMemberName: null,
        producerName: null,
        salerMemberName: null,
        drugStandardCode: null,
        approvalNumber: null,
        dataTime: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
      },
      page: 0,
      size: 20,
      myChart1: null,
      orderDrugsData: {},
      ordersPriceAll: 0,    // 饼图总金额
      ordersPriceAlls: 0,   // 总金额
    };
  },
  methods: {
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    //  接受查询条件
    dataSearch(data) {
      this.filterForm = {
        hospitalMemberName: data.hospitalMemberName.value,
        objectType: data.objectType.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        tradeName: data.tradeName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        producerName: data.producerName.value,
        salerMemberName: data.salerMemberName.value,
        drugStandardCode: data.drugStandardCode.value,
        approvalNumber: data.approvalNumber.value,
        dataTime: data.dataTime.value,
      };
      // console.log();
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      const form = this.filterForm;
      let dataTime = '';
      if (form.dataTime && typeof form.dataTime === 'object') {
        dataTime = `${form.dataTime[0].replace(/\//g, '-')} - ${form.dataTime[1].replace(/\//g, '-')}`;
      } else {
        dataTime = form.dataTime;
      }
      if (dataTime === '1970-01-01 - 1970-01-01') {
        form.dataTime = null;
      } else {
        form.dataTime = dataTime;
      }
      form.gpoMemberId = this.getGpoId;          // 默认的GPOID
      ComponentAnalysis.list(cpage, cpageSizes, form)
        .then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.ordersPriceAlls = Number(res.data.result.resultAmountSum);   // 汇总金额
            let data = [];
            if (this.filterForm.objectType === 1) {
              data = res.data.result.typeOneOutputList;
            } else if (this.filterForm.objectType === 2) {
              data = res.data.result.typeTwoOutputList;
            } else if (this.filterForm.objectType === 3) {
              data = res.data.result.typeThreeOutputList;
            } else if (this.filterForm.objectType === 4) {
              data = res.data.result.typeFourOutputList;
            } else if (this.filterForm.objectType === 5) {
              data = res.data.result.typeFiveOutputList;
            } else if (this.filterForm.objectType === 6) {
              data = res.data.result.typeSixOutputList;
            } else if (this.filterForm.objectType === 7) {
              data = res.data.result.typeSevenOutputList;
            } else if (this.filterForm.objectType === 8) {
              data = res.data.result.typeEightOutputList;
            }
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            this.ordersPriceAll = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              data.content[i].ordersPrice = Number(data.content[i].ordersPrice);
              data.content[i].proportion = Number(data.content[i].proportion);
              this.tableNum.push(numX);
            }
            const data1 = res.data.result.topFiveOutputList;
            const a = [];
            const b = [];
            const c = [];
            const d = [];
            for (let i = 0; i < data1.length; i += 1) {
              a.push({
                name: data1[i].name || '',
                value: data1[i].ordersPrice || 0,
              });
              b.push(data1[i].name);
              this.ordersPriceAll += Number(data1[i].ordersPrice);
            }
            // 列表为5时，饼图只保留前5个，其他的加起来用‘其他’统一标示, 5+1模式
            if (data1.length >= 5) {
              const value1 = (Number(this.ordersPriceAlls) -
                Number(this.ordersPriceAll)).toFixed(2);
              a.push({
                name: '其他',
                value: value1,
              }); // 其他总数
              b.push('其他');
            }
            for (let i = data1.length - 1; i >= 0; i -= 1) {
              let value3 = '';
              if (data1[i].ordersPrice) {
                value3 = ((data1[i].ordersPrice) /
                  this.ordersPriceAlls).toFixed(2);
              } else {
                value3 = 0;
              }
              c.push({
                value: value3 || 0,
              });
              d.push(data1[i].name);
            }
            if (data1.length >= 5) {
              const value2 = ((Number(this.ordersPriceAlls) - Number(this.ordersPriceAll)) /
                Number(this.ordersPriceAlls)).toFixed(2);
              c.push({
                value: value2,
              }); // 其他总数
              d.push('其他');
            }
            this.orderDrugsData = {
              name: b,
              value: a,
              num: c,
              label: d,
            };
            this.myChart1.setOption(this.opt1);
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.page = data.number;
            this.size = data.size;
            this.$emit('page', data.number + 1, data.size, data.totalElements, data.totalPages);
          }
          this.loading = false;
        });
      return true;
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
      };
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
      }
      if (this.filterForm.drugsCode !== 'undefined' && this.filterForm.drugsCode) {
        form.drugsCode = this.filterForm.drugsCode;
      }
      if (this.filterForm.drugsName !== 'undefined' && this.filterForm.drugsName) {
        form.drugsName = this.filterForm.drugsName;
      }
      if (this.filterForm.tradeName !== 'undefined' && this.filterForm.tradeName) {
        form.tradeName = this.filterForm.tradeName;
      }
      if (this.filterForm.salerMemberName !== 'undefined' && this.filterForm.salerMemberName) {
        form.salerMemberName = this.filterForm.salerMemberName;
      }
      if (this.filterForm.approvalNumber !== 'undefined' && this.filterForm.approvalNumber) {
        form.approvalNumber = this.filterForm.approvalNumber;
      }
      if (this.filterForm.drugStandardCode !== 'undefined' && this.filterForm.drugStandardCode) {
        form.drugStandardCode = this.filterForm.drugStandardCode;
      }
      if (this.filterForm.objectType !== 'undefined' && this.filterForm.objectType) {
        form.objectType = this.filterForm.objectType;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      if (this.filterForm.producerName !== 'undefined' && this.filterForm.producerName) {
        form.producerName = this.filterForm.producerName;
      }
      if (this.filterForm.dataTime !== 'undefined' && this.filterForm.dataTime) {
        form.dataTime = this.filterForm.dataTime;
      }
      const url = ComponentAnalysis.output(form);
      window.open(url);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', '.content_pie', 170]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
};
</script>

<style scoped>
.text_right {
  text-align: right;
  width: 100%;
}
</style>

