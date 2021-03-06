import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
var moment = require("moment");

@inject(Router, Service)
export class Edit {
    // isEdit = true;
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    bind() {
        this.error = {};
    }


    async activate(params) {
        let id = params.id;
        this.data = await this.service.getById(id);
    }

    cancelCallback(event) {
        this.router.navigateToRoute('view', { id: this.data.Id });
    }

    saveCallback(event) {
        // this.error = {};
        // var errorCount = 0;
        // if(this.data.Date==null){
        //     this.error.Date="Date tidak boleh kosong";
        //     errorCount++;
        // }
        // if(!this.data.ProcessType || this.data.ProcessType==""){
        //     this.error.ProcessType="Jenis Proses tidak boleh kosong";
        //     errorCount++;
        // }
        // if(!this.data.MaterialTypeId || this.data.MaterialTypeId==""){
        //     this.error.MaterialTypeId="Nama Benang tidak boleh kosong";
        //     errorCount++;
        // }
        // if(!this.data.LotId || this.data.LotId==""){
        //     this.error.LotId="Lot tidak boleh kosong";
        //     errorCount++;
        // }
        // if(!this.data.Shift || this.data.Shift==""){
        //     this.error.Shift="Shift tidak boleh kosong";
        //     errorCount++;
        // }
        // if(!this.data.Group || this.data.Group==""){
        //     this.error.Group="Group tidak boleh kosong";
        //     errorCount++;
        // }
        // if(!this.data.UnitDepartmentId || this.data.UnitDepartmentId){
        //     this.error.UnitDepartmentId="Unit tidak boleh kosong";
        //     errorCount++;
        // }

        // if(errorCount==0){
            this.data.Date = this.data.Date ? moment(this.data.Date).format("DD MMM YYYY") : null;
        this.service.update(this.data)
            .then(result => {
                this.cancelCallback();
            })
            .catch(e => {
                this.error = e;
                alert("Missing Some Data");
            });
        // }
    }
}
