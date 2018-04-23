<template>
  <div class="preview" ref="preview">

    <div :class="main">
      <div class="main_head">
        <h1 class="main_head_title">打印预览</h1>
        <el-button class="main_head_close" size="small" @click="cancelClick">
          <i class="el-icon el-icon-close"></i>
        </el-button>
      </div>

      <div class="main_content">
        <!-- <iframe id="changIframe"></iframe> -->
      </div>

      <div class="main_footer">
        <div class="main_footer_btn">
          <el-button class="btnclass" size="small" type="primary" @click="sureClick">
            <i class="icon iconfont icon-right_circle"></i>打印</el-button>
          <el-button class="btnclass" size="small" @click="cancelClick">
            <i class="icon iconfont icon-jujue"></i>取消</el-button>
        </div>
      </div>
    </div>

    <div :class="mark" @click="markClick"></div>

  </div>
</template>

<script>
/**
 * 李昌盛
 * 584911924@qq.com
 * 打印预览组件
 */
export default {
  watch: {
    show() {
      this.showPrint = this.show;
      if (this.showPrint) {
        this.dataInit();
      }
    },
    showPrint() {
      const preview = this.$refs.preview;
      if (this.showPrint) {
        preview.style.display = 'block';
        setTimeout(() => {
          this.main = 'main show';
          this.mark = 'mark show';
        }, 0);
      } else {
        this.main = 'main';
        this.mark = 'mark';
        setTimeout(() => {
          preview.style.display = 'none';
        }, 500);
      }
    },
  },
  data() {
    return {
      showPrint: false,
      main: 'main',
      mark: 'mark',
      printHtml: '',
    };
  },
  methods: {
    //  初始化打印的图片
    dataInit() {
      const iframe = document.createElement('iframe');
      iframe.onload = () => {
        const fWindow = iframe.contentWindow;
        const fDocument = iframe.contentDocument;
        let html = '';
        for (let i = 0; i < this.imgArr.length; i += 1) {
          const item = this.imgArr[i];
          html += `<img title='${item.name || i}' src='${item.url}' style='width: 100%; height: auto; display: block;' />`;
        }
        this.printHtml = html;
        fDocument.body.innerHTML = html;
        fDocument.body.style.margin = '0px';
      };
      iframe.id = 'changIframe';
      iframe.style.width = '100%';
      iframe.style.borderWidth = '0';
      iframe.style.height = `${window.tableCustom.tableHeight([window.innerHeight * 0.06, 140])}px`;
      const main = this.$refs.preview.querySelector('.main_content');
      main.appendChild(iframe);
    },
    //  确定事件
    sureClick() {
      if (window.navigator.userAgent.indexOf('MSIE') >= 1 || 'ActiveXObject' in window) { //    如果是ie
        localStorage.setItem('printHtml', this.printHtml);
        const url = `${location.origin}/#/Print/DrugsPrint`;
        window.open(url);
      } else {
        const iframe = this.$refs.preview.querySelector('#changIframe');
        const fWindow = iframe.contentWindow;
        fWindow.print();
      }
    },
    //  取消事件
    cancelClick() {
      setTimeout(() => {
        const iframe = this.$refs.preview.querySelector('#changIframe');
        iframe.parentNode.removeChild(iframe);
      }, 200);
      this.$emit('print-cancel');
    },
    //  点击mark区域取消
    markClick() {
      if (this.markClose) {
        this.cancelClick();
      }
    },
  },
  props: {
    show: {             //  显示打印预览
      default: false,
    },
    markClose: {        //  是否点击遮罩关闭，默认开启
      default: true,
    },
    imgArr: {           //  要打印的图片数组，name爱传不传，src必传，不然哪来的图片打印
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.preview {
  display: none;
}

.main {
  position: fixed;
  z-index: 200;
  top: 5%;
  left: 25%;
  width: 50%;
  height: 94%;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  opacity: 0.01;
  transition: all .5s;
}

.main.show {
  top: 3%;
  opacity: 1;
}

.main_head {
  background-color: #f0f5f8;
  padding: 20px;
  color: #0868cf;
  font-family: 'Microsoft YaHei';
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}

.main_head_title {
  color: #0868cf;
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  float: left;
  font-size: 16px;
  line-height: 1;
}

.main_head_close {
  float: right;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  cursor: pointer;
  color: #bfc8d9;
}

.main_content {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
}

.main_footer {
  position: absolute;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  padding: 20px;
  z-index: 2;
  background-color: #fff;
}

.main_footer_btn {
  float: right;
}

.btnclass .icon {
  margin-right: 5px;
  display: inline-block;
  vertical-align: top;
}

.mark {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  z-index: 199;
  opacity: 0.01;
  transition: all .5s;
}

.mark.show {
  opacity: 1;
}
</style>
