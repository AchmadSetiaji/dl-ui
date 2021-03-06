import { inject, bindable, computedFrom } from "aurelia-framework";
import moment from "moment";
import { Dialog } from "../../../au-components/dialog/dialog";
import { EpSopQuantityEditor } from "./dialogs/ep-sop-quantity-editor";

@inject(Dialog)
export class DataForm {
  @bindable title;
  @bindable readOnly;
  isModalShown = false;
  modalLabel = true;

  yearFormat = "YYYY";
  years = [];

  formOptions = {
    cancelText: "Kembali",
    saveText: "Simpan"
  };

  customOptions = {
    label: {
      align: "left"
    }
  };

  customPUControlOptions = {
    control: {
      length: 12
    }
  };

  customEstimatedControlOptions = {
    control: {
      length: 9
    }
  };

  constructor(dialog) {
    // this.service = service;
    this.dialog = dialog;

    // function __openModal() {
      // console.log(this.dialog);
      // console.log("test");
      // this.dialog.show(AddSOPEditor);
    // }
  }

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;

    this.cancelCallback = this.context.cancelCallback;
    this.deleteCallback = this.context.deleteCallback;
    this.editCallback = this.context.editCallback;
    this.saveCallback = this.context.saveCallback;
  }

  columnsView = [
    { header: "Tanggal", value: "dateOrdered" },
    { header: "No. SOP", value: "orderNumber" },
    { header: "No. Konstruksi", value: "constructionNumber" },
    { header: "Total Gram", value: "amountTotal" },
    { header: "Jumlah Order (Gr)", value: "orderTotal" },
    { header: "Grade A (%)", value: "gradeA" },
    { header: "Grade B (%)", value: "gradeB" },
    { header: "Grade C (%)", value: "gradeC" },
    { header: "Grade D (%)", value: "gradeD" }
  ];

  // @computedFrom("data._id")
  // get isEdit() {
  //     return (this.data._id || '').toString() != '';
  // }

  // get openModal() {
  //   this.isModalShown = true;
  // }

  // get closeModal() {
  //   this.isModalShown = false;
  // }

  __openModal(){
    this.ShowAddSOPEditorDialog();
  }

  ShowAddSOPEditorDialog(){
    this.dialog.show(EpSopQuantityEditor);
  }
}
