import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'app/shared/services/store.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-user-required-documents',
  templateUrl: './user-required-documents.component.html',
  styleUrls: ['./user-required-documents.component.scss']
})
export class UserRequiredDocumentsComponent implements OnInit {
  @ViewChild('labelStaffID') public labelStaffID: ElementRef;
  @ViewChild('labelGovtID') public labelGovtID: ElementRef;
  @ViewChild('labelUtlity') public labelUtlity: ElementRef;
  @ViewChild('bankStatement') public bankStatement: ElementRef;
  public existingRequiredDocs: Array<any> = [];
  public myForm = new FormGroup({
    staffIdFile: new FormControl('', [Validators.required]),
    staffIdFileSource: new FormControl('', [Validators.required]),
    governmentIdFile: new FormControl('', [Validators.required]),
    governmentIdFileSource: new FormControl('', [Validators.required]),
    utilityBillFile: new FormControl('', [Validators.required]),
    utilityBillFileSource: new FormControl('', [Validators.required])
  });


  public myStatementUploadForm = new FormGroup({
    file_password: new FormControl('', [Validators.required]),
    bankStatmentFile: new FormControl('', [Validators.required]),
    bankStatmentFileSource: new FormControl('', [Validators.required])
  });

  public isLoading: boolean = true;
  public hasExistingRequiredDocs: boolean = false;

  constructor(private storeService: StoreService,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.storeService.getUserKYCRequiredDocs().subscribe((results: any) => {
      // console.log('results-show', results)
      if (results.data !== null) {
        this.existingRequiredDocs = results.data.records;
        this.hasExistingRequiredDocs = true;
      }
      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  get f() {
    return this.myForm.controls;
  }

  get fsl() {
    return this.myStatementUploadForm.controls;
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  onFileChange(event: any, params: any) {


    switch (params) {
      case 1:
        if (event.target.files.length > 0) {
          const file: any = event.target.files[0];
          this.labelStaffID.nativeElement.innerText = Array.from(event.target.files)
            .map((f: any) => f.name)
            .join(', ');

          // console.log(' this.labelStaffID.nativeElement.innerText', this.labelStaffID.nativeElement.innerText)
          this.labelStaffID.nativeElement.className += '-chosen';
          this.myForm.patchValue({
            staffIdFileSource: file
          });
        }
        break;
      case 2:
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.labelGovtID.nativeElement.innerText = Array.from(event.target.files)
            .map((f: any) => f.name)
            .join(', ');
          this.labelGovtID.nativeElement.className += '-chosen';
          this.myForm.patchValue({
            governmentIdFileSource: file
          });
        }
        break;
      case 3:
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.labelUtlity.nativeElement.innerText = Array.from(event.target.files)
            .map((f: any) => f.name)
            .join(', ');

          this.labelUtlity.nativeElement.className += '-chosen';
          this.myForm.patchValue({
            utilityBillFileSource: file
          });
        }
        break;

      default:
        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.labelUtlity.nativeElement.innerText = Array.from(event.target.files)
            .map((f: any) => f.name)
            .join(', ');

          this.labelUtlity.nativeElement.className += '-chosen';
          this.myStatementUploadForm.patchValue({
            bankStatmentFileSource: file
          });
        }
        break;
    }
  }


  submitRequired() {
    if (this.myForm.valid) {
      const formData = new FormData();
      formData.append('fileUpload[]', this.myForm.get('staffIdFileSource')?.value);
      formData.append('fileUpload[]', this.myForm.get('governmentIdFileSource')?.value);
      formData.append('fileUpload[]', this.myForm.get('utilityBillFileSource')?.value);

      this.http.post(`${environment.API_URL}/kyc-documents/add/`, formData)
        .subscribe(res => {
          console.log(res);
          alert('Uploaded Successfully.');
          this.router.navigate(['/property-search/checkout']);
        }, error => {
          console.log('_submit() error', error)
        })
    }
  }

  submitStatementRequired() {
    if (this.myStatementUploadForm.valid) {
      const formData = new FormData();
      formData.append('fileUpload[]', this.myForm.get('bankStatmentFileSource')?.value);
      formData.append('file_password', this.myForm.get('file_password')?.value);
      this.http.post(`${environment.API_URL}/kyc-documents/add/`, formData)
        .subscribe(res => {
          console.log(res);
          alert('Uploaded Successfully.');
          this.router.navigate(['/property-search/checkout']);
        }, error => {
          console.log('_submit() error', error)
        })
    }
  }

  public loadDocuments() {
    this.storeService.getUserKYCRequiredDocs().subscribe((results: any) => {
      // console.log('results-show', results)
      if (results.data !== null) {
        this.existingRequiredDocs = results.data.records;
        this.hasExistingRequiredDocs = true;
      }
      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });
  }

  // TODO Implement CDN Removal from backend

  /**
   * The removeDocument function is used to delete a document from the database
   * @param {any} param - any
   */
  public removeDocument(param: any) {
    this.http.delete(`${environment.API_URL}/kyc-documents/remove/${param.id}`)
      .subscribe(res => {
        console.log(res);
        alert('Uploaded Successfully.');
        this.loadDocuments()
      }, error => {
        console.log('_submit() error', error)
      })
  }

}
