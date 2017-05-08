/**
 * Created by Administrator on 2016/2/1.
 *
 *
 *
 */

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};

import React from 'react';

/*选择时间H5的input[type=date];*/
class ChooseTime extends React.Component {
    constructor(props) {
        super(props);
        var val = this.addDate(new Date(),-parseInt(this.props.num));
        var d = new Date();
        var m=d.getMonth()+1;
        m = m>10?m:("0"+m);
        var month = d.getFullYear()+"-"+m+"-01";
        //if(this.props.num==7){
        //    $("#"+this.props.id).val(this.nowTime(new Date(val)));
        //}else {
        //    $("#"+this.props.id).val(this.nowTime(new Date(month)));
        //}
        this.state = {
            val: val,
            date: month,
            format: "YYYY-MM-DD",
            inputFormat: "YYYY-MM-DD",
            mode: "date"
        }
    }

    addDate(date,days) {
        var d=new Date(date);
        d.setDate(d.getDate()+days);
        var m=d.getMonth()+1;
        m = m>10?m:("0"+m);
        var day = d.getDate();
        day = day>10?day:("0"+day);
        return d.getFullYear()+'-'+m+'-'+day;
    }

    nowTime(now) {
        return now.format("yyyy-MM-dd hh:mm:ss");
    }

    change() {
        var val = this.refs.timeNode.value;
        var isTrue = this.props.changeHandler && this.props.changeHandler(val);
        var _val = this.state.val;
        var _this = this;
        if(!isTrue){
            H.Modal({
                content: "结束时间不能小于开始时间",
                okCallback: function(){
                    $("#"+_this.props.id).val(_val);
                }
            });
            this.setState({val: _val});
        }else {
            this.setState({val: val});
        }
    }

    render () {
        return (
            <input className="form-control"
                   id={this.props.id}
                   type="date" onChange={this.change}
                   defaultValue={this.state.val}
                   data-val={this.state.val}
                   ref="timeNode"
            />
        );
    }
}

export default ChooseTime;