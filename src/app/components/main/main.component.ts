import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  loginEmail: string;
  loginPassword: string;
  loginError: string;

  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerConfirmPassword: string;
  registerPhoto: any;
  registerError: string;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  clearLoginData(): void {
    this.loginEmail = '';
    this.loginPassword = '';
  }

  clearRegisterData(): void {
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.registerPhoto = null;
  }

  handleLogin(): void {
    if (this.loginEmail && this.loginPassword) {
      const params = {
        email: this.loginEmail,
        password: this.loginPassword,
      };
      this.userService.login(params).subscribe(
        (data: User) => {
          this.userService.user = data;
          this.router.navigateByUrl('/home');
          this.clearLoginData();
        },
        () => {
          this.loginError = 'Credenciales inválidas';
          this.clearLoginData();
        }
      );
    } else {
      this.loginError = 'Ingresa tus datos de acceso';
    }
  }

  handleRegister(): void {
    if (
      this.registerEmail &&
      this.registerEmail &&
      this.registerPassword &&
      this.registerConfirmPassword &&
      this.registerPhoto
    ) {
      if (this.registerPassword === this.registerConfirmPassword) {
        const params = {
          name: this.registerName,
          email: this.registerEmail,
          password: this.registerPassword,
          photo: this.registerPhoto,
        };
        this.userService.register(params).subscribe(
          (data: User) => {
            this.userService.user = data;
            this.router.navigateByUrl('/home');
          },
          () => {
            this.registerError = 'No se pudo crear tu cuenta';
            this.clearRegisterData();
          }
        );
      } else {
        this.registerError = 'Las contraseñas no coinciden';
      }
    } else {
      this.registerError = 'Todos los campos son obligatorios';
    }
  }

  handlePhoto(event: any): void {
    if (event.target.files[0]) {
      this.toBase64(event.target.files[0])
        .then((image) => (this.registerPhoto = image))
        .catch((error) => console.log(error));
    }
  }

  toBase64(image: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = function () {
        resolve(
          reader.result
            .toString()
            .substring(22, reader.result.toString().length)
        );
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }
}
