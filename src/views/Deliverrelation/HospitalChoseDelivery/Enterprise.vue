<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" size="small">
      <el-form ref="form" label-width="140px" class="edit-form">
        <el-row class="edit-form-title">
          <p>
            1.配送区域
          </p>
        </el-row>

        <el-table v-loading="areaLoading" border fit :data="areaData" stripe height="150">
          <el-table-column prop="num" label="#" width="40"></el-table-column>
          <el-table-column min-width="200" prop="provinceName" label="省" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="200" prop="cityName" label="市" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="200" prop="countyName" label="县" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>

        <el-row class="edit-form-title">
          <p>
            2.仓储设施
          </p>
        </el-row>

        <el-table v-loading="storeLoading" border fit :data="storeData" stripe height="150">
          <el-table-column prop="num" label="#" width="40"></el-table-column>
          <el-table-column min-width="120" prop="storageName" label="仓储设施名称" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120" prop="storageType" label="仓储类型" sortable show-overflow-tooltip>
            <template scope="scope">
              <span v-if="scope.row.storageType === 0">常温库</span>
              <span v-if="scope.row.storageType === 1">阴凉库</span>
              <span v-if="scope.row.storageType === 2">冷库</span>
            </template>
          </el-table-column>
          <el-table-column min-width="120" prop="measure" label="仓储面积" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120" prop="detailsAddress" label="地址" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120" prop="remarks" label="备注" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120" label="证明文件" sortable class-name="table_right" show-overflow-tooltip>
            <template scope="scope">
              <YuploadFiles :data="convert.getJSON(scope.row.enclosure)"></YuploadFiles>
            </template>
          </el-table-column>
        </el-table>

        <el-row class="edit-form-title">
          <p>
            3.运输车辆
          </p>
        </el-row>

        <el-table v-loading="transportCarLoading" border fit :data="transportCarData" stripe height="150">
          <el-table-column prop="num" label="#" width="40"></el-table-column>
          <el-table-column min-width="120" prop="carNo" label="车牌号码" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120" prop="carType" label="车辆类型" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120" prop="registerDate" label="注册日期" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120" prop="issueDate" label="发证日期" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="120" label="行驶证" sortable show-overflow-tooltip>
            <template scope="scope">
              <YuploadFiles :data="convert.getJSON(scope.row.enclosure)"></YuploadFiles>
            </template>
          </el-table-column>
          <el-table-column min-width="120" prop="remarks" label="备注" sortable class-name="table_right" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import HospitalChoseDelivery from '../../../api/Deliverrelation/HospitalChoseDelivery';

export default {
  activated() {
    this.$bus.$on('data/area/create', this.dataCreate);
  },
  deactivated() {
    this.$bus.$off('data/area/create', this.dataCreate);
  },
  data() {
    return {
      elTabs: 0,
      // 是否可编辑
      areaLoading: false,
      areaPage: 1,
      areaSize: 15,
      areaTotal: 0,
      areaData: [],
      storeLoading: false,
      storePage: 1,
      storeSize: 15,
      storeTotal: 0,
      storeData: [],
      transportCarLoading: false,
      transportCarPage: 1,
      transportCarSize: 15,
      transportCarTotal: 0,
      transportCarData: [],
      dialogVisible: false,
      gid: '',
      pid: '',
      mid: '',
    };
  },
  methods: {
    // 新增
    dataCreate(data) {
      // console.log();
      this.title = '配送区域新增';
      this.dialogVisible = true;
      this.editType = 0;
      this.gid = data.gid;
      this.pid = data.pid;
      this.mid = data.mid;
      this.areaList();
      this.storeList();
      this.transportCarList();
    },
    areaList() {
      this.areaLoading = true;
      // console.log();
      HospitalChoseDelivery.enterprise(this.gid,
        this.pid, this.mid).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            for (let i = 0; i < data.length; i += 1) {
              // const numX = (i + 1) + ((this.areaPage - 1) * this.areaSize);
              data[i].num = i + 1;
            }
            this.areaData = data;
          }
          // console.log();
          this.areaLoading = false;
        });
    },
    storeList() {
      this.storeLoading = true;
      // console.log();
      HospitalChoseDelivery.storage(this.gid,
        this.pid, this.mid).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            for (let i = 0; i < data.length; i += 1) {
              // const numX = (i + 1) + ((this.areaPage - 1) * this.areaSize);
              data[i].num = i + 1;
            }
            this.storeData = data;
          }
          // console.log();
          this.storeLoading = false;
        });
    },
    transportCarList() {
      this.transportCarLoading = true;
      // console.log();
      HospitalChoseDelivery.transport(this.gid,
        this.pid, this.mid).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            for (let i = 0; i < data.length; i += 1) {
              // const numX = (i + 1) + ((this.areaPage - 1) * this.areaSize);
              data[i].num = i + 1;
            }
            this.transportCarData = data;
          }
          this.transportCarLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.edit-form {
  padding-bottom: 0.3rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.edit-form-title {
  font-size: 20px;
  padding: .1rem;
  margin-bottom: .2rem;
  border-bottom: .01rem solid #eee;
}
</style>

<style>
.el-dialog__body {
  padding-top: 10px !important;
}
</style>

