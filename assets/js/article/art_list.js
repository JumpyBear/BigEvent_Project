$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，将请求参数提交到服务器
    let q = {
        // 页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 2,
        // 文章分类的 Id
        cate_id: '',
        // 文章的状态，可选值有：已发布、草稿
        state: ''
    }

    initTable()
    initCate()

    // 获取文章数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染可选项
                let htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)

                // 重新渲染layui表单
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 渲染分页结构
        laypage.render({
            // 分页容器id
            elem: 'page-box',
            // 同条数
            count: total,
            // 每页显示多少条
            limit: q.pagesize,
            // 默认被选中的分页
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调
            // 触发jump的回调方式有两种：
            // 1.点击页码值
            // 2、调用laypage.render方法，就会触发回调
            // first=true不能调用initTable()，意思是通过第二种方式触发了回调，会产生死循环
            jump: function (obj, first) {
                // console.log(obj.curr)
                // console.log(first)
                // 把最新的页码值赋值给q
                q.pagenum = obj.curr
                // 把最新的条目数赋值给q.pagesize中
                q.pagesize = obj.limit
                // 可以通过first的值来判断是通过哪种方式触发的
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 页面删除按钮的个数
        let len = $('.btn-delete').length
        // 获取到文章的id
        let id = $(this).attr('data-id')
        // 弹出层
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: `/my/article/delete/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据被删除时，需要判断当前页面是否还有剩余数据，如果没有剩余数据，则让页码值-1重新渲染页面,并且页码值不能小于1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})