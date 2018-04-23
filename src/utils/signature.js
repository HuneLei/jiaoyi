/**
 * 签章公共事件
 */

import netcapki from './netcapki'; // 插件地址

//  获取签章的图片 base64
const getStamp = () => {
  try {
    if (!netcapki.isPKIInstalled()) {
      throw new Error('控件安装检测:失败!');
    }

    if (!netcapki.isHasCert()) {
      throw new Error('证书检测:不存在,请检查电子密钥是否插入电脑!');
    }

    if (!netcapki.isHasChain()) {
      throw new Error('证书链检测:不存在!');
    }
    console.log('没有安装东西');
    const iPDFSign = new ActiveXObject('Netca.PDFSign');
    self.name = iPDFSign.SelectCert('NETCA', 1);
    iPDFSign.TsaURL = 'http://tsa.cnca.net/NETCATimeStampServer/TSAServer.jsp'; //时间戳

    const iUtilTool = new ActiveXObject('Netca.UtilTool');
    const base64 = iUtilTool.getBase64ImgFromDevByCert(iPDFSign.SignCertBase64Encode);
    console.log('base64', base64);
    console.log('data:image/gif;base64,' + base64);
    return {
      status: 0,
      result: 'data:image/gif;base64,' + base64,
    };
  } catch (e) {
    return {
      status: 20000,
      message: e.message,
    };
  }
};

export default {
  getStamp,
};
