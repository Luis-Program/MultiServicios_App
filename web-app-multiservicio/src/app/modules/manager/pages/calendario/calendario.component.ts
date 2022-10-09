import {
  Component,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { ServicioService } from 'src/app/services/servicio.service';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  orange: {
    primary: '#ad7521',
    secondary: '#ad7521',
  },
  greenLight: {
    primary: '#91ad21',
    secondary: '#91ad21',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#50ad21',
    secondary: '#50ad21',
  },
  ocean: {
    primary: '#21ad85',
    secondary: '#21ad85',
  },
  lightBlue: {
    primary: '#21ada8',
    secondary: '#21ada8',
  },
  pink: {
    primary: '#ad2196',
    secondary: '#ad2196',
  },
  blackBlue: {
    primary: '#4921ad',
    secondary: '#4921ad',
  },
  purple: {
    primary: '#8521ad',
    secondary: '#8521ad',
  },
};

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  protected view: CalendarView = CalendarView.Month;
  protected refresh = new Subject<void>();
  protected events: CalendarEvent[] = [];
  protected CalendarView = CalendarView;
  protected viewDate: Date = new Date();
  protected loading = false;
  protected nameColors = ['red', 'green','purple','lightBlue', 'blue', 'pink', 'blackBlue', 'orange', 'yellow', 'ocean'];
  protected filter = "";

  protected modalData!: {
    action: string;
    event: CalendarEvent;
  };

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  protected actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  constructor(private servicioService: ServicioService) { }

  ngOnInit(): void {
    this.dataCalendar();
  }

  private dataCalendar() {
    this.servicioService.getDataCalendar()
      .subscribe(data => {
        this.loading = true;
        let nameColor = new Map();
        let count = 0;
        let alter: CalendarEvent[] = [];
        for (let index = 0; index < data.length; index++) {
          var color = '';
          if (nameColor.has(data[index].nombre)) {
            color = nameColor.get(data[index].nombre);
          } else {
            if (count < this.nameColors.length) {
              nameColor.set(data[index].nombre, this.nameColors[count]);
              color = this.nameColors[count];
              count++;
            } else {
              count = 0;
              nameColor.set(data[index].nombre, this.nameColors[count]);
              color = this.nameColors[count];
              count++;
            }
          }
          alter.push(
            {
              start: startOfDay(new Date(data[index].fechaHoraRealizar)),
              title: data[index].titulo,
              color: { ...colors[color] },
              allDay: true,
            }
          );
        }
        this.events = alter;
        this.loading = false;
      });
  }

  // this.events = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'Luis Diego Cáceres García 5:00PM',
  //     color: { ...colors['red'] },
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: false,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: { ...colors['yellow'] },
  //     actions: this.actions,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: { ...colors['blue'] },
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: { ...colors['yellow'] },
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  protected activeDayIsOpen: boolean = false;

  protected dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  protected eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  protected handleEvent(action: string, event?: CalendarEvent): void {
    if (event) {
      this.modalData = { event, action };
    }
  }

  protected setView(view: CalendarView) {
    this.view = view;
  }

  protected closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
