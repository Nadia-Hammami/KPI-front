import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UserService} from 'src/app/shared/services/api/user.service';
import {KpiService} from '../../../../shared/services/api/kpi.service';
// @ts-ignore

@Component({
    selector: 'app-users-create',
    templateUrl: './users-create.component.html',
    styleUrls: ['./users-create.component.scss']
})
export class UsersCreateComponent implements OnInit {
    public userForm: FormGroup;
    submitted = false;
    currentFile: any;
    products = [];
    role = [];
    users = [];
    public selectgroupby: string;
    public defaultBindingsList = [
        {value: '1', label: 'Alabama', job: 'Developer'},
        {value: '2', label: 'Wyoming', job: 'Developer'},
        {value: '3', label: 'Coming', job: 'Designer', disabled: true},
        {value: '4', label: 'Hanry Die', job: 'Designer'},
        {value: '5', label: 'John Doe', job: 'Designer'},
    ];

    constructor(private userService: UserService,
                private toasterService: ToastrService,
                private kpiService: KpiService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.userForm = new FormGroup({
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.required, Validators.email]),
            post: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
            ]),
            confirmPassword: new FormControl('', [Validators.required]),
            role: new FormControl(null, [Validators.required]),
            projects: new FormControl([], [Validators.required]),
        }, {validators: passwordMatchingValidatior});
        this.userService.getAllUsers().subscribe((response: any) => {
            this.users = response?.result;
        }, (error: any) => {
            this.toasterService.error('', error?.error?.message);
        });
        this.kpiService.getAllProjects().subscribe((response: any) => {
            this.products = response;
        }, (error: any) => {
        });
        this.userService.getRoles().subscribe((response: any) => {
            this.role = response;
        });
    }

    // tslint:disable-next-line:typedef
    ConfirmedValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (
                matchingControl.errors &&
                !matchingControl.errors.confirmedValidator
            ) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }
    // tslint:disable-next-line:typedef
    addNewUser() {
        this.submitted = true;
        if (this.userForm.invalid) {
            return;
        }
        const formData: any = new FormData();
        this.userForm.patchValue({
            role: {id: this.userForm.value.role},
        });
        if (this.currentFile) {
            formData.append('file', this.currentFile, this.currentFile.name);
            this.userService.uploadAvatar(formData).subscribe((res: any) => {
                const userForm = this.userForm.value;
                userForm.avatar = res?.result;
                this.addUser(userForm);
            }, (error: any) => {
                this.toasterService.error('', error?.error?.message);
            });
        } else {
            const userForm = this.userForm.value;
            userForm.avatar = 'defualt';
            this.addUser(userForm);
        }

    }

    // tslint:disable-next-line:typedef
    addUser(userForm: any) {
        console.log(userForm);
        this.userService.addUser(userForm).subscribe((response: any) => {
            this.toasterService.success('', response?.message);
            this.router.navigateByUrl('/user/index');
        }, (error: any) => {
            this.toasterService.error('', error?.error?.message);
        });
    }

    // tslint:disable-next-line:typedef
    compareFunction(item, selected) {
        return item.id === selected.id;
    }

}
export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { notmatched: true };
};
