import axios from 'axios'
import router from '../router'
import * as util from '../util/util.js'

const instance = axios.create({
	baseURL: process.env.API_ROOT,
	timeout: 40000
})

instance.defaults.headers.post['Content-Type'] = 'application/json'
// 错误处理
instance.interceptors.request.use(request => {
	return request
}, error => {
	util.axiosCatchError(error)
})

instance.interceptors.response.use(response => {
	if (response.data.code === '000000') {
		if (response.data.subCode === '000000') {
			return response
		} else if (response.data.subCode === '4001') {
			router.replace({
				path: '/'
			})
			util.axiosCatchError(response)
		} else {
			util.axiosCatchError(response)
		}
	} else {
		util.axiosCatchError(response)
	}
}, error => {
	util.axiosCatchError(error)
})

export default instance
