import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import Swal from 'sweetalert2';


@Injectable()
export class AuthService {

    constructor(public afAuth: AngularFireAuth) { }


    registerUser(email: string, pass: string) {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
            .then(userData => resolve(userData),
        err => reject (err));
        });
    }

    loginEmail(email: string, pass: string) {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.signInWithEmailAndPassword(email, pass)
                .then(userData => resolve(userData),
                    err => reject(err));
        })
            .catch(err => {
                console.error(err);
                Swal('Error en el ingreso', 'El usuario o contraseña no es válido', 'error');
            });
    }

    logout() {
        return this.afAuth.auth.signOut();
    }

    getAuth() {
        return this.afAuth.authState.map (auth => auth);
    }
}
