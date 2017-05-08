import React from "react";

class DropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optionArr: []
        };

        this.selChange = this.selChange.bind(this);
    }

    selChange() {
        if(this.props.changeEv) {
            this.props.changeEv(this.refs.selectNode.value);
        }
    }

    componentWillMount(){
        this.setState({optionArr : this.props.dropdownData});
    }

    render() {
        var val = 0,
            DomXml = '',
            dataArr = this.state.optionArr;
        if(this.props.selectVal){
            val = this.props.selectVal;
        }
        var checkData = "";
        if(this.props.checkData){
            checkData = this.props.checkData;
        }
        DomXml = dataArr.map((name, index) => {
            var optionVal = "";
            if(checkData[index]){
                optionVal = checkData[index];
            }else {
                optionVal = index;
            }
            return <option value={optionVal} key={index} >{name}</option>;
        });
        return (
            <select value={val} className="form-control" onChange={this.selChange} ref="selectNode">
                {DomXml}
            </select>
        );
    }
}

export default DropDown;