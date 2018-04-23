<template>
  <div class="yu-load-files">

    <ul id="imageviewer" ref="imageviewer">
    </ul>

    <div class="file_tag">
      <el-tag :type="tagClass" @click.native="previewFile">{{tagName}}</el-tag>
    </div>

  </div>
</template>

<script>
import 'viewerjs/dist/viewer.min.css';
import Viewer from 'viewerjs/dist/viewer.esm';
import picPdf from '../assets/img/pic_pdf.png';
import picWord from '../assets/img/pic_word.png';
import picExecl from '../assets/img/pic_execl.png';
import picPPT from '../assets/img/pic_ppt.png';
import picRar from '../assets/img/pic_rar.png';
/**
 * 附件预览
 */
export default {
  mounted() {
  },
  watch: {
    isShow() {
      if (this.isShow) {
        this.previewFile();
      }
    },
  },
  computed: {
    tagName() {
      if (this.data && typeof (this.data) === 'object' && this.data.length > 0) {
        let count = 0;
        for (let i = 0; i < this.data.length; i += 1) {
          const item = this.data[i];
          if (item.status === 'success' && item.percentage === 100) {
            count += 1;
          }
        }
        return `附件(${count})`;
      }
      return '附件(0)';
    },
    tagClass() {
      if (this.data && typeof (this.data) === 'object' && this.data.length > 0) {
        return 'primary';
      }
      return 'gray';
    },
  },
  data() {
    return {
      index: 0,
      $viewer: null,
      $viewin: null,
    };
  },
  methods: {
    // 预览文件
    previewFile() {
      let innerHtml = '';
      for (let i = 0; i < this.data.length; i += 1) {
        const item = this.data[i];
        if (item.status === 'success' && item.percentage === 100) {
          let dataUrl = item.url;
          switch (item.type) {
            case 'pdf':
              dataUrl = picPdf;
              break;
            case 'word':
              dataUrl = picWord;
              break;
            case 'excel':
              dataUrl = picExecl;
              break;
            case 'ppt':
              dataUrl = picPPT;
              break;
            case 'rar':
              dataUrl = picRar;
              break;
            default:
              break;
          }
          innerHtml += `<li><img src='${dataUrl}?type=${item.type}&url=${item.url}' alt='${item.name}' /></li>`;
        }
      }
      this.$refs.imageviewer.innerHTML = innerHtml;

      const that = this;

      if (!this.$viewer) {
        this.$viewer = new Viewer(this.$refs.imageviewer, {
          tooltip: false,
          hide() {
            that.$emit('preview-hide');
          },
        });
      } else {
        this.$viewer.destroy();
        this.$viewer = new Viewer(this.$refs.imageviewer, {
          tooltip: false,
          hide() {
            that.$emit('preview-hide');
          },
        });
      }
      const $imgs = this.$refs.imageviewer.children;
      if ($imgs.length > 0) {
        if ($imgs.length - 1 < this.previewIndex) {
          $imgs[0].querySelector('img').click();
        } else {
          $imgs[this.previewIndex].querySelector('img').click();
        }

        this.$viewin = document.querySelector('.viewer-container.viewer-in');

        this.$viewin.addEventListener('click', (e) => {
          const $e = e.target;
          const getCode = (name) => {
            const reg = new RegExp(`.+(&)${name}=([^&]*)`);
            if ($e.src) {
              const r = $e.src.match(reg);
              if (r !== null) return unescape(r[2]);
            }
            return null;
          };
          if ($e.src && getCode('type') && getCode('type') !== 'image') {
            window.open(getCode('url'));
          }
        });
      }
    },
  },
  props: {
    previewIndex: {
      default: 0,
    },
    data: {
      default: null,
    },
    isShow: {
      default: false,
    },
  },
};
</script>

<style scoped>
.file_tag {
  cursor: pointer;
}

#imageviewer {
  display: none;
}
</style>
