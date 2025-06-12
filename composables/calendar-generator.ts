import ical, { ICalCalendarMethod } from 'ical-generator';

const calendar = ical({ name: 'my first iCal' });
calendar.method(ICalCalendarMethod.REQUEST);

const startTime = new Date();
const endTime = new Date();
endTime.setHours(startTime.getHours() + 1);

calendar.createEvent({
  start: startTime,
  end: endTime,
  summary: 'Example Event',
  description: 'It works ;)',
  location: 'my room',
  url: 'http://sebbo.net/',
});

export function useCalendarGenerator() {
  const downloadCalendar = () => {
    const blob = new Blob([calendar.toString()], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendar.ics';
    a.click();

    URL.revokeObjectURL(url);
  };

  return {
    downloadCalendar,
  };
}