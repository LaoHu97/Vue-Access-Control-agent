import instance from './index';
const preUrlPath = '';
//获取菜单权限
export const menu = params => { return instance.get(`${preUrlPath}/admin/wp/ag/menu`,{ params: params }); };
//检查是否拥有权限
export const checkPermission = params => { return instance.post(`${preUrlPath}/admin/wp/ag/checkPermission`, params).then(res => res.data); };
//登录
export const loginVerify = params => { return instance.post(`${preUrlPath}/admin/wp/ag/loginVerify`, params).then(res => res.data); };
//退出
export const loginOut = params => { return instance.post(`${preUrlPath}/admin/wp/ag/loginOut`, params).then(res => res.data); };
//验证码
export const getCode = process.env.API_ROOT+"/admin/wp/comm/getCode";
//交易列表
export const queryAgentOrder = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryAgentOrder`, params).then(res => res.data);};
//商户模糊查询
export const selectMersByName = params => { return instance.post(`${preUrlPath}/admin/wp/comm/selectMersByName`,params).then(res => res.data); };
//业务员模糊查询
export const selectSaleByName= params => { return instance.post(`${preUrlPath}/admin/wp/comm/selectSaleByName`, params).then(res => res.data); };
//商户入住
export const agentMerEnter = params => { return instance.post(`${preUrlPath}/admin/wp/ag/agentMerEnter`, params).then(res => res.data); };
//商户列表
export const queryAgentMer = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryAgentMer`,params).then(res => res.data); };
//业务员查询
export const querySalesman = params => { return instance.post(`${preUrlPath}/admin/wp/ag/querySalesman`,params).then(res => res.data); };
//重置密码
export const resetPwd = params => { return instance.post(`${preUrlPath}/admin/wp/ag/resetPwd`,params).then(res => res.data); };
//删除业务员
export const deleteSalesman = params => { return instance.post(`${preUrlPath}/admin/wp/ag/deleteSalesman`,params).then(res => res.data); };
//新增业务员
export const addSalesman = params => { return instance.post(`${preUrlPath}/admin/wp/ag/addSalesman`,params).then(res => res.data); };
//业务员状态
export const updateSalesmanStatus = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateSalesmanStatus`,params).then(res => res.data); };
//修改密码
export const updateSysPwd = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateSysPwd`,params).then(res => res.data); };
//分配业务员
export const updateAgentSalesman = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateAgentSalesman`,params).then(res => res.data); };
//一键分配业务员
export const updateAgentAllSalesman = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateAgentAllSalesman`,params).then(res => res.data); };
//新增商户
export const addAgentMer = params => { return instance.post(`${preUrlPath}/admin/wp/ag/addAgentMer`,params).then(res => res.data); };
//行业类目
export const addLcShopView = params => { return instance.post(`${preUrlPath}/admin/wp/comm/addLcShopView`,params).then(res => res.data); };
export const showBusinessType = params => { return instance.post(`${preUrlPath}/admin/wp/comm/showBusinessType`,params).then(res => res.data); };
//开户银行
export const selectBank = params => { return instance.post(`${preUrlPath}/admin/wp/comm/selectBank`,params).then(res => res.data); };
//开户银行省
export const getProvince = params => { return instance.post(`${preUrlPath}/admin/wp/comm/getProvince`,params).then(res => res.data); };
//开户银行市
export const queryCity = params => { return instance.post(`${preUrlPath}/admin/wp/comm/queryCity`,params).then(res => res.data); };
//开户银行支行
export const selectbranch = params => { return instance.post(`${preUrlPath}/admin/wp/comm/selectbranch`,params).then(res => res.data); };
//富有大商户
export const getTokenList = params => { return instance.post(`${preUrlPath}/admin/wp/comm/getTokenList`,params).then(res => res.data); };
//反佣查询
export const queryAgentRebate = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryAgentRebate`,params).then(res => res.data); };
//反佣查询状态修改
export const updateRebateStatus = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateRebateStatus`,params).then(res => res.data); };
//反佣查询明细
export const queryMerRebate = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryMerRebate`,params).then(res => res.data); };
export const updateAgentMerView = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateAgentMerView`,params).then(res => res.data); };
//商户修改
export const updateAgentMer = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateAgentMer`,params).then(res => res.data); };
//业务员修改
export const updateAgSalesman = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateAgSalesman`,params).then(res => res.data); };
//商户入住
export const queryAgentLc = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryAgentLc`,params).then(res => res.data); };
//交易统计
export const showMerStatement = params => { return instance.post(`${preUrlPath}/admin/wp/ag/showMerStatement`,params).then(res => res.data); };
//商户日交易统计
export const queryMerDaySum = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryMerDaySum`,params).then(res => res.data); };


//首页
export const showAgentDate = params => { return instance.post(`${preUrlPath}/admin/wp/ag/showAgentDate`,params).then(res => res.data); };
//公告列表
export const getNotices = params => { return instance.post(`${preUrlPath}/admin/sys/getNotices`,params).then(res => res.data); };
//公告详情
export const getNoticeById = params => { return instance.post(`${preUrlPath}/admin/sys/getNoticeById`,params).then(res => res.data); };
//商户月排行榜
export const queryMerMonthData = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryMerMonthData`,params).then(res => res.data); };


//商家设置
//添加门店
export const addStore = params => { return instance.post(`${preUrlPath}/admin/wp/ag/addStore`,params).then(res => res.data); };
//门店管理
export const queryStoresShop = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryStoresShop`,params).then(res => res.data); };
//列表修改
export const updateStore = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateStore`,params).then(res => res.data); };
//门店删除
export const deleteStore = params => { return instance.post(`${preUrlPath}/admin/wp/ag/deleteStore`,params).then(res => res.data); };
//门店状态
export const updateStoreState = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateStoreState`,params).then(res => res.data); };
//重置密码
export const resetStorePwd = params => { return instance.post(`${preUrlPath}/admin/wp/ag/resetStorePwd`,params).then(res => res.data); };

//款台查询
export const queryEmployeeShop = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryEmployeeShop`,params).then(res => res.data); };
//款台详情
export const queryEmployeeDetail = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryEmployeeDetail`,params).then(res => res.data); };
//款台密码重置
export const resetEmployeePwd = params => { return instance.post(`${preUrlPath}/admin/wp/ag/resetEmployeePwd`,params).then(res => res.data); };
//款台增加
export const addEmployee = params => { return instance.post(`${preUrlPath}/admin/wp/ag/addEmployee`,params).then(res => res.data); };
//款台修改
export const updateEmployee = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateEmployee`,params).then(res => res.data); };
//款台删除
export const deleteEmployee = params => { return instance.post(`${preUrlPath}/admin/wp/ag/deleteEmployee`,params).then(res => res.data); };
//款台状态
export const updateEmployeeStatus = params => { return instance.post(`${preUrlPath}/admin/wp/ag/updateEmployeeStatus`,params).then(res => res.data); };
//门店模糊查询
export const selectStoreList = params => { return instance.post(`${preUrlPath}/admin/wp/ag/selectStoreList`,params).then(res => res.data); };

export const querySalesmanRebate = params => { return instance.post(`${preUrlPath}/admin/wp/ag/querySalesmanRebate`,params).then(res => res.data); };
//商户月交易汇总
export const queryMerMonthDetail = params => { return instance.post(`${preUrlPath}/admin/wp/ag/queryMerMonthDetail`,params).then(res => res.data); };

export const uploadImage = `${preUrlPath}/admin/ag/uploadImage`;