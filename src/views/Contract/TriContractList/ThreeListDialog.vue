<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" size="large">
      <el-form ref="form" label-width="140px" class="edit-form">
        <el-table v-loading="storeLoading" border fit :data="tableData" stripe height="600">
          <el-table-column prop="num" label="#" width="40"></el-table-column>
          <el-table-column min-width="80" prop="code" label="合同编号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="160" prop="deliveryMemberName" label="配送企业名称" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="80" prop="amount" label="合同总金额" align="right" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="150" prop="validtime" label="合同有效期" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="150" prop="createTime" label="合同创建时间" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="160" prop="hospitalMemberName" label="医疗机构" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="100" prop="remarks" label="备注" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
        name="Back"
        type="primary"
         @click="dialogVisible = false"
        class="page_btn">
        <i class="icon iconfont"></i>确 定
      </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TriContractList from '../../../api/Contract/TriContractList';    // api

export default {
  activated() {
    this.$bus.$on('data/lookThreeContract', this.dataContract);
  },
  deactivated() {
    this.$bus.$off('data/lookThreeContract', this.dataContract);
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      storeLoading: false,
      contractId: '',
      title: '',
    };
  },
  methods: {
    dataContract(id) {
      this.dialogVisible = true;
      this.title = '查看已生成合同';
      this.contractId = id;
      this.dataList();
    },
    // 加载列表
    dataList() {
      this.storeLoading = true;
      TriContractList.threeList(this.contractId)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = i + 1;
              data[i].validtime = `${data[i].validBtime.substring(0, 10) || ''}~${data[i].validEtime.substring(0, 10) || ''}`;
            }
            this.tableData = data;
          }
        });
      this.storeLoading = false;
    },
  },
};
</script>

<style scoped>
.edit-form {
  overflow-x: hidden;
  overflow-y: auto;
}

.edit-form-title {
  font-size: 20px;
  padding: .1rem;
  margin-bottom: .2rem;
  border-bottom: .01rem solid #eee;
}

.dialog-footer {
  text-align: center;
}
</style>

<style>
.el-dialog__body {
  padding-top: 10px !important;
}
</style>

