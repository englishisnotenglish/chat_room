import React from 'react';
import Table from '../../components/Table/table.jsx';
import EditImage from './EditImage.js';
import GoodsInfoCtrl from '../GoodsInfo/GoodsInfoCtrl';
import BtnGroup from '../../components/btn-group/btn_group.jsx';

class GoodsTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopList: [],
            goodsList: [],
            status: 2,
            currentShop: '',
            panel : '',
            areaId: '',
            supplierName: '',
            areaList: [],    //大区数据;
            currentArea: ''  //当前大区ID;
        };

        this.updateGoods = this.updateGoods.bind(this);
        this.getGoodsList = this.getGoodsList.bind(this);
        this.setGoodsList = this.setGoodsList.bind(this);
        this.getSupplierInfo = this.getSupplierInfo.bind(this);
        this.shielding = this.shielding.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentWillMount(){
        H.server.other_customArea_list({}, (res) => {
            if(res.code == 0){
                this.state.areaList = res.data;
                this.state.currentArea = res.data[0].area_id;
                this.getShopList();
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

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

    //获得商铺列表
    createShopList(){
        let shopList = this.state.shopList,
            list = [];
        shopList.map((shop, index) => {
            list.push(<li key={index} style={this.state.currentShop == shop.shop_id ? {backgroundColor: '#28bb7f', color: '#fff'} : null}
                          data-index={index} className="list-group-item">{shop.shop_name + '(' + shop.shop_id + ')'+ '—' +shop.market_name}</li>);
        });

        return(
            <ul className="list-group-item shop-list" onClick={this.setGoodsList.bind(this)} >
                {list}
            </ul>
        );
    }

    createSelectArea(){
        let btnNames = ['在售', '已下架', '已删除'],
            bindData = [2, 3, 4];
        return(
            <BtnGroup btnNames={btnNames} bindData={bindData} clickCallback={this.toggleStatus.bind(this)}
                      style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.status}/>
        );
    }

    createTable(){
        let goodsList = this.state.goodsList,
            headlines = ['商品ID', '供应商', '商品名', '操作'],
            order = ['goods_id', 'supplier', 'goods_name'],
            bodyOperate = {
                1: this.getSupplierInfo,
                3: this.updateGoods
            },
            operate = {
                1: [this.state.supplierName],
                3: ['转移']
            };
        return(
            <Table key={this.state.status} values={goodsList} headlines={headlines} order={order} bodyOperate={bodyOperate} operate={operate} id={'goods_transfer'} />
        );
    }

    toggleArea(e) {
        let area_id = e.target.dataset.index;
        if(area_id == this.state.currentArea) return;
        this.setState({currentArea: area_id}, () => {
            this.getShopList();
        });
    }

    getShopList(){
        H.server.goods_transfer_shop_list({area_id: this.state.currentArea}, (res) => {
            if(res.code == 0){
                this.setState({
                    shopList: res.data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    toggleStatus(e){
        let state =  this.state;
        state.status = e.target.dataset.index;
        this.getGoodsList();
    }

    setGoodsList(e){
        let index = e.target.dataset.index,
            state= this.state;
        state.currentShop = this.state.shopList[index].shop_id;
        state.supplierName = this.state.shopList[index].shop_name;
        state.areaId = this.state.shopList[index].area_id;
        this.getGoodsList();
    }

    getGoodsList() {
        let para = {
            shop_id: this.state.currentShop,
            goods_status: this.state.status
        };
        H.server.goods_transfer_list(para, (res) => {
            if(res.code == 0){
                this.setState({
                    goodsList: res.data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //关闭商品详情页面;
    closePanel() {
        this.setState({panel: ''});
    }

    updateGoods(e){
        let panel = '',
            index = null;
        if(e.target) {
            index = e.target.dataset.index;
        }else {
            index = 2;
        }
        switch (index){
            case '1':
                let goodsId = this.state.goodsList[e.target.parentNode.dataset.index].goods_id;
                panel = (
                    <div className="transfer-goods" id="transfer_goods">
                        <GoodsInfoCtrl closePanel={this.closePanel.bind(this)} goodsId={goodsId} getGoodsList={this.getGoodsList} areaId={this.state.areaId}/>
                    </div>
                );
                break;
            case '2':
                if(this.state.status != 2){
                    this.shielding(e);
                }else{
                    this.delete(e);
                }
                break;
        }

        this.setState({
            panel: panel
        });
    }

    getSupplierInfo(){
        H.server.goods_shop_info({shop_id: this.state.currentShop}, (res) => {
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

    //屏蔽操作
    shielding(e){
        let goods_id = this.state.goodsList[e.target.parentNode.dataset.index].goods_id,
            para = {goods_id: goods_id};
        H.server.goods_transfer_shielding(JSON.stringify(para), (res) => {
            if(res.code == 0){
                this.getGoodsList();
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //删除操作
    delete(e){
        let goods_id = this.state.goodsList[e.target.parentNode.dataset.index].goods_id,
            para = {goods_id: goods_id};
        H.Modal({
            title: '确认删除商品',
            content: '<p>确定要删除该商品吗，删除之后若要恢复请联系管理员</p>',
            okText: '确定',
            cancel: true,
            okCallback: () => {
                H.server.goods_transfer_oldGoods_del(JSON.stringify(para), (res) => {
                    if(res.code == 0){
                        H.Modal('删除成功');
                        this.getGoodsList();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-table">
                    <div className="section-filter">
                        <form className="form-inline">
                            <div className="filter-row">
                                {this.createArea()}
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-3">
                        {this.createShopList()}
                    </div>

                    <div className="col-lg-9">
                        <div className="section-filter">
                            <div className="filter-row">
                                {this.createSelectArea()}
                            </div>
                        </div>
                        {this.createTable()}
                    </div>
                </div>
                {this.state.panel}
            </div>
        );
    }
}

export default GoodsTransfer;