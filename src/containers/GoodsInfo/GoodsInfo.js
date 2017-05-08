/*
* 商品转移，添加，修改用*/

import React from 'react';
import InputUnit from '../../components/input-unit/input-unit.jsx';
import GoodsClassSelect from '../GoodsClassSelect';
import RadioGroup from '../../components/radio/radio.jsx';
import EditImage from '../GoodsTransfer/EditImage.js';

/*
* props参数说明:
* goodsId: 5  商品ID;
* */

class GoodsInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {  //需要提交的数据;
                'basic_infos': {
                    'goods_id': this.props.goodsId || 0,
                    'goods_name': '',
                    'goods_type_id': 11,
                    'brand_id': 0,
                    'origin': '',
                    'halal': 0,
                    'smuggle_id': 1,
                    'goods_title': '',
                    'describe': ''
                },
                'basic_attributes': {
                    'goods_price': 0,
                    'goods_unit_id': 1,
                    'price_adjust_frequency': 1,
                    'rough_weight': '',
                    'net_weight': '',
                    'meat_weight': '',
                    'inventory': 99999,
                    'minimum_order_quantity': 1,
                    'specs': {
                        'constraint_id':3,
                        'must':true,
                        'name':'规格',
                        'values':[
                            {
                                'value':'',
                                'unit':''
                            }
                        ]
                    },
                    'types':{
                        'constraint_id':2,
                        'must':true,
                        'name':'型号',
                        'values':[
                            {
                                'value':'',
                                'unit':''
                            }
                        ]
                    }
                },
                'special_attributes':[],
                'pictures':[],
                inspection_reports: []
            },
            basicAttrData: null,  //基本属性规则;
            specialData: [],    //特殊属性规则;
            goodsClassData: null,  //商品分类数据;
            activitiesType: [],   //活动类型数据;
            goodsUnits: [],    //商品单位获取;
            goodsSmuggles: [],   //商品国别获取;
            goodsBrands: null,    //商品品牌;
            searchBrand: [],    //当前搜索出来的品牌;
            EditImage: '',   //编辑图片弹出框;
            brand_name: '',   //当前选中的这个品牌名;
            editor: null,   //编辑器;
            strArr: []      //特殊属性中之前的属性值;
        };
        this.setTypeId = this.setTypeId.bind(this);
        this.getAttr = this.getAttr.bind(this);
        this.createFormatType = this.createFormatType.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.setNewImgUrl = this.setNewImgUrl.bind(this);
        this.hideEditImage = this.hideEditImage.bind(this);
        this.picSortBlur = this.picSortBlur.bind(this);
    }

    componentWillMount() {
        this.getInitData();
    }

    componentDidMount() {
        document.addEventListener('click', function(event) {
            if(event.target.dataset.choose != 'input' && event.target.dataset.choose != 'brand'){
                $('.search-select').hide();
            }
        });
    }

    //基本属性规则和特殊属性规则获取;
    getAttr() {
        let param = {type_id: this.state.data.basic_infos.goods_type_id},
            that = this;
        that.state.specialData = [];
        H.server.goods_type_basicAttr_get(param, (res) => {  //基本属性规则获取
            if(res.code == 0) {
                if(!res.data.spec_constraint.attribute_id) {
                    H.Modal({
                        title: '警告',
                        content: '该分类下还没有设置规格约束，您暂时不能在这个分类下添加商品'
                    });
                }else if(!res.data.type_constraint.attribute_id) {
                    H.Modal({
                        title: '警告',
                        content: '该分类下还没有设置型号约束，您暂时不能在这个分类下添加商品'
                    });
                }
                this.state.basicAttrData = res.data;
                setString();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
        H.server.goods_type_specialAttr_list(param, (res) => {  //获取特殊属性;
            if(res.code == 0) {
                this.state.specialData = res.data.attributes;
                setString();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
        function setString() {
            if(that.state.basicAttrData && that.state.specialData.length > 0) {
                let oldData = Object.assign({}, that.state.oldData),
                    data = that.state.data,
                    specialData = that.state.specialData,
                    specsArr = [],
                    strArr = [];
                if(oldData.basic_attributes.specs.constraint_id != that.state.basicAttrData.spec_constraint.attribute_id) {
                    that.state.specsAttrString = oldData.basic_attributes.specs.attr_values;
                    data.basic_attributes.specs = that.createGoodsInfoKey(that.state.basicAttrData.spec_constraint, '规格');
                }else {
                    if(oldData.basic_attributes.specs.format_type_id != that.state.basicAttrData.spec_constraint.format_type_id) {
                        that.state.specsAttrString = oldData.basic_attributes.specs.attr_values;
                        data.basic_attributes.specs = that.createGoodsInfoKey(that.state.basicAttrData.spec_constraint, '规格');
                    }else {
                        data.basic_attributes.specs = {
                            'constraint_id': oldData.basic_attributes.specs.constraint_id,
                            'must': oldData.basic_attributes.specs.must,
                            'name': oldData.basic_attributes.specs.name,
                            'values': oldData.basic_attributes.specs.values
                        };
                    }
                }
                if(oldData.basic_attributes.types.constraint_id != that.state.basicAttrData.type_constraint.attribute_id) {
                    that.state.typesAttrString = oldData.basic_attributes.specs.attr_values;
                    data.basic_attributes.types = that.createGoodsInfoKey(that.state.basicAttrData.type_constraint, '型号');
                }else {
                    if(oldData.basic_attributes.types.format_type_id != that.state.basicAttrData.type_constraint.format_type_id) {
                        that.state.typesAttrString = oldData.basic_attributes.types.attr_values;
                        data.basic_attributes.types = that.createGoodsInfoKey(that.state.basicAttrData.type_constraint, '型号');
                    }
                }
                let oldSpecial = Object.assign({}, oldData.special_attributes),
                    _arr = [];
                for(let k in oldSpecial) {
                    _arr.push(oldSpecial[k]);
                }
                oldSpecial = _arr;
                for(let i = 0 ; i < specialData.length; i++) {
                    for(let j = 0 ; j < oldSpecial.length ; j++) {
                        if(specialData[i].attribute_id == oldSpecial[j].constraint_id) {
                            if(specialData[i].format_type_id == oldSpecial[j].format_type_id) {
                                specsArr[i] = {
                                    'constraint_id': oldSpecial[j].constraint_id,
                                    'must': specialData[i].must,
                                    'name': specialData[i].attribute_name,
                                    'values': oldSpecial[j].values
                                };
                                oldSpecial.splice(j, 1);
                                break;
                            }else {
                                specsArr[i] = that.createGoodsInfoKey(specialData[i]);
                            }

                        }else {
                            specsArr[i] = that.createGoodsInfoKey(specialData[i]);
                        }
                    }
                }
                for(let n = 0 ; n < oldSpecial.length ; n++) {
                    strArr.push(oldSpecial[n].attr_values);
                }
                data.special_attributes = specsArr;
                that.state.strArr = strArr;
                that.setState({data: data});
            }
        }
    }

    //根据对应的规则生成商品信息默认的字段;
    createGoodsInfoKey(res, name) {
        let must = false;
        if(name) {
            must = true;
        }else {
            must = res.must;
        }
        let obj = {'constraint_id': res.attribute_id, 'must': must, 'name': name ? name : res.attribute_name, 'values':[]},
            values = [];
        switch (res.format_type_id) {
            case 1:
                values = [{'value': '', 'unit': ''}];
                break;
            case 2:
                values = [{'value': '', 'unit': ''}];
                break;
            case 3:
                let arr = res.format_values;
                for(let i = 0 ; i < arr ; i++) {
                    values.push({'value': '', 'unit': arr[i].unit});
                }
                break;
            case 4:
                values = [{'value': '', 'unit': res.format_values[0].unit}, {'value': '', 'unit': res.format_values[1].unit}];
                break;
            case 5:
                values = [{'value': '', 'unit': res.format_values[0].unit}, {'value': '', 'unit': res.format_values[1].unit}];
                break;
        }
        obj.values = values;
        return obj;
    }

    //设置选择的分类;
    setTypeId(id) {
        let data = this.state.data;
        data.basic_infos.goods_type_id = id;
        data.special_attributes = [];
        data.basic_attributes.specs.values = [];
        data.basic_attributes.types.values = [];
        this.setState({data: data}, () => {
            this.getAttr();
        });
    }

    //基本属性和特殊属性中几个对应的选项：单选、多选、文本框、X*Y、X-Y;
    createFormatType(data, value, label, status){
        let XML = [];
        switch (data.format_type_id) {
            case 1:
                let defaultValue = '',
                    spanXml = [];
                if(value) {
                    if(value.values[0]){
                        defaultValue = value.values[0].value;
                    }
                }
                if(data.format_values[0].unit) {   //如果规则中有单位的需要在输入框后面加单位;
                    spanXml.push(<span key={status + '' + new Date().getTime()} className="unit-item">{data.format_values[0].unit}</span>);
                }

                XML.push(
                    <div className="col-lg-6 form-inline" key={data.format_type_id + '' + new Date().getTime()}>
                        <span className="label-title">{label}</span>
                        <div className="form-control input-unit">
                            <input type="text" defaultValue={defaultValue}
                                   onBlur={this.constraint.bind(this, data, data.format_values[0], status)}
                            />{spanXml}
                        </div>
                    </div>
                );
                break;
            case 2:
                XML.push(
                    <div className="col-lg-6 form-inline" key={data.format_type_id + '' + new Date().getTime()}>
                        <span className="label-title">{label}<span style={{color: '#38b7f6', display: 'inherit'}}>(单选)</span></span>
                        <div className="form-group input-inline btn-group-rule">
                            {
                                data.format_values.map((val, index) => {
                                    let flag = false;
                                    if(value) {
                                        if(value.values[0] && value.values[0].value == val.value) flag = true;
                                    }
                                    return (
                                        <btn key={index + '' + new Date().getTime()} className={flag ? 'btn active' : 'btn'}
                                             onClick={this.constraint.bind(this, data, val, status)}>{val.value}</btn>
                                    );
                                })
                            }
                        </div>
                    </div>
                );
                break;
            case 3:
                XML.push(
                    <div className="col-lg-6 form-inline" key={data.format_type_id + '' + new Date().getTime()}>
                        <span className="label-title">{label}<span style={{color: '#38b7f6', display: 'inherit'}}>(多选)</span></span>
                        <div className="form-group input-inline btn-group-rule">
                            {
                                data.format_values.map((val, index) => {
                                    let that = val,
                                        flag = false;
                                    that.index = index;
                                    if(value) {
                                        for(let i = 0 ; i < value.values.length ; i++) {
                                            if(value.values[i]) {
                                                if(value.values[i].value == val.value) {
                                                    flag = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    return (
                                        <btn key={index + '' + new Date().getTime()} className={flag ? 'btn active' : 'btn'}
                                             onClick={this.constraint.bind(this, data, that, status)}>{val.value}</btn>
                                    );
                                })
                            }
                        </div>
                    </div>
                );
                break;
            case 4:
                let flag1 = false, flag2 = false;
                if(value) {
                    if(value.values[0]) flag1 = true;
                }
                if(value) {
                    if(value.values[1]) flag2 = true;
                }
                XML.push(
                    <div className="col-lg-6 form-inline" key={data.format_type_id + '' + new Date().getTime()}>
                        <span className="label-title">{label}</span>
                        <input type="text" className="form-control sm-input" defaultValue={flag1 ? value.values[0].value : ''}
                               onBlur={this.constraint.bind(this, data, 1, status)} />{data.format_values[0].unit} <span className="symbol">-</span>
                        <input type="text" className="form-control sm-input" defaultValue={flag2 ? value.values[1].value : ''}
                               onBlur={this.constraint.bind(this, data, 2, status)} />{data.format_values[1].unit}
                    </div>
                );
                break;
            case 5:
                let flag3 = false, flag4 = false;
                if(value) {
                    if(value.values[0]) flag3 = true;
                }
                if(value) {
                    if(value.values[1]) flag4 = true;
                }
                XML.push(
                    <div className="col-lg-6 form-inline" key={data.format_type_id + '' + new Date().getTime()}>
                        <span className="label-title">{label}</span>
                        <input type="text" className="form-control sm-input" defaultValue={flag3 ? value.values[0].value : ''}
                               onBlur={this.constraint.bind(this, data, 1, status)} />{data.format_values[0].unit} <span className="symbol">*</span>
                        <input type="text" className="form-control sm-input" defaultValue={flag4 ? value.values[1].value : ''}
                               onBlur={this.constraint.bind(this, data, 2, status)} />{data.format_values[1].unit}
                    </div>
                );
                break;
        }
        return XML;
    }

    getInitData() {
        let server = H.server,
            goodsUnits = null,
            goodsSmuggles = null,
            goodsBrands = null,
            goodsClassData = null,
            activitiesType = null,
            goodsInfo = null,
            that = this;

        //商品单位获取;
        server.other_goods_units({}, (res) => {
            if(res.code == 0) {
                goodsUnits = res.data;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //商品国别获取;
        server.other_goods_smuggles({}, (res) => {
            if(res.code == 0) {
                goodsSmuggles = res.data;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //品牌获取;
        server.goods_brands_list({page: 1, size: 5000}, (res) => {
            if(res.code == 0) {
                goodsBrands = res.data.brands;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //获取商品分类数据;
        server.goods_type_list({area_id: this.props.area}, (res) => {
            if(res.code == 0) {
                goodsClassData = res.data;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //获取活动类型;
        server.activities_type({}, (res) => {
            if(res.code == 0) {
                activitiesType = res.data;
                activitiesType.push({id: 1, name: '无活动'});
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //获取商品详细信息;
        server.goods_info({goods_id: this.props.goodsId}, (res) => {
            if(res.code == 0) {
                goodsInfo = res.data;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        function setData(){
            if(goodsUnits && goodsSmuggles && goodsBrands && goodsClassData && activitiesType && goodsInfo) {
                let info = Object.assign({}, goodsInfo);
                //通过商品信息的brand_id在品牌列表数据中得出品牌名的默认值;
                let bindName = '';
                for(let i = 0 ; i < goodsBrands.length ; i++) {
                    if(goodsBrands[i].id == goodsInfo.basic_infos.brand_id) {
                        bindName = goodsBrands[i].brand + ' (' + goodsBrands[i].id + ')';
                    }
                }
                that.state.goodsUnits = goodsUnits;
                that.state.goodsSmuggles = goodsSmuggles;
                that.state.goodsBrands = goodsBrands;
                that.state.goodsClassData = goodsClassData;
                that.state.activitiesType = activitiesType;
                that.state.data = {
                    basic_infos: info.basic_infos,
                    basic_attributes: info.basic_attributes,
                    special_attributes: info.special_attributes,
                    pictures: info.pictures,
                    inspection_reports: info.inspection_reports
                };
                that.state.oldData = info;
                that.state.brand_name = bindName;
                that.picSortBlur();
                if(goodsInfo.basic_infos.goods_type_id && goodsInfo.basic_infos.goods_type_id != 1) {
                    that.getAttr();
                }else {
                    that.forceUpdate();
                }
            }
        }
    }

    getBrandData() {
        //品牌获取;
        H.server.goods_brands_list({page: 1, size: 5000}, (res) => {
            if(res.code == 0) {
                this.setState({goodsBrands: res.data.brands});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //输入框修改时;
    inputChange(status, e) {
        let val = e.target.value,
            data = this.state.data;
        switch (parseInt(status)) {
            case 1:  //商品名;
                data.basic_infos.goods_name = val;
                break;
            case 2:  //产地;
                data.basic_infos.origin = val;
                break;
            case 3:  //带箱重量;
                if(!H.isFloat(val) && val != '') {
                    e.target.focus();
                }else {
                    data.basic_attributes.rough_weight = val;
                }
                break;
            case 4:   //解冻后约;
                if(!H.isFloat(val) && val != '') {
                    e.target.focus();
                }else {
                    data.basic_attributes.meat_weight = val;
                }
                break;
            case 5:   //库存;
                if(!H.isNumber(val, 0) && val != '') {
                    e.target.focus();
                }else if(val == '') {
                    data.basic_attributes.inventory = 99999;
                } else {
                    data.basic_attributes.inventory = parseInt(val);
                }
                break;
            case 6:   //起卖量;
                if(!H.isNumber(val) && val != '') {
                    e.target.focus();
                }else {
                    data.basic_attributes.minimum_order_quantity = val;
                }
                break;
            case 7:   //一口价;
                if(!H.isFloat(val) && val != '') {
                    e.target.focus();
                }else {
                    data.basic_attributes.goods_price = val;
                }
                break;
            case 8:   //商品标题;
                data.basic_infos.goods_title = val;
                break;
            case 9:   //清真食品;
                data.basic_infos.halal = val;
                break;
            case 10:   //国别;
                data.basic_infos.smuggle_id = val;
                break;
            case 11:   //过期频率;
                data.basic_attributes.price_adjust_frequency = val;
                break;
            case 12:   //单位;
                data.basic_attributes.goods_unit_id = val;
                break;
            case 13:   //优势描述;
                data.basic_infos.describe = val;
                break;
            case 14:   //去箱重量;
                if(!H.isFloat(val) && val != '') {
                    e.target.focus();
                }else {
                    data.basic_attributes.net_weight = val;
                }
                break;
        }
        this.setState({data: data});
    }

    /*约束里面的数据;
    *status{-1: 基本属性型号0: 基本属性规格;其它值：特殊属性}
    */
    constraint(val, item, status, e) {
        let data = this.state.data,
            obj = null;
        if(status == -1) {  //型号;
            obj = data.basic_attributes.types;
            obj.constraint_id = val.attribute_id;
        }else if(status == -2) { //规格;
            obj = data.basic_attributes.specs;
            obj.constraint_id = val.attribute_id;
        }else {
            if(data.special_attributes[status]) {
                obj = data.special_attributes[status];
            }else {
                obj = {
                    constraint_id: val.attribute_id,
                    must: val.must || 0,
                    name: val.attribute_name,
                    'values':[]
                };
            }
        }
        switch (val.format_type_id) {
            case 1:
                obj.values = [{value: e.target.value, unit: item.unit}];
                break;
            case 2:
                $(e.target).siblings().removeClass('active');
                $(e.target).addClass('active');
                obj.values = [{value: item.value, unit: item.unit}];
                break;
            case 3:
                if($(e.target).attr('class').indexOf('active') == -1) {
                    $(e.target).addClass('active');
                    obj.values.push({value: item.value, unit: item.unit});
                }else {
                    $(e.target).removeClass('active');
                    obj.values.splice(item.index, 1);
                }
                break;
            case 4:
                if(item == 1) {
                    obj.values[0] = {
                        value: e.target.value,
                        unit: val.format_values[0].unit
                    };
                }else {
                    obj.values[1] = {
                        value: e.target.value,
                        unit: val.format_values[1].unit
                    };
                }
                break;
            case 5:
                if(item == 1) {
                    obj.values[0] = {
                        value: e.target.value,
                        unit: val.format_values[0].unit
                    };
                }else {
                    obj.values[1] = {
                        value: e.target.value,
                        unit: val.format_values[1].unit
                    };
                }
                break;
        }

        if(status == -1) {  //型号;
            data.basic_attributes.types = obj;
        }else if(status == -2) {  //规格;
            data.basic_attributes.specs = obj;
        }else {   //特殊属性;
            data.special_attributes[status] = obj;
        }
        this.setState({data: data});
    }

    //图片排序;
    picSort(index, e) {
        let data = this.state.data,
            value = parseInt(e.target.value),
            that;
        that = data.pictures[index];  //得到需要调的图片数据;
        if(value <= data.pictures.length && value > 0) {
            data.pictures.splice(index, 1);  //先把这个移出;
            data.pictures.splice(value-1, 0, that);  //再把这个添加到对应的位置;
            this.picSortBlur();
        }else if(e.target.value == '') {
            that.sort_value = '';
        }
        this.setState({data: data});
    }

    //图片排序;
    picSortBlur() {
        let data = this.state.data;
        for(let i = 0 ; i < data.pictures.length ; i++) {   //再把全部的排序字段按新的顺序修改;
            data.pictures[i].sort_value = i+1;
        }
        this.setState({data: data});
    }

    //删除检验报告;
    inspectionReportDel(pic, index) {
        if(pic.picture_id == 0) {
            let data = this.state.data;
            data.inspection_reports.splice(index, 1);
            this.setState({data: data});
            return;
        }
        H.Modal({
            title: '删除检验报告',
            content: '<p>确认要删除检验报告吗，删除之后不能恢复哦。</p>',
            cancel: true,
            height: '210',
            cancelText: '取消',
            okCallback: () => {
                H.server.goods_inspectionReport_picture_del(JSON.stringify({picture_id: pic.picture_id}), (res) => {
                    if(res.code == 0) {
                        let data = this.state.data;
                        data.inspection_reports.splice(index, 1);
                        this.setState({data: data});
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    //删除检验报告;
    picturesDel(pic, index) {
        if(pic.picture_id == 0) {
            let data = this.state.data;
            data.pictures.splice(index, 1);
            this.setState({data: data});
            return;
        }
        H.Modal({
            title: '删除检验报告',
            content: '<p>确认要删除商品图片吗，删除之后不能恢复哦。</p>',
            cancel: true,
            height: '210',
            cancelText: '取消',
            okCallback: () => {
                H.server.goods_picture_del(JSON.stringify({picture_id: pic.picture_id}), (res) => {
                    if(res.code == 0) {
                        let data = this.state.data;
                        data.pictures.splice(index, 1);
                        this.setState({data: data});
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    //EditImage  显示裁剪图的弹窗; obj == '' 表示添加，否则表示修图，status == 1 表示检验报告，==2表示商品图片;
    showEditImage(obj, status) {
        if(this.state.data.pictures.length >= 6 && obj == '' && status == 2) {
            H.Modal('最多上传6张商品图片');
            return;
        }
        let EditImageXML = (<EditImage imgURL={obj.picture_add} imgObj={obj} status={status} setNewImgUrl={this.setNewImgUrl} closeModal={this.hideEditImage} />);
        this.setState({EditImage: EditImageXML});
    }

    hideEditImage() {
        this.setState({EditImage: ''});
    }

    //设置新图片的地址;
    setNewImgUrl(obj, status, url) {
        let data = this.state.data,
            arr = [];
        if(status == 1) {  //1是检验报告;
            arr = data.inspection_reports;
        }else {
            arr = data.pictures;
        }
        if(obj) {   //修图;
            if(obj.picture_id == 0) {
                arr[obj.index].picture_add = url;
            }else {
                for(let i = 0 ; i < arr.length ; i++) {
                    if(arr[i].picture_id == obj.picture_id) {
                        arr[i].picture_add = url;
                        break;
                    }
                }
            }
        }else {  //添加新图;
            arr.push({
                'picture_id': 0,
                'picture_add': url,
                'sort_value': arr.length+1
            });
        }
        this.setState({data: data, EditImage: ''});
    }

    //品牌搜索框的值改变时;
    brandChange(e) {
        let value = e.target.value,
            brandsAll = this.state.goodsBrands || [],
            arr = [];
        for(let i = 0 ; i < brandsAll.length ; i++) {
            if(brandsAll[i].brand.indexOf(value) != -1) {
                arr.push(brandsAll[i]);
            }
        }
        this.setState({searchBrand: arr, brand_name: value});
        $('.search-select').show();
    }

    //选择搜索出来的品牌;
    chooseBrand(val, e) {
        e.stopPropagation();
        e.preventDefault();
        let data = this.state.data,
            brand_name = val.brand + ' (' + val.id + ')';
        data.basic_infos.brand_id = val.id;
        this.setState({data: data, brand_name: brand_name});
        $('.search-select').hide();
    }

    //保存商品;
    saveGoodsInfo(e) {
        let param = Object.assign({}, this.state.data),
            specialArr = param.special_attributes,
            newArr = [],
            eve = e;
        for(let i = 0 ; i < specialArr.length ; i++) {
            if(specialArr[i]) {
                let valArr = specialArr[i].values;
                for(let l = 0 ; l < valArr.length ; l++) {
                    if(valArr[l].value) {
                        newArr.push(specialArr[i]);
                        break;
                    }
                }
            }
        }
        param.special_attributes = newArr;
        if(this.state.brand_name.indexOf('(') == -1 && this.state.brand_name.indexOf(')') == -1) {
            H.Modal('品牌信息不正确');
            return;
        }
        H.server.goods_update(JSON.stringify(param), (res) => {
            if(res.code == 0) {
                H.Modal('修改成功');
                this.props.closePanel(eve);
                this.props.getGoodsList && this.props.getGoodsList(eve);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    render() {
        let data = this.state.data,
            oldData = this.state.oldData || {};
        return (
            <div>
                <div className="goods-info-warp">
                    <div className="row">
                        <h5 className="col-lg-12 title">活动</h5>
                        <div className="col-lg-12 form-inline">
                            <div className="form-group"><span className="label-title">活动</span>
                                <RadioGroup
                                    param={this.state.activitiesType}
                                    defaultVal={oldData.activity_type || 1}
                                    disabled={true}
                                    index={this.props.goodsId}
                                    name="activity"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h5 className="col-lg-12 title">基本信息</h5>
                        <div className="col-lg-6 form-inline">
                            <span className="label-title">商品名</span>
                            <input type="text" className="form-control input-inline" placeholder="(必须包含品牌名)"
                                   value={data.basic_infos.goods_name} onChange={this.inputChange.bind(this, 1)}/>
                        </div>
                        <div className="col-lg-6 form-inline"><span className="label-title">分类</span>
                            {
                                this.state.goodsClassData ?
                                    <GoodsClassSelect
                                        data={this.state.goodsClassData}
                                        typeId={this.state.data.basic_infos.goods_type_id}
                                        setTypeId={this.setTypeId}
                                        showAll={true}
                                    /> : null
                            }
                        </div>
                        {this.state.typesAttrString ?
                            <div className="row" style={{color: '#999'}}><div className="col-lg-6"></div>
                                <div className="col-lg-6"><span className="label-title"></span>{this.state.typesAttrString}</div>
                            </div> : ''}
                        {this.state.data.basic_infos.brand_name ?
                            <div className="col-lg-12" style={{color: '#999'}}><span className="label-title"></span>{this.state.data.basic_infos.brand_name}</div> : null}
                        <div className="col-lg-6 form-inline"><span className="label-title">品牌（厂号）</span>
                            <div className="form-control input-inline brand-input-inline" style={{position: 'relative'}}>
                                <input type="text" placeholder="选择品牌" id="brand_input"
                                       value={this.state.brand_name}
                                       style={{outline: 'none', border: 'none', width: '100%'}}
                                       onChange={this.brandChange.bind(this)}
                                       onFocus={this.brandChange.bind(this)}
                                       data-choose="input"
                                />
                                <ul className="search-select" style={{display: 'none'}}>
                                    {
                                        this.state.searchBrand.map((value, index) => {
                                            return (
                                                <li key={index} data-choose="brand" onClick={this.chooseBrand.bind(this, value)}>{value.brand}</li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                            <a className="brand-btn" onClick={this.getBrandData.bind(this)}>刷新</a>
                        </div>
                        {this.state.basicAttrData ? this.createFormatType(this.state.basicAttrData.type_constraint, data.basic_attributes.types, '型号', -1) : ''}
                        {this.state.specsAttrString ?
                            <div className="row" style={{color: '#999'}}><div className="col-lg-6"></div>
                                <div className="col-lg-6"><span className="label-title"></span>{this.state.specsAttrString}</div>
                            </div> : ''}
                        <div className="col-lg-6 form-inline"><span className="label-title">产地</span>
                            <input type="text" className="form-control input-inline"
                                   value={data.basic_infos.origin} onChange={this.inputChange.bind(this, 2)} />
                        </div>
                        {this.state.basicAttrData ? this.createFormatType(this.state.basicAttrData.spec_constraint, data.basic_attributes.specs, '规格', -2) : ''}
                        <div className="col-lg-6 form-inline"><span className="label-title">带箱重量</span>
                            <InputUnit param={{text: '公斤', placeholder: '（纯数字）', value: data.basic_attributes.rough_weight, identify: 3}}
                                       changeHandler={this.inputChange}/>
                        </div>
                        <div className="col-lg-6 form-inline"><span className="label-title">解冻后约</span>
                            <InputUnit param={{text: '公斤', placeholder: '（纯数字）', value: data.basic_attributes.meat_weight, identify: 4}}
                                       changeHandler={this.inputChange}/>
                            <span style={{color: 'red', marginLeft: '10px'}}>非必填</span>
                        </div>
                        <div className="col-lg-6 form-inline"><span className="label-title">去箱重量</span>
                            <InputUnit param={{text: '公斤', placeholder: '（纯数字）', value: data.basic_attributes.net_weight, identify: 14}}
                                       changeHandler={this.inputChange}/>
                        </div>
                        <div className="col-lg-6 form-inline"><span className="label-title">清真食品</span>
                            <RadioGroup
                                param={[{id: 0, name: '否'}, {id: 1, name: '是'}]}
                                defaultVal={data.basic_infos.halal}
                                name="halal"
                                changeHandler={this.inputChange}
                                identify={9}
                                index={this.props.goodsId}
                            />
                        </div>
                        <div className="col-lg-6 form-inline"><span className="label-title">国别</span>
                            <div className="form-group">
                                <RadioGroup
                                    param={this.state.goodsSmuggles}
                                    name="country-real"
                                    defaultVal={data.basic_infos.smuggle_id}
                                    changeHandler={this.inputChange}
                                    identify={10}
                                    index={this.props.goodsId}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h5 className="col-lg-12 title">特殊属性<span className="appendage">条例特殊属性配置</span></h5>
                        <div className="col-lg-12">
                            <div className="row">
                                {
                                    this.state.strArr.map((val, index) => {
                                        return (<div className="col-lg-6" style={{color: '#999', marginBottom: '10px'}} key={index}><span className="label-title"></span>{val}</div>);
                                    })
                                }
                            </div>
                        </div>
                        {
                            this.state.specialData.map((val, index) => {
                                return (
                                    this.createFormatType(val, data.special_attributes[index], val.attribute_name, index)
                                );
                            })
                        }
                    </div>
                    <div className="row">
                        <h5 className="col-lg-12 title">单位</h5>
                        <div className="col-lg-6 form-inline"><span className="label-title">单位</span>
                            <RadioGroup
                                param={this.state.goodsUnits}
                                name="unit"
                                defaultVal={data.basic_attributes.goods_unit_id}
                                changeHandler={this.inputChange}
                                identify={12}
                                index={this.props.goodsId}
                            />
                        </div>
                        <div className="col-lg-6 form-inline"><span className="label-title">库存量</span>
                            <input className="form-control input-inline" type="text" placeholder="（纯数字）"
                                value={data.basic_attributes.inventory == 99999 ? '' : data.basic_attributes.inventory} onChange={this.inputChange.bind(this, 5)}
                            />
                            <span style={{color: 'red', marginLeft: '100px'}}>非必填，空值表示不限库存</span>
                        </div>
                        <div className="col-lg-6 form-inline"><span className="label-title">起购量</span>
                            <input className="form-control input-inline" type="text" placeholder="（纯数字，默认为1）"
                                value={data.basic_attributes.minimum_order_quantity} onChange={this.inputChange.bind(this, 6)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <h5 className="col-lg-12 title">价格</h5>
                        <div className="col-lg-6 form-inline"><span className="label-title">一口价</span>
                            <InputUnit param={{text: '元', placeholder: '（货币）', value: data.basic_attributes.goods_price, identify: 7}}
                                       changeHandler={this.inputChange}/>
                        </div>
                        <div className="col-lg-6 form-inline"><span className="label-title">价格过期频率</span>
                            <RadioGroup
                                param={[{id: 1, name: '每天过期'}, {id: 0, name: '长期有效'}]}
                                name="gq"
                                defaultVal={data.basic_attributes.price_adjust_frequency}
                                changeHandler={this.inputChange}
                                identify={11}
                                index={this.props.goodsId}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <h5 className="col-lg-12 title">介绍</h5>
                        <div className="col-lg-12 form-inline"><span className="label-title">商品标题</span>
                            <input type="text" className="form-control input-inline" placeholder="15-25字"
                                   value={data.basic_infos.goods_title} onChange={this.inputChange.bind(this, 8)}
                            />
                        </div>
                        <div className="col-lg-12 form-inline"><span className="label-title">优势描述<br/><span style={{color: 'red'}}>非必填</span></span>
                            <textarea className="input-inline" placeholder="支持断行、最多100字"
                                      value={data.basic_infos.describe} onChange={this.inputChange.bind(this, 13)}>
                            </textarea>
                        </div>
                        <div className="col-lg-12 form-inline"><span className="label-title">检验报告<br/><span style={{color: '#ccc'}}>(最多3张)</span></span>
                            <div className="input-inline">
                                {
                                    data.inspection_reports.map((value, index) => {
                                        let val = value;
                                        val.index = index;
                                        return (
                                            <div key={index} className="form-group goods-img">
                                                <a style={{width: '200px', height: '200px', display: 'inline-block'}} href={H.cdn + val.picture_add} target="_blank">
                                                    <img src={H.cdn + val.picture_add + '@200w_50Q.jpg'} /></a>
                                                <div>
                                                    <btn className="btn btn-sm" onClick={this.inspectionReportDel.bind(this, val, index)}>删除</btn>
                                                    <btn className="btn btn-sm" onClick={this.showEditImage.bind(this, val, 1)}>修图</btn>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                {
                                    data.inspection_reports.length >= 3 ? '' :
                                        <div className="form-group goods-img">
                                            <btn className="btn add-inspection" onClick={this.showEditImage.bind(this, '', 1)}>+添加</btn>
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="col-lg-12 form-inline"><span className="label-title">实物图片</span>
                            <div className="input-inline">
                                <p>最少4张，最多可添加6张图片，最好是竖屏图片</p>
                                <div>
                                    <div className="form-group">
                                        <div className="btn add-goods-img"
                                             onClick={this.showEditImage.bind(this, '', 2)}>
                                            <div className="glyphicon cloud-up"></div><p>添加图片</p>
                                        </div>
                                    </div>
                                </div>
                                {
                                    data.pictures.map((value, index) => {
                                        let val = value;
                                        val.index = index;
                                        return (
                                            <div key={index} className="form-group goods-img">
                                                <a style={{width: '200px', height: '200px', display: 'inline-block'}} href={H.cdn + val.picture_add} target="_blank">
                                                    <img src={H.cdn + val.picture_add + '@200w_50Q.jpg'} /></a>
                                                <div>
                                                    <btn className="btn btn-smell" onClick={this.picturesDel.bind(this, val, index)}>删除</btn>
                                                    <btn className="btn btn-smell" onClick={this.showEditImage.bind(this, val, 2)}>修图</btn>
                                                    <div className="form-group sort">排序
                                                        <input type="text" className="sort-input" value={val.sort_value}
                                                               onBlur={this.picSortBlur.bind(this)}
                                                               onChange={this.picSort.bind(this, index)} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="col-lg-12 form-inline">
                            <span className="label-title">
                            </span>
                            <a className="btn btn-lg goods-info-close" data-method="close" onClick={this.props.closePanel}>关闭</a>
                            <a className="btn btn-lg btn-default" data-method="save" onClick={this.saveGoodsInfo.bind(this)}>保存</a>
                        </div>
                    </div>
                </div>
                {this.state.EditImage}
            </div>
        );
    }
}

export default GoodsInfo;