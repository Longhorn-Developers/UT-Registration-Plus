// 0 refers to Sunday, 6 - to Saturday
scheduler.ignore_week = function(date) {
    if (date.getDay() == 6 || date.getDay() == 0) // hides Sat and Sun
        return true;
};

// Sets schedule to 12-hour format
scheduler.config.hour_date = "%h:%i %A";

scheduler.config.first_hour = 8;
scheduler.config.last_hour = 21;

scheduler.init('scheduler_here', new Date(), "week");

var events = [
    {id:1, text:"Meeting",   start_date:"08/09/2018 14:00",end_date:"08/09/2018 17:00"},
    {id:2, text:"Conference",start_date:"08/13/2018 12:00",end_date:"08/13/2018 13:00"},
    {id:3, text:"Interview", start_date:"08/01/2018 09:00",end_date:"08/01/2018 10:00"}
 ];
  
 scheduler.parse(events, "json"); // takes the name and format of the data source