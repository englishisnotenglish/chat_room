import React from  'react';
/*
* 约束表
* handler: fn 返回值给控制页面
* values: {}  传入的数据
* rules: []   传入的规则
* num: int    标号
* */
class ConstraintForm extends React.Component{

    constructor(){
        super();
        this.state = {
            status: '1',
            values: null,
            xRule: 'string',
            yRule: 'string'
        };
    }

    componentWillMount(){
        if(!this.props.values) return;
        this.setState({
            status: this.props.values.format_type_id + '',
            values: this.props.values,
            rules: this.props.rules.verify_format,
            options: this.props.rules.input_format,
            xRule: !this.props.values.format_values[0] ? 'string' : this.props.values.format_values[0].rule,
            yRule: !this.props.values.format_values[1] ? 'string' : this.props.values.format_values[1].rule
        });
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.values) return;
        this.setState({
            status: nextProps.values.format_type_id + '',
            values: nextProps.values,
            rules: nextProps.rules.verify_format,
            options: nextProps.rules.input_format,
            xRule: !nextProps.values.format_values[0] ? 'string' : nextProps.values.format_values[0].rule,
            yRule: !nextProps.values.format_values[1] ? 'string' : nextProps.values.format_values[1].rule
        });
    }

    createOptions(){
        let options = [];
        this.state.options.map((option, index)=>{
            options.push(<option key={index} value={option.id}>{option.name}</option>);
        });
        return(
            <div className="form-inline">
                <label >格式：</label>
                <select onChange={this.toggleComponent.bind(this)} data-type="type_id" value={this.state.status} className="form-control">
                    {options}
                </select>
            </div>
        );
    }

    //创建按钮框
    createRadioBox(){
        let xml = [];
        this.state.values.format_values.map((format_value, index)=>{
            xml.push(
                <div  key={index} className="form-inline space">
                    <input  data-index={index} onChange={this.updateRadioBox.bind(this)} value={format_value.value} className="form-control"/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a onClick={this.deleteItem.bind(this, index)} href="javascript:;">
                        <i className="glyphicon glyphicon-minus"
                           style={{color:'white', borderRadius: '50%', backgroundColor: 'red', display: 'inline-block', width: '16px', height: '16px', paddingTop: '1px'}}>
                        </i>
                    </a>
                </div>
            );
        });
        return (
            <div>
                <br/><label style={{verticalAlign:'top'}}>{this.state.status == 2 ? '单选：' : '多选：'}</label>
                <div className="btn-group">
                    {xml}
                    <button className="btn btn-sm space" onClick={this.addRadio.bind(this)}>添加选项+</button>
                </div>
            </div>
        );
    }

    //创建输入框
    createInputBox(){
        let options = [];
        let input = '';
        let format_values =  this.state.values.format_values;
        if(this.state.xRule != 'string'){
            input =  <input className="form-control form-control-no-left" type="text" data-unit="left" style={{display: 'inline-block', width: '60px'}}
                            onChange={this.updateValue.bind(this)} value={!format_values[0] ? null : format_values[0].unit} />;
        }
        this.state.rules.map((rule, index) => {
            options.push(
                <option key={+new Date() + index} value={rule.rule}>{rule.name}</option>
            );
        });
        return(
            <div className="form-inline">
                <br/>
                <label>文本输入框：</label>
                <select data-rule="left" onChange={this.updateValue.bind(this)} value={this.state.xRule} className="form-control">
                    {options}
                </select>
                {input}
            </div>
        );
    }

    createXYRange(){
        let options = [];
        let format_values =  this.state.values.format_values;
        this.state.rules.map((rule, index) => {
            options.push(
                <option key={+new Date() + index} value={rule.rule}>{rule.name}</option>
            );
        });
        return(
            <div className="form-inline">
                <br/>
                <label>X-Y：</label>
                <select data-rule="left" onChange={this.updateValue.bind(this)} value={this.state.xRule} className="form-control form-control-no-left">
                    {options}
                </select>
                <input className="form-control form-control-no-left" type="text" data-unit="left" style={{display: 'inline-block', width: '60px'}}
                   onChange={this.updateValue.bind(this)} value={!format_values[0] ? null : format_values[0].unit} />
                —
                <select data-rule="right" onChange={this.updateValue.bind(this)} value={this.state.yRule} className="form-control form-control-no-left" >
                    {options}
                </select>
                <input className="form-control form-control-no-left" type="text" data-unit="right" style={{display: 'inline-block', width: '60px'}}
                       value={!format_values[1] ? null : format_values[1].unit}  onChange={this.updateValue.bind(this)} />
            </div>
        );
    }

    createXY(){
        let options = [];
        let format_values =  this.state.values.format_values;
        this.state.rules.map((rule, index) => {
            options.push(
                <option key={+new Date() + index} value={rule.rule}>{rule.name}</option>
            );
        });
        return(
            <div className="form-inline">
                <br/>
                <label>X*Y：</label>
                <select data-rule="left" onChange={this.updateValue.bind(this)} value={this.state.xRule} className="form-control form-control-no-left">
                    {options}
                </select>
                <input type="text" data-unit="left" style={{display: 'inline-block', width: '60px'}}  className="form-control form-control-no-left"
                       onChange={this.updateValue.bind(this)} value={!format_values[0] ? null : format_values[0].unit}/>
                *
                <select data-rule="right" onChange={this.updateValue.bind(this)} value={this.state.yRule} className="form-control form-control-no-left">
                    {options}
                </select>
                <input type="text" style={{display: 'inline-block', width: '60px'}} data-unit="right" className="form-control form-control-no-left"
                       onChange={this.updateValue.bind(this)} value={!format_values[1] ? null : format_values[1].unit}/>
            </div>
        );
    }

    toggleComponent(e){
        this.updateValue(e);
        this.setState({
            status: e.target.value
        });
    }

    showComponent(){
        let result = null;
        switch (this.state.status){
            case '1':
                result = this.createInputBox();
                break;
            case '2':
                result = this.createRadioBox();
                break;
            case '3':
                result = this.createRadioBox();
                break;
            case '4':
                result = this.createXYRange();
                break;
            case '5':
                result = this.createXY();
                 break;
        }
        return result;
    }

    //添加选项
    addRadio(){
        let values = this.state.values;
        let temp ={
            'value': '',
            'unit': '',
            'rule': 'string',
            'default': false
        };
        values.format_values.push(temp);
        this.props.handler(values, this.props.num);
        this.setState({
            values: values
        });
    }

    //处理单,多选框的数据更新
    updateRadioBox(e){
        let values = this.state.values,
            target = e.target,
            format_values = values.format_values,
            index = target.dataset.index;
        values.format_type_id = this.state.status;
        format_values[index].value = target.value;
        this.props.handler(values, this.props.num);
        this.setState({
            values: values
        });
    }

    //删除一项单多选
    deleteItem(index) {
        let values = this.state.values,
            format_values = values.format_values;
        format_values.splice(index, 1);
        this.props.handler(values, this.props.num);
        this.setState({
            values: values
        });
    }

    //处理非单,多选框的数据更新和创建
    updateValue(e){
        let values = this.state.values,
            target = e.target,
            xRule = '',
            yRule = '',
            format_values = values.format_values;

        if(target.dataset.type == 'type_id'){
            values.format_type_id = target.value;
            let temp = {
                'value': '',
                'unit': '',
                'rule': 'string',
                'default': false
            };
            values.format_values = [];
            values.format_values[0]= temp;
            this.setState({
                format_type_id: target.value
            });
        }else if(target.dataset.rule == 'left' || target.dataset.unit == 'left' ){
            if(values.format_type_id == '1' && e.target.value == 'string'){
                let temp ={
                    'value': '',
                    'unit': '',
                    'rule': 'string',
                    'default': false
                };
                values.format_values = [];
                values.format_values[0] = temp;
            }
            if(!format_values[0]){//没有第一个数组就创建
                let temp ={
                    'value': '',
                    'unit': '',
                    'rule': 'string',
                    'default': false
                };
                format_values.push(temp);
            }
            if(target.nodeName == 'SELECT'){
                xRule = target.value;
                format_values[0].rule = target.value;
            }else{
                format_values[0].unit = target.value;
            }
        }else if(target.dataset.rule == 'right' || target.dataset.unit == 'right' ){
            if(!format_values[1]){//没有第二个数组就创建
                let temp ={
                    'value': '',
                    'unit': '',
                    'rule': 'string',
                    'default': false
                };
                format_values.push(temp);
            }
            if(target.nodeName == 'SELECT'){
                yRule = target.value;
                format_values[1].rule = target.value;
            }else{
                format_values[1].unit = target.value;
            }
        }
        if(xRule){
            this.setState({
                values: values,
                xRule: xRule
            });
        }else if(yRule){
            this.setState({
                values: values,
                yRule: yRule
            });
        }
        this.props.handler(values, this.props.num);
    }

    render(){
        if(!this.state.values) return null;
        return(
            <div>
                {this.createOptions()}

                {this.showComponent()}
            </div>
        );
    }
}

export default ConstraintForm;