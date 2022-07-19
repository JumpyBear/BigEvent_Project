// 每次调用$.get,post,ajax会先调用$.ajaxPrefilter这个函数
// 在这个函数中可以拿到我们给ajax的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    options.url = `http://www.liulongbin.top:3007${options.url}`
})