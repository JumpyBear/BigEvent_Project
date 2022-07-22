// 每次调用$.get,post,ajax会先调用$.ajaxPrefilter这个函数
// 在这个函数中可以拿到我们给ajax的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    // 在发起真正的ajax请求前，统一拼接请求的根路径
    options.url = `http://big-event-api-t.itheima.net${options.url}`

    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    // 不论成功还是失败，最终都会调用complete回调函数
    options.complete = function (res) {
        // console.log('执行了complete回调')
        // console.log(res)
        // 在complete回调函数中可以使用res.responseJSON拿到服务器响应的回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转到login
            location.href = '/login.html'
        }
    }

})