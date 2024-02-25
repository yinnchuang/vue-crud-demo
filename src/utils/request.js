// 引入文件
import axios from "axios";
import { ElMessage } from "element-plus";

//
const service = axios.create({
    baseURL:"http://127.0.0.1:3301/",
    timeout:8000
})

// 响应拦截
service.interceptors.response.use(res=>{
    console.log(res)
    const {code, data, msg} = res.data
    if (code === 200){
        ElMessage.success(msg)
        return data
    }else if(code === 400){
        ElMessage.error(msg)
    }
})

function request(options){
    options.method = options.method || 'get'
    if(options.method.toLowerCase() === 'get') options.params = options.data
    return service(options) 
}

['get', 'post', 'put', 'delete'].forEach(item=>{
    request[item] = (url, data, options) =>{
        return request({
            url,
            data,
            method:item
        })
    }
})

export default request