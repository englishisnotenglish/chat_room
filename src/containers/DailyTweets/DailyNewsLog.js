/*
* 推文日志*/

import React from 'react';

class DailyNewsLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,   //查询某月的推文发送日志;
            year: H.Date.getFullYear(),  //本年;
            month: H.Date.getMonth(), //本月;
            day: H.Date.getDate(), //当天;
            AreaData: null,  //当前地区;
            dateArr: []  //本月对应数组;
        };
        this.getData = this.getData.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }

    componentDidMount() {
        this.setState({AreaData: this.props.currentArea}, () =>{
            this.getData();
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentArea != this.state.AreaData) {
            this.setState({
                AreaData: nextProps.currentArea
            }, () => {
                this.getData();
            });
        }
    }

    getData() {
        let param = {
            area_id: this.state.AreaData.area_id,
            date: this.state.year + '-' + this.state.month
        };
        H.server.operate_dailyNews_log_list(param, (res) => {
            if(res.code == 0) {
                this.setState({data: res.data}, () => {
                    H.Calendar.init(this.state.year + '/' + this.state.month + '/' + this.state.day +' 00:00:00');
                    $('#calendar').html(H.Calendar.getCalendar(Object.keys(res.data)));
                    this.showInfo();
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });


    }

    showInfo() {
        let arr = $('#calendar .red_tbg'),
            _this = this;
        for(let i in arr) {
            arr.eq(i).hover(function(){
                let num = $(this).data('num'),
                    data = _this.state.data;
                $(this).find('.tbg_num').html('送达数量:' + data[num].delivery_number);
                $(this).find('.tbg_num').slideDown();
            }, function(){
                $(this).find('.tbg_num').html('');
                $(this).find('.tbg_num').slideUp();
            });
        }
    }

    //上一个月;
    prevMonth() {
        let data = H.Calendar.previousMonth();
        this.setState({
            year: data.year,
            month: data.month
        }, () => {
            this.getData();
        });
    }

    //下一个月;
    nextMonth() {
        if(this.state.year == H.Date.getFullYear() && this.state.month == H.Date.getMonth()) return;
        let data = H.Calendar.nextMonth();
        this.setState({
            year: data.year,
            month: data.month
        }, () => {
            this.getData();
        });
    }

    render() {
        return (
            <div className="section-table">
                <h4 className="calendar"><span className="prev-month" onClick={this.prevMonth.bind(this)}></span>
                    {this.state.year}年{this.state.month}月
                    <span
                        className={this.state.year == H.Date.getFullYear() && this.state.month == H.Date.getMonth() ? 'next-month disabled' : 'next-month'}
                        onClick={this.nextMonth.bind(this)}>
                    </span>
                </h4>
                <div id="calendar"></div>
            </div>
        );
    }
}

export default DailyNewsLog;