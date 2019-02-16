//支付方式
export const optionsPayment = [{
  valueScene: 'WX',
  labelScene: '微信'
}, {
  valueScene: 'ALI',
  labelScene: '支付宝'
}, {
  valueScene: 'DEBIT',
  labelScene: '借记卡'
}, {
  valueScene: 'CREDIT',
  labelScene: '贷记卡'
}, {
  valueScene: 'BEST',
  labelScene: '翼支付'
}, {
  valueScene: 'UNIONPAY',
  labelScene: '银联二维码'
}]
export const optionsPaymentCopy = [{
  value: 'WX',
  label: '微信'
}, {
  value: 'ALI',
  label: '支付宝'
}, {
  value: 'BANK',
  label: '银行卡'
}, {
  value: 'BEST',
  label: '翼支付'
}, {
  value: 'UNIONPAY',
  label: '银联二维码'
}]
export const optionsPaymentExcel = [{
  value: '',
  label: '所有'
}, {
  value: 'WX',
  label: '微信'
}, {
  value: 'ALI',
  label: '支付宝'
}, {
  value: 'BANK',
  label: '银行卡'
}, {
  value: 'BEST',
  label: '翼支付'
}, {
  value: 'UNIONPAY',
  label: '银联二维码'
}]
export const optionsBank = [{
  value: 'DEBIT',
  label: '借记卡'
}, {
  value: 'CREDIT',
  label: '贷记卡'
}]
export const optionsPayState = [{
  value: 'SUCCESS',
  label: '支付成功'
}, {
  value: 'REFUND',
  label: '退款成功'
}, {
  value: 'FAIL',
  label: '支付失败'
}, {
  value: 'UNKNOWN',
  label: '未知'
}]
export const regPhone = (rule, value, callback) => {
  if (!/^1(3|4|5|7|8)\d{9}$/.test(value) && value !== '') {
    callback(new Error('请输入正确的电话号码'));
  } else {
    callback();
  }
};
export const regBusinessLicense = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入执照证件号码'));
  } else if (!/(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/.test(value)) {
    callback(new Error('请输入正确的执照证件号码'));
  } else {
    callback();
  }
};
export const regFont = (rule, value, callback) => {
  if (!/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(value) &&  value !== '') {
    callback(new Error('请输入正确的姓名'));
  } else {
    callback();
  }
};
