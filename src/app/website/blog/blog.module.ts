import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'app/layout/layout.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';


@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
