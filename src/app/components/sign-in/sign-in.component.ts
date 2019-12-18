import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {

    public form: FormGroup;
    public pending = false;

    constructor(private router: Router,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl('', [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
        });
    }

    get email() {
        return this.form.get('email');
    }

    get password() {
        return this.form.get('password');
    }

    signIn() {
        console.log('signIn', this.form.value);

        this.pending = true;
        const { email, password } = this.form.value;

        this.authService.login({ email, password })
            .then(result => {
                console.log('signIn success', result);
                this.router.navigate([ '/trips' ]);
            })
            .catch(error => {
                console.log('signIn error', error);
                if (error && error.code === 'auth/user-not-found') {
                    this.email.setErrors({
                        userNotFound: error.message,
                    });
                }
                if (error && error.code === 'auth/wrong-password') {
                    this.password.setErrors({
                        wrongPassword: error.message,
                    });
                }
                if (error && error.code === 'auth/too-many-requests') {
                    this.form.setErrors({
                        tooManyRequests: error.message,
                    });
                }
            })
            .finally(() => this.pending = false);
    }

}
