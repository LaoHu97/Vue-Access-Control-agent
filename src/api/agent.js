import instance from './index';
const preUrlPath = '';
//登录
export const loginVerify = params => { return instance.post(`${preUrlPath}/pay/ag/loginVerify`, params).then(res => res.data); };
//退出
export const loginOut = params => { return instance.post(`${preUrlPath}/pay/ag/loginOut`, params).then(res => res.data); };
//验证码
export const getCode = process.env.API_ROOT+"/pay/getCode";
//交易列表
export const queryAgentOrder = params => { return instance.post(`${preUrlPath}/pay/ag/queryAgentOrder`, params).then(res => res.data);};
//商户模糊查询
export const selectMersByName = params => { return instance.post(`${preUrlPath}/pay/comm/selectMersByName`,params).then(res => res.data); };
//业务员模糊查询
export const selectSaleByName= params => { return instance.post(`${preUrlPath}/pay/comm/selectSaleByName`, params).then(res => res.data); };
//商户入住
export const agentMerEnter = params => { return instance.post(`${preUrlPath}/pay/ag/agentMerEnter`, params).then(res => res.data); };
//商户列表
export const queryAgentMer = params => { return instance.post(`${preUrlPath}/pay/ag/queryAgentMer`,params).then(res => res.data); };
//业务员查询
export const querySalesman = params => { return instance.post(`${preUrlPath}/pay/ag/querySalesman`,params).then(res => res.data); };
//重置密码
export const resetPwd = params => { return instance.post(`${preUrlPath}/pay/ag/resetPwd`,params).then(res => res.data); };
//删除业务员
export const deleteSalesman = params => { return instance.post(`${preUrlPath}/pay/ag/deleteSalesman`,params).then(res => res.data); };
//新增业务员
export const addSalesman = params => { return instance.post(`${preUrlPath}/pay/ag/addSalesman`,params).then(res => res.data); };
//业务员状态
export const updateSalesmanStatus = params => { return instance.post(`${preUrlPath}/pay/ag/updateSalesmanStatus`,params).then(res => res.data); };
//修改密码
export const updateSysPwd = params => { return instance.post(`${preUrlPath}/pay/ag/updateSysPwd`,params).then(res => res.data); };
//分配业务员
export const updateAgentSalesman = params => { return instance.post(`${preUrlPath}/pay/ag/updateAgentSalesman`,params).then(res => res.data); };
//一键分配业务员
export const updateAgentAllSalesman = params => { return instance.post(`${preUrlPath}/pay/ag/updateAgentAllSalesman`,params).then(res => res.data); };
//新增商户
export const addAgentMer = params => { return instance.post(`${preUrlPath}/pay/ag/addAgentMer`,params).then(res => res.data); };
//行业类目
export const addLcShopView = params => { return instance.post(`${preUrlPath}/pay/comm/addLcShopView`,params).then(res => res.data); };
export const showBusinessType = params => { return instance.post(`${preUrlPath}/pay/comm/showBusinessType`,params).then(res => res.data); };
//开户银行
export const selectBank = params => { return instance.post(`${preUrlPath}/pay/comm/selectBank`,params).then(res => res.data); };
//开户银行省
export const getProvince = params => { return instance.post(`${preUrlPath}/pay/comm/getProvince`,params).then(res => res.data); };
//开户银行市
export const queryCity = params => { return instance.post(`${preUrlPath}/pay/comm/queryCity`,params).then(res => res.data); };
//开户银行支行
export const selectbranch = params => { return instance.post(`${preUrlPath}/pay/comm/selectbranch`,params).then(res => res.data); };
//富有大商户
export const getTokenList = params => { return instance.post(`${preUrlPath}/pay/comm/getTokenList`,params).then(res => res.data); };
//反佣查询
export const queryAgentRebate = params => { return instance.post(`${preUrlPath}/pay/ag/queryAgentRebate`,params).then(res => res.data); };
//反佣查询状态修改
export const updateRebateStatus = params => { return instance.post(`${preUrlPath}/pay/ag/updateRebateStatus`,params).then(res => res.data); };
//反佣查询明细
export const queryMerRebate = params => { return instance.post(`${preUrlPath}/pay/ag/queryMerRebate`,params).then(res => res.data); };
export const updateAgentMerView = params => { return instance.post(`${preUrlPath}/pay/ag/updateAgentMerView`,params).then(res => res.data); };
//商户修改
export const updateAgentMer = params => { return instance.post(`${preUrlPath}/pay/ag/updateAgentMer`,params).then(res => res.data); };
//业务员修改
export const updateAgSalesman = params => { return instance.post(`${preUrlPath}/pay/ag/updateAgSalesman`,params).then(res => res.data); };
//商户入住
export const queryAgentLc = params => { return instance.post(`${preUrlPath}/pay/ag/queryAgentLc`,params).then(res => res.data); };
//交易统计
export const showMerStatement = params => { return instance.post(`${preUrlPath}/pay/ag/showMerStatement`,params).then(res => res.data); };
//商户日交易统计
export const queryMerDaySum = params => { return instance.post(`${preUrlPath}/pay/ag/queryMerDaySum`,params).then(res => res.data); };