/**
 * Created by Administrator on 2016/2/1.
 * 时间搜索栏
 */

import React from 'react';
import DropDown from '../drop_down/drop-down.js';
import ChooseTime from '../choose_time/choose-time.js';
import Btn from '../btn/btn.js';

/*时间搜索栏;*/
class TimeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selVal:0
        }
    }

    changeHandlerStart(time) {  /*从子组件传过来的开始时间;*/
        //this.setState({startTime: time});
        var str = this.props.prefix ? this.props.prefix : "";
        var endTimeVal = $("#"+str+"endTime").val();
        if(time > endTimeVal){
            return false;
        }else {
            return true;
        }
    }

    changeHandlerEnd(time) {  /*从子组件传过来的结束时间;*/
        //this.setState({endTime: time});
        var str = this.props.prefix ? this.props.prefix : "";
        var startTimeVal = $("#"+str+"startTime").val();
        if(startTimeVal > time){
            return false;
        }else {
            return true;
        }
    }

    backSelVal(val) {
        this.setState({selVal:val},function () {
            //alert(val);
        });
    }

    searchSub(e) {
        e.preventDefault();
        var selVal = this.state.selVal;
        this.props.emit && this.props.emit(selVal);
    }

    render() {
        return (
            <div>
                <DropDown dropdownData={this.props.dropdownMenus} changeEv={this.backSelVal} selectVal={this.state.selVal} />
                <ChooseTime changeHandler={this.changeHandlerStart} num="7" id={(this.props.prefix?this.props.prefix:"")+"startTime"} />—
                <ChooseTime changeHandler={this.changeHandlerEnd} num="0" id={(this.props.prefix?this.props.prefix:"")+"endTime"} />
                <Btn name="筛选" btnEvent={this.searchSub} />
            </div>
        )
    }
}

export default TimeSearch;