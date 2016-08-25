import {Component, ElementRef} from '@angular/core';
import {Http} from "@angular/http";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [],
  providers: []
})
export class AppComponent  {

  protected availableSports: Array<any> = [];
  protected sportEvents: Array<any> = [];
  protected currentEventIndex = 0;

  currentEvent: any = null;

  constructor(protected http:Http, protected host: ElementRef){

  }

  ngOnInit(){
    this.fetchSports()
        .then(sportTypes => {
          var sport = sportTypes[Math.floor(Math.random()*sportTypes.length)];
          return this.http.get(`//localhost:8080/sports?_filter=sport|${sport['_id']}`).map(res => res.json()).toPromise();
        })
        .then(sportEvents => {
          this.sportEvents = sportEvents;
          this.currentEvent = this.sportEvents[0];
        })
        .catch(err => alert(`Error while receiving data: ${err}`))
    ;
  }

  protected fetchSports(): Promise<Array<any>> {
    return this.http.get('//localhost:8080/sports/types').map(res => res.json()).toPromise();
  }

  makeVote(type:number, el: HTMLButtonElement): void {
    jQuery(this.host.nativeElement).find('button').prop('disabled', true);

    this.http.post(`//localhost:8080/sports/${this.currentEvent.id}/vote/${type}`, {}).toPromise().then(response => {
      if(response.text() === 'ok'){
        if(this.nexEvent()){
          jQuery(this.host.nativeElement).find('button').prop('disabled', false);
        }else{
          this.currentEvent = null;
        }
      }
    }, (err)=>{
      alert('Can not update event: ' + err);
    });
  }

  protected nexEvent(): boolean {
    this.currentEventIndex++;

    if(this.currentEventIndex === this.sportEvents.length){
      return false;
    }

    this.currentEvent = this.sportEvents[this.currentEventIndex];

    return true;
  }


}
