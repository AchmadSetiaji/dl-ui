import { inject, bindable, computedFrom } from 'aurelia-framework';
var UOMLoader = require('../../../loader/uom-azure-loader');
var UnitLoader = require('../../../loader/unit-azure-loader');

export class DataForm {
  @bindable title;
  @bindable readOnly;
  @bindable Uom;
  @bindable Unit;
  formOptions = {
    cancelText: "Kembali",
    saveText: "Simpan",
    deleteText: "Hapus",
    editText: "Ubah",
  }
  @computedFrom("data._id")
  get isEdit() {
    return (this.data._id || '').toString() != '';
  }

  typeOptions = []

  get uomLoader() {
    return UOMLoader;
  }
  get unitLoader() {
    return UnitLoader;
  }

  uomView = (uom) => {
    return `${uom.Unit}`
  }

  unitView = (unit) => {
    return `${unit.Name}`
  }

  UomChanged(newValue) {
    if (newValue &&newValue.Id) {
      this.data.UomId = newValue.Id;
      this.data.UomUnit = newValue.Unit;
    }else{
      this.data.UomId = 0;
      this.data.UomUnit = null;
    }
  }

  UnitChanged(newValue) {
    if (newValue && newValue.Id) {
      this.data.UnitId = newValue.Id;
      this.data.UnitName = newValue.Name;
      this.data.UnitCode = newValue.Code;
    }else{
      this.data.UnitId = 0;
      this.data.UnitName = null;
      this.data.UnitCode = null;
    }
  }

  async bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
    this.typeOptions = await this.context.service.getMachineTypes();
    this.cancelCallback = this.context.cancelCallback;
    this.deleteCallback = this.context.deleteCallback;
    this.editCallback = this.context.editCallback;
    this.saveCallback = this.context.saveCallback;

    if (this.data.UomId) {
      this.Uom = {};
      this.Uom.Id = this.data.UomId;
      this.Uom.Unit = this.data.UomUnit;
    }

    if (this.data.UnitId) {
      this.Unit = {};
      this.Unit.Id = this.data.UnitId;
      this.Unit.Name = this.data.UnitName;
      this.Unit.Code = this.data.UnitCode;
    }
  }
} 
