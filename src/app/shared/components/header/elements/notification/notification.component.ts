import {Component, OnInit} from '@angular/core';
import {KpiService} from '../../../../services/api/kpi.service';
class Notif {
  constructor(
      public name: string,
      public id: number,

  ) {}
}
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  public openNotification = false;
  public notif: any;
  public isloaded = false;
  public total = 4;
  constructor(private kpiService: KpiService) { }

  ngOnInit() {
    const res = [
      {
        name: 'ticket ferme',
        id : 12
      },
      {
        name: 'ticket modifier',
        id : 13
      },
      {
        name: 'ticket ajouté',
        id : 14
      },
      {
        name: 'projet creér',
        id : 15
      }
    ];

    this.isloaded = true;

    this.notif = res.map((rest) => {
      return new Notif(rest.name, rest.id);
    });
  }

  getNotif(){
    const promise = new Promise<void>((resolve, reject) => {
      this.kpiService.getAllNotif().subscribe({

        next: (res: any) => {
          this.total =  res.total;
          // tslint:disable-next-line:no-shadowed-variable
          this.notif = res.values.map((res: any) => {
            return new Notif(res.name, res.id);
          });
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {
          this.isloaded = true;
        },
      });
    });
    return promise;
  }
  toggleNotificationMobile() {
    this.openNotification = !this.openNotification;
  }

}
