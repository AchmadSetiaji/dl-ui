import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Dialog } from '../../../components/dialog/dialog';
import moment from "moment";

@inject(Router, Service, Dialog)
export class View {

  constructor(router, service, dialog) {
    this.router = router;
    this.service = service;
    this.dialog = dialog;
    this.data = {};
    this.error = {};
    this.sendData = {
      Id: "",
      BeamId: "",
      ShiftId: "",
      DateOperation: "",
      TimeOperation: "",
      OperatorId: ""
    };
  }

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
  }

  async activate(params) {
    var Id = params.Id;
    this.data =
      await this.service.getById(Id)
        .then(result => {
          return this.service.getUnitById(result.UnitId)
            .then(unit => {
              result.UnitName = unit.Name;
              return result;
            });
        });
  }

  dailyOperationBeamProducts = [
    { header: "No Beam", value: "BeamNumber" },
    { header: "Panjang", value: "Length" },
    { header: "Tention", value: "Tention" },
    { header: "Speed", value: "Speed" },
    { header: "PressRoll", value: "PressRoll" },
    { header: "Beam Status", value: "BeamStatus" }
  ];

  warpingHistory = [
    { header: "Beam", value: "BeamNumber" },
    { header: "Operator", value: "BeamOperatorName" },
    { header: "Group", value: "BeamOperatorGroup" },
    {
      field: "DateTimeMachine",
      title: "Waktu",
      formatter: function (value, data, index) {
        return moment(new Date(value)).format("DD MMM YYYY");
      }
    },
    { header: "Status", value: "OperationStatus" },
    { header: "Shift", value: "ShiftName" }
  ];

  back() {
    this.router.navigateToRoute("list");
  }

  start() {
    $("#Mulai").modal('hide');
    this.error = {};
    var errorIndex = 0;

    if (this.data.Id) {

      this.sendData.Id = this.data.Id;
      this.sendData.BeamId = this.data.BeamId;
      this.sendData.ShiftId = this.data.ShiftId;
      this.sendData.DateOperation = this.data.StartDate;
      this.sendData.TimeOperation = this.data.StartTime;
      this.sendData.OperatorId = this.data.OperatorId;


      if (this.data.BeamId) {
        console.log(this.data)
        if (this.data.BeamType != "Warping") {
          errorIndex++;
          this.error.Beam = "Tipe Beam : " + this.data.Beam.Type;
        }
      }

      if (errorIndex == 0) {
        this.service
          .updateForStartProcess(this.sendData)
          .then(result => {
            this.data.DailyOperationWarpingHistories = [];
            this.data.DailyOperationBeamProducts = [];

            this.data.DailyOperationWarpingHistories = result.DailyOperationWarpingHistories;
            this.data.DailyOperationBeamProducts = result.DailyOperationBeamProducts;

          }).catch(e => {
            var errorStatus = e.Status;
            this.dialog.errorPrompt(errorStatus);
          });
      }
    }

  }

  stop() {
    $("#Berhenti").modal('hide');
    this.error = {};

    this.service
      .updateForStopProcess(this.data)
      .then(result => {

        this.data.LoomHistory = [];

        if (result.length > 0) {
          result = this.remappingModels(result);
        }

        this.data.LoomHistory = result;
      }).catch(e => {
        var errorStatus = e.Status;
        this.dialog.errorPrompt(errorStatus);
      });
  }

  resume() {
    $("#Melanjutkan").modal('hide');
    this.error = {};

    this.service
      .updateForResumeProcess(this.data)
      .then(result => {

        this.data.LoomHistory = [];

        if (result.length > 0) {
          result = this.remappingModels(result);
        }

        this.data.LoomHistory = result;
      }).catch(e => {
        var errorStatus = e.Status;
        this.dialog.errorPrompt(errorStatus);
      });
  }

  finish() {
    $("#Selesai").modal('hide');
    this.error = {};

    this.service
      .updateForFinishProcess(this.data)
      .then(result => {

        this.data.LoomHistory = [];

        if (result.length > 0) {
          result = this.remappingModels(result);
        }

        this.data.LoomHistory = result;
      }).catch(e => {
        var errorStatus = e.Status;
        this.dialog.errorPrompt(errorStatus);
      });
  }

  updateShift() {
    $("#UbahShift").modal('hide');
    this.error = {};

    this.service
      .updateForShiftProcess(this.data)
      .then(result => {

        this.data.LoomHistory = [];

        if (result.length > 0) {
          result = this.remappingModels(result);
        }

        this.data.LoomHistory = result;
      }).catch(e => {
        var errorStatus = e.Status;
        this.dialog.errorPrompt(errorStatus);
      });
  }
}
