/*
 名称: NETCA PKI 中间件接口 JS 接口

 本案例为开源代码，请尊重开发人员权益，不要广为传播；
 本案例是对NETCA底层中间件Crypto的开发封装，简化操作代码；
 更深层次、更多功能请参考Crypto的底层开发接口文档；
 用户可以修改该文件，已达到自己需求，但须保障功能正确性；

 本案例使用，需安装"安全客户端"软件，请保障安装的是版本驱动v2.5.0及以后版本；

 功能描述：涉及到数字证书的相关业务处理；
 1 证书查询及证书解析
 2 电子签名及验证
 3 加密及解密
 4 工具

 修订记录：
 版本号		编辑时间		编辑人		修改描述
 2.0.0		03/20/2012		符利华		1.根据secuInter当前最新版本(V4.1)修改创建对象的方式，解决WIN7下多次弹出的问题。
 2.0.1		08/16/2013	    陆汉民		2.整理
 2.0.2       07/23/2016      陆汉民      3.重新修订,字符集采用UTF8编码，验签去掉是否带原文参数，选择证书部分接口优化
 替换原先接口，部分代码需修订
 （I）signNetCA 替换为signNETCA
 (ii)getX509Certificate 入参变为1个
 （iii）getX509Certificates入参变为1个
 （iv）verifySignedData入参变为2个
 */

/***************************************************/
/***********  0.  常量定义 2016.07.23    ***********/
/***************************************************/
//Crypto COM常量
var NETCAPKI_ALGORITHM_3DES_CBC = 16777216;
var NETCAPKI_ALGORITHM_3DES_ECB = 12582912;
var NETCAPKI_ALGORITHM_AES_CBC = 41943040;
var NETCAPKI_ALGORITHM_AES_ECB = 37748736;
var NETCAPKI_ALGORITHM_DES_CBC = 8388608;
var NETCAPKI_ALGORITHM_DES_ECB = 4194304;
var NETCAPKI_ALGORITHM_DH = 3;
var NETCAPKI_ALGORITHM_DSA = 2;
var NETCAPKI_ALGORITHM_ECC = 4;
var NETCAPKI_ALGORITHM_HMAC_MD5 = 131072;
var NETCAPKI_ALGORITHM_HMAC_SHA1 = 262144;
var NETCAPKI_ALGORITHM_HMAC_SHA224 = 393216;
var NETCAPKI_ALGORITHM_HMAC_SHA256 = 524288;
var NETCAPKI_ALGORITHM_HMAC_SHA384 = 655360;
var NETCAPKI_ALGORITHM_HMAC_SHA512 = 786432;
var NETCAPKI_ALGORITHM_HMAC_SM3 = 1048576;
var NETCAPKI_ALGORITHM_MD5 = 4096;
var NETCAPKI_ALGORITHM_MD5WITHRSA = 1;
var NETCAPKI_ALGORITHM_RC4 = 25165824;
var NETCAPKI_ALGORITHM_RSA = 1;
var NETCAPKI_ALGORITHM_RSA_PKCS1_V1_5_ENC = 16;
var NETCAPKI_ALGORITHM_RSA_RAW_ENC = 48;
var NETCAPKI_ALGORITHM_SHA1 = 8192;
var NETCAPKI_ALGORITHM_SHA1WITHRSA = 2;
var NETCAPKI_ALGORITHM_SHA224 = 12288;
var NETCAPKI_ALGORITHM_SHA224WITHRSA = 3;
var NETCAPKI_ALGORITHM_SHA256 = 16384;
var NETCAPKI_ALGORITHM_SHA256WITHRSA = 4;
var NETCAPKI_ALGORITHM_SHA384 = 20480;
var NETCAPKI_ALGORITHM_SHA384WITHRSA = 5;
var NETCAPKI_ALGORITHM_SHA512 = 24576;
var NETCAPKI_ALGORITHM_SHA512WITHRSA = 6;
var NETCAPKI_ALGORITHM_SM1_CBC = 67108864;
var NETCAPKI_ALGORITHM_SM1_ECB = 62914560;
var NETCAPKI_ALGORITHM_SM2_ENC = 64;
var NETCAPKI_ALGORITHM_SM3 = 28672;
var NETCAPKI_ALGORITHM_SM3WITHRSA = 31;
var NETCAPKI_ALGORITHM_SM3WITHSM2 = 25;
var NETCAPKI_ALGORITHM_SM4_CBC = 79691776;
var NETCAPKI_ALGORITHM_SM4_ECB = 75497472;
var NETCAPKI_ALGORITHM_SMS4_CBC = 79691776;
var NETCAPKI_ALGORITHM_SMS4_ECB = 75497472;
var NETCAPKI_ALGORITHM_SSF33_CBC = 54525952;
var NETCAPKI_ALGORITHM_SSF33_ECB = 50331648;
var NETCAPKI_BASE64_DECODE_STRICT = 2;
var NETCAPKI_BASE64_ENCODE_NO_NL = 1;
var NETCAPKI_BMPSTRING = 5;
var NETCAPKI_CERT_ATTRIBUTE_CERT_POLICY_OID = 61;
var NETCAPKI_CERT_ATTRIBUTE_CHECK_PRIVKEY = 54;
var NETCAPKI_CERT_ATTRIBUTE_CRL_URL = 56;
var NETCAPKI_CERT_ATTRIBUTE_CSP_NAME = 55;
var NETCAPKI_CERT_ATTRIBUTE_DELTA_CRL_URL = 57;
var NETCAPKI_CERT_ATTRIBUTE_DNS_NAME = 60;
var NETCAPKI_CERT_ATTRIBUTE_EX_DEPARTMENT = 25;
var NETCAPKI_CERT_ATTRIBUTE_EX_DEVICE_SN = 42;
var NETCAPKI_CERT_ATTRIBUTE_EX_DEVICE_TYPE = 41;
var NETCAPKI_CERT_ATTRIBUTE_EX_EMAIL = 26;
var NETCAPKI_CERT_ATTRIBUTE_EX_FRIENDLY_NAME = 22;
var NETCAPKI_CERT_ATTRIBUTE_EX_NAME = 23;
var NETCAPKI_CERT_ATTRIBUTE_EX_ORGANIZATION = 24;
var NETCAPKI_CERT_ATTRIBUTE_EXTENDED_KEY_USAGE = 62;
var NETCAPKI_CERT_ATTRIBUTE_IP = 59;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_C = 10;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_CN = 13;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_DISPLAY_NAME = 9;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_EMAIL = 14;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_HEX_ENCODE = 53;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_L = 38;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_LDAP_NAME = 48;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_O = 11;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_OU = 12;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_ST = 37;
var NETCAPKI_CERT_ATTRIBUTE_ISSUER_XMLSIG_NAME = 49;
var NETCAPKI_CERT_ATTRIBUTE_OCSP_URL = 58;
var NETCAPKI_CERT_ATTRIBUTE_PREVCERT_THUMBPRINT = 29;
var NETCAPKI_CERT_ATTRIBUTE_PUBKEY_ECC_CURVE = 43;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_C = 17;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_CN = 20;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_DISPLAY_NAME = 16;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_EMAIL = 21;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_HEX_ENCODE = 52;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_L = 40;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_LDAP_NAME = 50;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_O = 18;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_OU = 19;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_ST = 39;
var NETCAPKI_CERT_ATTRIBUTE_SUBJECT_XMLSIG_NAME = 51;
var NETCAPKI_CERT_ATTRIBUTE_UPN = 36;
var NETCAPKI_CERT_ENCODE_BASE64 = 2;
var NETCAPKI_CERT_ENCODE_BASE64_NO_NL = 3;
var NETCAPKI_CERT_ENCODE_DER = 1;
var NETCAPKI_CERT_PURPOSE_ENCRYPT = 1;
var NETCAPKI_CERT_PURPOSE_SIGN = 2;
var NETCAPKI_CERT_PURPOSE_VERIFY_OLD_DATA = 268435458;
var NETCAPKI_CERT_STATUS_CA_REVOKED = -2;
var NETCAPKI_CERT_STATUS_REVOKED = 0;
var NETCAPKI_CERT_STATUS_UNDETERMINED = -1;
var NETCAPKI_CERT_STATUS_UNREVOKED = 1;
var NETCAPKI_CERT_STORE_NAME_CA = "ca";
var NETCAPKI_CERT_STORE_NAME_MY = "my";
var NETCAPKI_CERT_STORE_NAME_OTHERS = "others";
var NETCAPKI_CERT_STORE_NAME_ROOT = "root";
var NETCAPKI_CERT_STORE_TYPE_CURRENT_USER = 0;
var NETCAPKI_CERT_STORE_TYPE_LOCAL_MACHINE = 1;
var NETCAPKI_CERT_STORE_TYPE_MEMORY = 2;
var NETCAPKI_CERT_TYPE_LOCAL_MACHINE = 32768;
var NETCAPKI_CERT_VERIFY_FLAG_ONLINE = 2;
var NETCAPKI_CERT_VERIFY_FLAG_VERIFY_CACERT_REVOKE = 4;
var NETCAPKI_CERT_VERIFY_FLAG_VERIFY_CRL = 32;
var NETCAPKI_CERT_VERIFY_FLAG_VERIFY_OCSP = 16;
var NETCAPKI_CERT_VERIFY_FLAG_VERIFY_REVOKE = 1;
var NETCAPKI_CERTVERIFY_OPTION_IGNOREALLEXT = 4;
var NETCAPKI_CERTVERIFY_OPTION_ONLINE_GETCACERT = 32;
var NETCAPKI_CERTVERIFY_OPTION_ONLINE_GETREVOKEINFO = 64;
var NETCAPKI_CERTVERIFY_OPTION_USEALLCACERT = 2;
var NETCAPKI_CERTVERIFY_OPTION_USEV1CERT = 1;
var NETCAPKI_CERTVERIFY_OPTION_VERIFYCAREVOKE = 16;
var NETCAPKI_CERTVERIFY_OPTION_VERIFYEEREVOKE = 8;
var NETCAPKI_CMS_ENCODE_BASE64 = 2;
var NETCAPKI_CMS_ENCODE_BASE64_MULTILINE = 3;
var NETCAPKI_CMS_ENCODE_DER = 1;
var NETCAPKI_CP_ACP = 0;
var NETCAPKI_CP_BIG5 = 950;
var NETCAPKI_CP_GB18030 = 54936;
var NETCAPKI_CP_GBK = 936;
var NETCAPKI_CP_UTF16LE = 1200;
var NETCAPKI_CP_UTF8 = 65001;
var NETCAPKI_CRL_REASON_AACOMPROMISE = 10;
var NETCAPKI_CRL_REASON_AFFILIATION_CHANGED = 3;
var NETCAPKI_CRL_REASON_CACOMPROMISE = 2;
var NETCAPKI_CRL_REASON_CERTIFATE_HOLD = 6;
var NETCAPKI_CRL_REASON_CESSATION_OF_OPERATION = 5;
var NETCAPKI_CRL_REASON_KEYCOMPROMISE = 1;
var NETCAPKI_CRL_REASON_PRIVILEGE_WITHDRAWN = 9;
var NETCAPKI_CRL_REASON_REMOVE_FROM_CRL = 8;
var NETCAPKI_CRL_REASON_SUPERSEDED = 4;
var NETCAPKI_CRL_REASON_UNSPECIFIED = 0;
var NETCAPKI_DEVICEFLAG_CACHE_PIN_IN_HANDLE = 2;
var NETCAPKI_DEVICEFLAG_CACHE_PIN_IN_PROCESS = 0;
var NETCAPKI_DEVICEFLAG_NOT_CACHE_PIN = 4;
var NETCAPKI_DEVICEFLAG_SILENT = 1;
var NETCAPKI_DEVICETYPE_ANY = -1;
var NETCAPKI_DEVICETYPE_EKEY_EKPK = 1;
var NETCAPKI_DEVICETYPE_EKEY_EKPKXC_V2 = 2;
var NETCAPKI_DEVICETYPE_EKEY_EKPKXC_V3 = 6;
var NETCAPKI_DEVICETYPE_EPASS3000 = 3;
var NETCAPKI_DEVICETYPE_EPASS3003 = 5;
var NETCAPKI_DEVICETYPE_ETAX = 30;
var NETCAPKI_DEVICETYPE_HAIKEY = 4;
var NETCAPKI_DEVICETYPE_HAIKEY_SM2 = 33;
var NETCAPKI_DEVICETYPE_HWETAX = 31;
var NETCAPKI_DEVICETYPE_SJY03B = 101;
var NETCAPKI_DEVICETYPE_SJY05B = 100;
var NETCAPKI_DEVICETYPE_SOFTWARE = 0;
var NETCAPKI_ECC_CURVE_P192 = 1;
var NETCAPKI_ECC_CURVE_P224 = 2;
var NETCAPKI_ECC_CURVE_P256 = 3;
var NETCAPKI_ECC_CURVE_P384 = 4;
var NETCAPKI_ECC_CURVE_P521 = 5;
var NETCAPKI_ECC_CURVE_SM2 = 7;
var NETCAPKI_ECC_CURVE_WAPI = 6;
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_AES128CBC = 4;
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_AES192CBC = 5;
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_AES256CBC = 6;
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_SM1CBC = 8;
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_SM4CBC = 9;
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_SMS4CBC = 9;
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_SSF33CBC = 7;
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_TDESCBC = 3;
var NETCAPKI_IA5STRING = 3;
var NETCAPKI_KEYPAIR_ENCRYPT = 1;
var NETCAPKI_KEYPAIR_SIGNATURE = 2;
var NETCAPKI_KEYUSAGE_CONTENTCOMMITMENT = 2;
var NETCAPKI_KEYUSAGE_CRLSIGN = 64;
var NETCAPKI_KEYUSAGE_DATAENCIPHERMENT = 8;
var NETCAPKI_KEYUSAGE_DECIPHERONLY = 256;
var NETCAPKI_KEYUSAGE_DIGITALSIGNATURE = 1;
var NETCAPKI_KEYUSAGE_ENCIPHERONLY = 128;
var NETCAPKI_KEYUSAGE_KEYAGRESSMENT = 16;
var NETCAPKI_KEYUSAGE_KEYCERTSIGN = 32;
var NETCAPKI_KEYUSAGE_KEYENCIPHERMENT = 4;
var NETCAPKI_KEYUSAGE_NONREPUDIATION = 2;
var NETCAPKI_MAJOR_VERSION = 1;
var NETCAPKI_MIME_TYPE_BASIC = 0;
var NETCAPKI_MIME_TYPE_MESSAGE = 2;
var NETCAPKI_MIME_TYPE_MULTIPART = 1;
var NETCAPKI_MINOR_VERSION = 0;
var NETCAPKI_OID = 6;
var NETCAPKI_PADDING_NONE = 1;
var NETCAPKI_PADDING_PKCS5 = 2;
var NETCAPKI_PRINTABLESTRING = 2;
var NETCAPKI_REGCERT_IN_MS_CERTSTORE = 2;
var NETCAPKI_REGCERT_IN_NETCA_CERTSTORE = 1;
var NETCAPKI_SEARCH_KEYPAIR_FLAG_CURRENT_USER = 1073741824;
var NETCAPKI_SEARCH_KEYPAIR_FLAG_DEVICE = 268435456;
var NETCAPKI_SEARCH_KEYPAIR_FLAG_LOCAL_MACHINE = 536870912;
var NETCAPKI_SIGNEDDATA_INCLUDE_CERT_OPTION_CERTPATH = 3;
var NETCAPKI_SIGNEDDATA_INCLUDE_CERT_OPTION_CERTPATHWITHROOT = 4;
var NETCAPKI_SIGNEDDATA_INCLUDE_CERT_OPTION_NONE = 1;
var NETCAPKI_SIGNEDDATA_INCLUDE_CERT_OPTION_SELF = 2;
var NETCAPKI_SIGNEDDATA_VERIFY_LEVEL_NO_VERIFY = 0;
var NETCAPKI_SIGNEDDATA_VERIFY_LEVEL_VERIFY_CERT = 2;
var NETCAPKI_SIGNEDDATA_VERIFY_LEVEL_VERIFY_CERT_REVOKE = 3;
var NETCAPKI_SIGNEDDATA_VERIFY_LEVEL_VERIFY_CERTPATH_REVOKE = 4;
var NETCAPKI_SIGNEDDATA_VERIFY_LEVEL_VERIFY_SIGNATURE_ONLY = 1;
var NETCAPKI_SO_PWD = 2;
var NETCAPKI_TIMESTAMP_RESP_STATUS_BADRESP = -1;
var NETCAPKI_TIMESTAMP_RESP_STATUS_BADTSACERT = -2;
var NETCAPKI_TIMESTAMP_RESP_STATUS_GRANTED = 0;
var NETCAPKI_TIMESTAMP_RESP_STATUS_GRANTEDWITHMODS = 1;
var NETCAPKI_TIMESTAMP_RESP_STATUS_REJECTION = 2;
var NETCAPKI_TIMESTAMP_RESP_STATUS_REVOCATIONNOTIFICATION = 5;
var NETCAPKI_TIMESTAMP_RESP_STATUS_REVOCATIONWARNING = 4;
var NETCAPKI_TIMESTAMP_RESP_STATUS_WAITING = 3;
var NETCAPKI_UIFLAG_ALWAYS_UI = 3;
var NETCAPKI_UIFLAG_DEFAULT_UI = 1;
var NETCAPKI_UIFLAG_NO_UI = 2;
var NETCAPKI_USER_PWD = 1;
var NETCAPKI_UTF8STRING = 1;
var NETCAPKI_VISIBLESTRING = 4;

//自定义常量

// 证书基本信息：
var NETCAPKI_CERT_PEM = 0;    //	NETCA为证书Base64编码
var NETCAPKI_CERT_THUMBPRINT = 1;    //	NETCA为证书姆印
var NETCAPKI_CERT_SERIALNUMBER = 2;  //	证书序列号
var NETCAPKI_CERT_SUBJECT = 3;       //	证书Subject
var NETCAPKI_CERT_ISSUER = 4;        //	证书颁发者
var NETCAPKI_CERT_VALIDFROMDATE = 5; //	证书有效期起
var NETCAPKI_CERT_VALIDTODATE = 6;   //	证书有效期止
var NETCAPKI_CERT_KEYUSAGE = 7;      //	密钥用法 KeyUsage
var NETCAPKI_CERT_PUBLICKEYALGO = 8;      //	证书公钥算法
var NETCAPKI_CERT_USRCERTNO = 9;     //	UsrCertNO：证书绑定号；//NETCA绑定姆印，编号为1；GDCA绑定为TrustID，编号为51；
var NETCAPKI_CERT_OLDUSRCERTNO = 10; // OldUsrCertNo：旧的用户证书绑定值；NETCA：绑定旧姆印，编号为31；GDCA：绑定为TrustID，编号为51；
// 证书基本信息细化解析：
var NETCAPKI_CERT_SUBJECT_NAME = 11; //	证书主题名称；有CN项取CN项值；无CN项，取O的值
var NETCAPKI_CERT_SUBJECT_CN = 12;   //	Subject中的CN项（人名）
var NETCAPKI_CERT_SUBJECT_O = 13;    //	Subject中的O项（单位）
var NETCAPKI_CERT_SUBJECT_L = 14;    //	Subject中的L项（地址）
var NETCAPKI_CERT_SUBJECT_EMAIL = 15; //	Subject中的Email
var NETCAPKI_CERT_SUBJECT_DEPARTMENT = 16; //	Subject中的部门名
var NETCAPKI_CERT_SUBJECT_COUNTRY = 17;   //	用户国家名
var NETCAPKI_CERT_SUBJECT_CITY = 18;      //	用户省州名
// 特定证书信息：
var NETCAPKI_CERT_CATITLE = 21;               //	CA ID： CA的ID:1：NETCA；2：GDCA；3：SZCA；0：未知CA
var NETCAPKI_CERT_CERTCLASSIFY = 22;      //	CertClassify：证书类型；1：服务器证书；2：个人证书 3: 机构证书；4：机构员工证书；5：机构业务证书；注：该类型国密标准待定0：其他证书
var NETCAPKI_CERT_CERTID = 23;            //	CertID；证书唯一标识； GDCA为信任号，见编号51 NETCA：目前无，以后可能有，兼容以后
// NETCA扩展域
var NETCAPKI_CERT_PREVCERT_THUMBPRINT = 31; //	旧姆印信息（如保含该域，则取出，否则为“”）
var NETCAPKI_CERT_TAXPAYERNUM = 32;         //	纳税人编码（如保含该域，则取出，否则为“”）
var NETCAPKI_CERT_ENTERPRISENUM = 33;       //	企业法人代码（如保含该域，则取出，否则为“”）
var NETCAPKI_CERT_TAXREGISTERNUM = 34;       //	税务登记号（如保含该域，则取出，否则为“”）
var NETCAPKI_CERT_CERTFROM = 35;             //	证书来源地（如保含该域，则取出，否则为“”）
// GDCA扩展域
var NETCAPKI_CERT_TRUSTID = 51;              //	GDCA的信任号TrustID
// 证书基本信息解析
var CERTVALUEPARSE = new Array(
  "证书PEM编码","证书姆印","证书序列号","证书主题","证书颁发者主题",
  "证书有效期起","证书有效期止","密钥用法","证书公钥算法","用户证书绑定值",//0~9
  "旧的用户证书绑定值","证书主题名称","Subject的人名(CN)","Subject中的单位(O)","Subject中的地址项(L)",
  "Subject中的Email(E)","Subject中的部门名(OU)","国家名(C)","省州名(S)","",//10~19
  "","CA标志","证书类型","证书唯一标识","",
  "","", "", "","",//20~29
  "","NETCA:旧姆印信息","纳税人编码","企业法人代码","税务登记号",
  "证书来源地","证件号码信息","证件号码明文", "","",
  "","", "", "","",
  "", "", "", "", "", //30~49:NETCA扩展域
  "","GDCA:信任号TrustID", "", "","",
  "", "", "", "", "" //50~59:GDCA扩展域
);//根据实际情况修订


/***************************************************/
/******  0.1  全局变量，根据项目实际应用定制，可修订 2016.07.23    ***********/
/***************************************************/

//定制1：字符串编码方式，特定项目需定制
//早期案例编码方式为：NETCAPKI_CP_UTF16LE
//2015年后一般采用UTF8编码方式
var NETCAPKI_CP = NETCAPKI_CP_UTF8;

//定制2：默认的证书筛选条件，特定项目需定制
//多CA支持时需定制，如{ "NETCA", "GDCA","SZCA" }
var NETCAPKI_SUPPORTCA = new Array("NETCA");  //默认的证书筛选条件
function getCAFilter() {
  var filter = "";
  if (NETCAPKI_SUPPORTCA.length > 0) {
    filter += "(";

    for (var j = 0; j < NETCAPKI_SUPPORTCA.length; j++) {
      if (j == 0) {
        filter += "IssuerCN~'" + NETCAPKI_SUPPORTCA[j] + "'";
      }
      else {
        filter += "||IssuerCN~'" + NETCAPKI_SUPPORTCA[j] + "'";
      }
    }
    filter += ")";
  }
  return filter;
}


//定制3：证书获取方式，特定项目需定制
//Device：从设备获取证书；
//CSP：从获取证书，多CA支持时需采用此方式；
var NETCAPKI_CERTFROM = "Device";
//定制4：NETCA证书实体唯一标识，特定项目需定制
//1.3.6.1.4.1.18760.1.12.11/1.3.6.1.4.1.18760.11.12.11.1：NETCA通用定义OID；
//2.16.156.112548：深圳地方标准
var NETCAPKI_UUID = "2.16.156.112548";


//定制5：HASH算法，一般无需定制
var NETCAPKI_ALGORITHM_HASH = NETCAPKI_ALGORITHM_SHA1;
//定制6：RSA签名算法，一般无需定制
var NETCAPKI_ALGORITHM_RSASIGN = NETCAPKI_ALGORITHM_SHA1WITHRSA;
//定制7：SM2签名算法，一般无需定制
var NETCAPKI_ALGORITHM_SM2SIGN = NETCAPKI_ALGORITHM_SM3WITHSM2;

//定制8：RSA加密算法，一般无需定制
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_RSAENV = NETCAPKI_ENVELOPEDDATA_ALGORITHM_AES256CBC;
//定制9：SM2加密算法，一般无需定制
var NETCAPKI_ENVELOPEDDATA_ALGORITHM_SM2ENV = NETCAPKI_ENVELOPEDDATA_ALGORITHM_SM1CBC;

//定制10：RSA对称加密算法，一般无需定制
var NETCAPKI_ALGORITHM_SYMENV = NETCAPKI_ALGORITHM_AES_ECB;
//定制11：签名包含证书的选项，一般无需定制
var NETCAPKI_SIGNEDDATA_INCLUDE_CERT_OPTION =NETCAPKI_SIGNEDDATA_INCLUDE_CERT_OPTION_SELF;

/***************************************************/
/***********  1  初始化及工具类 2016.7.14        ***********/
/***************************************************/
if (!!window.ActiveXObject || "ActiveXObject" in window){
  console.log('ie');
  // 浏览器为IE内核
  try {
    var initialObj = new ActiveXObject("NetcaPki.Utilities");
  } catch (error) {
    console.log(error);
  }
}else{
  // 浏览器不是IE内核
}
/* 作用是在WIN7下载入JS时就提示加载控件 */
//

/***************1.1 判断控件是否安装成功 ***************/
function isPKIInstalled() {
  try {
    var utilObj = new ActiveXObject("NetcaPki.Utilities");
    if (typeof (utilObj) == "object") {
      utilObj = null;
      return true;
    }
    utilObj = null;
    return false;
  }
  catch (e) {
    return false;
  }
}

/// <summary>1.2 ****字符串转byte[]
///
/// </summary>
/// <param name="sData"></param>
/// <returns></returns>
function convertByte(sSource) {
  return initialObj.Encode(sSource, NETCAPKI_CP);
}
/// <summary>1.3 *****byte[]转字符串
///
/// </summary>
/// <param name="bDatas"></param>
/// <returns></returns>
function convertString(bDatas) {
  return initialObj.Decode(bDatas, NETCAPKI_CP);
}
/// <summary>1.4 byte[]转字符串（Hex编码）
/// 转大写
/// </summary>
/// <param name="bDatas"></param>
/// <returns></returns>
function convertHex(bDatas) {

  return initialObj.BinaryToHex(bDatas, true);

}
/** 1.5 Base64编码
 * 输入：sSource	byte[]:原文
 * 输出：String	BASE64信息;
 */
function base64Encode(sSource) {
  return initialObj.Base64Encode(sSource, NETCAPKI_BASE64_ENCODE_NO_NL);
}

/** 1.6 Base64解码
 * 输入：string strBase64
 * 输出：Byte[]	原文
 */
function base64Decode(strBase64) {
  return initialObj.Base64Decode(strBase64, NETCAPKI_BASE64_DECODE_STRICT);
}

/**
 * 1.7 Hash
 * 输入：algo Hash算法
 *       sSource 原文
 * 输出：Hash值，Byte数组
 */
function hash(sSource) {
  var deviceObj;
  try {
    deviceObj = initialObj.CreateDeviceObject();
  }
  catch (e) {
    alert("安装不成功!");
    return null;
  }

  var rt = deviceObj.Hash(NETCAPKI_ALGORITHM_HASH, convertByte(sSource));
  return initialObj.BinaryToHex(rt);
}


/** 1.8 获取随机数
 * 输入：length;
 * 输出：随机数(Hex编码，大写)
 */
function getRandom(length) {
  var deviceObj;
  try {
    deviceObj = initialObj.CreateDeviceObject();
  }
  catch (e) {
    alert("安装不成功!");
    return null;
  }
  var bRt= deviceObj.GenerateRandom(length);
  return convertHex(bRt);
}

/**
 * 1.9 二进制读文件
 * 输入：sFilePath:String，文件名（含路径）;
 * 输出：Byte[]	文件内容
 * 需要驱动中包含LittleUtils.dll，通常都包含
 */
function readFile(sFilePath) {
  if (sFilePath == "") {
    alert("文件路径为空");
    return null;
  }


  var fileProcessObj;
  try {

    fileProcessObj = new ActiveXObject("LittleUtils.BinaryFile");
  }
  catch (e) {
    alert("安装不成功!");
    return null;
  }
  return fileProcessObj.Read(sFilePath);

}


/**
 * 1.10 二进制写文件
 * 输入：sFilePath:String，文件名（含路径）;
 *       bContent，Byte[]:二进制内容
 * 输出：无
 * 需要驱动中包含LittleUtils.dll，通常都包含
 */
function writeFile(sFilePath, bContent) {
  if (sFilePath == "") {
    alert("文件路径为空");
    return;
  }
  var fileProcessObj;
  try {
    fileProcessObj = new ActiveXObject("LittleUtils.BinaryFile"); ;
  }
  catch (e) {
    alert("安装不成功!");
    return;
  }

  fileProcessObj.Write(sFilePath, bContent);
  return;
}

/***************************************************/
/***********  2.  证书类 2012.3.24       ***********/
/***************************************************/

/*************** 2.1 判断是否有证书  ***************/
function isHasCert() {
  var certs = getX509Certificates(NETCAPKI_CERT_PURPOSE_SIGN);
  if (certs == null || certs.Count <= 0) {
    alert("未检测到证书,请确认是否插入证书!");
    return false;
  }
  return true;
}

/**********  2.2 判断是否有网证通证书链 ************/
function isHasChain() {
  var storeObj;
  try {
    storeObj = initialObj.CreateStoreObject();
  }
  catch (e) {
    storeObj = null;
    alert("获取ActiveXObject失败!");
    return false;
  }


  storeObj.Open(NETCAPKI_CERT_STORE_TYPE_CURRENT_USER, NETCAPKI_CERT_STORE_NAME_ROOT);
  var count = storeObj.GetCertificateCount();
  if (count <= 0) {
    storeObj.Close();
    storeObj = null;
    alert("证书库没有证书!");
    return false;
  }

  for (var i = 1; i < count + 1; i++) {
    var oCert = storeObj.GetCertificate(i);

    //根据支持CA,过滤证书
    if (getX509CertificateInfo(oCert, NETCAPKI_CERT_CATITLE) == "") {
      break;
    }
    storeObj.Close();
    storeObj = null;
    return true;
  } // End for
  storeObj.Close();
  storeObj = null;
  return false;
}


/*********** 2.3 选择证书集 ***********
 * certType: NETCAPKI_CERTTYPE_ALL= 0;NETCAPKI_CERT_PURPOSE_SIGN= 2;NETCAPKI_CERT_PURPOSE_ENCRYPT= 1;
 */
function getX509Certificates(NETCAPKI_CERT_PURPOSE) {
  var storeObj;
  try {
    storeObj = initialObj.CreateStoreObject();
  }
  catch (e) {
    storeObj = null;
    alert("获取ActiveXObject失败!");
    return null;
  }

  storeObj.Open(NETCAPKI_CERT_STORE_TYPE_CURRENT_USER, NETCAPKI_CERT_STORE_NAME_MY);
  var count = storeObj.GetCertificateCount();
  if (count <= 0) {
    storeObj.Close();
    storeObj = null;
    alert("证书库没有证书!");
    return null;
  }

  var certArray = new Array();
  for (var i = 1; i < count + 1; i++) {
    var oCert = storeObj.GetCertificate(i);
    //根据支持CA,过滤证书
    if (getX509CertificateInfo(oCert, NETCAPKI_CERT_CATITLE) == "") {
      break;
    }

    //根据密钥用法，过滤证书
    if (NETCAPKI_CERT_PURPOSE == NETCAPKI_CERT_PURPOSE_SIGN) {
      if (!((oCert.KeyUsage == (NETCAPKI_KEYUSAGE_DIGITALSIGNATURE | NETCAPKI_KEYUSAGE_NONREPUDIATION))
          || (oCert.KeyUsage == -1) || (oCert.KeyUsage == NETCAPKI_KEYUSAGE_DIGITALSIGNATURE)))
        break;

    }
    else if (NETCAPKI_CERT_PURPOSE == NETCAPKI_CERT_PURPOSE_ENCRYPT) {
      if (!((oCert.KeyUsage == (NETCAPKI_KEYUSAGE_KEYENCIPHERMENT | NETCAPKI_KEYUSAGE_DATAENCIPHERMENT))
          || (oCert.KeyUsage == -1)
          || (oCert.KeyUsage == NETCAPKI_KEYUSAGE_KEYENCIPHERMENT)))
        break;

    }
    certArray.push(oCert);

  } // End for

  storeObj.Close();
  storeObj = null;
  return certArray;
}


/***********  2.4	获取证书 ***********
 * NETCAPKI_CERT_PURPOSE: NETCAPKI_CERTTYPE_ALL= 0(所有);NETCAPKI_CERT_PURPOSE_SIGN= 2(签名);NETCAPKI_CERT_PURPOSE_ENCRYPT= 1(加密);
 */
function getX509Certificate(NETCAPKI_CERT_PURPOSE) {
  var objCertificate;
  try {
    objCertificate = initialObj.CreateCertificateObject();
  }
  catch (e) {
    alert("获取ActiveXObject失败!");
    return null;
  }

  // Type
  var sType = "{";
  sType += "\"UIFlag\":\"default\", \"InValidity\":true,";

  if (NETCAPKI_CERT_PURPOSE == NETCAPKI_CERT_PURPOSE_SIGN) {
    sType += "\"Type\":\"signature\" , ";
  }
  else if (NETCAPKI_CERT_PURPOSE == NETCAPKI_CERT_PURPOSE_ENCRYPT) {
    sType += "\"Type\":\"encrypt\" , ";
  }

  if (NETCAPKI_CERTFROM=="Device") {
    sType += "\"Method\":\"device\", \"Value\":\"any\"";
  }
  else {
    sType += "\"Method\":\"store\", \"Value\":{\"Type\":\"current user\",\"Value\":\"my\"}";
  }
  sType += "}";

  // filter
  var sFilter = "";
  sFilter = "InValidity='True'"; //
  if (getCAFilter()!="") {
    sFilter += "&&" + getCAFilter();
  }
  if (NETCAPKI_CERT_PURPOSE == NETCAPKI_CERT_PURPOSE_SIGN) {
    sFilter += "&&CertType='Signature'&&CheckPrivKey='True'";
  }
  else if (NETCAPKI_CERT_PURPOSE == NETCAPKI_CERT_PURPOSE_ENCRYPT) {
    sFilter += "&&CertType='Encrypt'";
  }
  //alert(sType + "\r\n" + sFilter);
  objCertificate.Select(sType, sFilter);
  return objCertificate;
}

// 签名证书
function getX509CertificateSign() {
  var objCertificate;
  try {
    objCertificate = initialObj.CreateCertificateObject();
  }
  catch (e) {
    alert("获取ActiveXObject失败!");
    return null;
  }
  // Type
  var sType = "{";
  sType += "\"UIFlag\":\"default\", \"InValidity\":true,";

  sType += "\"Type\":\"signature\" , ";

  if (NETCAPKI_CERTFROM=="Device") {
    sType += "\"Method\":\"device\", \"Value\":\"any\"";
  }
  else {
    sType += "\"Method\":\"store\", \"Value\":{\"Type\":\"current user\",\"Value\":\"my\"}";
  }
  sType += "}";

  // filter
  var sFilter = "";
  sFilter = "InValidity='True'"; //
  if (getCAFilter()!="") {
    sFilter += "&&" + getCAFilter();
  }
  sFilter += "&&CertType='Signature'&&CheckPrivKey='True'";
  //alert(sType + "\r\n" + sFilter);
  objCertificate.Select(sType, sFilter);
  return objCertificate;
}

/** 2.5	获取证书对象。
 *
 */
function getX509CertificateByString(certContent) {
  if (certContent == "") {
    return null;
  }
  //alert(certContent);
  var certObj;
  try {
    certObj = initialObj.CreateCertificateObject();
  }
  catch (e) {
    alert("获取ActiveXObject失败!");
    return null;
  }
  certObj.Decode(certContent);
  return certObj;
}

/*********** 2.6	获取证书：根据特定域的值获取证书 **********　　##还没有测试，该函数功能没有写完
 * NETCAPKI_CERT_PURPOSE: NETCAPKI_CERTTYPE_ALL= 0(所有);NETCAPKI_CERT_PURPOSE_SIGN= 2(签名);NETCAPKI_CERT_PURPOSE_ENCRYPT= 1(加密);
 * iValueType:   证书信息特定域类别
 * value:        证书信息特定域值
 */
function getX509CertificateByInfo(NETCAPKI_CERT_PURPOSE, iValueType, value) {
  var objCerts = getX509Certificates(NETCAPKI_CERT_PURPOSE);
  if (objCerts == null) {
    return null;
  }

  var certCount = objCerts.length;
  if (certCount <= 0) {
    alter("证书库没有证书!");
    return null;
  }

  // 按需求，暂时只考虑 证书姆印
  for (var i = 0; i < certCount; i++) {
    var oCert = objCerts[i];
    if (getX509CertificateInfo(oCert, iValueType).toLowerCase() == value.toLowerCase()) {
      return oCert;
    }
  }

  return null;
}

/***********2.7 获取证书信息: 根据证书 和  证书信息特定域类别 获取证书信息
 // 证书基本信息：
 iValueType 具体信息参见常量定义 CERTVALUEPARSE

 * 输出：（字符串）返回证书信息
 */
function getX509CertificateInfo(oCert, iValueType) {
  var rvStr;
  var temp;


  if (oCert == null) {
    return null;
  }
  if (iValueType == null) {
    return null;
  }

  switch (iValueType) {
    case NETCAPKI_CERT_PEM:
      try {
        var certPem = oCert.Encode(2);
        var certHeader = "-----BEGIN CERTIFICATE-----\r\n";
        var certEnd = "-----END CERTIFICATE-----\r\n";
        if (certPem.indexOf(certHeader) >= 0) {
          certPem = certPem.substring(certHeader.length, certPem.length);
          certPem = certPem.substring(0, certPem.length - certEnd.length);
        }
        return certPem;
      }
      catch (e) { return ""; }
    case NETCAPKI_CERT_THUMBPRINT: //证书姆印
      try {
        return initialObj.BinaryToHex(oCert.ThumbPrint(NETCAPKI_ALGORITHM_SHA1), true);
      }
      catch (e) {
        return "";
      }
    case NETCAPKI_CERT_SERIALNUMBER: //证书序列号
      return oCert.SerialNumber;
    case NETCAPKI_CERT_SUBJECT: //证书Subject
      return oCert.Subject;
    case NETCAPKI_CERT_ISSUER: // 证书颁发者
      return oCert.Issuer;
    case NETCAPKI_CERT_VALIDFROMDATE: //证书有效期起
      var fromDate = new Date(oCert.ValidFromDate);
      return fromDate.toString(); //2012-05-02 lu modify toDate.toDateString()
    case NETCAPKI_CERT_VALIDTODATE: //证书有效期止
      var toDate = new Date(oCert.ValidToDate);
      return toDate.toString(); //2012-05-02 lu modify toDate.toDateString()
    case NETCAPKI_CERT_KEYUSAGE: //密钥用法 KeyUsage
      return "" + oCert.KeyUsage;
    case NETCAPKI_CERT_PUBLICKEYALGO: //证书的公钥算法
      return "" + oCert.PublicKeyAlgorithm;
    case NETCAPKI_CERT_USRCERTNO: // UsrCertNO：证书绑定号；NETCA绑定姆印，编号为1；GDCA绑定为TrustID，编号为51；
      if (getX509CertificateInfo(oCert, 21) == "NETCA") {
        rvStr = "" + getX509CertificateInfo(oCert, 23); //取证书唯一标识
        if (rvStr == "") {
          rvStr = "" + getX509CertificateInfo(oCert, 36); //取证书证件号码扩展域信息
          if (rvStr == "") {
            rvStr = "" + getX509CertificateInfo(oCert, 1); //取证书姆印
          }
        }
        return rvStr;
      }
      else if (getX509CertificateInfo(oCert, 21) == "GDCA") {
        return "" + getX509CertificateInfo(oCert, 51);
      }
      else if (getX509CertificateInfo(oCert, 21) == "SZCA") {
        return "" + getX509CertificateInfo(oCert, 2);
      }
      else {
        return "未知CA";
      }

    case NETCAPKI_CERT_OLDUSRCERTNO:
      if (getX509CertificateInfo(oCert, 21) == "NETCA") {
        return getX509CertificateInfo(oCert, 31);
      }
      else {
        return "";
      }
    case NETCAPKI_CERT_SUBJECT_NAME: // 证书主题名称；有CN项取CN项值；无CN项，取O的值；
      var tmp = getX509CertificateInfo(oCert, 12);
      if (tmp == "") {
        tmp = getX509CertificateInfo(oCert, 13);
      }
      return tmp;
    case NETCAPKI_CERT_SUBJECT_CN: //Subject中的CN项（人名）
      try {
        return oCert.GetStringInfo(NETCAPKI_CERT_ATTRIBUTE_SUBJECT_CN);
      }
      catch (e) {
        return "";
      }

    case NETCAPKI_CERT_SUBJECT_O: //Subject中的O项（单位)
      try {
        return oCert.GetStringInfo(NETCAPKI_CERT_ATTRIBUTE_SUBJECT_O);
      }
      catch (e) {
        return "";
      }

    case NETCAPKI_CERT_SUBJECT_L: //Subject中的L项（地址）
      try {
        return oCert.GetStringInfo(NETCAPKI_CERT_ATTRIBUTE_SUBJECT_L);
      }
      catch (e) {
        return "";
      }

    case NETCAPKI_CERT_SUBJECT_EMAIL: //Subject中的Email

      try {
        return oCert.GetStringInfo(NETCAPKI_CERT_ATTRIBUTE_SUBJECT_EMAIL);
      }
      catch (e) {
        return "";
      }

    case NETCAPKI_CERT_SUBJECT_DEPARTMENT:  //Subject中的部门名
      try {
        return oCert.GetStringInfo(NETCAPKI_CERT_ATTRIBUTE_EX_DEPARTMENT);
      }
      catch (e) {
        return "";
      }

    case NETCAPKI_CERT_SUBJECT_COUNTRY:   //用户国家名
      try {
        return oCert.GetStringInfo(NETCAPKI_CERT_ATTRIBUTE_SUBJECT_C);
      }
      catch (e) {
        return "";
      }

    case NETCAPKI_CERT_SUBJECT_CITY: //  用户省州名
      try {
        return oCert.GetStringInfo(NETCAPKI_CERT_ATTRIBUTE_SUBJECT_ST);

      }
      catch (e) {
        return "";
      }

    case NETCAPKI_CERT_CATITLE: // CAID  1：NETCA；2：GDCA；3：SZCA；0：未知CA

      for (var z= 0; z < NETCAPKI_SUPPORTCA.length; z++) {
        if (getX509CertificateInfo(oCert, 4).indexOf(NETCAPKI_SUPPORTCA[z]) > 0) {
          return NETCAPKI_SUPPORTCA[z];
        }
      }

      return "";
    case NETCAPKI_CERT_CERTCLASSIFY: //CertID：证书类型
      if (getX509CertificateInfo(oCert, NETCAPKI_CERT_CATITLE) == "NETCA") {
        try {
          var netcaCaType = initialObj.DecodeASN1String(1, oCert.GetExtension("1.3.6.1.4.1.18760.1.12.12.2")); //netca证书类型扩展OID
          if (netcaCaType == "001") {
            return "3";
          }
          else if (netcaCaType == "002") {
            return "5";
          }
          else if (netcaCaType == "003") {
            return "4";
          }
          else if (netcaCaType == "004") {
            return "2";
          }
          return "0";
        }
        catch (e) {
          return "0";
        }
      }
      else
        return "0";
    case NETCAPKI_CERT_CERTID: // 证书唯一标识
      if (getX509CertificateInfo(oCert, NETCAPKI_CERT_CATITLE) == "NETCA") {
        return "";
      }
      else if (getX509CertificateInfo(oCert, NETCAPKI_CERT_CATITLE) == "GDCA") {
        return getX509CertificateInfo(oCert, 51);
      }
      return "";
    case NETCAPKI_CERT_PREVCERT_THUMBPRINT:  // 旧姆印信息
      if (getX509CertificateInfo(oCert, NETCAPKI_CERT_CATITLE) == "NETCA")//NETCA
      {
        try {
          return initialObj.BinaryToHex(oCert.GetStringInfo(NETCAPKI_CERT_ATTRIBUTE_PREVCERT_THUMBPRINT), true);
        }
        catch (e) {
          return "";
        }
      }
      else {
        return "";
      }
      break;
    /* 需求没有提供 OID信息，无法获取，暂未实现
     case NETCAPKI_CERT_TAXPAYERNUM: //纳税人编码（如保含该域，则取出，否则为“”）
     break;
     case NETCAPKI_CERT_ENTERPRISENUM:    //企业法人代码（如保含该域，则取出，否则为“”）
     break;

     case NETCAPKI_CERT_TAXREGISTERNUM:    //税务登记号（如保含该域，则取出，否则为“”）
     break;

     case NETCAPKI_CERT_CERTFROM:    //证书来源地
     break;
     */
    case 36:
      if (getX509CertificateInfo(oCert, NETCAPKI_CERT_CATITLE) == "NETCA")//NETCA
      {
        try {
          return initialObj.DecodeASN1String(1, oCert.GetExtension(NETCAPKI_UUID));
        }
        catch (e) {
          return "";
        }
      }
      else {
        return "";
      }
      break;
    case 37:
      var rt = getX509CertificateInfo(oCert, 36);
      if (rt.length > 13) {//00011@0006PO1MTIzNDU2Nzg5MDEyMzQ1Njc4
        var beginIndex = rt.indexOf('@');
        if (beginIndex == -1) {
          //alert("获取证件号码失败：无法定位@");
          return "";
        }
        var iClassify = rt.substring(beginIndex + 7, beginIndex + 8); //获取编码标志位
        if (iClassify == "1") {
          var b64Identity = rt.substring(beginIndex + 8);
          var bIdentity = initialObj.Base64Decode(b64Identity);
          return initialObj.Decode(bIdentity, 65001);
        }
        else if (iClassify == "0") {
          return rt.substring(beginIndex + 8);
        }
        return "";
      }
      else {
        return "";
      }
      break;
    case NETCAPKI_CERT_TRUSTID:    //GDCA的信任号TrustID
      var oid = "1.2.86.21.1.3";
      try {

        if (getX509CertificateInfo(oCert, NETCAPKI_CERT_CATITLE) == "GDCA") {

          temp = initialObj.Decode(oCert.GetExtension(oid), NETCAPKI_CP);
          rvStr = temp.substr(2, temp.length - 2);

        }
        else {
          rvStr = "";
        }
      }
      catch (e) {
        rvStr = "";
      }

      break;
    default:
      return "";

  }
  return rvStr;
}

/****** 2.8 获取证书信息: 根据证书 和  OID 获取证书信息 。 目前DecodeASN1String 解码失败*******
 * oCert: 证书;
 * OID:	String类型，OID的值
 * 输出：OID信息的base64编码
 */
function getX509CertificateInfoByOID(oCert, OID) {
  var OIDStr;

  if (oCert == null) {
    return null;
  }
  OIDStr = oCert.GetExtension(OID);
  return initialObj.Base64Encode(OIDStr, 1);
}



/***************************************************/
/***********  3.签名类 2012.3.23         ***********/
/***************************************************/
/**3.1	PKCS#7签名（兼容以前）**/
function signNETCA(bContent, IsNotHasSource) {
  return signedData(bContent, IsNotHasSource);
}

/**3.2	PKCS#7签名 **/
function signedData(sSource, IsNotHasSource) {
  return signedDataByPwd(sSource, IsNotHasSource, "");
}

/**3.3	PKCS#7签名 **/
function signedDataByPwd(sSource, IsNotHasSource, pwd) {
  var oCert;
  try {
    oCert = initialObj.CreateCertificateObject();
  }
  catch (e) {
    alert("获取ActiveXObject失败!");
    return null;
  }

  oCert = getX509Certificate(NETCAPKI_CERT_PURPOSE_SIGN);
  if (oCert == null) {
    alert("未选择证书,请检查是否插入密钥!");
    return null;
  }

  return signedDataByCertificate(oCert, sSource, IsNotHasSource, pwd);
}

/**3.4	使用指定证书,PKCS#7签名 **/
function signedDataByCertificate(oCert, bContent, IsNotHasSource, pwd) {
  if (bContent == "") {
    alert("原文内容为空!");
    return null;
  }
  var signObj;

  try {

    signObj = initialObj.CreateSignedDataObject();
  }
  catch (e) {
    alert("安装不成功!");
    return null;
  }
  var tbs;
  if (typeof (bContent) == "string" || typeof (bContent) == "String") {
    tbs = convertByte(bContent);
  }
  else {// 原文是数组
    tbs = bContent;
  }

  if (signObj.SetSignCertificate(oCert, pwd, false) == false) {
    alert("设置签名证书失败");
    return null;
  }
  signObj.SetSignAlgorithm(-1, getX509CertificateInfo(oCert, 8) == NETCAPKI_ALGORITHM_RSA.toString() ? NETCAPKI_ALGORITHM_RSASIGN : NETCAPKI_ALGORITHM_SM2SIGN);
  signObj.SetIncludeCertificateOption(NETCAPKI_SIGNEDDATA_INCLUDE_CERT_OPTION);

  // 1：不带原文；0：带原文
  if (IsNotHasSource == 0 || IsNotHasSource == "0" || IsNotHasSource == false) {
    // 带原文
    signObj.Detached = false;
  }
  else {
    signObj.Detached = true;
  }
  var str= signObj.Sign(tbs, NETCAPKI_CMS_ENCODE_BASE64);
  signObj = null;

  return str;
}

/// <summary>3.5 PKCS#7时间戳签名
///2013-05-01 update
/// </summary>
/// <param name="sSource">签名内容</param>
/// <param name="sTsaUrl">时间戳服务器URL</param>
/// <param name="bNoHasSource">是否带原文</param>
/// <returns>签名值</returns>
function signedDataWithTSA(bContent, sTsaUrl, bNoHasSource) {
  if (bContent == "") {
    alert("原文内容为空!");
    return null;
  }
  var oCert;
  try {
    oCert = initialObj.CreateCertificateObject();
  }
  catch (e) {
    alert("获取ActiveXObject失败!");
    return null;
  }
  var signObj;
  try {

    signObj = initialObj.CreateSignedDataObject();
  }
  catch (e) {
    alert("安装不成功!");
    return null;
  }

  oCert = getX509Certificate(NETCAPKI_CERT_PURPOSE_SIGN);
  if (oCert == null) {
    alert("未选择证书,请检查是否插入密钥!");
    return null;
  }
  var tbs;
  if (typeof (bContent) == "string" || typeof (bContent) == "String") {
    tbs = convertByte(bContent);
  }
  else {// 原文是数组
    tbs = bContent;
  }
  if (signObj.SetSignCertificate(oCert, "", false) == false) {
    alert("设置签名证书失败");
    return null;
  }
  signObj.SetIncludeCertificateOption(NETCAPKI_SIGNEDDATA_INCLUDE_CERT_OPTION);

  signObj.SetSignAlgorithm(-1, getX509CertificateInfo(oCert, 8) == NETCAPKI_ALGORITHM_RSA.toString() ? NETCAPKI_ALGORITHM_RSASIGN : NETCAPKI_ALGORITHM_SM2SIGN);
  // 1：不带原文；0：带原文
  if (bNoHasSource == 0 || bNoHasSource == "0" || bNoHasSource == false) {
    // 带原文
    signObj.Detached = false;
  }
  else {
    signObj.Detached = true;

  }
  var str = signObj.SignWithTSATimeStamp(sTsaUrl, tbs, NETCAPKI_CMS_ENCODE_BASE64);
  signObj = null;
  oCert = null;
  return str;
}

/**3.6	PKCS#7签名验证**/
function verifySignedData(sSource, sSignature) {
  if (sSource == "") {
    alert("原文内容为空!");
    return null;
  }
  if (sSignature == "") {
    alert("签名信息为空!");
    return null;
  }
  //alert("sSource:" + sSource);
  //alert("sSignature:" + sSignature);
  var signObj;
  try {

    signObj = initialObj.CreateSignedDataObject();

  }
  catch (e) {
    alert("安装不成功!");
    return null;
  }

  var bSource;
  if (typeof (sSource) == "string" || typeof (sSource) == "String") {// 原文是字符串
    bSource = convertByte(sSource);
  }
  else {// 原文是数组
    bSource = sSource;
  }
  var bSignature = base64Decode(sSignature);
  var checkSignFormat = signObj.IsSign(bSignature);
  if (!checkSignFormat) {
    alert("签名信息验签未通过:签名数据格式不正确!");
    return null;
  }
  var IsDetached = signObj.IsDetachedSign(bSignature);
  if (IsDetached)  /**不带原文的签名 ***/
  {
    var tbs = signObj.DetachedVerify(bSource, bSignature, false);
    if (!tbs) {
      alert("签名信息验签未通过!");
      return null;
    }

  }
  else// 带原文
  {
    var tbs= signObj.Verify(bSignature, true);

    var isOK = initialObj.ByteArrayCompare(tbs, bSource);

    if (!isOK) {
      alert("签名信息验签未通过:原文与签名信息不一致!");
      return null;

    }
  }
  //alert("OK");
  var certObj = signObj.GetSignCertificate(-1);
  return certObj;
}
/**3.7	从PKCS#7签名信息中获取原文 **/
function getSourceFromSignature(sSignature) {
  if (sSignature == "") {
    alert("签名信息为空!");
    return null;
  }
  var bSignature = base64Decode(sSignature);
  var oSignedData;
  try {

    oSignedData = initialObj.CreateSignedDataObject();
  }
  catch (e) {
    alert("安装不成功!");
    return "";
  }
  var checkSignFormat = oSignedData.IsSign(bSignature);
  if (!checkSignFormat) {
    alert("签名信息验签未通过:签名数据格式不正确!");
    return "";

  }

  var IsDetached = oSignedData.IsDetachedSign(bSignature);
  if (IsDetached)  /**不带原文的签名 ***/
  {
    alert("不带原文签名,不能还原出原文!");
    return "";

  }
  var tbs = oSignedData.Verify(bSignature, true);
  var sReturn = convertString(tbs);
  oSignedData = null;
  return sReturn;
}

/// <summary>3.8 PKCS1签名
/// 2016-12-29
///
/// </summary>
/// <param name="sSource"></param>
/// <param name="oCert"></param>
/// <returns>base64编码字符串</returns>
function sign(bContent) {
  if (bContent == "") {
    alert("待签名内容为空!");
    return null;
  }
  var oCert = getX509Certificate(NETCAPKI_CERT_PURPOSE_SIGN);
  if (oCert == null) {
    alert("未选择证书,请检查是否插入密钥!");
    return "";
  }
  var tbs = null;
  if (typeof (bContent) == "string" || typeof (bContent) == "String") {
    tbs = convertByte(bContent);
  }
  else {// 原文是数组
    tbs = bContent;
  }
  var arrRT = oCert.Sign(getX509CertificateInfo(oCert, 8) == NETCAPKI_ALGORITHM_RSA.toString() ? NETCAPKI_ALGORITHM_RSASIGN : NETCAPKI_ALGORITHM_SM2SIGN, tbs);
  return base64Encode(arrRT);
}

/*** 3.9	PKCS#1签名验证 ***/
function verify(bContent, sP1SignData) {
  if (bContent == "") {
    alert("待签名内容为空!");
    return null;
  }
  var oCert = getX509Certificate( NETCAPKI_CERT_PURPOSE_SIGN);
  if (oCert == null) {
    alert("找不到数字证书,请检查是否插好电子密钥!");
    return null;
  }
  var tbs = null;
  if (typeof (bContent) == "string" || typeof (bContent) == "String") {
    tbs = convertByte(bContent);
  }
  else {
    // 原文是数组
    tbs = bContent;
  }
  var bSignature=base64Decode(sP1SignData);
  return oCert.Verify(getX509CertificateInfo(oCert, 8) == NETCAPKI_ALGORITHM_RSA.toString() ? NETCAPKI_ALGORITHM_RSASIGN : NETCAPKI_ALGORITHM_SM2SIGN, tbs, bSignature);

}



/***************************************************/
/***********    4.加密类 2012.3.23         ***********/
/***************************************************/

/**	4.1 PKCS#7加密  *******
 * 注意：大数据加密时,请定制，返回值不要使用base64编码，用byte[]会节省资源；
 * 输入：
 *        oCert	证书
 *        bContent;byte[]或String:原文;
 * 输出：String base64编码加密信息
 */
function envelopedData(oCert, bContent) {
  var objEnv;
  try {
    objEnv = initialObj.CreateEnvelopedDataObject();
  }
  catch (e) {
    alert("获取ActiveXObject失败!");
    return "";
  }
  var tbs;
  if (typeof (bContent) == "string" || typeof (bContent) == "String") {
    tbs = convertByte(bContent);
    //alert("字符串" );
  }
  else {// 原文是数组
    tbs = bContent;
  }

  objEnv.EncryptAlgorithm = getX509CertificateInfo(oCert, 8) == NETCAPKI_ALGORITHM_RSA.toString() ? NETCAPKI_ENVELOPEDDATA_ALGORITHM_RSAENV : NETCAPKI_ENVELOPEDDATA_ALGORITHM_SM2ENV;

  if (objEnv.AddCert(oCert) == false) {
    alert("添加加密证书失败");
    return "";
  }
  var sBase64 = objEnv.Encrypt(tbs, NETCAPKI_CMS_ENCODE_BASE64);
  return sBase64;
}

/**	4.2 PKCS#7解密  *******
 * 输入：sEnvData:String:base64编码加密数据;
 * 输出：String 	PKCS#7解密后的信息
 */
function developedData(sEnvData) {
  var objEnv;
  try {

    objEnv = initialObj.CreateEnvelopedDataObject();
  }
  catch (e) {
    alert("获取ActiveXObject失败!");
    return null;
  }
  var bEnvData = base64Decode(sEnvData);
  var bSource=objEnv.Decrypt(bEnvData);
  var sSource = convertString(bSource);
  return sSource;
}

export default {
  isPKIInstalled,
  isHasCert,
  isHasChain,
  getX509Certificate,
  getX509CertificateSign,
  getX509CertificateInfo,
  NETCAPKI_ALGORITHM_RSA
};

