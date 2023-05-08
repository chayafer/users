import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl='https://localhost:7158/WeatherForecast';
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  //fullname(fullname: any)
  //{
  //  throw new Error('Method not implemented.');
 // }
 // email: any;

  constructor(private http:HttpClient) { }

  getUsers():any {

    this.http.get<User[]>(`${this.baseUrl}`)
      .subscribe(newValue => this.usersSubject.next(newValue));;

    return this.users$;
  }
  handleError(handleError: any): any {
    throw new Error('Method not implemented.');
  }

}
