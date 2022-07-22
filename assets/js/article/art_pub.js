$(function () {
    let layer = layui.layer
    let form = layui.form


    // 定义加载文章分类的方法
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别初始化失败！')
                }
                // 调用模板引擎渲染数据
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 要调用form.render()重新渲染表单
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件 并模拟点击行为
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        if (files.length === 0) {
            return layer.msg('请选择图片!')
        }
        // 根据文件创建url地址
        let newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    let artState = '已发布'
    // 为存为草稿绑定点击事件
    $('#btnSaveto').on('click', function () {
        artState = '草稿'
    })

    // 监听表单的submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单 快速创建FormData对象
        let fd = new FormData($(this)[0])

        // 将文章的发布状态 存到fd中
        fd.append('state', artState)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储至fd中
                fd.append('cover_img', blob)

                // 发起ajax请求
                publishArticle(fd)
            })

    })

    // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是FormData类型的数据,必须要有以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                // 成功后跳转至文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})