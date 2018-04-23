import Vue from 'vue';

import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Row,
  Col,
  Upload,
  Spinner,
  Scrollbar,
  Cascader,
  Loading,
  MessageBox,
  Message,
  Progress,
  Notification,
  // Transfer,
  Tooltip,
  // ColorPicker,
  Carousel,
  CarouselItem,
  // Collapse,
  // CollapseItem,
  Badge,
  // Card,
  // Rate,
  Steps,
  Step,
  // Progress,
  Tree,
  Alert,
  // Slider,
  // Icon,
  Popover,
  Switch,
} from 'element-ui';

import { LayoutNav, PublicEditPassword } from 'gpo-public';

import {
  PageTitle,
  FormLayout,
  Find,
  Paging,
  DialogList,
  YuploadFiles,
  YUploadEdit,
  Percent,
  TradeFooter,
  TradeEditsForm,
  QywNumberInput,
} from './components';

import baseSelect from './utils/baseSelect'; //  公共下拉选项
import baseTableSelect from './utils/baseTableSelect'; //  公共表格显示选项
import tableCustom from './utils/tableCustom'; //  表格自定义事件
import authControl from './utils/authControl'; //  按钮权限控制
import validator from './utils/validator'; //  全局自定义验证
import convert from './utils/convert'; //  转换

window.tableCustom = tableCustom;
window.authControl = authControl;
window.validator = validator;
window.baseSelect = baseSelect;

Vue.prototype.baseTableSelect = baseTableSelect;
Vue.prototype.convert = convert;

Vue.component('PageTitle', PageTitle);
Vue.component('FormLayout', FormLayout);
Vue.component('Find', Find);
Vue.component('Paging', Paging);
Vue.component('DialogList', DialogList);
Vue.component('YuploadFiles', YuploadFiles);
Vue.component('YUploadEdit', YUploadEdit);
Vue.component('Percent', Percent);
Vue.component('TradeFooter', TradeFooter);
Vue.component('TradeEditsForm', TradeEditsForm);
Vue.component('QywNumberInput', QywNumberInput);

Vue.use(LayoutNav); //  左侧上侧菜单
Vue.use(PublicEditPassword); // 修改密码弹框

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Spinner);
Vue.use(Scrollbar);
Vue.use(Cascader);
Vue.use(Loading.directive);
Vue.use(Progress);
Vue.use(Switch);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Badge);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Carousel);
Vue.use(CarouselItem);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

// 注册一个全局自定义指令 v-focus
// Vue.directive('drag', (el) => {
//   const div1 = el;
//   div1.onmousedown = (ev) => {
//     const oevent = ev || event;
//
//     const distanceX = oevent.clientX - div1.offsetLeft;
//     const distanceY = oevent.clientY - div1.offsetTop;
//
//     document.onmousemove = (eve) => {
//       const oevent1 = eve || event;
//       if (oevent1.clientX - distanceX < 0) {
//         div1.style.left = 0;
//       } else if (oevent1.clientX - distanceX > 500) {
//         div1.style.left = `${500}px`;
//       } else {
//         div1.style.left = `${oevent1.clientX - distanceX}px`;
//       }
//       // console.log(oevent1.clientY - distanceY);
//       if (oevent1.clientY - distanceY < 0) {
//         div1.style.top = 0;
//       } else if (oevent1.clientY - distanceY > 500) {
//         div1.style.top = `${500}px`;
//       } else {
//         div1.style.top = `${oevent1.clientY - distanceY}px`;
//       }
//     };
//     document.onmouseup = () => {
//       document.onmousemove = null;
//       document.onmouseup = null;
//     };
//   };
// });

// =================== 停用组件清单 ==================
// Vue.use(Slider);
// Vue.use(Icon);
// Vue.use(Card);
// Vue.use(Rate);
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(Collapse);
// Vue.use(CollapseItem);
// Vue.use(ColorPicker);

// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$prompt = MessageBox.prompt;
