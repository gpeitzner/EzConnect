import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Publication } from 'src/app/interfaces/publication';
import { User } from 'src/app/interfaces/user';
import { PublishService } from 'src/app/services/publish.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  publicationText: string;
  publicationPhoto: string;

  account: User;
  users: User[] = [];
  suggestions: User[] = [];
  requests: User[] = [];
  pendings: User[] = [];
  friends: User[] = [];
  publications: Publication[] = [];

  creatingPublication: boolean;
  publicationError: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private publishService: PublishService
  ) {
    if (!this.userService.user) {
      this.router.navigateByUrl('/');
    } else {
      this.getCoreData();
    }
  }

  ngOnInit(): void {}

  handleExit(): void {
    this.userService.user = null;
    this.router.navigateByUrl('/');
  }

  async getCoreData(): Promise<void> {
    try {
      this.account = await this.userService
        .getUser(this.userService.user.email)
        .toPromise();
      this.userService.user = this.account;
      this.users = await this.userService.getAll().toPromise();
      this.users = this.users.filter(
        (user: User) => user.email != this.account.email
      );
      this.suggestions = this.users.filter(
        (user: User) =>
          !this.account.friends.includes(user.email) &&
          !this.account.invitations.includes(user.email) &&
          !user.invitations.includes(this.account.email)
      );
      this.requests = this.users.filter((user: User) =>
        this.account.invitations.includes(user.email)
      );
      this.pendings = this.users.filter((user: User) =>
        user.invitations.includes(this.account.email)
      );
      this.friends = this.users.filter((user: User) =>
        this.account.friends.includes(user.email)
      );
      const allPublications = await this.publishService.getAll().toPromise();
      this.publications = allPublications.filter(
        (publication) =>
          publication.email === this.account.email ||
          this.account.friends.includes(publication.email)
      );
    } catch (error) {
      console.log(error);
    }
  }

  sendInvitation(suggestion: User): void {
    suggestion.invitations.push(this.account.email);
    this.userService.updateUser(suggestion).subscribe(
      () => this.getCoreData(),
      (error) => console.log(error)
    );
  }

  cancelInvitation(pending: User): void {
    pending.invitations = pending.invitations.filter(
      (invitation) => invitation != this.account.email
    );
    this.userService.updateUser(pending).subscribe(
      () => this.getCoreData(),
      (error) => console.log(error)
    );
  }

  async acceptInvitation(request: User): Promise<void> {
    try {
      this.account.invitations = this.account.invitations.filter(
        (invitation) => invitation != request.email
      );
      this.account.friends.push(request.email);
      await this.userService.updateUser(this.account).toPromise();
      request.friends.push(this.account.email);
      await this.userService.updateUser(request).toPromise();
      this.getCoreData();
    } catch (error) {
      console.log(error);
    }
  }

  declineInvitation(request: User): void {
    this.account.invitations = this.account.invitations.filter(
      (invitation) => invitation != request.email
    );
    this.userService.updateUser(this.account).subscribe(
      () => this.getCoreData(),
      (error) => console.log(error)
    );
  }

  async deleteFriend(friend: User): Promise<void> {
    try {
      this.account.friends = this.account.friends.filter(
        (currentFriend) => currentFriend != friend.email
      );
      await this.userService.updateUser(this.account).toPromise();
      friend.friends = friend.friends.filter(
        (currentFriend) => currentFriend != this.account.email
      );
      await this.userService.updateUser(friend).toPromise();
      this.getCoreData();
    } catch (error) {
      console.log(error);
    }
  }

  handlePhoto(event: any): void {
    if (event.target.files[0]) {
      this.toBase64(event.target.files[0])
        .then((image) => (this.publicationPhoto = image))
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

  makePublication(): void {
    if (this.publicationText && this.publicationPhoto) {
      let friendsData = [];
      for (let i = 0; i < this.friends.length; i++) {
        const friend = this.friends[i];
        const photoName = friend.photo.split('/');
        friendsData.push({
          name: friend.name,
          photo: photoName[photoName.length - 1],
        });
      }
      const params = {
        email: this.account.email,
        name: this.account.name,
        avatar: this.account.photo,
        text: this.publicationText,
        friends: friendsData,
        photo: this.publicationPhoto,
      };
      this.creatingPublication = true;
      this.publishService.createPublication(params).subscribe(
        () => {
          this.publicationError = '';
          this.creatingPublication = false;
          this.clearPublicationData();
          this.getCoreData();
        },
        (error) => {
          this.publicationError = 'No se pudo crear la publicación';
          this.creatingPublication = false;
          console.log(error);
        }
      );
    } else {
      this.publicationError = 'Una publicación lleva texto y una imagen';
    }
  }

  clearPublicationData(): void {
    this.publicationText = '';
    this.publicationPhoto = '';
  }
}
