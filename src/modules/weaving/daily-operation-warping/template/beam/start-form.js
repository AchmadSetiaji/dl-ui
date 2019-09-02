import { inject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "../../service";
import moment from "moment";
var Operator = require("../../../../../loader/weaving-operator-loader");
//stock card beam
var Beam = require("../../../../../loader/weaving-beam-loader");

@inject(Service, Router)
export class StartForm {
    @bindable title;
    @bindable readOnly;
    @bindable OrderProduction;
    @bindable StartTime;
    @bindable Beam;
    @bindable startOperator;
    @bindable StartDate;

    constructor(service, router) {

        this.service = service;
        this.router = router;
    }

    bind(context) {

        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
    }

    cancelCallback(event) {
        console.log(this);
        this.list();
      }

    // Loaders
    get Operators() {

        return Operator;
    }

    get Beams() {
        return Beam;
    }

    //bindable method
    StartDateChanged(newValue) {
        this.data.StartDate = moment(newValue).utcOffset("+07:00").format();
    }

    startOperatorChanged(newValue) {
        if (newValue) {

            this.data.OperatorId = newValue.Id;
        }
    }

    BeamChanged(newValue) {
        if (newValue) {
            this.data.BeamId = newValue.Id;
            this.data.BeamType = newValue.Type;
        }
    }

    StartTimeChanged(newValue) {

        this.data.StartTime = newValue;
        this.service.getShiftByTime(newValue)
            .then(result => {

                this.data.StartShiftName = result.Name;
                this.data.ShiftId = result.Id;
            });
    }
}