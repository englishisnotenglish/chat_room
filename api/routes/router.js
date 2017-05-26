var path = require('path'),
    express = require('express'),
    router = express.Router();

// 过滤掉路径中的‘\route’
var static_root = __dirname.replace(/\\route$/, '') + '/mock';

function getOptions(){
    return {
        root: static_root,
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        } 
    }
};

router.use(function timeLog(req, res, next){
    console.log('Time: ', Date.now());
    console.log(req.url);
    next();
});

// 登录;
router.post('/user/login',function(req, res){
    console.log('登录');
    res.sendFile('/user/login.json', getOptions());
});

// 退出;
router.post('/user/logout',function(req, res){
    console.log('退出');
    res.sendFile('/user/logout.json', getOptions());
});

// 导航;
router.get('/user/navigate',function(req, res){
    console.log('导航');
    res.sendFile('/user/navigate.json', getOptions());
});

// 获取用户信息;
router.get('/user/info',function(req, res){
    console.log('获取用户信息');
    res.sendFile('/user/info.json', getOptions());
});

/*
* 账户管理
* */

//操作员账户列表;
router.get('/user/list',function(req, res){
    console.log('获取用户列表');
    res.sendFile('/user/list.json', getOptions());
});
//操作员账户信息修改;
router.post('/user/info/update',function(req, res){
    console.log('操作员账户信息修改');
    res.sendFile('/user/info/update.json', getOptions());
});
//操作员添加;
router.post('/user/add',function(req, res){
    console.log('操作员添加');
    res.sendFile('/user/add.json', getOptions());
});
//操作员状态更改;
router.post('/user/status/update',function(req, res){
    console.log('操作员状态更改');
    res.sendFile('/user/status/update.json', getOptions());
});
//指定ID的操作员所有权限获取;
router.get('/user/privilege',function(req, res){
    console.log('指定ID的操作员所有权限获取');
    res.sendFile('/user/privilege.json', getOptions());
});
//用户权限修改;
router.post('/user/privilege/update',function(req, res){
    console.log('用户权限修改');
    res.sendFile('/user/privilege/update.json', getOptions());
});

/*
 * 部门管理
 * */

//部门列表;
router.get('/department/list',function(req, res){
    console.log('获取部门列表');
    res.sendFile('/department/list.json', getOptions());
});
//添加部门;
router.post('/department/add',function(req, res){
    console.log('添加部门');
    res.sendFile('/department/add.json', getOptions());
});
//修改部门;
router.post('/department/info/update',function(req, res){
    console.log('修改部门');
    res.sendFile('/department/info/update.json', getOptions());
});
//部门状态更改（删除）;
router.post('/department/status/update',function(req, res){
    console.log('部门状态更改（删除）');
    res.sendFile('/department/status/update.json', getOptions());
});

/*
 * 权限管理管理
 * */

//所有权限获取;
router.get('/privilege/list',function(req, res){
    console.log('所有权限获取');
    res.sendFile('/privilege/list.json', getOptions());
});
//添加权限;
router.post('/privilege/add',function(req, res){
    console.log('所有权限获取');
    res.sendFile('/privilege/add.json', getOptions());
});
//修改权限;
router.post('/privilege/update',function(req, res){
    console.log('所有权限获取');
    res.sendFile('/privilege/update.json', getOptions());
});
//获取指定ID权限的详细信息;
router.get('/privilege/info',function(req, res){
    console.log('获取指定ID权限的详细信息');
    res.sendFile('/privilege/info.json', getOptions());
});
//修改指定权限的状态;
router.post('/privilege/status/update',function(req, res){
    console.log('修改指定权限的状态');
    res.sendFile('/privilege/status/update.json', getOptions());
});

/*
 * 商贸公司管理
 * */

//商贸公司列表;
router.get('/trade/list',function(req, res){
    console.log('商贸公司列表');
    res.sendFile('/trade/list.json', getOptions());
});
//商贸公司添加;
router.post('/trade/add',function(req, res){
    console.log('商贸公司添加');
    res.sendFile('/trade/add.json', getOptions());
});
//商贸公司信息获取;
router.get('/trade/info',function(req, res){
    console.log('商贸公司信息获取');
    res.sendFile('/trade/info.json', getOptions());
});
//商贸公司信息修改;
router.post('/trade/info/update',function(req, res){
    console.log('商贸公司信息修改');
    res.sendFile('/trade/info/update.json', getOptions());
});
//商贸公司状态修改;
router.post('/trade/status/update',function(req, res){
    console.log('商贸公司状态修改');
    res.sendFile('/trade/status/update.json', getOptions());
});

/*
 * 店铺
 * */

//店铺类型获取;
router.get('/shop/type/list',function(req, res){
    console.log('店铺类型获取');
    res.sendFile('/shop/type/list.json', getOptions());
});

/*
 * 省、市、区县信息获取
 * */

//省、市、区县信息获取;
router.get('/other/area/list',function(req, res){
    console.log('省、市、区县信息获取');
    res.sendFile('/other/area/list.json', getOptions());
});

//地区列表获取;
router.get('/other/custom-area/list',function(req, res){
    console.log('地区列表获取');
    res.sendFile('/other/custom-area/list.json', getOptions());
});

//可推送用户列表;
router.get('/operate/daily-news/receive-user/list',function(req, res){
    console.log('可推送用户列表');
    res.sendFile('/operate/daily-news/receive-user/list.json', getOptions());
});

//今日推文列表;
router.get('/operate/today-article/list',function(req, res){
    console.log('今日推文列表');
    res.sendFile('/operate/today-article/list.json', getOptions());
});

//今日推文列表;
router.get('/other/today-article/type',function(req, res){
    console.log('今日推文列表');
    res.sendFile('/other/today-article/type.json', getOptions());
});

//今日推文编辑（添加/修改）;
router.post('/operate/today-article/edit',function(req, res){
    console.log('今日推文编辑（添加/修改）');
    res.sendFile('/operate/today-article/edit.json', getOptions());
});

//今日推文删除;
router.post('/operate/today-article/delete',function(req, res){
    console.log('今日推文删除');
    res.sendFile('/operate/today-article/del.json', getOptions());
});

//推文商品列表;
router.get('/operate/daily-news/goods/list',function(req, res){
    console.log('推文商品列表');
    res.sendFile('/operate/daily-news/goods/list.json', getOptions());
});

//推文商品屏蔽操作;
router.post('/operate/daily-news/goods/shield',function(req, res){
    console.log('推文商品屏蔽操作');
    res.sendFile('/operate/daily-news/goods/shield.json', getOptions());
});

//前端上传数据到OSS的签名接口;
router.get('/other/oss/signature',function(req, res){
    console.log('前端上传数据到OSS的签名接口');
    res.sendFile('/other/oss/signature.json', getOptions());
});

//获取前端上传数据到OSS的请求ID;
router.get('/other/oss/identity/data',function(req, res){
    console.log('获取前端上传数据到OSS的请求ID');
    res.sendFile('/other/oss/identity/data.json', getOptions());
});

//推文日志列表;
router.get('/operate/daily-news/log/list',function(req, res){
    console.log('获取前端上传数据到OSS的请求ID');
    res.sendFile('/operate/daily-news/log/list.json', getOptions());
});

//每日推文设置get;
router.get('/operate/daily-news/manage/list',function(req, res){
    console.log('每日推文设置get');
    res.sendFile('/operate/daily-news/manage/list.json', getOptions());
});

//每日推文设置post;
router.post('/operate/daily-news/manage/edit',function(req, res){
    console.log('每日推文设置post');
    res.sendFile('/operate/daily-news/manage/edit.json', getOptions());
});

//店铺类型获取
router.get('/shop/type/info',function(req, res){
    console.log('店铺类型获取');
    res.sendFile('/shop/type/info.json', getOptions());
});

//读取活动列表
router.get('/activities/list',function(req, res){
    console.log('读取活动列表');
    res.sendFile('/activities/list.json', getOptions());
});

//添加活动
router.post('/activities/add',function(req, res){
    console.log('添加活动');
    res.sendFile('/activities/add.json', getOptions());
});

//更新活动
router.post('/activities/update',function(req, res){
    console.log('更新活动');
    res.sendFile('/activities/update.json', getOptions());
});

//活动商品列表
router.get('/activities/goods/list',function(req, res){
    console.log('活动商品列表');
    res.sendFile('/activities/goods/list.json', getOptions());
});

//活动商品添加
router.post('/activities/goods/add',function(req, res){
    console.log('活动商品添加');
    res.sendFile('/activities/goods/add.json', getOptions());
});

//活动商品删除
router.post('/activities/goods/del',function(req, res){
    console.log('活动商品删除表');
    res.sendFile('/activities/goods/del.json', getOptions());
});

//活动商品清空
router.post('/activities/goods/clear',function(req, res){
    console.log('活动商品清空');
    res.sendFile('/activities/goods/clear.json', getOptions());
});

//活动商品排序
router.post('/activities/goods/sort',function(req, res){
    console.log('活动商品排序');
    res.sendFile('/activities/goods/sort.json', getOptions());
});


/*
 * 访问日志
 * */
//当前页面所有访问统计get
router.get('/statistic/page/all',function(req, res){
    console.log('当前页面所有访问统计get');
    res.sendFile('/statistic/page/list.json', getOptions());
});

//店铺访问统计数据展示get
router.get('/statistic/page/detail',function(req, res){
    console.log('店铺访问统计数据展示get');
    res.sendFile('/statistic/page/detail.json', getOptions());
});

//商品当前结果统计get
router.get('/statistic/goods/all',function(req, res){
    console.log('商品当前结果统计get');
    res.sendFile('/statistic/goods/list.json', getOptions());
});

//商品访问统计数据展示get
router.get('/statistic/goods/detail',function(req, res){
    console.log('商品访问统计数据展示get');
    res.sendFile('/statistic/goods/detail.json', getOptions());
});

//指定商品访问统计数据展示get
router.get('/statistic/goods-specific/detail',function(req, res){
    console.log('指定商品访问统计数据展示get');
    res.sendFile('/statistic/goods-specific/detail.json', getOptions());
});

/*
 * 店铺
 * */

//添加推荐榜商品;
router.post('/operate/daily-news/goods/recommend',function(req, res){
    console.log('添加推荐榜商品');
    res.sendFile('/operate/daily-news/goods/recommend.json', getOptions());
});

//移除单个推荐榜商品;
router.post('/operate/daily-news/recommend/goods/remove',function(req, res){
    console.log('移除单个推荐榜商品');
    res.sendFile('/operate/daily-news/recommend/goods/remove.json', getOptions());
});

//移除全部推荐榜商品;
router.post('/operate/daily-news/recommend/goods/remove-all',function(req, res){
    console.log('移除单个推荐榜商品');
    res.sendFile('/operate/daily-news/recommend/goods/remove-list.json', getOptions());
});

//推荐榜商品排序;
router.post('/operate/daily-news/recommend/goods/sort',function(req, res){
    console.log('推荐榜商品排序');
    res.sendFile('/operate/daily-news/recommend/goods/sort.json', getOptions());
});

/*
 * 商品分类管理;
 * */

//添加商品分类;
router.post('/goods/type/add',function(req, res){
    console.log('添加商品分类');
    res.sendFile('/goods/type/add.json', getOptions());
});

//获取商品分类数据;
router.get('/goods/type/list',function(req, res){
    console.log('获取商品分类数据');
    res.sendFile('/goods/type/list.json', getOptions());
});

//修改商品分类;
router.post('/goods/type/update',function(req, res){
    console.log('修改商品分类');
    res.sendFile('/goods/type/update.json', getOptions());
});

//删除商品分类;
router.post('/goods/type/delete',function(req, res){
    console.log('删除商品分类');
    res.sendFile('/goods/type/del.json', getOptions());
});

//删除商品分类;
router.post('/goods/type/sort',function(req, res){
    console.log('删除商品分类');
    res.sendFile('/goods/type/sort.json', getOptions());
});

//获取商品分类信息;
router.get('/goods/type/info',function(req, res){
    console.log('获取商品分类信息');
    res.sendFile('/goods/type/info.json', getOptions());
});

//商品属性可输入格式获取;
router.get('/other/goods/type/attr/input-format/list',function(req, res){
    console.log('商品属性可输入格式获取');
    res.sendFile('/other/goods/type/attr/input-format/list.json', getOptions());
});

//商品分类基本属性获取;
router.get('/goods/type/basic-attr/get',function(req, res){
    console.log('商品分类基本属性获取');
    res.sendFile('/goods/type/basic-attr/get.json', getOptions());
});

//商品分类基本属性添加或者更改;
router.post('/goods/type/basic-attr/update',function(req, res){
    console.log('商品分类基本属性添加或者更改');
    res.sendFile('/goods/type/basic-attr/update.json', getOptions());
});

//分类特殊属性添加/修改;
router.post('/goods/type/special-attr/update',function(req, res){
    console.log('分类特殊属性添加/修改');
    res.sendFile('/goods/type/special-attr/update.json', getOptions());
});

//分类特殊属性信息列表;
router.get('/goods/type/special-attr/list',function(req, res){
    console.log('分类特殊属性信息列表');
    res.sendFile('/goods/type/special-attr/list.json', getOptions());
});

//分类特殊属性删除;
router.post('/goods/type/special-attr/delete',function(req, res){
    console.log('分类特殊属性删除');
    res.sendFile('/goods/type/special-attr/del.json', getOptions());
});


/*
* 品牌管理
* */
//分页读取品牌列表
router.get('/goods/brands/list',function(req, res){
    console.log('分页读取品牌列表');
    res.sendFile('/goods/brands/list.json', getOptions());
});

//删除品牌
router.post('/goods/brands/delete',function(req, res){
    console.log('删除品牌');
    res.sendFile('/goods/brands/del.json', getOptions());
});

//新增品牌
router.post('/goods/brands/add',function(req, res){
    console.log('新增品牌');
    res.sendFile('/goods/brands/add.json', getOptions());
});

//更新品牌
router.post('/goods/brands/update',function(req, res){
    console.log('更新品牌');
    res.sendFile('/goods/brands/update.json', getOptions());
});

/*
<<<<<<< HEAD
 * 商品转移
 * */
//店铺列表
router.get('/goods/transfer/shop/list',function(req, res){
    console.log('店铺列表');
    res.sendFile('/goods/transfer/shop/list.json', getOptions());
});

//商品列表
router.get('/goods/transfer/list',function(req, res){
    console.log('商品列表');
    res.sendFile('/goods/transfer/list.json', getOptions());
});

/*
* 转移商品
* */
//店铺列表（只列出有商品可转移的店铺）;
router.get('/goods/transfer/shop/list',function(req, res){
    console.log('店铺列表（只列出有商品可转移的店铺）');
    res.sendFile('/goods/transfer/shop/list.json', getOptions());
});

//需转移商品列表;
router.get('/goods/transfer/list',function(req, res){
    console.log('需转移商品列表');
    res.sendFile('/goods/transfer/list.json', getOptions());
});

//供应商信息查询
router.get('/goods/shop/info',function(req, res){
    console.log('供应商信息查询');
    res.sendFile('/goods/shop/info.json', getOptions());
});

//屏蔽操作
router.post('/goods/transfer/shielding',function(req, res){
    console.log('屏蔽操作');
    res.sendFile('/goods/transfer/shielding.json', getOptions());
});

//删除操作
router.post('/goods/transfer/old-goods/del',function(req, res){
    console.log('删除操作');
    res.sendFile('/goods/transfer/old-goods/del.json', getOptions());
});


/*
 * 添加、修改、转移商品
 * */
//活动类型获取;
router.get('/activities/type',function(req, res){
    console.log('活动类型获取');
    res.sendFile('/activities/type.json', getOptions());
});

//商品单位获取;
router.get('/other/goods/units',function(req, res){
    console.log('商品单位获取');
    res.sendFile('/other/goods/units.json', getOptions());
});

//商品国别获取;
router.get('/other/goods/smuggles',function(req, res){
    console.log('商品国别获取');
    res.sendFile('/other/goods/smuggles.json', getOptions());
});

//商品图片删除;
router.post('/goods/picture/del',function(req, res){
    console.log('商品图片删除');
    res.sendFile('/goods/picture/del.json', getOptions());
});

//旧商品图片(包括检验报告)的获取;
router.get('/goods/picture/list',function(req, res){
    console.log('旧商品图片(包括检验报告)的获取');
    res.sendFile('/goods/picture/list.json', getOptions());
});

//检验报告图片删除;
router.post('/goods/inspection-report/picture/del',function(req, res){
    console.log('检验报告图片删除');
    res.sendFile('/goods/inspection-report/picture/del.json', getOptions());
});

//商品添加;
router.post('/goods/add',function(req, res){
    console.log('商品添加');
    res.sendFile('/goods/add.json', getOptions());
});

/*
* 普通商品
* */
//普通商品
router.get('/goods/ordinary/list',function(req, res){
    console.log('普通商品');
    res.sendFile('/goods/ordinary/list.json', getOptions());
});

//下架普通商品
router.post('/goods/ordinary/sold-out',function(req, res){
    console.log('下架普通商品');
    res.sendFile('/goods/ordinary/sold-out.json', getOptions());
});

//刷新普通商品价格
router.post('/goods/ordinary/price-refresh',function(req, res){
    console.log('刷新普通商品价格');
    res.sendFile('/goods/ordinary/price-refresh.json', getOptions());
});

//删除普通商品
router.post('/goods/ordinary/delete',function(req, res){
    console.log('删除普通商品');
    res.sendFile('/goods/ordinary/delete.json', getOptions());
});

//上架普通商品
router.post('/goods/ordinary/on-sale',function(req, res){
    console.log('上架普通商品');
    res.sendFile('/goods/ordinary/on-sale.json', getOptions());
});

//所在片区的发货市场获取
router.get('/shop/custom-area/shipment-market/list',function(req, res) {
    console.log('所在片区的发货市场获取');
    res.sendFile('/shop/custom-area/shipment-market/list.json', getOptions());
});

//恢复删除普通商品
router.post('/goods/ordinary/undelete',function(req, res){
    console.log('恢复删除普通商品');
    res.sendFile('/goods/ordinary/undelete.json', getOptions());
});

/*
 * 待审核商品
 * */
//有待审核商品的市场及店铺列表;
router.get('/shop/new-goods/market/list',function(req, res){
    console.log('有待审核商品的市场及店铺列表');
    res.sendFile('/shop/new-goods/market/list.json', getOptions());
});

//待审核商品列表
router.get('/goods/new-goods/list',function(req, res){
    console.log('待审核商品列表');
    res.sendFile('/goods/new-goods/list.json', getOptions());
});

//审核通过(通过)
router.post('/goods/audit/pass',function(req, res){
    console.log('审核通过(通过)');
    res.sendFile('/goods/audit/pass.json', getOptions());
});

//审核拒绝
router.post('/goods/audit/refused',function(req, res){
    console.log('审核拒绝');
    res.sendFile('/goods/audit/refused.json', getOptions());
});

/*
* 商品日志
* */
//商品历史价格日志列表
router.get('/goods/logs/list',function(req, res){
    console.log('商品历史价格日志列表');
    res.sendFile('/goods/logs/list.json', getOptions());
});

//商品历史价格日志列表
router.get('/goods/history-prices/list',function(req, res){
    console.log('商品历史价格日志列表');
    res.sendFile('/goods/history-prices/list.json', getOptions());
});

//商品详细信息获取
router.get('/goods/info',function(req, res){
    console.log('商品详细信息获取');
    res.sendFile('/goods/info.json', getOptions());
});

//商品修改
router.get('/goods/update',function(req, res){
    console.log('商品修改');
    res.sendFile('/goods/update.json', getOptions());
});

/**
 * 权重配置
 */
//获取权重的信息
router.get('/search/boost', function (req, res) {
    console.log('获取权重配置');
    res.sendFile('/search/boost.json', getOptions());
});

//发送权重配置的信息
router.post('/search/boost', function (req, res) {
    console.log('发送权重配置');
    res.sendFile('/search/search.json', getOptions());
});

/*
 * 商品词库管理;
 * */
//获取同义词的数据;
router.get('/search/synonym',function(req, res){
    res.sendFile('/search/synonym/synonym.txt', getOptions());
});

//获取自定义词库的数据;
router.get('/search/custom',function(req, res){
    res.sendFile('/search/custom/custom.txt', getOptions());
});

//更新搜索同义词;
router.post('/search/synonym/update',function(req, res){
    res.sendFile('/search/synonym/update.json', getOptions());
});

//更新搜索自定义词库;
router.post('/search/custom/update',function(req, res){
    res.sendFile('/search/custom/update.json', getOptions());
});

//更新索引;
router.post('/search/index/init',function(req, res){
    res.sendFile('/search/index/init.json', getOptions());
});

/**
 * 物流区域配置
 */
//不通过id获取当前所有的区域
router.get('/logistics/area/map', function (req, res) {
    res.sendFile('/logistic/area/area.json', getOptions());
});
//通过id获取当前所有的区域
router.get('/logistics/area/map/:id', function (req, res) {
    res.sendFile('/logistic/area/area.json', getOptions());
});
//通过id获取所有街道的信息
router.get('/logistics/area/street/:id', function (req, res) {
    res.sendFile('/logistic/area/street.json', getOptions());
});
//修改区街道的状态
router.post('/logistics/area/street/status', function (req, res) {
    res.sendFile('logistic/area/modify-state.json', getOptions());
});


/**
 * 运力管理
 */
// 获取所有的运力数据
router.get('/logistics/capacity/:display', function (req, res) {
    res.sendFile('logistic/capacity/list.json', getOptions());
});
// 修改运力数据
router.post('/logistics/capacity/update', function (req, res) {
    res.sendFile('logistic/capacity/modify.json', getOptions());
});
// 添加新运力
router.post('/logistics/capacity/add', function (req, res) {
    res.sendFile('logistic/capacity/add.json', getOptions());
});
// 删除运力信息
router.post('/logistics/capacity/delete', function (req, res) {
    res.sendFile('logistic/capacity/modify.json', getOptions());
});


/**
 * 司机信息
 */
// 获取所有的司机信息
router.get('/logistics/driver', function (req, res) {
    res.sendFile('logistic/driver/list.json', getOptions());
});
// 修改司机状态信息
router.post('/logistics/driver/status', function (req, res) {
    res.sendFile('logistic/driver/change.json', getOptions());
});
// 修改司机信息
router.post('/logistics/driver/update', function (req, res) {
    res.sendFile('logistic/driver/modify.json', getOptions());
});
// 删除司机信息
router.post('/logistics/driver/delete', function (req, res) {
    res.sendFile('logistic/driver/modify.json', getOptions());
});
// 获取当值司机的列表信息
router.get('/logistics/capacitys/available', function (req, res) {
    res.sendFile('logistic/driver/work.json', getOptions());
});


/**
 * 运单管理
 */
// 获取全部的运单信息
router.post('/logistics/delivery', function (req, res) {
    res.sendFile('logistic/bill/list.json', getOptions());
});
// 管理员作废运单
router.post('/logistics/delivery/cancel/:id', function (req, res) {
    res.sendFile('logistic/bill/cancel.json', getOptions());
});
// 获得当前选中的运单详情
router.get('/logistics/deliverys/:id', function (req, res) {
   res.sendFile('logistic/bill/current.json', getOptions());
});
// 更新运单详情
router.post('/logistics/delivery/update/:method/:id', function (req, res) {
    res.sendFile('logistic/bill/cancel.json', getOptions());
});
// 收揽运单
router.post('/logistics/delivery/received/:id', function (req, res) {
    res.sendFile('logistic/bill/cancel.json', getOptions());
});


/**
 * 实时运单状态
 */
// 实时运单状态列表
router.get('/logistics/intime', function (req, res) {
    res.sendFile('logistic/bill/intimeList.json', getOptions());
});
router.get('/logistics/intime/:id', function (req, res) {
    res.sendFile('logistic/bill/intimeDetail.json', getOptions());
});


/**
 * 调度分配
 */
// 获取当日的运单统计数据
router.get('/logistics/delivery/statics', function (req, res) {
    res.sendFile('logistic/bill/statics.json', getOptions());
});
// 获取当日的运单列表坐标集合
router.get('/logistics/delivery/points', function (req, res) {
    res.sendFile('logistic/bill/points.json', getOptions());
});
// 分配运单
router.post('/logistics/delivery/assign', function (req, res) {
    res.sendFile('logistic/bill/assign.json', getOptions());
});


/**
 * 录单
 */
// 搜索商家
router.get('/logistics/shop/search', function (req, res) {
    res.sendFile('logistic/add/shop-search.json', getOptions());
});
// 添加商家
router.post('/logistics/shop/sign', function (req, res) {
    res.sendFile('logistic/add/shop-add.json', getOptions());
});
// 生成地址
router.get('/logistics/shop/address/:id', function (req, res) {
    res.sendFile('logistic/add/custom-address.json', getOptions());
});
// 保存收货人
router.post('/logistics/shop/order/:id', function (req, res) {
    res.sendFile('logistic/add/custom.json', getOptions());
});
// 修改收货人地址
router.post('/logistics/shop/address/update/:id', function (req, res) {
    res.sendFile('logistic/add/custom.json', getOptions());
});
// 新增收货人地址
router.post('/logistics/shop/address/add/:id', function (req, res) {
    res.sendFile('logistic/add/custom.json', getOptions());
});



/**
 * 客户管理
 */
// 获取所有客户地址信息
router.get('/logistics/custom', function (req, res) {
    res.sendFile('logistic/customer/list.json', getOptions());
});
// 获取单个的客户地址
router.get('/logistics/custom/:id', function (req, res) {
    res.sendFile('logistic/customer/one.json', getOptions());
});
// 编辑用户地址
router.post('/logistics/custom/:id', function (req, res) {
    res.sendFile('logistic/customer/update.json', getOptions());
});


/**
 * 运费管理
 */
// 获得未付款的运费
router.get('/logistics/charge/unpaid', function (req, res) {
    res.sendFile('logistic/charge/unpay.json', getOptions());
});
// 获得已完成的运费
router.get('/logistics/charge/paid', function (req, res) {
    res.sendFile('logistic/charge/paid.json', getOptions());
});
// 获得已撤销的运费
router.get('/logistics/charge/canceled', function (req, res) {
    res.sendFile('logistic/charge/cancel.json', getOptions());
});
// 撤销运费
router.post('/logistics/charge/cancel/:id', function (req, res) {
    res.sendFile('logistic/charge/status.json', getOptions());
});
// 确定实收费用
router.post('/logistics/charge/create', function (req, res) {
    res.sendFile('logistic/charge/status.json', getOptions());
});
// 发送短信验证码
router.post('/verify/mobile', function (req, res) {
    res.sendFile('logistic/charge/status.json', getOptions());
});
// 作废（免单）
router.post('/logistics/charge/free', function (req, res) {
    res.sendFile('logistic/charge/status.json', getOptions());
});

/**
 * 地图通用
 */
// 地点搜索
router.post('/map/search/hint', function (req, res) {
    res.sendFile('logistic/map/text.json', getOptions());
});
// 通过经纬度获取地理位置
router.post('/map/geocode/regeo', function (req, res) {
    res.sendFile('logistic/full-address.json', getOptions());
});

module.exports = router;
