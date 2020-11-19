import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {WordsComponent} from './component/game/words/words.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'game',
    children: [
      {
        path: 'words',
        component: WordsComponent
      }
    ]},
  { path: '',   redirectTo: '/login', pathMatch: 'full' }, // redirect to `first-component`
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
