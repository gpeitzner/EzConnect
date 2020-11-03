import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  loginEmail: string;
  loginPassword: string;

  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerConfirmPassword: string;
  registerPhoto: any;

  constructor() {}

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
      console.log(params);
      this.clearLoginData();
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
      const params = {
        name: this.registerName,
        email: this.registerEmail,
        password: this.registerPassword,
        photo: this.registerPhoto,
      };
      console.log(params);
      this.clearRegisterData();
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
