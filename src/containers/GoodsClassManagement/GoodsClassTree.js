/*
* 商品分类的树型结构*/
import React from 'react';

/*props参数说明：
* data => 商品分类的数据,
* updateGoodsClass => 点击分类执行的回调; 默认三个参数分别：点击的这个分类的ID、父级分类ID数组，是否有下级;
* goodsNumber => 是否显示每个分类下面的商品数量;
* */
class GoodsClassTree extends React.Component {
    constructor(props) {
        super(props);
    }

    CreateClass() {
        let data = this.props.data,
            XML = [];

        if(!data) return [];
        for(let i in data) {  //第一级;
            let oneXml = [],
                data1 = data[i],
                isHasChild1 = false;  //是否有子级;
            for(let n in data1) {   //第二级;
                if(typeof data1[n] === 'object') {
                    isHasChild1 = true;
                    let twoXml = [],
                        isHasChild2 = false,  //是否有子级;
                        data2 = data1[n];
                    for(let m in data2) {   //第三级;
                        if(typeof data2[m] === 'object') {
                            isHasChild2 = true;
                            let threeXml = [],
                                isHasChild3 = false,  //是否有子级;
                                data3 = data2[m];
                            for(let k in data3) {
                                if(typeof data3[k] === 'object') {
                                    isHasChild3 = true;
                                    let fourXml = [],
                                        isHasChild4 = false,  //是否有子级;
                                        data4 = data3[k];
                                    for(let j in data4) {
                                        if(typeof data4[j] === 'object') {
                                            isHasChild4 = true;
                                            let fiveXml = [],
                                                isHasChild5 = false,
                                                data5 = data4[j];
                                            for(let l in data5) {
                                                if(typeof data5[l] === 'object') {
                                                    isHasChild5 = true;
                                                    let idArr = [i, n, m, k, j];
                                                    fiveXml.push(this.itemXml(data5[l], false, [], idArr));
                                                }
                                            }
                                            let idArr = [i, n, m, k];
                                            fourXml.push(this.itemXml(data4[j], isHasChild5, fiveXml, idArr));
                                        }
                                    }
                                    let idArr = [i, n, m];
                                    threeXml.push(this.itemXml(data3[k], isHasChild4, fourXml, idArr));
                                }
                            }
                            let idArr = [i, n];
                            twoXml.push(this.itemXml(data2[m], isHasChild3, threeXml, idArr));
                        }
                    }
                    let idArr = [i];
                    oneXml.push(this.itemXml(data1[n], isHasChild2, twoXml, idArr));
                }
            }
            let idArr = [0];
            XML.push(this.itemXml(data[i], isHasChild1, oneXml, idArr, 1));
        }
        return (<ul className="goods-class-treeview" style={{margin: '0'}}>{XML}</ul>);
    }

    itemXml(obj, isHasChild, xml, arr, isTwo) {
        let goodsNum = '',
            toggleClassName = '';
        if(this.props.goodsNumber) {
            if(obj.goods_number > 0) {
                goodsNum = '('+obj.goods_number+')';
            }
        }
        if(isHasChild) {
            if(isTwo) {
                toggleClassName = 'toggle-open';
            }else {
                toggleClassName = 'toggle-close';
            }
        }

        return (
            <li key={obj.type_id} className={toggleClassName}>
                {isHasChild ? <div className={isHasChild ? 'cuttle-icon' : ''} onClick={this.handler.bind(this)}></div> : <div className="last-icon"></div>}
                <div className="goods-class-name" onClick={this.classClick.bind(this, obj.type_id, arr, isHasChild)}>{obj.type_name}{goodsNum}</div>
                {
                    this.props.sortState ?
                        <input type="text" defaultValue={obj.sort_value} className="class-sort" onChange={this.changeClassSort.bind(this, obj.type_id)}/> : ''
                }
                {
                    isHasChild ? <ul>{xml}</ul> : ''
                }
            </li>
        );
    }

    changeClassSort(typeId, e) {
        let val = e.target.value,
            obj = {
                type_id: typeId,
                sort_value: val
            };
        this.props.setTypeSortParam && this.props.setTypeSortParam(obj);
    }

    classClick(typeId, arr, isHasChild, e) {
        this.props.updateGoodsClass && this.props.updateGoodsClass(typeId, arr, isHasChild);
        $('.goods-class-name').removeClass('active');
        $(e.target.parentNode).addClass('active');
    }

    handler(e) {
        let parent = $(e.target).parent();
        if(parent.attr('class') === 'toggle-open') {
            parent.removeClass('toggle-open');
            parent.addClass('toggle-close');
        }else {
            parent.removeClass('toggle-close');
            parent.addClass('toggle-open');
        }
    }

    render() {
        return (
            <div className="goods-class-tree">
                {this.CreateClass()}
            </div>
        );
    }
}

export default GoodsClassTree;