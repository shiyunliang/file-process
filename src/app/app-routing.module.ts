import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExcelSplitComponent } from './excel/excel-split/excel-split.component';
import { TextCompareComponent } from './text/text-compare/text-compare.component';

const routes: Routes = [
  { path: 'excel/split', component: ExcelSplitComponent },
  { path: 'text/compare', component: TextCompareComponent },
  { path: '', redirectTo: 'excel/split', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
