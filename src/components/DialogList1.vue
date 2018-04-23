<template>
  <div class="dialog-list">
    <el-dialog class="dialog-ct" :title="options.title" :visible.sync="isShow" :size="options.dialogSize" @open="dialogOpen" @close="Close">
      <div v-if="shows" class="dialog-search">
        <DialogFind :message="options.searchMessage" :showNum="4" @dialogFindheight="dialogHeight" @dialogFind="onSearch" :dialogSize="options.dialogSize" :searchInput="searchInput"></DialogFind>

      </div>

      <slot v-if="options.customTable" :name="options.customTableName" :class="options.customTableName"></slot>
      <el-table v-else fit border stripe ref="multipleTable" :data="options.tableData" :height="tableHeight" @selection-change="dataSelect" @cell-click="cellClick" v-loading="options.isLoadingTable">
        <el-table-column v-show="options.showSelection" type="selection" width="40" align="center">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40" show-overflow-tooltip>
        </el-table-column>
        <!--
                            <template scope="scope">
                              <el-input v-model="scope.row.certificateNo"></el-input>
                            </template> -->
        <el-table-column v-for="item in options.tableOptions" :key="item.key" :prop="item.key" :label="item.name" :min-width="item.width ? item.width : 160" :sortable="!(item.sortable === false)" show-overflow-tooltip>
          <template scope="scope">
            <span v-if="item.component">
              <component :is="item.component" v-model="scope.row[item.key]" :row="scope.row"></component>
            </span>
            <span v-else-if="item.option && item.option.length">
              <span v-for="it in item.option" :key="it.value">{{ scope.row[item.key] === it.value ? it.label : '' }}</span>
            </span>
            <span v-else>{{scope.row[item.key]}}</span>
          </template>
          <!-- <template scope="scope">
          </template> -->
        </el-table-column>
      </el-table>

      <div class="dialog-footer">
        <slot v-if="options.customFooter" :name="options.customFooterName" :class="options.customFooterName"></slot>
        <div v-else>
          <el-pagination small layout="prev, pager, next" :current-page="options.page" :total="options.pageTotal" :page-size="options.pageSize" class="dialog-page" @current-change="pageChange">
          </el-pagination>
          <span class="dialog-btn">
            <el-button v-show="showBtn.isShowSure" class="btnclass" size="small" type="primary" @click="sureClick">
              <i class="icon iconfont icon-right_circle"></i>确定</el-button>
            <el-button v-show="showBtn.isShowCanel" class="btnclass" size="small" @click="cancelClick">
              <i class="icon iconfont icon-jujue"></i>取消</el-button>
            <el-button v-show="showBtn.isShowClose" class="btnclass" size="small" @click="closeClick">
              <i class="icon iconfont icon-jujue"></i>关闭</el-button>
          </span>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  /**
   * Created by 李昌盛
   * 通用的
   * 点击弹框组件
   */
  import DialogFind from './DialogFind';
  import myinput from './tableComp/myinput';

  export default {
    created() {
      if (this.options.isHideSearch) {
        this.shows = false;
      } else {
        this.shows = true;
      }
      this.$bus.$on('dialogList/select', this.dataSelectInit);
    },
    destroyed() {
      this.$bus.$off('dialogList/select', this.dataSelectInit);
    },
    components: {
      DialogFind,
      myinput,
    },
    data() {
      return {
        selectRows: [],               //  多选的情况下被选中的rows
        tableHeight: 0,
        searchNumShow: 4,
        selectOne: [],
        finalRows: [],
        isclear: false,               //  是否清空按钮
        isfirstSel: false,            //  是否第一次选择
        isShow: false,
        shows: false,
      };
    },
    computed: {
    },
    watch: {
      isShowDialog() {
        this.isShow = this.isShowDialog;
      },
    },
    props: {
      showBtn: {
        default() {
          return {
            isShowSure: true,
            isShowCanel: true,
            isShowClose: false,
          };
        },
      },
      searchInput: {
        default: 0,
      },
      searchNum: {                  //  默认显示多少个搜索条件
        default: 4,
      },
      isShowDialog: false,
      tableSelected: null,          //  默认被选中的数组id
      tableType: 0,                 //  0 单选，1 多选 默认单选
      msgBase: '',                  //  基础信息，用于识别哪个弹框，初始化的时候传进来的的，看是否需要
      options: {
        default() {
          return {
            title: '',                  //  弹出框标题
            dialogSize: 'large',        //  弹出框大小   tiny/small/large/full
            isLoadingTable: false,      //  是否loading列表
            page: 1,                    //  当前页
            pageTotal: 0,              //  总条数
            pagesize: 20,               //  每一页条数
            dialogForm: {},             //  表格查询条件
            tableBase: '',              //  表格列表属于哪个表格
            tableData: [],              //  表格详细
            tableOptions: [],           //  表格初始化设置
            searchMessage: [],          //  初始化搜索条件
            customTable: false,         //  是否自定义表格
            customTableName: 'customTable',   // 自定义表格的名称
            customFooter: false,         //  是否自定义底部
            customFooterName: 'customFooterName',   // 自定义底部的名称
            selection: true,           //  表格选择框，默认显示
            IsTrue: false,    // 判断点击确定按鈕是否直接关闭弹框
            showSelection: true,
          };
        },
      },
    },
    methods: {
      //  查询表格事件
      onSearch(searchValue) {
        this.$emit('dataSearch', this.options.tableBase, searchValue);
      },
      //  确定按钮
      sureClick() {
        this.$emit('dataSelect', this.finalRows, this.msgBase, this.options.tableBase, this.options.tableData);
        if (this.options.IsTrue) {
          return false;
        }
        this.$emit('dialogHide');
        return true;
      },
      //  取消按钮
      cancelClick() {
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
        this.$emit('dialogHide');
      },
      // 关闭按钮
      closeClick() {
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
        this.$emit('dialogHide');
      },
      //  打开dialog触发事件
      dialogOpen() {
        this.$emit('dialogOpen');
        this.dialogHeight();
        window.onresize = () => {
          this.dialogHeight();
        };
      },
      //  切换当前页面时
      pageChange(page) {
        this.$emit('pageChange', this.options.tableBase, this.options.dialogForm, page - 1, this.options.pageSize);
      },
      cellClick(row, column, cell, event) {
        if ('el-table-column--selection'.indexOf(column.className) === -1) {
          if (this.tableType === 1) {
            const index = this.selectRows.indexOf(row);
            if (index > -1) {
              this.selectRows.splice(index, 1);
              this.$refs.multipleTable.toggleRowSelection(row, false);
            } else {
              this.selectRows.push(row);
              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          } else {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        }
      },
      //  表格选择事件
      dataSelect(rows) {
        if (this.tableType === 1) {
          this.finalRows = rows;
          return false;
        }
        if (this.isfirstSel) {
          this.isfirstSel = false;
          this.finalRows = rows;
          return false;
        }
        if (rows.length === 0 && !this.isclear) {
          this.finalRows = rows;
          return false;
        }
        if (rows.length === 1) {
          this.finalRows = rows;
          return false;
        }
        if (!this.isclear) {
          this.selectOne = rows;
          this.isclear = true;
          this.$refs.multipleTable.clearSelection();
        } else {
          this.selectOne.forEach((row) => {
            this.isclear = false;
            if (row !== this.finalRows[0]) {
              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          });
        }
        return true;
      },
      //  初始化默认选择
      dataSelectInit(rowIds) {
        let selectIds = [];
        if (rowIds) {
          selectIds = rowIds;
        } else {
          selectIds = this.tableSelected;
        }
        this.options.tableData.forEach((row) => {
          if (selectIds.indexOf(row.id) > -1) {
            this.isfirstSel = true;
            this.finalRows = [row];
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        });
      },
      //  计算表格高度
      dialogHeight() {
        setTimeout(() => {
          const $search = document.querySelectorAll('.dialog-search');
          let searchHeight = 0;
          for (let i = 0; i < $search.length; i += 1) {
            if ($search[i].clientHeight > searchHeight) {
              searchHeight = $search[i].clientHeight;
            }
          }
          const $footer = document.querySelectorAll('.dialog-footer');
          let footerHeight = 0;
          for (let i = 0; i < $footer.length; i += 1) {
            if ($footer[i].clientHeight > footerHeight) {
              footerHeight = $footer[i].clientHeight;
            }
          }
          this.tableHeight = window.tableCustom.tableHeight([
            searchHeight,
            footerHeight,
            window.innerHeight * 0.3,
            100,
          ]);
          const $body = document.querySelector('.dialog-ct .el-dialog__body');
//          $body.innerHeight = this.tableHeight;
        }, 0);
      },
      Close() {
        this.cancelClick();
      },
    },
  };
</script>

<style scoped>
  .dialog-search {
    position: relative;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-bottom: 15px;
  }

  .dialog-search-btn {
    position: absolute;
    top: 15px;
    right: 10px;
    z-index: 2;
    height: 36px;
  }

  .dialog-search-btn .el-button {
    padding: 0;
    width: 36px;
    height: 36px;
  }

  .dialog-search-btn i {
    font-size: 20px;
  }

  .dialog-search-box {
    position: relative;
    z-index: 1;
    padding-right: 60px;
    padding-top: 15px;
    overflow: hidden;
  }

  .dialog-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    padding: 20px;
    z-index: 2;
    background-color: #fff;
    border-radius: 10px;
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
    float: right;
    margin-right: 20px;
  }

  .btnclass {
    border-radius: 3px;
    font-size: 12px;
  }
</style>
<style>
  .dialog-ct .el-dialog__header {
    background-color: #f0f5f8;
    padding: 20px;
    color: #0868cf;
    font-family: 'Microsoft YaHei';
    border-bottom: 1px solid #ddd;
  }

  .dialog-ct .el-dialog__header .el-dialog__title {
    color: #0868cf;
    font-family: 'Microsoft YaHei';
    font-weight: bold;
  }

  .dialog-ct .el-dialog__body {
    padding: 15px 20px 0;
    overflow: hidden;
  }

  .dialog-ct .el-dialog {
    height: 70%;
    overflow: hidden;
    border-radius: 10px;
  }
</style>
