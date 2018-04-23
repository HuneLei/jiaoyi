<template>
  <el-form-item label="省/市"  prop="District">
    <el-cascader clearable placeholder="请选择省市" :disabled="disabled" :options="options" v-model="selectedOptions" @active-item-change="getCity1" @change="getDistric">
    </el-cascader>
  </el-form-item>
</template>

<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import district from '../api/district'; // 省市

export default {
  data() {
    return {
      options: [], // 省市选择框
      selectedOptions: [],  // 选择的省市值
    };
  },
  activated() {
    this.$bus.$on('data/Distric', this.dataDistric);
  },
  deactivated() {
    this.$bus.$off('data/Distric', this.dataDistric);
  },
  props: {
    disabled: false,
  },
  methods: {
    // 进入编辑页面显示省市
    dataDistric(msg) {
      if (msg.length === 0) {
        this.selectedOptions = [];
      }
      if (typeof (msg
      ) !== 'string' && typeof (msg
      ) !== 'number' && typeof (msg
      ) !== 'undefined' && msg.length > 0) {
        this.selectedOptions = msg;
        const arr = [];
        arr.push(msg[0]);
        this.getCity(arr);
      }
    },
    // 点击后触发改变选择的省市内容
    getDistric(val) {
      if (val[0] === -1) {
        this.selectedOptions = [];
        this.selectedOptions.push(val[0], 0);
        this.$bus.$emit('change/province', this.selectedOptions);
        return false;
      }
      const data = [];
      for (let i = 0; i < this.options.length; i += 1) {
        if (this.options[i].value === val[0]) {
          data.push({
            id: val[0],
            name: this.options[i].label,
          });
          const child = this.options[i].children;
          for (let j = 0; j < child.length; j += 1) {
            if (val[1] === child[j].value) {
              data.push({
                id: val[1],
                name: child[j].label,
              });
            }
          }
        }
      }
      this.$bus.$emit('change/province', this.selectedOptions, data);
      return true;
    },
    // 获取省值
    getProvince() {
      district.cityList(88888).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          for (let j = 0; j < data.length; j += 1) {
            let d = {};
            if (j === 0) {
              d = {
                value: data[j].id,
                label: data[j].name,
              };
            } else {
              d = {
                value: data[j].id,
                label: data[j].name,
                children: [],
              };
            }
            this.options.push(d);
          }
        }
      });
    },
    // 点击获取市值
    getCity(value) {
      // console.log('shengshi', value);
      if (!value[0] || value[0] === -1) {
        this.selectedOptions = [];
        this.selectedOptions.push(value[0], 0);
        this.$bus.$emit('change/province', this.selectedOptions);
        return false;
      }
      district.cityList(value[0]).then((res) => {
        if (res.data.code === 0) {
          const cityChildren = [];
          const data = res.data.result;
          if (data) {
            for (let i = 0; i < data.length; i += 1) {
              const a = {
                value: data[i].id,
                label: data[i].name,
              };
              cityChildren.push(a);
            }
          }
          for (let q = 0; q < this.options.length; q += 1) {
            if (this.options[q].value === value[0]) {
              this.options[q].children = cityChildren;
              break;
            }
          }
        }
      });
      return true;
    },
    // 点击获取市值
    getCity1(value) {
      const arr = [];
      for (let i = 0; i < this.options.length; i += 1) {
        if (this.options[i].value === value[0]) {
          arr.push({
            id: value[0],
            name: this.options[i].label,
          });
        }
      }
      this.selectedOptions = [];
      this.selectedOptions.push(value[0], 0);
      this.$bus.$emit('change/province', this.selectedOptions, arr);
      district.cityList(value[0]).then((res) => {
        if (res.data.code === 0) {
          this.isActive = false;
          const cityChildren = [];
          const data = res.data.result;
          for (let i = 0; i < data.length; i += 1) {
            const a = {
              value: data[i].id,
              label: data[i].name,
            };
            cityChildren.push(a);
          }
          for (let q = 0; q < this.options.length; q += 1) {
            if (this.options[q].value === value[0]) {
              this.options[q].children = cityChildren;
              break;
            }
          }
        }
      });
    },
  },
  mounted() {
    this.getProvince();
  },
};
</script>
