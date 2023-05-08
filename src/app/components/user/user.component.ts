import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import Validation from 'src/app/utils/validation';
import {User} from 'src/app/models/user';
import { map, Observable, of } from 'rxjs';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})

export class UserComponent {
  users:User[]=[];
   //currentUser: User;
   currentUser:User|undefined;
  idErrorMsg!:string|null;
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  submitted = false;
  sub: any;

  constructor(private formBuilder: FormBuilder,public userservice:UserService) {}


  ngOnInit(): void {

    //this.userservice.getUsers();
    // this.sub = this.userservice.getUsers().subscribe((response: User[]) => {
    //   this.users=response;
    // });

   //declaration

    const user:User= {id:'060869211',username:'aa', email:'a@gmail.com',address:'',password:'',confirmPassword:''};
            //declaration
this.users = [user];

    this.form = this.formBuilder.group(
      {
        id: ['', Validators.required,
        this.checkValidId()],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );

    this.onChanges()


  }
onChanges(){
  this.f["id"].valueChanges.subscribe(selectedValue => {
  this.currentUser=this.getUser(selectedValue);
  this.initForm();
   if(!this.currentUser){
      return;
   }
  })

  this.form.get("address")?.valueChanges.subscribe(selectedValue => {

   console.log('address changed')
    console.log(selectedValue)
  })
}
initForm(){
  this.f["username"].setValue(this.currentUser?.address);
  this.f["email"].setValue(this.currentUser?.email);
}

checkValidId(): ValidatorFn {
  return (control:AbstractControl) : Observable<ValidationErrors | null>=> {

      const value = control.value;

      if (!value || value.length > 9 || value.length < 5) {
          return of( {idError:true});
      }

      const valid= Array
      .from(value, Number)
      .reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
      }) % 10 === 0;


      return of(!valid ? {idError:true}: null);
  }
}

checkValidIdOld(): boolean {
  {
    var id = this.currentUser?.id.trim();
    if (!id || id.length > 9 || id.length < 5) return false;

    // Pad string with zeros up to 9 digits
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

    return Array
      .from(id, Number)
      .reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
      }) % 10 === 0;

  }
}
getUser(selectedValue:any) {
   return this.users.find(use => use.id === selectedValue);
}

get f(): { [key: string]: AbstractControl } {
  return this.form.controls;
}

getuserFromObservable(selectedValue:string){
  return this.userservice.users$.pipe(map(users => users.filter(u => u.id === selectedValue)));
}


onSubmit(): void {
  this.submitted = true;

  if (this.form.invalid) {
    return;
  }

  console.log(JSON.stringify(this.form.value, null, 2));
}

onReset(): void {
  this.submitted = false;
  this.form.reset();
}
}


