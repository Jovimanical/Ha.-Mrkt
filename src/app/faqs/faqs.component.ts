import { Component, OnInit } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FAQsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
     //   accordion ------------------
     $(".accordion a.toggle").on("click", function (a) {
      a.preventDefault();
      $(".accordion a.toggle").removeClass("act-accordion");
      $(this).addClass("act-accordion");
      if ($(this).next('div.accordion-inner').is(':visible')) {
        $(this).next('div.accordion-inner').slideUp();
      } else {
        $(".accordion a.toggle").next('div.accordion-inner').slideUp();
        $(this).next('div.accordion-inner').slideToggle();
      }
    });
    $(".accordion-lite-header").on("click", function () {
      $(this).parent(".accordion-lite-container").find(".accordion-lite_content").slideToggle(400);
      $(this).toggleClass("acc_open");
    });
    $('.faq-nav li a').on("click", function () {
      $('.faq-nav li a').removeClass("act-faq-link");
      $(this).addClass("act-faq-link");
    });
  }

}
