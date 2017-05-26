(function(){

var server = H.namespace('server');

var contextPath = "/mock";
/**
 * 发起请求方法
 * @param type{get|post}    请求类型
 * @param api               请求地址 url
 * @param parameters        请求发布参数
 * @param success           回调方法,(错误也会调用)
 * @param async             事后异步请求
 * @returns {*}             ajax对象
 */
var send = function (type, api, parameters, success, contentType) {
    typeof success == 'function' || (success = function () {
    });
    var Headers = contentType ?
    {"Cache-Control": "no-cache", "Accept": "application/json", "Content-Type": contentType} :
    {"Cache-Control": "no-cache", "Accept": "application/json"};
    var request = $.ajax({
        url: api + "?r=" + Math.random(),
        data: parameters,
        type: type,
        dataType: 'json',
        async: true,
        cache: false,
        headers: Headers,
        timeout: 300000,
        success: function (data, textStatus, jqXHR) {
            success.call(this, data, textStatus, jqXHR);
        },
        error: function (jqXHR, textStatus, errorThrown) {

            //alert(jqXHR+errorThrown+textStatus);
            if (jqXHR.status == 401) {
                location.href = contextPath;
            } else {
                if (!errorThrown) {
                    return false;
                }
                var errors = {
                    101: "网络不稳定或不畅通，请检查网络设置",
                    403: "服务器禁止此操作！",
                    500: "服务器遭遇异常阻止了当前请求的执行<br/><br/><br/>"
                };

                var msg = null;
                switch (textStatus) {
                    case "timeout":
                        msg = "网络连接超时，请检查网络是否畅通！";
                        break;
                    case "error":
                        if (errors[jqXHR.status]) {
                            var data = null;
                            try {
                                data = jQuery.parseJSON(jqXHR.responseText);
                            } catch (e) {
                            }
                            if (data && data.message) {
                                msg = data.message;
                            } else {
                                msg = errors[jqXHR.status];
                            }
                        } else {
                            msg = "服务器响应异常<br/><br/>" + (jqXHR.status == 0 ? "" : jqXHR.status) + "&nbsp;" + errorThrown;
                        }
                        break;
                    case "abort":
                        msg = null;//"数据连接已被取消！";
                        break;
                    case "parsererror":
                        msg = "数据解析错误！";
                        break;
                    default:
                        msg = "出现错误:" + textStatus + "！";
                }
                if (errorThrown.code != null && errorThrown.message != null && !errors[errorThrown.code]) {
                    msg += "</br>[code:" + errorThrown.code + "][message:" + errorThrown.message + "]" + (null == errorThrown.stack ? "" : errorThrown.stack);
                }
                if (msg == null) {
                    msg = '';
                }
                success.call(this, {code: jqXHR.status, message: msg}, textStatus, jqXHR, errorThrown);
            }
        }
    });
    return request;
};

    /**
     * 登录/退出
     **/
    // 登录
    server.login = function (data, callback) {
        return send('post', contextPath + '/user/login', data, callback);
    };
    // 退出
    server.logout = function (data, callback) {
        return send('post', contextPath + '/user/logout', data ,callback);
    };

    /**
     * 导航
     * */
    server.user_navigate = function (data, callback) {
        return send('get', contextPath + '/user/navigate', data, callback);
    };

    /*
    * 获取用户信息*
    */
    server.user_info = function (data, callback) {
        return send('get', contextPath + '/user/info', data, callback);
    };

    /*
    * 账户管理;
    * */
    //获取账户列表;
    server.user_list = function (data, callback) {
        return send('get', contextPath + '/user/list', data, callback);
    };
    //操作员信息修改;
    server.user_info_update = function (data, callback) {
        return send('post', contextPath + '/user/info/update', data, callback);
    };
    //操作员添加;
    server.user_add = function (data, callback) {
        return send('post', contextPath + '/user/add', data, callback);
    };
    //操作员状态更改;
    server.user_status_update = function (data, callback) {
        return send('post', contextPath + '/user/status/update', data, callback);
    };
    //指定ID的操作员所有权限获取;
    server.user_privilege = function (data, callback) {
        return send('get', contextPath + '/user/privilege', data, callback);
    };
    //用户权限修改;
    server.user_privilege_update = function (data, callback) {
        return send('post', contextPath + '/user/privilege/update', data, callback);
    };

    /*
     * 部门管理;
     * */
    //获取部门列表;
    server.department_list = function (data, callback) {
        return send('get', contextPath + '/department/list', data, callback);
    };
    //添加部门;
    server.department_add = function (data, callback) {
        return send('post', contextPath + '/department/add', data, callback);
    };
    //修改部门;
    server.department_info_update = function (data, callback) {
        return send('post', contextPath + '/department/info/update', data, callback);
    };
    //部门状态更改（删除）;
    server.department_status_update = function (data, callback) {
        return send('post', contextPath + '/department/status/update', data, callback);
    };

    /*
     * 权限管理;
     * */
    //所有权限获取;
    server.privilege_list = function (data, callback) {
        return send('get', contextPath + '/privilege/list', data, callback);
    };
    //添加权限;
    server.privilege_add = function (data, callback) {
        return send('post', contextPath + '/privilege/add', data, callback);
    };
    //修改权限;
    server.privilege_update = function (data, callback) {
        return send('post', contextPath + '/privilege/update', data, callback);
    };
    //获取指定ID权限的详细信息;
    server.privilege_info = function (data, callback) {
        return send('get', contextPath + '/privilege/info', data, callback);
    };
    //修改指定权限的状态;
    server.privilege_status_update = function (data, callback) {
        return send('post', contextPath + '/privilege/status/update', data, callback);
    };

    /*
     * 商贸公司管理
     * */

    //商贸公司列表;
    server.trade_list = function (data, callback) {
        return send('get', contextPath + '/trade/list', data, callback);
    };
    //商贸公司添加;
    server.trade_add = function (data, callback) {
        return send('post', contextPath + '/trade/add', data, callback);
    };
    //商贸公司信息获取;
    server.trade_info = function (data, callback) {
        return send('get', contextPath + '/trade/info', data, callback);
    };
    //商贸公司信息修改;
    server.trade_info_update = function (data, callback) {
        return send('post', contextPath + '/trade/info/update', data, callback);
    };
    //商贸公司状态修改;
    server.trade_status_update = function (data, callback) {
        return send('post', contextPath + '/trade/status/update', data, callback);
    };

    /*
     * 店铺
     * */

    //店铺类型获取;
    server.shop_type_list = function (data, callback) {
        return send('get', contextPath + '/shop/type/list', data, callback);
    };

    /*
     * 省、市、区县信息获取
     * */

    //省、市、区县信息获取;
    server.other_area_list = function (data, callback) {
        return send('get', contextPath + '/other/area/list', data, callback);
    };

    //大区列表获取;
    server.other_customArea_list = function (data, callback) {
        return send('get', contextPath + '/other/custom-area/list', data, callback);
    };

    /*
    * 每日推送
    * */
    //可推送用户列表;
    server.operate_dailyNews_receiveUser_list = function (data, callback) {
        return send('get', contextPath + '/operate/daily-news/receive-user/list', data, callback);
    };

    //今日推文列表;
    server.operate_todayArticle_list = function (data, callback) {
        return send('get', contextPath + '/operate/today-article/list', data, callback);
    };

    //今日推文类型获取;
    server.other_todayArticle_type = function (data, callback) {
        return send('get', contextPath + '/other/today-article/type', data, callback);
    };

    //今日推文编辑（添加/修改）;
    server.operate_todayArticle_edit = function (data, callback) {
        return send('post', contextPath + '/operate/today-article/edit', data, callback);
    };

    //今日推文删除;
    server.operate_todayArticle_delete = function (data, callback) {
        return send('post', contextPath + '/operate/today-article/delete', data, callback);
    };

    //推文商品列表;
    server.operate_dailyNews_goods_list = function (data, callback) {
        return send('get', contextPath + '/operate/daily-news/goods/list', data, callback);
    };

    //推文商品屏蔽操作;
    server.operate_dailyNews_goods_shield = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/goods/shield', data, callback);
    };

    //前端上传数据到OSS的签名接口;
    server.other_oss_signature = function (data, callback) {
        return send('get', contextPath + '/other/oss/signature', data, callback);
    };

    //获取前端上传数据到OSS的请求ID;
    server.other_oss_identity_data = function (data, callback) {
        return send('get', contextPath + '/other/oss/identity/data', data, callback);
    };

    //推文日志列表;
    server.operate_dailyNews_log_list = function (data, callback) {
        return send('get', contextPath + '/operate/daily-news/log/list', data, callback);
    };

    //每日推文设置
    server.operate_dailyNews_manage_list = function (data, callback) {
        return send('get', contextPath + '/operate/daily-news/manage/list', data, callback);
    };

    //每日推文设置发送
    server.operate_dailyNews_manage_edit = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/manage/edit', data, callback);
    };

    //店铺类型获取
    server.shop_type_info = function (data, callback) {
        return send('get', contextPath + '/shop/type/info', data, callback);
    };

    //获得活动列表
    server.activities_list = function (data, callback) {
        return send('get', contextPath + '/activities/list', data, callback);
    };

    //添加活动
    server.activities_add = function (data, callback) {
        return send('post', contextPath + '/activities/add', data, callback, 'application/json');
    };

    //更新活动
    server.activities_update = function (data, callback) {
        return send('post', contextPath + '/activities/update', data, callback, 'application/json');
    };

    //活动商品列表
    server.activities_goods_list = function (data, callback) {
        return send('get', contextPath + '/activities/goods/list', data, callback);
    };
    //活动商品添加
    server.activities_goods_add = function (data, callback) {
        return send('post', contextPath + '/activities/goods/add', data, callback);
    };

    //活动商品删除
    server.activities_goods_del = function (data, callback) {
        return send('post', contextPath + '/activities/goods/del', data, callback);
    };

    //活动商品清空
    server.activities_goods_clear = function (data, callback) {
        return send('post', contextPath + '/activities/goods/clear', data, callback);
    };

    //活动商品排序
    server.activities_goods_sort = function (data, callback) {
        return send('post', contextPath + '/activities/goods/sort', data, callback);
    };

    /*
     * 访问日志
     * */
    //当前页面所有访问统计
    server.statistic_page_all = function (data, callback) {
        return send('get', contextPath + '/statistic/page/all', data, callback);
    };

    //店铺访问统计数据展示
    server.statistic_page_detail = function (data, callback) {
        return send('get', contextPath + '/statistic/page/detail', data, callback);
    };

    //商品当前结果统计
    server.statistic_goods_all = function (data, callback) {
        return send('get', contextPath + '/statistic/goods/all', data, callback);
    };

    //商品页面详细数据
    server.statistic_goods_detail = function (data, callback) {
        return send('get', contextPath + '/statistic/goods/detail', data, callback);
    };

    //指定商品的详细访问记录
    server.statistic_goodsSpecific_detail = function (data, callback) {
        return send('get', contextPath + '/statistic/goods-specific/detail', data, callback);
    };


    /*
     * 推荐商品
     * */
    //添加推荐榜商品;
    server.operate_dailyNews_goods_recommend = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/goods/recommend', data, callback);
    };

    //移除单个推荐榜商品;
    server.operate_dailyNews_recommend_goods_remove = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/recommend/goods/remove', data, callback);
    };

    //移除全部推荐榜商品;
    server.operate_dailyNews_recommend_goods_removeAll = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/recommend/goods/remove-all', data, callback);
    };

    //推荐榜商品排序;
    server.operate_dailyNews_recommend_goods_sort = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/recommend/goods/sort', data, callback);
    };

    /*
    * 商品分类管理;
    * */
    //添加商品分类;
    server.goods_type_add = function (data, callback) {
        return send('post', contextPath + '/goods/type/add', data, callback);
    };

    //获取商品分类数据;
    server.goods_type_list = function (data, callback) {
        return send('get', contextPath + '/goods/type/list', data, callback);
    };

    //修改商品分类;
    server.goods_type_update = function (data, callback) {
        return send('post', contextPath + '/goods/type/update', data, callback);
    };

    //删除商品分类;
    server.goods_type_delete = function (data, callback) {
        return send('post', contextPath + '/goods/type/delete', data, callback);
    };

    //商品分类排序;
    server.goods_type_sort = function (data, callback) {
        return send('post', contextPath + '/goods/type/sort', data, callback);
    };

    //获取商品分类信息;
    server.goods_type_info = function (data, callback) {
        return send('get', contextPath + '/goods/type/info', data, callback);
    };

    //商品属性可输入格式获取;
    server.other_goods_type_attr_inputFormat_list = function (data, callback) {
        return send('get', contextPath + '/other/goods/type/attr/input-format/list', data, callback);
    };

    //商品分类基本属性获取;
    server.goods_type_basicAttr_get = function (data, callback) {
        return send('get', contextPath + '/goods/type/basic-attr/get', data, callback);
    };

    //商品分类基本属性添加或者更改;
    server.goods_type_basicAttr_update = function (data, callback) {
        return send('post', contextPath + '/goods/type/basic-attr/update', data, callback, 'application/json');
    };

    //分类特殊属性添加/修改;
    server.goods_type_specialAttr_update = function (data, callback) {
        return send('post', contextPath + '/goods/type/special-attr/update', data, callback, 'application/json');
    };

    //分类特殊属性信息列表;
    server.goods_type_specialAttr_list = function (data, callback) {
        return send('get', contextPath + '/goods/type/special-attr/list', data, callback);
    };

    //分类特殊属性删除;
    server.goods_type_specialAttr_delete = function (data, callback) {
        return send('post', contextPath + '/goods/type/special-attr/delete', data, callback, 'application/json');
    };

    /*
    * 品牌管理;
    * */
    //分页读取品牌列表
    server.goods_brands_list = function (data, callback) {
        return send('get', contextPath + '/goods/brands/list', data, callback);
    };

    // 删除品牌
    server.goods_brands_delete = function (data, callback) {
        return send('post', contextPath + '/goods/brands/delete', data, callback);
    };

    // 新增品牌
    server.goods_brands_add = function (data, callback) {
        return send('post', contextPath + '/goods/brands/add', data, callback);
    };

    // 更新品牌
    server.goods_brands_update = function (data, callback) {
        return send('post', contextPath + '/goods/brands/update', data, callback);
    };

    /*
    * 商品转移
    * */
    //店铺列表
    server.goods_transfer_shop_list = function (data, callback) {
        return send('get', contextPath + '/goods/transfer/shop/list', data, callback);
    };

    //商品列表
    server.goods_transfer_list = function (data, callback) {
        return send('get', contextPath + '/goods/transfer/list', data, callback);
    };

    //供应商信息查询
    server.goods_shop_info = function (data, callback) {
        return send('get', contextPath + '/goods/shop/info', data, callback);
    };

    //屏蔽操作
    server.goods_transfer_shielding = function(data, callback){
        return send('post', contextPath + '/goods/transfer/shielding', data, callback);
    };

    //删除操作
    server.goods_transfer_oldGoods_del = function(data, callback){
        return send('post', contextPath + '	/goods/transfer/old-goods/del', data, callback);
    };

    /*
    * 添加、修改、转移商品
    * */
    //活动类型获取;
    server.activities_type = function (data, callback) {
        return send('get', contextPath + '/activities/type', data, callback);
    };
    //商品单位获取;
    server.other_goods_units = function (data, callback) {
        return send('get', contextPath + '/other/goods/units', data, callback);
    };
    //商品国别获取;
    server.other_goods_smuggles = function (data, callback) {
        return send('get', contextPath + '/other/goods/smuggles', data, callback);
    };
    //商品图片删除;
    server.goods_picture_del = function (data, callback) {
        return send('post', contextPath + '/goods/picture/del', data, callback, 'application/json');
    };
    //旧商品图片(包括检验报告)的获取;
    server.goods_picture_list = function (data, callback) {
        return send('get', contextPath + '/goods/picture/list', data, callback);
    };
    //检验报告图片删除;
    server.goods_inspectionReport_picture_del = function (data, callback) {
        return send('post', contextPath + '/goods/inspection-report/picture/del', data, callback);
    };
    //商品添加;
    server.goods_add = function (data, callback) {
        return send('post', contextPath + '/goods/add', data, callback);
    };

    /*
     * 普通商品
     * */
    //普通商品
    server.goods_ordinary_list = function(data, callback){
        return send('get', contextPath + '	/goods/ordinary/list', data, callback);
    };

    //下架普通商品
    server.goods_ordinary_soldOut = function (data, callback) {
        return send('post', contextPath + '/goods/ordinary/sold-out', data, callback);
    };

    //刷新普通商品价格
    server.goods_ordinary_priceRefresh = function (data, callback) {
        return send('post', contextPath + '/goods/ordinary/price-refresh', data, callback);
    };

    //删除普通商品
    server.goods_ordinary_delete = function (data, callback) {
        return send('post', contextPath + '/goods/ordinary/delete', data, callback);
    };

    //上架普通商品
    server.goods_ordinary_onSale = function (data, callback) {
        return send('post', contextPath + '/goods/ordinary/on-sale', data, callback);
    };

    //恢复删除普通商品
    server.goods_ordinary_undelete = function (data, callback) {
        return send('post', contextPath + '/goods/ordinary/undelete', data, callback);
    };


    /*
    * 待审核商品
    * */
    //有待审核商品的市场及店铺列表;
    server.shop_newGoods_market_list = function (data, callback) {
        return send('get', contextPath + '/shop/new-goods/market/list', data, callback);
    };

    //待审核商品列表;
    server.goods_newGoods_list = function (data, callback) {
        return send('get', contextPath + '/goods/new-goods/list', data, callback);
    };

    //审核通过(通过);
    server.goods_audit_pass = function (data, callback) {
        return send('post', contextPath + '/goods/audit/pass', data, callback);
    };

    //审核拒绝;
    server.goods_audit_refused = function (data, callback) {
        return send('post', contextPath + '/goods/audit/refused', data, callback);
    };

    //所在片区的发货市场获取
    server.shop_customArea_shipmentMarket_list = function(data, callback){
        return send('get', contextPath + '/shop/custom-area/shipment-market/list', data, callback);
    };

    /*
    * 商品日志
    * */

    //商品处理日志列表
    server.goods_logs_list = function(data, callback){
        return send('get', contextPath + '/goods/logs/list', data, callback);
    };

    //商品处理日志列表
    server.goods_historyPrices_list = function(data, callback){
        return send('get', contextPath + '/goods/history-prices/list', data, callback);
    };

    //商品详细信息获取;
    server.goods_info = function(data, callback){
        return send('get', contextPath + '/goods/info', data, callback);
    };

    //商品修改;
    server.goods_update = function (data, callback) {
        return send('post', contextPath + '/goods/update', data, callback);
    };

    /**
     * 权重配置
     */
    //获取权重配置的服务器文件
    server.get_access_config = function (data, callback) {
        return send('get', contextPath + '/search/boost', data, callback);
    };

    //提交权重配置的信息
    server.push_access_config = function (data, callback) {
        return send('post', contextPath + '/search/boost', data, callback);
    };

    /*
    * 商品词库管理;
    * */
    //获取同义词的数据;
    server.search_synonym = function (data, callback) {
        $.ajax({url: "/synonym.txt", success: function(res) {callback(res)}});
    };

    //获取自定义词库的数据;
    server.search_custom = function (data, callback) {
        $.ajax({url: "/custom.txt", success: function(res) {callback(res)}});
    };

    //更新搜索同义词;
    server.search_synonym_update = function (data, callback) {
        return send('post', contextPath + '/search/synonym/update', data, callback);
    };

    //更新搜索自定义词库;
    server.search_dict_update = function (data, callback) {
        return send('post', contextPath + '/search/custom/update', data, callback);
    };

    //更新索引;
    server.search_index_init = function (data, callback) {
        return send('post', contextPath + '/search/index/init', data, callback);
    };


    /**
     * 物流区域配置
     */
    //获取当前所有的区域
    server.get_all_area = function (data, callback) {
        let url = '';
        if(data.id){
            url = '/logistics/area/map/'+data.id;
        } else {
            url = '/logistics/area/map';
        }
        return send('get', contextPath + url, data, callback);
    };

    //获取成都市所有街道的信息
    server.get_logistic_street = function (data, callback) {
        let url = '';
        if(data.id){
            url = '/logistics/area/street/'+data.id;
        } else {
            url = '/logistics/area/street';
        }

        return send('get', contextPath + url, data, callback);
    };

    //修改区街道的状态信息
    server.change_street_state = function (data, callback) {
        return send('post', contextPath + '/logistics/area/street/status', data, callback);
    };


    /**
     * 运力管理
     */
    // 获取所有的运力数据
    server.get_capacity_info = function (data, callback) {
        return send('get', contextPath + '/logistics/capacity/'+data.display, data, callback);
    };
    // 修改运力数据
    server.modify_capacity = function (data, callback) {
        return send('post', contextPath + '/logistics/capacity/update', data, callback);
    };
    // 添加新运力
    server.add_capacity = function (data, callback) {
        return send('post', contextPath + '/logistics/capacity/add', data, callback);
    };
    // 删除运力信息
    server.delete_capacity = function (data, callback) {
        return send('post', contextPath + '/logistics/capacity/delete', data, callback);
    };


    /**
     * 司机信息
     */
    // 获取所有的司机信息
    server.get_driver_info = function (data, callback) {
        return send('get', contextPath + '/logistics/driver', data, callback);
    };
    // 修改司机状态信息
    server.modify_driver_state = function (data, callback) {
        return send('post', contextPath + '/logistics/driver/status', data, callback);
    };
    // 修改司机信息
    server.modify_driver = function (data, callback) {
        return send('post', contextPath + '/logistics/driver/update', data, callback);
    };
    // 删除司机信息
    server.delete_driver = function (data, callback) {
        return send('post', contextPath + '/logistics/driver/delete', data, callback);
    };
    // 获取当值司机列表
    server.get_work_driver = function (data, callback) {
        return send('get', contextPath + '/logistics/capacitys/available', data, callback);
    };


    /**
     * 运单管理
     */
    // 获取全部运单的信息
    server.get_all_waybill = function (data, callback) {
        return send('post', contextPath + '/logistics/delivery', data, callback);
    };
    // 管理员作废运单
    server.cancel_waybill = function (data, callback) {
        return send('post', contextPath + '/logistics/delivery/cancel/'+data.id, data, callback);
    };
    // 获得当前选中的运单详情
    server.get_current_waybill = function (data, callback) {
        return send('get', contextPath + '/logistics/deliverys/'+data.id, data, callback);
    };
    // 更新运单详情
    server.update_waybill_detail = function (data, callback) {
        return send('post', contextPath + '/logistics/delivery/update/'+data.method+'/'+data.id, data, callback);
    };
    // 收揽运单
    server.waybill_buy_over = function (data, callback) {
        return send('post', contextPath + '/logistics/delivery/received/'+data.id, data, callback);
    };


    /**
     * 运单实时状态
     */
    // 实时运单列表
    server.get_real_time_waybill = function (data, callback) {
        return send('get', contextPath + '/logistics/intime', data, callback);
    };
    // 获取实时运单详情
    server.get_real_time_detail = function (data, callback) {
        return send('get', contextPath + '/logistics/intime/'+data.id, data, callback);
    };


    /**
     * 调度分配
     */
    // 获取当日的运单统计
    server.get_today_waybill = function (data, callback) {
        return send('get', contextPath + '/logistics/delivery/statics', data, callback);
    };
    // 获取当日的运单列表坐标集合
    server.get_all_points = function (data, callback) {
        return send('get', contextPath + '/logistics/delivery/points', data, callback);
    };
    // 分配运单
    server.assign_delivery = function (data, callback) {
        return send('post', contextPath + '/logistics/delivery/assign', data, callback);
    };


    /**
     * 录单
     */
    // 搜索商家
    server.shop_search = function (data, callback) {
        return send('get', contextPath+'/logistics/shop/search', data, callback);
    };
    // 添加商家
    server.sign_shop = function (data, callback) {
        return send('post', contextPath+'/logistics/shop/sign', data, callback);
    };
    // 生成商家地址
    server.get_address = function (data, callback) {
        return send('get', contextPath + '/logistics/shop/address/'+data.id, data, callback);
    };
    // 保存收货人
    server.send_order = function (data, callback) {
        return send('post', contextPath + '/logistics/shop/order/'+data.id, data, callback);
    };
    // 修改收货人地址
    server.update_custom_address = function (data, callback) {
        return send('post', contextPath + '/logistics/shop/address/update/'+data.id, data, callback);
    };
    // 新增收货人地址
    server.add_custom_address = function (data, callback) {
        return send('post', contextPath + '/logistics/shop/address/add/'+data.id, data, callback);
    };

    /**
     * 客户管理
     */
    // 获取用户地址列表
    server.get_all_customer = function (data, callback) {
        return send('get', contextPath + '/logistics/custom', data, callback);
    };
    // 获取单个用户地址信息
    server.get_custom_by_id = function (data, callback) {
        return send('get', contextPath + '/logistics/custom/'+data.id, data, callback);
    };
    // 修改单个用户地址信息
    server.update_custom = function (data, callback) {
        return send('post', contextPath + '/logistics/custom/'+data.id, data, callback);
    };


    /**
     * 运费管理
     */
    // 获得未付款的运费管理
    server.get_unpaid_waybill = function (data, callback) {
        return send('get', contextPath+'/logistics/charge/unpaid', data, callback);
    };
    // 获得已付款运费管理页
    server.get_paid_waybill = function (data, callback) {
        return send('get', contextPath+'/logistics/charge/paid', data, callback);
    };
    // 获得撤销运费
    server.get_canceled_waybill = function(data, callback) {
        return send('get', contextPath+'/logistics/charge/canceled', data, callback);
    };
    // 撤销收款
    server.cancel_charge = function (data, callback) {
        return send('post', contextPath+'/logistics/charge/cancel/'+data.id, data, callback);
    };
    // 确定实收费用
    server.create_charge = function (data, callback) {
        return send('post', contextPath+'/logistics/charge/create', data, callback);
    };
    // 发送短信验证码
    server.send_code = function (data, callback) {
        return send('post', contextPath+'/verify/mobile', data, callback);
    };
    // 作废（免单）
    server.unpay_waybill = function (data, callback) {
        return send('post', contextPath+'/logistics/charge/free', data, callback);
    };


    /**
     * 地图通用
     */
    // 地点搜索
    server.get_all_address = function (data, callback) {
        return send('post', contextPath + '/map/search/hint', data, callback);
    };
    // 通过经纬度获取地址
    server.gecode_address = function (data, callback) {
        return send('post', contextPath + '/map/geocode/regeo', data, callback);
    };



    /*
    * 版本管理
    * */
    //添加版本日志记录
    server.version_log_add = function(data, callback){
        return send('post', contextPath + '/system/version/log/add.json', data, callback);
    };

    //版本日志记录列表
    server.version_log_list= function(data, callback){
        return send('get', contextPath + '/system/version/log/street.json', data, callback);
    };

    //修改版本日志记录
    server.version_log_update= function(data, callback) {
        return send('post', contextPath + '/system/version/log/update.json', data, callback);
    };


    /*
    * 首页管理
    * */
    //推荐好货列表
    server.indexManage_recommendGoods_list = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/recommend-goods/street.json', data, callback);
    };

    //添加推荐好货
    server.indexManage_recommendGoods_add = function(data, callback){
        return send('get', contextPath + '	/operation-manage/index-manage/recommend-goods/add.json', data, callback);
    };

    //下架推荐好货
    server.indexManage_recommendGoods_pullOff = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/recommend-goods/pull-off.json', data, callback);
    };

    //优质供应商列表
    server.indexManage_highQualitySuppliers_list = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/high-quality-suppliers/street.json', data, callback);
    };

    //添加优质供应商
    server.indexManage_highQualitySuppliers_add = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/high-quality-suppliers/add.json', data, callback);
    };

    //6下架优质供应商
    server.indexManage_highQualitySuppliers_pullOff = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/high-quality-suppliers/pull-off.json', data, callback);
    };

    //7添加新上好货
    server.indexManage_newGoods_add = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/new-goods/add.json', data, callback);
    };

    //8获取新上好货列表
    server.indexManage_newGoods_list = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/new-goods/street.json', data, callback);
    };

    //9下架新上好货
    server.indexManage_newGoods_pullOff = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/new-goods/pull-off.json', data, callback);
    };

    //10移动新上好货
    server.indexManage_newGoods_move = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/new-goods/move.json', data, callback);
    };

    //11移动优质供应商
    server.indexManage_highQualitySuppliers_move = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/high-quality-suppliers/move.json', data, callback);
    };

    //12移动推荐好货
    server.indexManage_recommendGoods_move = function(data, callback){
        return send('get', contextPath + '/operation-manage/index-manage/recommend-goods/move.json', data, callback);
    };


})($);