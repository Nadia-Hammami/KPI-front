import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../../../services/nav.service';
import {KpiService} from '../../../../services/api/kpi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public menuItems: any;
  public items: any;

  public searchResult = false;
  public searchResultEmpty = false;
  public text: string;
  public projectList: any;
  public notif: any;

   constructor(public navServices: NavService, private kpiService: KpiService, private router: Router) {
    this.kpiService.getAllProject().subscribe((response: any) => {
      this.projectList = response?.result;
    }, (error: any) => {
    });

     // this.navServices.items.subscribe(menuItems => this.items = menuItems);
  }

  ngOnInit() {
  }

  searchToggle() {
    this.navServices.search = false;
  }

  searchTerm(term: any) {
    term ? this.addFix() : this.removeFix();
    if (!term) { return this.menuItems = []; }
    const items = [];
    term = term.toLowerCase();
    this.projectList.filter(menuItems => {
      if (!menuItems?.name) { return false; }
      if (menuItems.name.toLowerCase().includes(term)) {
        console.log(menuItems);
        items.push(menuItems);
      }
      this.checkSearchResultEmpty(items);
      this.menuItems = items;
    });
  }

  checkSearchResultEmpty(items) {
    if (!items.length) {
      this.searchResultEmpty = true;
    }
    else {
      this.searchResultEmpty = false;
    }
  }

  addFix() {

    this.searchResult = true;
    document.getElementsByTagName('body')[0].classList.add('offcanvas');
  }

  removeFix() {
    this.searchResult = false;
    this.text = '';
    document.getElementsByTagName('body')[0].classList.remove('offcanvas');
  }
  navigateTo(key){
    this.removeFix();
    this.router.navigate(['dashboard/search/' + key ]);
  }
}
