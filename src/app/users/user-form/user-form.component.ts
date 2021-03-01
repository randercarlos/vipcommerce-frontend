import { UserService } from './../user.service';
import { NotificationService } from './../../core/services/notification.service';
import { AppConfigService } from './../../core/services/app-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from './../user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FORM_MODE } from '../../core/enums/form-mode.enum';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UploadService } from './../../core/services/upload.service';
import { ValidationService } from './../../core/services/validation.service';
import { NotificationType } from 'src/app/core/enums/notification-type.enum';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: [ConfirmationService]
})
export class UserFormComponent implements OnInit {


  formMode: FORM_MODE;                      // store the form mode from route data
  FORM_MODE: typeof FORM_MODE = FORM_MODE;  // allow to use the enum FORM_MODE in template
  user: User;
  originalUser: User;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public appConfig: AppConfigService,
    public uploadService: UploadService,
    public validationService: ValidationService,
    public notificationService: NotificationService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loadForm();
  }

  private loadForm(): void {

    this.createForm();

    // get the form mode from route data
    this.route.data.subscribe(data => {
      this.formMode = data.formMode ? data.formMode : FORM_MODE.Create; // default is create/new form

      if (this.formMode === FORM_MODE.View) {
        this.userForm.disable();
      }

      if (this.formMode !== FORM_MODE.Create) {
        const id_user = this.route.snapshot.params['id'];
        // load the user from DB
        this.loadUser(id_user);
      }

    });
  }

  private createForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
      gender: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      birthday: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      id_value: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      phone: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      nat: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      street: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      postcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
    });
  }


  private loadUser(id: string): void {
    this.userService.loadByID(id).subscribe(user => {
      this.user = user;

      // create a clone of the loaded product to restore it when the Cancel button is clicked
      this.originalUser = user;
      this.populateForm();
    });
  }

  private populateForm(): void {
    this.userForm.setValue({
      name: this.user.person.name,
      email: this.user.person.email,
      gender: this.user.person.gender,
      birthday: this.user.person.birthday,
      id_value: this.user.person.id_value,
      phone: this.user.person.phone,
      nat: this.user.person.nat,
      street: this.user.location.street,
      number: this.user.location.number,
      city: this.user.location.city,
      state: this.user.location.state,
      country: this.user.location.country,
      postcode: this.user.location.postcode,
    });
  }

  cancel(): void {
    this.confirmationService.confirm({ message: this.translateService.instant('global.confirm_cancel_msg'),
      accept: () => {

        this.userForm.reset();
        if (this.formMode === FORM_MODE.Edit) {
          this.user = { ...this.originalUser };
          this.populateForm();
        }

      }
    });

  }

  save(): void {
    const data = this.userForm.value;
    if (this.route.snapshot.paramMap.get('id')) {
      data.uuid = this.route.snapshot.paramMap.get('id');
    }

    this.userService.save(data).subscribe(response => {
      this.router.navigateByUrl('/users');

      this.notificationService.notify(this.translateService.instant('global.success_msg'),
        this.translateService.instant('users.successfull_save_msg', { value: this.userForm.get('name').value }),
          NotificationType.Success);
    });
  }
}
