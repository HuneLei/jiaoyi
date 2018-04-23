<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
    </el-table-column>
    <el-table-column align="left" prop="memberCode" label="会员编码" sortable="custom" width="80" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="memberName" label="会员名称" sortable="custom" width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="addressCode" label="地址编码" sortable="custom" width="80" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="addressType" label="地址类型" sortable="custom" width="160" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.addressType === 1">医疗机构（配送点）</span>
        <span v-if="scope.row.addressType === 2">配送企业（仓库）</span>
        <span v-if="scope.row.addressType === 3">GPO仓库</span>
      </template>
    </el-table-column>
    <el-table-column align="left" prop="addressName" label="地址名称" sortable="custom" width="120" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="provinceName" align="left" label="省/市/区" sortable="custom" width="250" show-overflow-tooltip>
      <template scope="scope">
        {{scope.row.provinceName}} / {{scope.row.cityName}} / {{scope.row.countyName}}
      </template>
    </el-table-column>
    <!--<el-table-column align="left" prop="cityName" label="市" sortable width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="countyName" label="区" sortable width="100" show-overflow-tooltip>
      </el-table-column>-->
    <el-table-column align="left" prop="addressFull" label="详细地址" sortable="custom" width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="contacter" label="联系人" sortable="custom" min-width="70" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="contacterPhone" label="联系电话" sortable="custom" class-name="" min-width="90" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="outAddressCode" label="外部地址编码" sortable="custom" class-name="table_right" min-width="100" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="center" min-width='160' fixed="right" label="操作" v-if="authbtn.item">
      <template scope="scope">
        <el-button type="text" @click="dataUpdate(scope.row)" v-if="authbtn.update">
          <i class="fa fa-edit"></i> 编辑</el-button>
        <el-button type="text" v-if="authbtn.destory" @click="dataDelete(scope.row)">
          <i class="fa fa-trash-o"></i> 删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import address from '../../../api/BasicInfo/Address';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    /**
     *  获取当前用户会员的类型
     *  memberType = 5 ： 管理员，可查看所有的地址
     *  Other : 查看当前会员的地址
     */
    if (this.View_UserInfo.memberType === 5) {
      this.dataList();
    } else {
      this.filterForm.memberId = this.View_UserInfo.memberId; // 会员ID
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: mapGetters([
    'View_UserInfo',
  ]),
  data() {
    return {
      tableHeight: 650,
      tableData: [],       // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      page: 0,
      size: 20,
      // 筛选的字段
      filterForm: {
        memberId: null,
        memberName: null,
        addressType: null,
        provinceId: null,                     // 省ID
        cityId: null,                         // 市ID
        countyId: null,                       // 区ID
      },
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
    // 数据查询条件获取
    dataSearch(data) {
      if (this.View_UserInfo.memberType === 5) {
        this.filterForm = {
          memberId: null, // 会员ID
          memberName: data.memberName.value,
          addressType: data.addressType.value,
          provinceId: data.provinceId.value,
          cityId: data.cityId.value,
          countyId: data.countyId.value,
        };
      } else {
        this.filterForm = {
          memberId: this.View_UserInfo.memberId, // 会员ID
          memberName: data.memberName.value,
          addressType: data.addressType.value,
          provinceId: data.provinceId.value,
          cityId: data.cityId.value,
          countyId: data.countyId.value,
        };
      }
      this.dataList(0, this.size);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      address.list(cpage, cpageSizes, this.filterForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            // data.content[i].num = (i + 1) + (cpage * cpageSizes);
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
          }
          this.tableDataOld = data.content;
          this.tableData = data.content;
          this.page = data.number;
          this.size = data.size;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
    },
    // 数据更新
    dataUpdate(item) {
      this.$bus.$emit('data/update', item);
    },
    // 删除
    dataDelete(item) {
      const ret = '此操作将永久删除该内容, 是否继续?';
      this.$confirm(ret, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true;
        const arrId = [];
        arrId.push(item.id);  // 将获取的id值转化为数组类型
        // 链接删除接口
        address.destory(arrId).then((res) => {
          if (res.data.code === 0) {
            this.dataList();
            this.$message({
              type: 'success',
              message: '删除成功',
            });
          }
          this.loading = false;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
  mounted() {
  },
};
</script>
