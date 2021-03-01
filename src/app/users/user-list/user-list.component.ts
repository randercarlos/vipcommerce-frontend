import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../core/services/notification.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from './../user.model';
import { AppConfigService } from '../../core/services/app-config.service';
import { TableColumns } from '../../core/interfaces/table-columns.interface';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { UserService } from '../user.service';
import { UtilService } from './../../core/services/util.service';
import * as jsPDF from "jspdf";
import "jspdf-autotable";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
  providers: [ConfirmationService]
})
export class UserListComponent implements OnInit {

  users: User[];
  tableColumns: TableColumns[];
  totalRecords: number;
  tableLoading: boolean = true;
  nats: string[];

  userFilterForm = this.fb.group({
    name: [''],
    gender: [''],
    nat: ['']
  });

  constructor(
    public appConfig: AppConfigService,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private userService: UserService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {

    this.nats = [];
    this.tableColumns = [
      { field: "person.name", header: "global.name", sort: false },
      { field: "person.email", header: "global.email", sort: false },
      { field: "person.nat", header: "global.nationatily", width: "90px", align: "center", sort: false },
      { field: "person.gender", header: "global.gender", width: "120px", align: "center", sort: false },
      { field: "person.birthday", header: "global.birthday", width: "150px", align: "center", sort: false },
      { field: "actions", header: "global.actions", width: "110px", align: "center", sort: false },
    ];

    this.loadUsers();
  }

  loadUsers(event?: LazyLoadEvent, filters?: object): void {

    this.tableLoading = true;
    this.userService
      .loadByFilters(event, filters ? filters : this.userFilterForm.value)
      .subscribe(resp => {
        this.users = resp.body['data'];
        this.users = this.users.map(user => {

          this.nats.push(user.person.nat);
          user = this.utilService.flattenObj(user);

          return user;
        });
        this.nats = [... new Set(this.nats)];
        this.totalRecords = resp.body['total'];
        this.tableLoading = false;
      });

  }

  public filter(): void {
    this.loadUsers(null, this.userFilterForm.value);
  }


  confirm(record): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('global.confirm_remove_msg',
        { value: this.translateService.instant('users.the_user').toLowerCase() + ` <b>${name}</b>` }),
      accept: () => {

        this.userService.deleteById(record.uuid).subscribe(data => {

          this.notificationService.notify(this.translateService.instant('global.success_msg'),
            this.translateService.instant('global.successfull_remove_msg',
            { value: this.translateService.instant('users.the_user') + ` <b>${record.name}</b>` }))

            this.loadUsers();
          });
      }
    });
  }
}
