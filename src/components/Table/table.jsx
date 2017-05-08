import React from 'react';
import BtnGroup from './../btn-group/btn_group.jsx';
/*
* 带操作的表格
* values: []        //是一个对象数组
* headlines: []     //标题数组
* headStyle: ''     //头部样式
*
*  style: ''         //表格操作行样式
* bodyOperate: {    //需要填加操作的列
*   operate: fn
* }
* headOperate: {    //头部操作
*   operate: fn
* }
* order: []         //排序的顺序
* statusOperate:{   //一个状态操作表
*   status: []
* }
* status: {         //状态转换表
*   column: {}
* }
* operate:{         //对应的单列操作
*   column: []
* }
* */
/*let headlines = ['商品ID', '分类', '供应商', '品名', '标题', '单价', '单位', '市场', '价格更新时间', '状态', '操作'],
    order = ['goods_id', 'goods_type_name', 'supplier_name', 'goods_name', 'title', 'price', 'unit', 'market', 'price_updated_at', 'goods_status', 'goods_status'],
    status = {
        9: {
            1: '价格过期',
            2: '在售',
            3: '已下架',
            4: '已删除'
        }
    },
    statusOperate = {
        1: ['详细', '刷新价格', '下架', '删除'],
        2: ['详细', '下架', '删除'],
        3: ['详细', '上架', '删除'],
        4: ['详细', '恢复上架']
    },
    fn = {
        2: this.getSupplierInfo,
        10: this.operate
    },
    headOperate = {
        0: this.order,
        5: this.order,
        8: this.order
    },
    headStyle = 'glyphicon glyphicon-sort';
    let goodsList = this.state.goodsList;
    goodsList.map((goods) => {
        if(goods.price_status == 2){
            goods.goods_status = 1;
        }
    });
return(
    <Table values={this.state.goodsList} headlines={headlines} order={order} bodyOperate={fn}
           statusOperate={statusOperate} status={status} headOperate={headOperate} headStyle={headStyle}/>
);*/
class Table extends React.Component{

    constructor(){
        super();
    }

    static defaultProps = {
        status: {},
        statusOperate: {},
        headOperate: {},
        bodyOperate: {},
        style: '',
        headStyle: '',
        operate: {}
    };

    componentDidMount(){
        let bodyOperate = this.props.bodyOperate,
            id = this.props.id.split('_').join('-');
        for(let key in bodyOperate){
            $('#' + this.props.id + '_table').delegate('.'+ id + '-operate'+key, 'click', bodyOperate[key]);
        }
    }

    //创建表格标题
    createHead(){
        let headlines = this.props.headlines,
            headOperate = this.props.headOperate,
            headStyle = this.props.headStyle,
            len = headlines.length,
            head = new Array(len);
        for(var i=0; i<len; i++){
            head[i] = (
                    headOperate[i] === undefined ? <th key={i}>{headlines[i]}</th> :
                                                   <th key={i}><a href="javascript:;" data-index={i} onClick={headOperate[i]}>{headlines[i]}<span  className={headStyle} >{null}</span></a></th>
                );
        }
        return(
            <tr>
                {head}
            </tr>
        );
    }

    //创建表格内容
    createBody(){
        let values = this.props.values,
            len = this.props.values.length,
            objLen = this.props.headlines.length,
            order = this.props.order,
            bodyOperate = this.props.bodyOperate,
            status = this.props.status,
            style = this.props.style,
            statusOperate = this.props.statusOperate,
            rows = new Array(len),
            content = '',
            finalTag = '',
            statusOperateTemp = '',
            operate = this.props.operate,
            id = this.props.id.split('_').join('-');

        for(var i=0; i<len; i++){
            let value = values[i],
                row = new Array(objLen);
            for(var j=0; j<objLen; j++){
                statusOperateTemp = statusOperate[value[order[j]]];
                status[j] === undefined ? content = value[order[j]]:
                                          content = status[j][value[order[j]]];
                statusOperateTemp === undefined ? finalTag = <a href="javascript:;" className={id + '-operate'+j+' '+style} data-index={i}>{content}</a>:
                                                  finalTag = <BtnGroup style={style} btnNames={statusOperateTemp} identification={id + '-operate'+j} index={i}/>;
                if(operate[j] !== undefined)   finalTag = <BtnGroup style={style} btnNames={operate[j]} identification={id+'-operate'+j} index={i}/>;
                row[j] = (bodyOperate[j] === undefined ? <td key={j}>{content}</td> : <td key={j}>{finalTag}</td>);
            }
            rows[i] = (<tr key={i}>{row}</tr>);
        }
        return rows;
    }

    render(){
        return(
            <table className="table table-bordered table-hover table-responsive">
                <thead>
                    {this.createHead()}
                </thead>

                <tbody id={this.props.id + '_table'}>
                    {this.createBody()}
                </tbody>
            </table>
        );
    }
}
export default Table;