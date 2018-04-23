<template>
  <div class="dialog-sign">
    <el-dialog :title="signOptions.signTitle"
               :visible.sync="signVisibleOut"
               :show-close="false"
               :close-on-click-modal	="false"
               :close-on-press-escape="false" @open="dialogOpen" top="15px">
      <div id="wrapper-img" style="width: 600px; margin: 0 auto; position: relative" v-loading="signLoading">
        <div class="sign-mould" style="width: 100px; position: absolute; left: 0; top: 0;" v-drag ref="drag">
          <div class="sign-position" id="sign-position" ref="sign"></div>
        </div>
        <img id="img" :src="imgSrc" ref="image" />
      </div>
      <div slot="footer" class="dialog-footer">
        <span class="dialog-btn">
            <el-button size="small" name="signature" type="primary"  class="page_btn" :loading="btnIsLoading.signature" :disabled="btnIsDisabled.signature" @click="signContract()">
              <i class="icon iconfont icon-qianzhang"></i>
              签章
            </el-button>
           <el-button name="Back" size="small" @click="signDialogClose" class="page_btn">
        <i class="icon iconfont icon-fanhui"></i>返回
      </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * Created by lqy
   * 签章弹框
   */

  import { mapActions, mapGetters } from 'vuex';
  import config from '../../config';
  import gpo from './../../api/gpo'

  export default {
    directives: {
      drag: {
        inserted(el) {
          const div1 = el;
          div1.onmousedown = (ev) => {
            const oevent = ev || event;

            console.log(oevent.clientX);
            console.log(div1.offsetLeft);
            const distanceX = oevent.clientX - div1.offsetLeft;
            const distanceY = oevent.clientY - div1.offsetTop;
            // 外部DIV
            const $wrapperImg = document.getElementById('wrapper-img');
            console.log(321312, $wrapperImg);
            const height = $wrapperImg.style.height.slice(0, $wrapperImg.style.height.length - 2) - 110;
            console.log(321, $wrapperImg.style.height);
            document.onmousemove = (eve) => {
             //  alert(321);
              const oevent1 = eve || event;
              if (oevent1.clientX - distanceX < 0) {
                div1.style.left = 0;
              } else if (oevent1.clientX - distanceX > 500) {
                div1.style.left = `${500}px`;
              } else {
                div1.style.left = `${oevent1.clientX - distanceX}px`;
              }
              if (oevent1.clientY - distanceY < 0) {
                div1.style.top = 0;
                console.log(3);
              } else if (oevent1.clientY - distanceY > height) {
                div1.style.top = `${height}px`;
                console.log(2);
              } else {
                div1.style.top = `${oevent1.clientY - distanceY}px`;
                console.log(1);
              }
            };
            document.onmouseup = () => {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        },
      }
    },
    watch: {
      signVisibleOut() {     // 监听dialogFormVisible值变化组件显示隐藏
        this.signDialogVisible = true;
      },
    },
    data() {
      return {
        signLoading: false,
        signDialogVisible: false,
        imgSrc: null,
        top: null,
        left: null,
      }
    },
    computed: {
      signContentStyle() {
        return `height: ${window.innerHeight - 55 - 57 - 60}px; overflow-y: auto;`;
      },
      uploadHost() {
        return `${config.getUploadHost()}pdf?access_token=${config.getToken()}`;
      },
    },
    props: {
      // signLoading: true,
      signVisibleOut: true,
      signOptions: null,
      btnIsDisabled: {
        type: Object,
        default() {
          return {
            signature: false,
          };
        },
      },
      btnIsLoading: {
        type: Object,
        default() {
          return {
            signature: false,
          };
        },
      },
    },
    methods: {
      // 预览PDF
      showPdf() {
        setTimeout(() => {
          const $drag = this.$refs.drag;
          const $img = document.getElementById('img');    // div大小 600px
          const img = new Image();
          img.src = this.signOptions.url;                 // 真实大小
          img.onload = () => {
            const $wrapperImg = document.getElementById('wrapper-img');
            $wrapperImg.style.height = (600/img.width*img.height).toFixed(0) + 'px';
            if (this.signOptions.x) {
              $drag.style.left = this.signOptions.x + 'px';
            } else {
              // 随机
              $drag.style.left = this.RandomNumBoth(0, 500) + 'px';
            }
            if (this.signOptions.y) {
              $drag.style.top = this.signOptions.y + 'px';
            } else {
              // 随机
              $drag.style.top = this.RandomNumBoth(0, (600/img.width*img.height - 100)) + 'px';
            }
            const $sign = document.getElementById('sign-position');
            const $image = this.$refs.image;
            $image.onmousedown = (e) => {
              e.preventDefault();
            };
            $sign.style.backgroundImage =`url(${this.signOptions.urls})`;
            this.imgSrc = this.signOptions.oldUrl;
            this.signLoading = false;
          }
        });
      },
      // 签章操作
      signContract() {
        this.signLoading = true;
        const $drag = this.$refs.drag;
        let top = $drag.style.top.replace(/px/, '');
        let top1 = $drag.style.top.replace(/px/, '');
        let left = $drag.style.left.replace(/px/, '');
        let left1 = $drag.style.left.replace(/px/, '');

        const $img = document.getElementById('img');
        const img = new Image();
        img.src = this.signOptions.url;

        top = parseInt((img.height / $img.height) * top);
        left = parseInt((img.width / $img.width) * left);

        top = top && top > 0 ? top : 0;
        left = left && left > 0 ? left : 0;

        gpo.seal(left, top, this.signOptions.oldUrl, this.signOptions.urls, this.signOptions.gOldUrl).then((res) => {
          const result = res.data;
          if (result.code === 0) {
            // 签章成功后操作
            const path = result.result;
            // this.imgSrc = path;
            setTimeout(() => {
              this.$message({
                message: '签章成功',
                type: 'success',
              });
              this.signLoading = false;
            }, 1000);
            this.$emit('to-upload', result.result, this.signOptions.index, left1, top1, this.signOptions.oldUrl);
          } else {
            this.signLoading = false;
            this.$message({
              message: result.message,
              type: 'error',
            });
          }
        });
      },
      signDialogClose() {
        this.imgSrc = null;
        this.$emit('dialog-close', this.fromDialog);
      },
      //  打开dialog触发事件
      dialogOpen() {
        this.signLoading = true;
        // this.imgSrc = null;
        this.showPdf();
      },
      RandomNumBoth(Min, Max) {
        const Range = Max - Min;
        const Rand = Math.random();
        const num = Min + Math.round(Rand * Range); //四舍五入
        return num;
      }
    },
  };
</script>

<style scoped>
  .dialog-footer {
    text-align: center;
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
    margin-right: 20px;
  }

  .btnclass {
    border-radius: 3px;
    font-size: 12px;
  }

  .el-dialog__body {
    position: relative;
  }

  #canvas {
    display: none;
  }

  #img {
    width: 100%;
  }

  .sign-position {
    width: 105px;
    height: 105px;
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
  }

</style>
<style>
  .dialog-sign .el-dialog {
    width: 842px !important;
  }
</style>
