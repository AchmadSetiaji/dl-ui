import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";

@inject(Router, Service)
export class View {
  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  async activate(params) {
    // var id = params.id;
    // this.data = await this.service.getById(id);
    this.data = {
      id: 1,
      unit: "Weaving1",
      machineNumber: "000001",
      machineType: "Type C",
      rpm: 50000,
      location: "Place A",
      block: "a",
      maintenance: "maintenance",
      operator: "operator"
    };
  }

  list() {
    this.router.navigateToRoute("list");
  }

  cancelCallback(event) {
    this.list();
  }

  editCallback(event) {
    this.router.navigateToRoute("edit", { id: this.data.id });
  }

  deleteCallback(event) {
    this.service.delete(this.data).then(result => {
      this.cancelCallback(event);
    });
  }
}
