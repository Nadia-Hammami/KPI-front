import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { MustMatch } from '../../shared/validators/passwordMatch';
import {passwordMatchingValidatior} from '../../components/apps/users/users-create/users-create.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public show = false;
  submitted = false;

  public showConfirmation = false;
  public resetPasswordForm: FormGroup;
  public showLoader = false;

  constructor(private toastr: ToastrService,
              public authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.params.token;
    // @ts-ignore
    // @ts-ignore
    this.resetPasswordForm = new FormGroup({
      token: new FormControl(token),
      password: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
      passwordConfirmation: new FormControl('', [Validators.required]),
    }, {validators: passwordMatchingValidatiorV1});
  }

  showPassword() {
    this.show = !this.show;
  }

  showPasswordConfirmation() {
    this.showConfirmation = !this.showConfirmation;
  }

  // Reset password request
  resetPassword() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.showLoader = true;
    this.authService.resetPassword(this.resetPasswordForm.value).subscribe((response: any) => {
      this.showLoader = false;
      this.toastr.success('password changed successfully', response?.message);
      this.router.navigate(['/auth/login']);
    }, (error: any) => {
      this.showLoader = false;
      this.toastr.error(error?.error?.message, error?.error?.error);
    });
  }
}
export const passwordMatchingValidatiorV1: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('passwordConfirmation');
  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};
