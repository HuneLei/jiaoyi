<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" size="small" :title="title">
      <el-form ref="form" label-width="85px" class="edit-form">
        <TradeEditsForm :from-edit="fromEdit" :isGoBackShow="false" :arrow-num=4 :arrow-down="true" :message="editMessage" :is-readonly="true">
        </TradeEditsForm>
        <div style="margin: 20px 0;">
          <span style="font-size: 13px;font-weight: 600;">库存数量：
            <span style="margin-left: 10px;">{{gpoStockNums}}</span>
          </span>
        </div>
        <el-table v-loading="stockLoading" border fit :data="stockData" stripe height="400" v-if="getPrincipal.memberType === 4">
          <el-table-column prop="num" label="#" width="40"></el-table-column>
          <el-table-column min-width="120" prop="LOTNO" label="生产批号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="140" prop="PRODDATE" label="生产日期" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="140" prop="INVALIDDATE" label="有效期至" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="80" prop="GOODSQTY" label="库存数量" align="right" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import DrugsUp from '../../../api/Drugs/DrugsUp'; // 药品上架管理APi
import TradeEditsForm from '../../../components/TradeEditsForm';

export default {
  activated() {
    this.$bus.$on('drugsUp/gpoStock', this.getStock);
  },
  deactivated() {
    this.$bus.$off('drugsUp/gpoStock', this.getStock);
  },
  components: {
    TradeEditsForm,
  },
  data() {
    return {
      // 是否可编辑
      stockLoading: false,
      stockData: [],
      dialogVisible: false,
      drugsCode: '',
      title: '',
      gpoStockNums: 0,
      fromEdit: {
        drugsCode: '',
        drugsName: '',
        formName: '',
        specName: '',
      },
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '药品编码', key: 'drugsCode', type: 'el-input', isReadonly: true, span: 6 },
          { label: '通用名', key: 'drugsName', type: 'el-input', isReadonly: true, span: 6 },
          { label: '剂型', key: 'formName', type: 'el-input', isReadonly: true, span: 6 },
          { label: '规格', key: 'specName', type: 'el-input', isReadonly: true, span: 6 },
        ],
        styleObject: {},
        options: {},
        radios: {},
        rules: {},
      },
    };
  },
  computed: {
    getPrincipal() {
      return this.$store.state.view.principal;
    },
  },
  methods: {
    // 新增
    getStock(data) {
      this.title = 'GPO库存';
      this.dialogVisible = true;
      this.drugsCode = data.drugsCode;
      this.fromEdit.drugsCode = data.drugsCode;
      this.fromEdit.drugsName = data.drugsName;
      this.fromEdit.formName = data.formName;
      this.fromEdit.specName = data.specName;
      this.dataList();
    },
    dataList() {
      this.stockLoading = true;
      DrugsUp.stockItem(this.drugsCode).then((res) => {
        if (res.data.code === 0) {
          this.gpoStockNums = 0;
          const data = res.data.result.result;
          if (Number(res.data.result.error) === 0) {
            for (let i = 0; i < data.content.length; i += 1) {
              data.content[i].num = i + 1;
              this.gpoStockNums += Number(data.content[i].GOODSQTY);
              data.content[i].INVALIDDATE = data.content[i].INVALIDDATE.substring(0, 10);
              data.content[i].PRODDATE = data.content[i].PRODDATE.substring(0, 10);
              console.log('data.content[i].INVALIDDATE', data.content[i].INVALIDDATE);
              const INVALIDDATE = data.content[i].INVALIDDATE.split('/');
              const PRODDATE = data.content[i].PRODDATE.split('/');
              data.content[i].INVALIDDATE = `${INVALIDDATE[0] || ''}-${INVALIDDATE[1] || ''}-${INVALIDDATE[2] || ''}`;
              data.content[i].PRODDATE = `${PRODDATE[0] || ''}-${PRODDATE[1] || ''}-${PRODDATE[2] || ''}`;
            }
            this.stockData = data.content;
          }
        }
        this.stockLoading = false;
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
  padding: 0.1rem;
  margin-bottom: 0.2rem;
  border-bottom: 0.01rem solid #eee;
}
</style>

<style>
.el-dialog__body {
  padding-top: 10px !important;
}
</style>

