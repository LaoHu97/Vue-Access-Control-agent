//电话验证
export const number_phone = (rule, value, callback) => {
  if (!/^\d{7,15}$/.test(value) && value !== '') {
    callback(new Error('请输入正确的电话号码'));
  } else {
    callback();
  }
}
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
  if (!/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(value) && value !== '') {
    callback(new Error('请输入正确的姓名'));
  } else {
    callback();
  }
};
export const validateAmount = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
    callback(new Error('请输入正确的金额格式'));
  } else {
    callback();
  }
};

export const validateNumber = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else if (!/(^[1-9]\d*$)/.test(value)) {
    callback(new Error('请输入正整数格式'));
  } else {
    callback();
  }
};