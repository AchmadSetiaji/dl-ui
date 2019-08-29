import { RestService } from "../../../utils/rest-service";
import { Container } from "aurelia-dependency-injection";
import { Config } from "aurelia-api";
const serviceUri = 'weaving/daily-operations-warping';
const entryProcess = 'entry-process-operation';
const startProcess = 'weaving/daily-operations-warping/start-process';
const pauseProcess = 'weaving/daily-operations-warping/pause-process';
const resumeProcess = 'weaving/daily-operations-warping/resume-process';
const finishProcess = 'weaving/daily-operations-warping/finish-process';
const finishDailyOperation = 'weaving/daily-operations-warping/finish-process-operation'; 

export class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "weaving");
    }

    search(info) {
        var endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    getUnitById(Id) {
        var config = Container.instance.get(Config);
        var _endpoint = config.getEndpoint("core");
        var _serviceUri = `master/units/${Id}`;

        return _endpoint.find(_serviceUri).then(result => {
            return result.data;
        });
    }

    getShiftByTime(value) {
        var config = Container.instance.get(Config);
        var _endpoint = config.getEndpoint("weaving");
        var _serviceUri = `weaving/shifts/check-shift/${value}`;

        return _endpoint.find(_serviceUri).then(result => {
            return result.data;
        });
    }

    createOnEntryProcess(data) {
        var endpoint = `${serviceUri}/${entryProcess}`;
        return super.post(endpoint, data);
    }

    updateForStartProcess(data) {
        var endpoint = `${serviceUri}/${startProcess}`;
        return super.put(endpoint, data);
    }

    updateForStopProcess(data) {
        var endpoint = `${serviceUri}/${pauseProcess}`;
        return super.put(endpoint, data);
    }

    updateForResumeProcess(data) {
        var endpoint = `${serviceUri}/${resumeProcess}`;
        return super.put(endpoint, data);
    }

    updateForFinishProcess(data) {
        var endpoint = `${serviceUri}/${finishProcess}`;
        return super.put(endpoint, data);
    }

    updateForfinishDailyOperation(data) {
        var endpoint = `${serviceUri}/${finishDailyOperation}`;
        return super.put(endpoint, data);
    }

    getById(Id) {
        var endpoint = `${serviceUri}/${Id}`;
        return super.get(endpoint);
    }

    update(data) {
        var endpoint = `${serviceUri}/${data.Id}`;
        return super.put(endpoint, data);
    }
}