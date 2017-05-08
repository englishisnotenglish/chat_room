/**
 * Created by Administrator on 2016/2/1.
 * 时间搜索栏
 */

import React from 'react';
import ChooseTime from '../choose_time/choose-time.js';
import Btn from '../btn/btn.js';

/*时间搜索栏;*/
class TimeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime:"2016-01-12T03:05",
            endTime:"2016-01-12T03:06"
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

    searchSub(e) {
        e.preventDefault();
        this.props.emit && this.props.emit();
    }

    render() {
        return (
            <div className="time-search-w" style={{display: "inline-block"}}>
                <ChooseTime changeHandler={this.changeHandlerStart} num="7" id={(this.props.prefix?this.props.prefix:"")+"startTime"} /><span className="separated">—</span>
                <ChooseTime changeHandler={this.changeHandlerEnd} num="0" id={(this.props.prefix?this.props.prefix:"")+"endTime"} />
                <Btn name="筛选" btnEvent={this.searchSub} />
            </div>
        )
    }
}

export default TimeSearch;
