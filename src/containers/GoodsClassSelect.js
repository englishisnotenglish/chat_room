import React from 'react';

/*
* props参数说明:
* data: {}       所有分类数据,
* _dataArr: []   如果是修改时，原来的所属分类数组,
* setTypeId: fn  设置选择的分类Id,
* typeId: 当前分类最低级的ID;
* disabled: 布尔  select是否可用;
* showAll: 布尔   是否全部显示select值,每层的值为非0;
* */

class GoodsClassSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeArr: null   //添加分类时选择父级分类;
        };
        this.createSelect = this.createSelect.bind(this);
        this.changeClassAll = this.changeClassAll.bind(this);
        this.createArr = this.createArr.bind(this);
    }

    componentWillMount() {
        if(this.props.typeId && this.props.typeId != 1) {
            this.createArr();
        }else {
            if(this.props._dataArr) {
                this.setState({typeArr: this.props._dataArr}, () => {
                    if(this.props.showAll) {
                        this.changeClassAll();
                    }
                });
            }else {
                if(this.props.showAll) {
                    this.changeClassAll();
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps._dataArr) {
            this.setState({typeArr: this.props._dataArr});
        }
    }

    //选择父级分类时的change事件（仅子级联动）;
    changeClass(index, e) {
        let arr = this.state.typeArr || [],
            data = this.props.data;
        if(e.target.value && e.target.value != 0) {
            arr[index] = e.target.value;
            for(let i = 0 ; i <= index ; i++) {
                data = data[arr[i]];
                if(Object.keys(data).length > 2) {   //如果长度大于2表示有多子级;
                    if(i == arr.length-1 && arr[arr.length-1] != 0) {
                        arr.push(0);
                        break;
                    }
                }else {
                    let ARR = [];
                    for(let i in arr) {
                        if(i <= index) {
                            ARR.push(arr[i]);
                        }else {
                            break;
                        }
                    }
                    arr = ARR;
                    break;
                }
            }
        }else {
            let ARR = [];
            for(let i in arr) {
                if(i < index) {
                    ARR.push(arr[i]);
                }else if(i == index) {
                    ARR.push(0);
                }else {
                    break;
                }
            }
            arr = ARR;
        }
        this.setState({typeArr: arr});
        let typeId = this.props.typeId;
        if(arr.length > 1 && arr[arr.length-1] == 0) {
            typeId = arr[arr.length-2];
        }else {
            typeId = arr[arr.length-1];
        }
        this.props.setTypeId(typeId);
    }

    //select选择时change事件（全部联动）;
    changeClassAll(index, e) {
        let arr = this.state.typeArr || [],
            data = this.props.data,
            ARR = [];

        if(index) {
            arr[index] = e.target.value;
            for(let i = 0 ; i <= index ; i++) {
                data = data[arr[i]];
                ARR.push(arr[i]);
            }
        }
        for(let k in data) {
            if(typeof data[k] == 'object') {
                data = data[k];
                ARR.push(k);
                for(let n in data) {
                    if(typeof data[n] == 'object') {
                        data = data[n];
                        ARR.push(n);
                        for(let m in data) {
                            if(typeof data[m] == 'object') {
                                data = data[m];
                                ARR.push(m);
                                for(let l in data) {
                                    if(typeof data[l] == 'object') {
                                        data = data[l];
                                        ARR.push(l);
                                        for(let o in data) {
                                            if(typeof data[o] == 'object') {
                                                data = data[o];
                                                ARR.push(o);
                                                for(let p in data) {
                                                    if(typeof data[p] == 'object') {
                                                        data = data[p];
                                                        ARR.push(p);
                                                    }
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            break;
        }
        arr = ARR;
        this.setState({typeArr: arr});
        this.props.setTypeId(arr[arr.length-1]);
    }

    createArr() {
        let data = this.props.data,
            typeId = this.props.typeId;
        for(let i in data) {  //第一级;
            let data1 = data[i];
            for(let n in data1) {   //第二级;
                if(typeof data1[n] === 'object') {
                    let data2 = data1[n];
                    for(let m in data2) {   //第三级;
                        if(typeof data2[m] === 'object') {
                            let data3 = data2[m];
                            for(let k in data3) {
                                if(typeof data3[k] === 'object') {
                                    let data4 = data3[k];
                                    for(let j in data4) {
                                        if(typeof data4[j] === 'object') {
                                            let data5 = data4[j];
                                            for(let l in data5) {
                                                if(typeof data5[l] === 'object') {
                                                    let idArr = [i, n, m, k, j, l];
                                                    if(data5[l].type_id == typeId) {
                                                        this.setState({typeArr: idArr});
                                                        return;
                                                    }
                                                }
                                            }
                                            let idArr = [i, n, m, k, j];
                                            if(data4[j].type_id == typeId) {
                                                this.setState({typeArr: idArr});
                                                return;
                                            }
                                        }
                                    }
                                    let idArr = [i, n, m, k];
                                    if(data3[k].type_id == typeId) {
                                        this.setState({typeArr: idArr});
                                        return;
                                    }
                                }
                            }
                            let idArr = [i, n, m];
                            if(data2[m].type_id == typeId) {
                                this.setState({typeArr: idArr});
                                return;
                            }
                        }
                    }
                    let idArr = [i, n];
                    if(data1[n].type_id == typeId) {
                        this.setState({typeArr: idArr});
                        return;
                    }
                }
            }
            let idArr = [i];
            if(data[i].type_id == typeId) {
                this.setState({typeArr: idArr});
                return;
            }
        }
    }

    createSelect() {
        let data = this.props.data,
            typeArr = this.state.typeArr || [0],
            XML = [];
        if(!data) return XML;
        let levelData = data;
        for(let i in typeArr) {
            let itemXml = [];
            for(let n in levelData) {
                if(typeof levelData[n] === 'object') {
                    itemXml.push(<option key={levelData[n].type_id+'_'+i} value={levelData[n].type_id}>{levelData[n].type_name}</option>);
                }
            }
            if(levelData[typeArr[i]]) {
                levelData = levelData[typeArr[i]];
            }
            XML.push(
                <div className="form-group" key={typeArr[i]}>
                    {
                        this.props.showAll ?
                            <select value={typeArr[i] == 0 ? 0 : typeArr[i]} className="form-control" onChange={this.changeClassAll.bind(this, i)} disabled={this.props.disabled ? true : false}>
                                {itemXml}
                            </select> :
                            <select value={typeArr[i] == 0 ? 0 : typeArr[i]} className="form-control" onChange={this.changeClass.bind(this, i)} disabled={this.props.disabled ? true : false}>
                                <option value="0">选择...</option>
                                {itemXml}
                            </select>
                    }
                </div>
            );
        }
        return XML;
    }

    render() {
        return (
            <div className="form-group select-goods-type">
                {this.createSelect()}
            </div>
        );
    }
}

export default GoodsClassSelect;