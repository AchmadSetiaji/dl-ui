import { inject } from 'aurelia-framework';
import moment from 'moment';
import numeral from 'numeral';
import XLSX from 'xlsx';
import { Service, PurchasingService } from './service';
const SupplierLoader = require('../../../../loader/supplier-loader');
const DivisionLoader = require('../../../../loader/division-loader');
const UnitPaymentOrderLoader = require('../../../../loader/unit-payment-order-loader');
const DispositionLoader = require('../../../../loader/purchase-dispositions-all-loader');
@inject(Service, PurchasingService)
export class List {
    columns = [
        [
            { field: 'DispositionNo', title: 'No. Disposisi', rowspan: 2, sortable: true },
            {
                field: 'CreatedUtc', title: 'Tgl Disposisi', formatter: function (value, data, index) {
                    return moment(value).format('DD MMM YYYY');
                },
                rowspan: 2,
                sortable: true,
            },
            {
                field: 'PaymentDueDate', title: 'Tgl Jatuh Tempo', formatter: function (value, data, index) {
                    return moment(value).format('DD MMM YYYY');
                },
                rowspan: 2,
                sortable: true,
            },
            { field: 'InvoiceNo', title: 'Nomor Invoice', rowspan: 2, sortable: true },
            { field: 'SupplierName', title: 'Supplier', rowspan: 2, sortable: true },
            
            {
                field: 'Position', title: 'Posisi', formatter: (value, data, index) => {
                    let status = this.itemsStatus.find(p => p.value === value);
                    return status.text;
                },
                rowspan: 2,
                sortable: true,
            },
            {
                field: 'SentToVerificationDivisionDate', title: 'Tgl Pembelian Kirim', formatter: function (value, data, index) {
                    return value ? moment(value).format('DD MMM YYYY') : '-';
                },
                rowspan: 2,
            },
            { title: 'Verifikasi', colspan: 3 },
            { title: 'Kasir', colspan: 5 }
        ], [
            {
                field: 'VerificationDivisionDate', title: 'Tgl Terima', formatter: function (value, data, index) {
                    return value ? moment(value).format('DD MMM YYYY') : '-';
                },
            },
            {
                field: 'VerifyDate', title: 'Tgl Cek', formatter: function (value, data, index) {
                    return value ? moment(value).format('DD MMM YYYY') : '-';
                },
            },
            {
                field: 'SendDate', title: 'Tgl Kirim', formatter: function (value, data, index) {
                    return value ? moment(value).format('DD MMM YYYY') : '-';
                },
            },
            {
                field: 'CashierDivisionDate', title: 'Tgl Terima', formatter: function (value, data, index) {
                    return value ? moment(value).format('DD MMM YYYY') : '-';
                },
            },
            {
                field: 'BankExpenditureNoteDate', title: 'Tgl Bayar', formatter: function (value, data, index) {
                    return value ? moment(value).format('DD MMM YYYY') : '-';
                },
            },
            {
                field: 'BankExpenditureNoteNo', title: 'No Kuitansi'
            },
            {
                field: 'BankExpenditureNotePPHDate', title: 'Tgl Bayar PPH', formatter: function (value, data, index) {
                    return value ? moment(value).format('DD MMM YYYY') : '-';
                },
            },
            {
                field: 'BankExpenditureNotePPHNo', title: 'No Kuitansi PPH'
            },
        ]
    ];

    controlOptions = {
        label: {
            length: 4,
        },
        control: {
            length: 4,
        },
    };

    tableOptions = {
        showColumns: false,
        search: false,
        showToggle: false,
    };

    constructor(service, purchasingService) {
        this.service = service;
        this.purchasingService = purchasingService;

        this.flag = false;
        this.selectDisposition = ['DispositionNo'];
        this.selectSupplier = ['code', 'name'];
        this.itemsStatus = [
            { text: '', value: 0 },
            { text: 'Bag. Pembelian', value: 1 },
            { text: 'Dikirim ke Bag. Verifikasi', value: 2 },
            { text: 'Bag. Verifikasi', value: 3 },
            { text: 'Dikirim ke Bag. Kasir', value: 4 },
            { text: 'Dikirim ke Bag. Keuangan', value: 5 },
            { text: 'Dikirim ke Bag. Pembelian', value: 6 },
            { text: 'Bag. Kasir', value: 7 },
            { text: 'Bag. Keuangan', value: 8 },
        ];
    }

    loader = (info) => {
        let order = {};
        var postedDateFrom = null;
        var postedDateTo = null;
        if (info.sort)
            order[info.sort] = info.order;

        let filter = {};

        if (this.disposition) {
            filter.dispositionNo = this.disposition.DispositionNo;
        }

        if (this.supplier) {
            filter.supplierCode = this.supplier.code;
        }

        if (this.Position.value != 0) {
            filter.Position = this.Position.value;
        }

            
        let arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            filter: JSON.stringify(filter),
            order: order
        };

        arg.dateFrom = this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : null;
        arg.dateTo = this.dateTo? moment(this.dateTo).format("YYYY-MM-DD") : null;
        return this.flag ? (
            this.service.getReport(arg)
                .then(result => {
                    return {
                        total: result.info.Count,
                        data: result.data
                    };
                })
        ) : { total: 0, data: [] };
    }

    search() {
        this.flag = true;
        this.tableList.refresh();
    }

    getExcelData() {
        let order = {};
        var postedDateFrom = null;
        var postedDateTo = null;
        
        let filter = {};

        if (this.disposition) {
            filter.dispositionNo = this.disposition.DispositionNo;
        }

        if (this.supplier) {
            filter.supplierCode = this.supplier.code;
        }

        if (this.Position.value != 0) {
            filter.Position = this.Position.value;
        }

        if (this.dateFrom && this.dateTo) {
            postedDateFrom = this.dateFrom;
            postedDateTo = this.dateTo;
        }
            
        let arg = {
            filter: JSON.stringify(filter)
        };

        arg.dateFrom = this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : null;
        arg.dateTo = this.dateTo? moment(this.dateTo).format("YYYY-MM-DD") : null;
        this.service.getXls(arg);
    }

    excel() {
        this.getExcelData();
    }

    reset() {
        this.flag = false;
        this.unitPaymentOrder = undefined;
        this.supplier = undefined;
        this.division = undefined;
        this.Position = { value: 0 };
        this.dateFrom = undefined;
        this.dateTo = undefined;
        this.tableList.refresh();
    }

    get supplierLoader() {
        return SupplierLoader;
    }

    get dispositionLoader(){
        return DispositionLoader;
    }
}
