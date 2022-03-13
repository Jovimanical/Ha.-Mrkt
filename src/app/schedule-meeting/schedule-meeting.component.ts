import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent implements OnInit {

  public scheduleMeetingForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  // validate form input and call meeting API
  onSubmit() {

    if (this.isFormValid) {
      this.scheduleMeeting();
    }
  }

  private scheduleMeeting() {
    const payloads = this.scheduleMeetingForm.value;
    const meetingDatetime = new Date(payloads.meeting_date);
    const timeValue = payloads.time.split(':');

    // Hours are worth 60 minutes.
    const minutes = (+timeValue[0]) * 60 + (+timeValue[1]);
    meetingDatetime.setMinutes(minutes);

    // set meeting datetime
    payloads.meeting_date = meetingDatetime;

    const durationInMinutes = (payloads.duration_hours * 60) + payloads.duration_minutes;
    // set meeting duration
    payloads.duration = durationInMinutes;

    this._httpClient.post(`${environment.API_URL}/schedule-meeting/add`, payloads).subscribe((res: any) => {
      this.displayMessage(res.message);
    }, (error: any) => {
      this.displayMessage(error.message);
    })
  }

  private displayMessage(message: string) {
    this._snackBar.open(message, "Okay", {
      duration: 5000
    });
  }

  private get isFormValid(): boolean {
    return this.scheduleMeetingForm.valid;
  }

  private initForm(): void {
    this.scheduleMeetingForm = this.formBuilder.group({
      meeting_topic: ['', Validators.required],
      meeting_fullname: ['', Validators.required],
      meeting_email: ['', Validators.required],
      meeting_phone: ['', Validators.required],
      meeting_date: ['', [Validators.required]],
      meeting_time: ['', [Validators.required]],
      meeting_duration_hours: ['', [Validators.required]],
      meeting_duration_minutes: ['', [Validators.required]],
    })
  }
}

