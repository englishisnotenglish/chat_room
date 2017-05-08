import React from 'react';
import Table from '../../components/Table/table.jsx';
import Paging from '../../components/page/paging.js';

/*
* 商品日志
* goodsName: '',
* goodsID: ''
* */

class GoodsLog extends React.Component {
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
        let headlines = ['日期', '处理内容', '操作人'],
            order = ['operate_time', 'content', 'operator'],
            len  = this.state.logList.length,
            handledArr = [],
            logList = this.state.logList;
        let table = {
            1: '供应商',
            2: '管理员'
        };
        for(let i=0; i<len; i++){
            let obj = {},
                source = logList[i];
            obj.operate_time = source.operate_time;
            obj.content = source.type + ':' + (source.note ? source.note : '');
            obj.operator = table[source.identity] + '(' + source.user_name + ')';
            handledArr[i] = obj;
        }

        return(
            <Table values={handledArr} headlines={headlines} order={order} id={'goods_log' + Math.random()} />
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
        H.server.goods_logs_list(para, (res) => {
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
export default GoodsLog;