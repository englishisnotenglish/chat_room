/*
* 商品详情控制页面;
*
* props参数说明：
* closePanel: fn   //关闭商品信息的弹窗;
* goodsId:         //当前查看的这个商品的ID;
* getGoodsList:    //如果修改了商品信息之后重新获取商品列表;
* area:            //片区ID,商品信息用的获取分类会用到;
* */

import React from 'react';
import GoodsInfo from '../GoodsInfo.js';
import GoodsLogs from './GoodsLogs.js';
import GoodsPrice from './GoodsPrice.js';
import BtnGroup from '../../components/btn-group/btn_group.jsx';

class GoodsInfoCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelStatus: '0'    //0商品信息，1商品处理日志，2商品历史价格的页面状态;
        };
        this.createPanel = this.createPanel.bind(this);
    }

    setPanelStatus(e) {
        let status = e.target.dataset.index;
        this.setState({panelStatus: status});
    }

    createPanel() {
        let XML = '';
        switch (this.state.panelStatus) {
            case '0':    //商品信息;
                XML = (<GoodsInfo goodsId={this.props.goodsId} area={this.props.areaId} closePanel={this.props.closePanel} getGoodsList={this.props.getGoodsList} />);
                break;
            case '1':    //商品处理日志;
                XML = (<GoodsLogs goodsID={this.props.goodsId} />);
                break;
            case '2':    //商品历史价格;
                XML = (<GoodsPrice goodsID={this.props.goodsId} />);
                break;
        }
        return XML;
    }

    render() {
        return (
            <div className="goods-info-ctrl">
                <div className="goods-info container-fluid">
                    <h3 className="title">商品信息<button type="button" className="close" data-dismiss="modal" onClick={this.props.closePanel} style={{fontSize: '40px'}}>&times;</button></h3>
                    <div className="section-filter">
                        <div className="filter-row">
                            <BtnGroup btnNames={['商品信息', '商品处理日志', '商品历史价格']} bindData={[0, 1, 2]} clickCallback={this.setPanelStatus.bind(this)}
                                      style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.panelStatus}/>
                        </div>
                    </div>
                    <div className="goods-info-content">
                        {this.createPanel()}
                    </div>
                </div>
            </div>
        );
    }
}

export default GoodsInfoCtrl;