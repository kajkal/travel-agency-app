import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit {

    public form: FormGroup;
    public pending = false;

    constructor(private router: Router,
                private authService: AuthService) {
    }

    get email() {
        return this.form.get('email');
    }

    get password() {
        return this.form.get('password');
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

    signUp() {
        console.log('signUp', this.form.value);

        this.pending = true;
        const { email, password } = this.form.value;

        this.authService.register({ email, password })
            .then(result => {
                console.log('signUp success', result);
                this.router.navigate([ '/trips' ]);
            })
            .catch(error => {
                console.log('signUp error', error);
                if (error && error.code === 'auth/email-already-in-use') {
                    this.email.setErrors({
                        emailTaken: true,
                    });
                }
            })
            .finally(() => this.pending = false);
    }

}
