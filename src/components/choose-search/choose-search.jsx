/*
* 关联下拉选择搜索
*
* props参数说明：
* data: {} or []            //所有数据;  必须有
* keyArr: [1, 'name']          //取值的字段名; 可有
* diffArr: ['id', 'name']      //标识的字段名, [0]表示唯一标识，[1]文字; 必须有
* callback: fn              //回调;  必须有第一个参数下拉选项的ID，第二个参数下拉选项的文字内容（可选）;
* placeholder: '提示文字'   //placeholder属性;
* val: ''      //搜索输入框的值;
* */

//例子：
/*<ChooseSearch data={this.state.list} arr={['markets', 'shops']} diff={['shop_id', 'shop_name']} callback={this.props.callback} />*/

import React from 'react';

class ChooseSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ulStyleObj: {   //ul的样式;
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: '10',
                width: '100%',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                boxShadow: '0 5px 5px 2px rgba(0, 0, 0, 0.2)',
                maxHeight: '500px',
                overflowY: 'auto',
                paddingLeft: '12px',
                display: 'none'
            },
            val: '',  //input的值;
            data: []   //下拉框的列表数据;
        }
    }

    componentWillMount() {
        if(this.props.val != this.state.val) {
            this.setState({val: this.props.val});
        }
        document.addEventListener('click', function(e) {
            if(!e.target.dataset.choose) {
                $('.choose-search').hide();
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.val != this.state.val) {
            this.setState({val: nextProps.val});
        }
    }

    //设置下拉框的数据;
    setData(e) {
        let value = e.target.value,
            data = this.props.data,
            keyArr = this.props.keyArr,
            diffArr = this.props.diffArr,
            arr = [];
        if(value != '') {
            let v = H.trim(value);
            for(let i in data) {
                if(keyArr[0]) {
                    let d = data[i][keyArr[0]];
                    for(let k in d) {
                        if(keyArr[1]) {
                            let d1 = d[k][keyArr[1]];
                            for(let n in d1) {
                                if(d1[n][diffArr[1]].indexOf(v) != -1) {
                                    arr.push(d1[n]);
                                }
                            }
                        }else {
                            if(d[k][diffArr[1]].indexOf(v) != -1) {
                                arr.push(d[k]);
                            }
                        }
                    }
                }else {
                    if(data[i][diffArr[1]].indexOf(v) != -1) {
                        arr.push(data[i]);
                    }
                }
            }
            $('.choose-search').show();
        }
        this.setState({val: value, data: arr});
    }

    //选择的事件;
    chooseClick(e) {
        let shopId = e.target.dataset.choose,
            text = e.target.dataset.text;
        if(shopId) {
            this.props.callback && this.props.callback(shopId, text);
        }
        $('.choose-search').hide();
    }

    render() {
        return (
            <div className="form-control" style={{position: 'relative'}}>
                <input type="text" placeholder={this.props.placeholder || ''} style={{outline: 'none', width: '100%', border: 'none'}}
                       value={this.state.val} onChange={this.setData.bind(this)} onFocus={this.setData.bind(this)} data-choose="-1" />
                <ul className="choose-search" style={this.state.ulStyleObj} onClick={this.chooseClick.bind(this)}>
                    {
                        this.state.data.map((val, index) => {
                            return (
                                <li key={index} style={{lineHeight: '34px', cursor: 'pointer'}} data-choose={val[this.props.diffArr[0]]}
                                    data-text={val[this.props.diffArr[1]]}>{val[this.props.diffArr[1]]}</li>
                            );
                        })
                    }
                </ul>
                <i className="glyphicon search-icon"
                   style={{
                   position: 'absolute', right: '0', top: '0', color: '#ccc',
                   fontSize: '20px', lineHeight: '32px', width: '34px', textAlign: 'center', backgroundColor: '#fff'
                   }}>
                </i>
            </div>
        );
    }
}

export default ChooseSearch;