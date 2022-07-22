$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()


    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    // 为添加类别按钮绑定点击事件
    let indexAdd = null
    $('#add_cate').on('click', function () {
        indexAdd = layer.open({
            // 弹出层类型 页面层
            type: 1,
            // 区域大小
            area: ['500px', '250px'],
            // 弹出层标题
            title: '添加文章分类',
            // 内容
            content: $('#dialog_add').html()
        })
    })

    // 通过代理的形式为form-add绑定submit事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })

    let indexEdit = null
    // 通过代理的形式为btn_edit绑定点击事件
    $('tbody').on('click', '#btn_edit', function () {
        // 弹出一个修改文章信息分类的层
        indexEdit = layer.open({
            // 弹出层类型 页面层
            type: 1,
            // 区域大小
            area: ['500px', '250px'],
            // 弹出层标题
            title: '修改文章分类',
            // 内容
            content: $('#dialog_edit').html()
        })

        let id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: `/my/article/cates/${id}`,
            success: function (res) {
                form.val('form_edit', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章失败')
                }
                layer.msg('更新文章成功')
                layer.close(indexEdit)
                initArtCateList()
            }

        })
    })

    //  通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn_delete', function () {
        let id = $(this).attr('data-id')

        // 询问是否需要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: `/my/article/cates/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})