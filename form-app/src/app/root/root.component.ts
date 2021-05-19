import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {
  
  userForm : FormGroup;
  formSubmitted : boolean = false;
  emailIds = ["jay3dec@gmail.com","samhogn@gmail.com","abc@gmail.com"];
  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(10)]],
      lastName: ['',[Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email, this.duplicateEmailValidator.bind(this)]],
      employed : [''],
      companyName: ['']
    }, {validator : this.companyEmailValidation});

    this.handleValueChange();
    
  }

  handleValueChange(){
    this.userForm.get('employed').valueChanges.subscribe(response => {
      console.log('check response is ', response);
      if(response == true){
        this.userForm.get('companyName').setValidators(Validators.required);
      } else {
        this.userForm.get('companyName').clearValidators();
      }
      this.userForm.get('companyName').updateValueAndValidity();
    })
  }

  companyEmailValidation(formGroup : FormGroup){
    const email = formGroup.get('email').value;
    const company = formGroup.get('companyName').value;
    console.log('email ', email, ' company ', company);
    if(email && email.length > 0){
      let comName = email.split("@")[1].split(".")[0];
      if(company == comName) return null;
    }
    return {
      companyEmailError : true
    }
  }

  onSubmit(){
    if(this.userForm.valid){
      alert('good')
      this.http.post('/api/userCreate', this.userForm.value)
      .subscribe((response)=>{
        console.log('repsonsei ',response);
      })
    } else {
      this.formSubmitted = true;
    }
  }

  duplicateEmailValidator(control: FormControl){
    let email = control.value;
    if (email && this.emailIds.includes(email)) {
      return {
        duplicateEmailId: {
          email: email
        }
      }
    }
    return null;
  }

}
