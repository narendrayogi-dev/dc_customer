import moment from 'moment';

export const dateTimeFormatter = dateTimeString => {
  // const dateTime = new Date(dateTimeString);

  // const options = {
  //   day: '2-digit',
  //   month: '2-digit',
  //   year: 'numeric',
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   hour12: true,
  //   timeZone: 'UTC',
  // };

  // const formatter = new Intl.DateTimeFormat('en', options);
  // const [
  //   {value: month},
  //   ,
  //   {value: day},
  //   ,
  //   {value: year},
  //   ,
  //   {value: hour},
  //   ,
  //   {value: minute},
  //   ,
  //   {value: dayPeriod},
  // ] = formatter.formatToParts(dateTime);
  // const formattedDateTime = `${day}/${month}/${year}  ${hour}:${minute} ${dayPeriod}`;
  // return formattedDateTime;

  if (!dateTimeString) false;

  const dateTime = moment(dateTimeString);

  const formattedDateTime = dateTime.format('DD/MM/YYYY hh:mm A');
  return formattedDateTime;
};
