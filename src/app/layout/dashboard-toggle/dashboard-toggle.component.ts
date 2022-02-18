import { Component, OnInit } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-dashboard-toggle',
  templateUrl: './dashboard-toggle.component.html',
  styleUrls: ['./dashboard-toggle.component.scss']
})
export class DashboardToggleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(".dashboard-menu-btn").on("click", function () {
      $(".dashbard-menu-wrap").addClass("dashbard-menu-wrap_vis");
      $(".dashbard-menu-overlay").fadeIn(100);
    });

    $(".dashbard-menu-close , .dashbard-menu-overlay").on("click", function () {
      $(".dashbard-menu-wrap").removeClass("dashbard-menu-wrap_vis");
      $(".dashbard-menu-overlay").fadeOut(100);
    });

    //   css ------------------
    var $window2 = $(window);
    $window2.on("resize", function () {
      var ww3 = $window2.width();
      if (ww3 > 1270) {
        $(".dashbard-menu-overlay").css({
          display: "none",
        });
        $(".dashbard-menu-wrap").removeClass("dashbard-menu-wrap_vis");
      }
    });
  }

}
