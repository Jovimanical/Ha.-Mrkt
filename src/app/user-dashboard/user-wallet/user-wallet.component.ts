import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent implements OnInit {
  public PageName = "Wallet"
  constructor() { }

  ngOnInit(): void {
  }

}
