import React from 'react';
import Table from '../../components/Table/table.jsx';
import BtnGroup from '../../components/btn-group/btn_group.jsx';
import Search from '../../components/search/search.js';
import Paging from '../../components/page/paging.js';
import GoodsClassTree from '../GoodsClassManagement/GoodsClassTree.js';
import GoodsInfoCtrl from '../GoodsInfo/GoodsInfoCtrl.js';

class GeneralGoods extends React.Component{
    constructor(){
        super();
        this.state = {
            areaList: [],
            currentArea: 2,
            units: [],
            currentUnit: -1,
            goodsList: [],
            markets: [],
            currentMarket: 0,
            on_sale_status: 0,
            audit_status: 2,
            typeList: [],
            typeID: 0,
            priceStatus: 0,
            currentPage: 1,
            queryBy: '',  //根据什么查询
            total: 0,  //搜素的出来的结果
            xml: [],   //cookie的xml
            count: 0,  //为了刷新下面的Paging
            select: '',
            aesc: false, //排序的方式 默认降序
            panel: '',    //显示详情页面
            keyWords: ''  //关键字
        };

        this.getSupplierInfo = this.getSupplierInfo.bind(this);
        this.getGoodsList = this.getGoodsList.bind(this);
        this.operate = this.operate.bind(this);
        this.order = this.order.bind(this);
        this.updateGoodsClass = this.updateGoodsClass.bind(this);
        this.search = this.search.bind(this);
        this.updateCookie = this.updateCookie.bind(this);
        this.closePanel = this.closePanel.bind(this);
        this.hover = this.hover.bind(this);
    }

    static defaultProps = {
        size: 30
    };

    //初始化获取数据
    componentWillMount(){
        let state = this.state;
        H.server.other_customArea_list({}, (res) => {
            if(res.code == 0){
                this.setState({
                    areaList : res.data,
                    currentArea : res.data[0].area_id
                });
                H.server.shop_customArea_shipmentMarket_list({custom_area_id: state.currentArea}, (res) => {
                    if(res.code == 0){
                        this.setState({
                            markets : res.data
                        });
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
                H.server.goods_type_list({area_id: state.currentArea}, (res) => {
                    if(res.code == 0){
                        this.setState({
                            typeList: res.data,
                            typeID: res.data[1].type_id
                        }, this.getGoodsList);
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });

        H.server.other_goods_units({}, (res) => {
            if(res.code == 0){
                this.setState({
                    units : res.data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    componentDidMount(){
        let cookie = {
            'goods_name': [],
            'supplier_name': [],
            'brand': []
        };
        if(!H.cookie.getCookie('keywords')){
            H.cookie.setCookie('keywords', JSON.stringify(cookie), 7*24);
        }
    }

    //创建区域栏
    createArea(){
        let btnNames = [],
            bindData = [];
        this.state.areaList.map((area) => {
            btnNames.push(area.area_name);
            bindData.push(area.area_id);
        });
        return(
            <BtnGroup btnNames={btnNames} bindData={bindData} clickCallback={this.toggleArea.bind(this)}
                      style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentArea}/>
        );
    }

    //创建搜索条
    createSearchBar(){
        let cookie = JSON.parse(H.cookie.getCookie('keywords')),
            content = null,
            state = this.state;
        if(state.xml.length){
            return (
                <div className="search-bar">
                    <Search dropdownMenus={['商品', '供应商', '品牌']} emit={this.search} onChange={this.updateCookie}/>
                    <p style={{display: 'inline-block', color: 'gray', marginTop: '5px', whiteSpace: 'nowrap'}}>搜索历史：{state.xml}</p>
                    <btn className="btn btn-xs right" onClick={this.refresh.bind(this)}>刷新</btn>
                </div>
            );
        }
        if (cookie) {
            state.xml = [];
            content = cookie.goods_name;
            content.map((content, index) => {
                state.xml.push(<span style={{cursor: 'pointer', color: '#337ab7', textDecoration: 'underline', marginRight: '10px'}} key={index} data-val={'0'} data-query={'goods_name'} data-keywords={content}
                                     onClick= {this.getCookieResult.bind(this)}>{content}</span>);
            });
        }
        return (
            <div className="search-bar">
                <Search dropdownMenus={['商品', '供应商', '品牌']} emit={this.search}/>
                <p style={{display: 'inline-block', color: 'gray', marginTop: '5px', whiteSpace: 'nowrap'}}>搜索历史：{state.xml}</p>
                <btn className="btn btn-xs right" onClick={this.refresh.bind(this)} >刷新</btn>
            </div>
        );
    }

    //创建选择区域
    createSelectArea(){
        let units = ['全部'],
            unitsData = [-1],
            audit = ['全部', '已审核', '已删除'],
            audit_status = [0, 2, 4],
            markets = ['全部'],
            marketsData = [0],
            price = ['全部', '未过期', '已过期'],
            priceData = [0, 1, 2],
            on_sale = ['全部', '下架', '上架'],
            on_sale_status = [0, 1, 2];

        this.state.units.map((unit) => {
            units.push(unit.name);
            unitsData.push(unit.id);
        });

        this.state.markets.map((market) => {
            markets.push(market.market_name);
            marketsData.push(market.market_id);
        });

        return(
            <div className="section-filter" style={{paddingTop: 0}}>
                <form className="form-inline">
                    <div className="filter-row">
                        {this.createSearchBar()}
                    </div>
                </form>
                <div className="row">
                    <form className="form-inline col-lg-6">
                        <div className="filter-row">

                            <label style={{display: 'inline-block', width: '5em'}}>发货点：</label>
                            <BtnGroup btnNames={markets} bindData={marketsData} clickCallback={this.toggleMarket.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.currentMarket}/>
                        </div>
                    </form>
                    <form className="form-inline col-lg-6">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '5em'}}>上下架：</label>
                            <BtnGroup btnNames={on_sale} bindData={on_sale_status} clickCallback={this.toggleOnSale.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.on_sale_status}/>
                        </div>
                    </form>
                    <form className="form-inline col-lg-6">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '5em'}}>审核：</label>
                            <BtnGroup btnNames={audit} bindData={audit_status} clickCallback={this.toggleAudit.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.audit_status}/>
                        </div>
                    </form>
                    <form className="form-inline col-lg-6">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '5em'}}>价格状态：</label>
                            <BtnGroup btnNames={price} bindData={priceData} clickCallback={this.togglePriceStatus.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.priceStatus}/>
                        </div>
                    </form>
                    <form className="form-inline col-lg-6">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '5em'}}>单位：</label>
                            <BtnGroup btnNames={units} bindData={unitsData} clickCallback={this.toggleUnit.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.currentUnit}/>
                        </div>
                    </form>
                    <div className="col-lg-6">
                        <a className="btn btn-lg btn-orange" style={{float: 'right'}} onClick={this.getGoodsList.bind(this, 1)}>筛选</a>
                    </div>
                </div>
            </div>
        );
    }

    //创建表格
    createTable(){
        let headlines = ['商品ID', '分类', '供应商', '品名', '单价', '单位', '市场', '价格更新时间', '价格状态', '上下架', '审核', '操作'],
            order = ['goods_id', 'goods_type_name', 'supplier_name', 'goods_name', 'price', 'unit', 'market', 'price_updated_at', 'price_status', 'on_sale_status', 'audit_status', 'operate'],
            status = {
                8:{
                    1: '未过期',
                    2: '已过期'
                },
                9: {
                    1: '下架',
                    2: '上架'
                },
                10:{
                    2: '已审核',
                    4: '已删除'
                }
            },
            statusOperate = {
            },
            fn = {
                2: this.getSupplierInfo,
                3: this.hover,
                11: this.operate
            },
            headOperate = {
                0: this.order,
                4: this.order,
                7: this.order
            },
            headStyle = 'glyphicon sort-icon';
        let goodsList = this.state.goodsList;
        goodsList.map((goods, index) => {
            goods.operate = index;
            statusOperate[index] = ['详情'];
            if(goods.audit_status == 2){
                statusOperate[index].push('删除');
            }else{
                statusOperate[index].push('恢复');
            }
            if(goods.price_status == 2){
                statusOperate[index].push('刷新价格');
            }
            if(goods.on_sale_status == 1){
                statusOperate[index].push('上架');
            }else {
                statusOperate[index].push('下架');
            }
        });
        return(
            <Table values={this.state.goodsList} headlines={headlines} order={order} bodyOperate={fn} id={'general_goods'}
                   statusOperate={statusOperate} status={status} headOperate={headOperate} headStyle={headStyle}/>
        );
    }

    //获得供应商的信息
    getSupplierInfo(e){
        let index = e.target.dataset.index;
        H.server.goods_shop_info({shop_id: this.state.goodsList[index].supplier_id}, (res) => {
            if(res.code == 0){
                let data = res.data;
                H.Modal({
                    title: '供应商信息',
                    width: '450',
                    height: '550',
                    content: '<p>供应商：'+ data.shop_name +'</p>'+
                    '<p>市场：'+ data.market_name +'</p>'+
                    '<p>接单电话：'+ data.order_receive_tel +'</p>'+
                    '<p>老板电话：'+ data.boos_tel+'</p>'+
                    '<p>主营业务：'+ data.business_types+'</p>'+
                    '<p>详细地址：'+ data.shop_address+'</p>',
                    okText: '关闭'
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    closePanel() {
        this.setState({panel: ''});
    }

    //操作
    operate(e){
        let html = $(e.target).html(),
            index = e.target.parentNode.dataset.index;
        let goodsItem = this.state.goodsList[index];
        switch(html){
            case '详情':
                this.setState({
                    panel: <GoodsInfoCtrl closePanel={this.closePanel} goodsId={this.state.goodsList[index].goods_id} areaId={this.state.currentArea} getGoodsList={this.getGoodsList}/>
                });
                break;

            case '刷新价格':
                H.Modal({
                    title: '确认刷新商品',
                    content: '<p>确定要刷新该商品吗，刷新之后若要恢复请联系管理员</p>',
                    okText: '确定',
                    cancel: true,
                    okCallback: () => {
                        H.server.goods_ordinary_priceRefresh({goods_id: this.state.goodsList[index].goods_id}, (res) => {
                            if(res.code == 0){
                                this.getGoodsList();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;

            case '恢复':
                H.Modal({
                    title: '确认恢复商品',
                    content: '<p>确定要恢复该商品吗，恢复之后若要恢复请联系管理员</p>',
                    okText: '确定',
                    cancel: true,
                    okCallback: () => {
                        H.server.goods_ordinary_undelete({goods_id: this.state.goodsList[index].goods_id}, (res) => {
                            if(res.code == 0){
                                this.getGoodsList();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;

            case '上架':
                H.Modal({
                    title: '确认上架商品',
                    content: '<p>确定要上架该商品吗，上架之后若要恢复请联系管理员</p>',
                    okText: '确定',
                    cancel: true,
                    okCallback: () => {
                        H.server.goods_ordinary_onSale({goods_id: this.state.goodsList[index].goods_id}, (res) => {
                            if(res.code == 0){
                                this.getGoodsList();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;

            case '下架':
                let soldOutModal = H.Modal({
                    title: '下架',
                    width: '500',
                    content: '<p><label style="display: inline-block;width: 75px">品名：</label>'+goodsItem.goods_name+'</p>' +
                    '<p><label style="display: inline-block;width: 75px">供应商：</label>'+goodsItem.supplier_name+'</p>'+
                    '<p><label style="display: inline-block;width: 75px">下架原因：</label>' +
                    '<select value="商品照片模糊不清，请重新拍照上传" class="form-control" style="width: 350px;display: inline;" id="audit_refused_choose">' +
                    '<option value="商品照片模糊不清，请重新拍照上传">商品照片模糊不清，请重新拍照上传</option>' +
                    '<option value="商品照片不符合规范要求，请阅读《找冻品网商品规范书》后重新上传照片">商品照片不符合规范要求，请阅读《找冻品网商品规范书》后重新上传照片</option>' +
                    '<option value="图片与商品信息不符">图片与商品信息不符</option>' +
                    '<option value="缺少明显“清真”标记的照片">缺少明显“清真”标记的照片</option>' +
                    '<option value="抄码商品的重量和金额必须填最大值，不能按公斤报价">抄码商品的重量和金额必须填最大值，不能按公斤报价</option>' +
                    '<option value="商品重量错误">商品重量错误</option>' +
                    '<option value="商品产地信息错误">商品产地信息错误</option>' +
                    '<option value="商品优势描述不符合要求，请阅读《找冻品网商品规范书》后修改">商品优势描述不符合要求，请阅读《找冻品网商品规范书》后修改</option>' +
                    '<option value="检验报告不符合要求">检验报告不符合要求</option>' +
                    '<option value="0">其它自定义填写</option>' +
                    '</select></p><div><label style="display: inline-block;width: 75px"></label>' +
                    '<textarea id="refused_why" placeholder="请输入下架原因" style="width: 350px;height: 100px;display: none;border: 1px solid #ccc;"></textarea></div>'+
                    '<div class="form-inline"><label style="display: inline-block;width: 75px">供应商：</label>' +
                    '<div class="form-group">' +'<label class="radio-inline"><input type="radio" value="0" checked name="refusedNotice" />不通知</label>'+
                    '<label class="radio-inline"><input type="radio" value="1" name="refusedNotice" />微信模板消息</label>' +
                    '<label class="radio-inline"><input type="radio" value="2" name="refusedNotice" />短信通知</label></div></div>',
                    okText: '确定',
                    cancel: true,
                    autoClose: false,
                    init: () => {
                        $('#audit_refused_choose').change(function() {
                            if($(this).val() == 0) {
                                $('#refused_why').show();
                            }else {
                                $('#refused_why').hide();
                            }
                        });
                    },
                    cancelCallback: () => {
                        soldOutModal.destroy();
                    },
                    okCallback: () => {
                        let val = $('#audit_refused_choose').val(),
                            refusedInfo = $('#refused_why').val();
                        if(val == 0 &&  refusedInfo== '') {
                            $('#refused_why').focus();
                            return;
                        }
                        let param = {
                            goods_id: goodsItem.goods_id,
                            sold_out_reason: val != 0 ? val : refusedInfo,
                            notify_way: $('input[name="refusedNotice"]:checked').val()
                        };
                        H.server.goods_ordinary_soldOut(param, (res) => {
                            if(res.code == 0){
                                soldOutModal.destroy();
                                this.getGoodsList();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;

            case '删除':
                let deleteModal = H.Modal({
                    title: '删除',
                    width: '500',
                    content: '<p><label style="display: inline-block;width: 75px">品名：</label>'+goodsItem.goods_name+'</p>' +
                    '<p><label style="display: inline-block;width: 75px">供应商：</label>'+goodsItem.supplier_name+'</p>'+
                    '<p><label style="display: inline-block;width: 75px">删除原因：</label>' +
                    '<select value="商品照片模糊不清，请重新拍照上传" class="form-control" style="width: 350px;display: inline;" id="audit_refused_choose">' +
                    '<option value="商品照片模糊不清，请重新拍照上传">商品照片模糊不清，请重新拍照上传</option>' +
                    '<option value="商品照片不符合规范要求，请阅读《找冻品网商品规范书》后重新上传照片">商品照片不符合规范要求，请阅读《找冻品网商品规范书》后重新上传照片</option>' +
                    '<option value="图片与商品信息不符">图片与商品信息不符</option>' +
                    '<option value="缺少明显“清真”标记的照片">缺少明显“清真”标记的照片</option>' +
                    '<option value="抄码商品的重量和金额必须填最大值，不能按公斤报价">抄码商品的重量和金额必须填最大值，不能按公斤报价</option>' +
                    '<option value="商品重量错误">商品重量错误</option>' +
                    '<option value="商品产地信息错误">商品产地信息错误</option>' +
                    '<option value="商品优势描述不符合要求，请阅读《找冻品网商品规范书》后修改">商品优势描述不符合要求，请阅读《找冻品网商品规范书》后修改</option>' +
                    '<option value="检验报告不符合要求">检验报告不符合要求</option>' +
                    '<option value="0">其它自定义填写</option>' +
                    '</select></p><div><label style="display: inline-block;width: 75px"></label>' +
                    '<textarea id="refused_why" placeholder="请输入下架原因" style="width: 350px;height: 100px;display: none;border: 1px solid #ccc;"></textarea></div>'+
                    '<div class="form-inline"><label style="display: inline-block;width: 75px">供应商：</label>' +
                    '<div class="form-group">' +'<label class="radio-inline"><input type="radio" value="0" checked name="refusedNotice" />不通知</label>'+
                    '<label class="radio-inline"><input type="radio" value="1" name="refusedNotice" />微信模板消息</label>' +
                    '<label class="radio-inline"><input type="radio" value="2" name="refusedNotice" />短信通知</label></div></div>',
                    okText: '确定',
                    cancel: true,
                    autoClose: false,
                    init: () => {
                        $('#audit_refused_choose').change(function() {
                            if($(this).val() == 0) {
                                $('#refused_why').show();
                            }else {
                                $('#refused_why').hide();
                            }
                        });
                    },
                    cancelCallback: () => {
                        deleteModal.destroy();
                    },
                    okCallback: () => {
                        let val = $('#audit_refused_choose').val(),
                            refusedInfo = $('#refused_why').val();
                        if(val == 0 &&  refusedInfo== '') {
                            $('#refused_why').focus();
                            return;
                        }
                        let param = {
                            goods_id: goodsItem.goods_id,
                            delete_reason: val != 0 ? val : refusedInfo,
                            notify_way: $('input[name="refusedNotice"]:checked').val()
                        };
                        H.server.goods_ordinary_delete(param, (res) => {
                            if(res.code == 0){
                                deleteModal.destroy();
                                this.getGoodsList();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
        }
    }

    //标题排序
    order(e){
        if(this.state.total == 0){
            return;
        }
        let index = e.target.parentNode.dataset.index,
            state = this.state,
            para = {
                area_id: state.currentArea,
                market_id: state.currentMarket,
                goods_type_id: state.typeID,
                audit_status: state.audit_status,
                on_sale_status: state.on_sale_status,
                unit: state.currentUnit,
                page: state.currentPage,
                price_status: state.priceStatus,
                size: this.props.size
            };
        if($('#component_search_input').val()){
            para.query_by = state.queryBy;
            para.key_words = state.keyWords;
            console.log(state.keyWords);
        }
        switch(index){
            case '0':
                para.order_by = 'goods_id';
                state.aesc = !state.aesc;
                para.aesc = Number(state.aesc);
                this.setGoodsList(para);
                break;
            case '4':
                para.order_by = 'price';
                state.aesc = !state.aesc;
                para.aesc = Number(state.aesc);
                this.setGoodsList(para);
                break;
            case '7':
                para.order_by = 'price_updated_at';
                state.aesc = !state.aesc;
                para.aesc = Number(state.aesc);
                this.setGoodsList(para);
                break;
        }
    }

    //切换地区
    toggleArea(e){
        let index = e.target.dataset.index;
        if(index == this.state.currentArea) return;
        this.state.count++;
        this.setState({
            currentArea: index,
            currentPage: 1
        }, ()=>{
            H.server.goods_type_list({area_id: this.state.currentArea}, (res) => {
                if(res.code == 0){
                    this.setState({
                        typeList: res.data,
                        goodsList: []
                    }, this.backToInit);
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        });
    }

    //切换市场
    toggleMarket(e){
        let index = e.target.dataset.index;
        this.state.count++;
        this.setState({
            currentMarket: index
        });
    }

    //切换上下架状态
    toggleOnSale(e){
        let index = e.target.dataset.index;
        this.state.count++;
        this.setState({
            on_sale_status: index
        });
    }

    //切换单位
    toggleUnit(e){
        let index = e.target.dataset.index;
        this.state.count++;
        this.setState({
            currentUnit: index
        });
    }

    //切换价格状态
    togglePriceStatus(e){
        let index = e.target.dataset.index;
        this.state.count++;
        this.setState({
            priceStatus: index
        });
    }

    //审核状态
    toggleAudit(e){
        let index = e.target.dataset.index;
        this.state.count++;
        this.setState({
            audit_status: index
        });
    }

    //获取typeID
    updateGoodsClass(id){
        this.state.typeID = id;
        this.state.count++;
        this.state.currentPage = 1;
        this.backToInit();
        this.getGoodsList();
    }

    //设置获取GoodList接口
    setGoodsList(para){
        H.server.goods_ordinary_list(para, (res) => {
            if(res.code == 0){
                this.setState({
                    goodsList: res.data.goods_lists,
                    total: res.data.total
                });
                setTimeout(()=>{
                    this.hover();
                }, 50);
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //得到商品列表
    getGoodsList(page){
        let state = this.state,
        para = {
            area_id: state.currentArea,
            market_id: state.currentMarket,
            goods_type_id: state.typeID,
            audit_status: state.audit_status,
            on_sale_status: state.on_sale_status,
            unit: state.currentUnit,
            price_status: state.priceStatus,
            page: page || state.currentPage,
            size: this.props.size
        };
        if(!para.goods_type_id || para.goods_type_id <= 0) {
            return;
        }
        if(page) state.count++;
        if(state.keyWords){
            para.query_by = state.queryBy;
            para.key_words = state.keyWords;
        }
        H.server.goods_ordinary_list(para, (res) => {
            if(res.code == 0){
                this.setState({
                    goodsList: res.data.goods_lists,
                    total: res.data.total
                });
                setTimeout(()=>{
                    this.hover();
                }, 50);
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //搜索按钮
    search(selVal, keyVal){
        let state = this.state,
            para = {},
            query = {
                0: 'goods_name',
                1: 'supplier_name',
                2: 'brand'
            },
            content = null;
        let cookie = JSON.parse(H.cookie.getCookie('keywords'));
        state.currentMarket = 0;
        state.audit_status = 0;
        state.on_sale_status = 0;
        state.currentUnit = -1;
        state.priceStatus = 0;
        para = {
            area_id: state.currentArea,
            market_id: state.currentMarket,
            goods_type_id: state.typeID,
            audit_status: state.audit_status,
            on_sale_status: state.on_sale_status,
            unit: state.currentUnit,
            page: 1,
            price_status: state.priceStatus,
            size: this.props.size
        };
        state.queryBy = query[selVal];
        state.keyWords = keyVal;
        para.query_by = query[selVal];
        para.key_words = keyVal;
        if(cookie[query[selVal]].length < 8){
            cookie[query[selVal]].unshift(keyVal);
        }else{
            cookie[query[selVal]].splice(6, 1);
            cookie[query[selVal]].unshift(keyVal);
        }
        H.cookie.setCookie('keywords', JSON.stringify(cookie), 7*24);

        //刷新cookie
        state.xml= [];
        content = cookie[query[selVal]];
        content.map((content, index) => {
            state.xml.push(<span  style={{cursor: 'pointer', color: '#337ab7', textDecoration: 'underline', marginRight: '10px'}} key={index} data-val={selVal} data-query={query[selVal]} data-keywords={content}
                                 onClick= {this.getCookieResult.bind(this)}>{content}</span>);
        });

        this.setGoodsList(para);
    }

    //更新搜索历史
    updateCookie(val){
        let state = this.state,
            query = {
                0: 'goods_name',
                1: 'supplier_name',
                2: 'brand'
            },
            content = null;
        let cookie = JSON.parse(H.cookie.getCookie('keywords'));
        state.queryBy = query[val];
        state.keyWords = $('#component_search_input').val();
        //刷新cookie
        state.xml= [];
        content = cookie[query[val]];
        content.map((content, index) => {
            state.xml.push(<span style={{cursor: 'pointer', color: '#337ab7', textDecoration: 'underline', marginRight: '10px'}} key={index} data-val={val} data-query={query[val]} data-keywords={content}
                                 onClick= {this.getCookieResult.bind(this)}>{content}</span>);
        });
        if(!content.length){
            state.xml.push(<span key={'default'}>{null}</span>);
        }
        this.setState({
            select: val
        });
    }

    getCookieResult(e){
        let state =this.state,
            target = e.target.dataset,
            para = {};
        state.currentMarket = 0;
        state.audit_status = 0;
        state.on_sale_status = 0;
        state.currentUnit = -1;
        state.priceStatus = 0;
        state.queryBy = target.query;
        state.keyWords = target.keywords;
        para = {
            area_id: state.currentArea,
            market_id: state.currentMarket,
            goods_type_id: state.typeID,
            audit_status: state.audit_status,
            on_sale_status: state.on_sale_status,
            unit: state.currentUnit,
            page: 1,
            price_status: state.priceStatus,
            size: this.props.size
        };
        para.query_by = state.queryBy;
        para.key_words = state.keyWords;
        $('#component_search_input').val(target.keywords);
        $('select[class="form-control"]').val(target.val);
        this.setGoodsList(para);
    }

    //设置page
    setPageNum(page){
        this.setState({
            currentPage: page.page
        }, this.getGoodsList);
    }

    //重回初始值;
    backToInit(){
        let state =this.state;
        state.currentMarket = 0;
        state.audit_status = 0;
        state.on_sale_status = 0;
        state.currentUnit = -1;
        state.priceStatus = 0;
        state.queryBy = '';
        state.keyWords = '';
        $('#component_search_input').val('');
        $('select[class="form-control"]').val('0');
    }

    //hover
    hover(){
        $('.GeneralGoods-operate3').off('hover');
        $('.GeneralGoods-operate3').hover((e) => {
            let target = e.target,
                index = e.target.dataset.index;
            $(target).append(
                '<div style="position: absolute; background-color: #fff; width: 200px; border: 1px solid #ccc; padding: 2px 5px; top: 20%; left: 100%; z-index: 9999" >' +
                    this.state.goodsList[index].title +
                '</div>');
        }, (e)=>{
            let target = e.target;
            $(target).find('div').remove();
        });
    }

    //刷新;
    refresh() {
        this.backToInit();
        this.getGoodsList();
    }

    render(){
        return(
            <div className="section-warp">
                <div className="section-table">
                    <div className="section-filter">
                        <form className="form-inline">
                            <div className="filter-row">
                                {this.createArea()}
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-3" style={{border: '1px solid #999'}}>
                        <GoodsClassTree data={this.state.typeList} updateGoodsClass={this.updateGoodsClass} goodsNumber={1} />
                    </div>

                    <div className="col-lg-9">
                        {this.createSelectArea()}
                        <p>当前结果：{this.state.total}种商品</p>
                        {this.createTable()}
                        <Paging key={this.state.count} maxPage={Math.ceil(this.state.total/this.props.size)} clickCallback={this.setPageNum.bind(this)} />
                    </div>
                    {this.state.panel}
                </div>
            </div>
        );
    }
}
export default GeneralGoods;