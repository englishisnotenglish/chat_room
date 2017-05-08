/**
 * Created by Administrator on 2016/2/1.
 * 选择时间
 */

import React from 'react';
import DropDown from '../drop_down/drop-down.js';
import Btn from '../btn/btn.js';

/*关键字搜索栏*/
class KeySearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selVal: 0
        };

        this.backSelVal = this.backSelVal.bind(this);
        this.searchSub = this.searchSub.bind(this);
    }

    searchSub(e) {
        e.preventDefault();
        var keyVal = this.refs.key.value.split(' ').join('');
        if(keyVal == null || keyVal == undefined || keyVal == ""){
            H.Modal('搜索的关键词不能为空！');
            return ;
        }
        var selVal = this.state.selVal;
        this.props.emit && this.props.emit(selVal,keyVal);
    }

    backSelVal(val){
        this.props.onChange(val);
        this.setState({selVal:val});
        this.refs.key.value = '';

    }

    render() {
        return (
            <div className="search-w">
                <DropDown dropdownData={this.props.dropdownMenus} changeEv={this.backSelVal} selectVal={this.state.selVal} />
                <input id="component_search_input" className="form-control input-key" type="text" ref="key" />
                <Btn name="搜 索" btnEvent={this.searchSub} otherClass={'btn-sm'}/>
            </div>
        )
    }
}

export default KeySearch;