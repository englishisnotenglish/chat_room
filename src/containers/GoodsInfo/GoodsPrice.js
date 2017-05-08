import React from 'react';
import Table from '../../components/Table/table.jsx';
import Paging from '../../components/page/paging.js';
/*
 * 商品价格日志
 * goodsName: '',
 * goodsID: ''
 * */
class GoodsPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            size: 30,
            total: 0,
            logList: []
        };

        this.getList = this.getList.bind(this);
    }

    componentWillMount(){
        this.getList();
    }

    createTable(){
        let headlines = ['日期', '一口价'],
            order = ['change_time', 'goods_price'];
         return(
            <Table values={this.state.logList} headlines={headlines} order={order} id={'goods_price' + Math.random()} />
         );
    }

    setPageNum(page){
        this.setState({
            page: page.page
        }, this.getList);
    }

    getList(){
        let state = this.state,
            para = {
                goods_id: this.props.goodsID,
                page: state.page,
                size: state.size
            };
        H.server.goods_historyPrices_list(para, (res) => {
            if(res.code == 0){
                this.setState({
                    logList: res.data.logs,
                    total: res.data.total
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    render() {
        return (
            <div>
                <p>{this.props.goodsName}</p>
                {this.createTable()}
                <Paging maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)} />
            </div>
        );
    }
}
export default GoodsPrice;