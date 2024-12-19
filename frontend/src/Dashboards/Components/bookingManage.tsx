import * as React from 'react';
import { Booking, ManageBookProps } from '../../Types';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { putBookingsAcceptId, putBookingsDeclineId } from '../../Helpers';
import { Card, CardActions, CardContent, Grid } from '@mui/material';
import dayjs from 'dayjs';

export function BookingRequests (props: ManageBookProps) {
  const handleAccept = (idx: number) => {
    const bookingId = props.bookings[idx]?.id;
    putBookingsAcceptId(bookingId as string, props.token as string);
    alert('Booking accepted')
    props.setTrig(!props.trig);
  }

  const handleDeny = (idx: number) => {
    const bookingId = props.bookings[idx]?.id;
    putBookingsDeclineId(bookingId as string, props.token as string);
    alert('Booking declined')
    props.setTrig(!props.trig);
  }

  if (props.bookings === undefined || props.bookings.length === 0) {
    return (
      <>
        <Typography variant="h5" color="text.secondary" paragraph>
          No Booking Requests
        </Typography>
      </>
    )
  }

  return (
    <><Typography variant="h5" color="text.secondary" paragraph>
      Booking Requests:
    </Typography><Container sx={{ py: 1 }} maxWidth="md">
        <Grid container spacing={4}>
          {props.bookings.map((book, idx) => {
            return (
              <Grid item key={idx} xs={12} sm={6} md={4.5}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography>
                      Date: {book.dateRange.start} to {book.dateRange.end}<br />
                      Total Price: ${book.totalPrice}<br />
                      Status: {book.status}<br />
                    </Typography>
                  </CardContent>
                  <CardActions>
                  <Button size="small" onClick={() => handleAccept(idx)}>Accept</Button>
                  <Button size="small" onClick={() => handleDeny(idx)}>Deny</Button>
                </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container></>
  );
}

export function PreviousRequests ({ bookings }: { bookings: Booking[] }) {
  let word = '';
  if (bookings === undefined || bookings.length === 0) {
    return (
      <>
      </>
    )
  } else {
    if (bookings[0]?.status === 'accepted') {
      word = 'Accepted';
    } else {
      word = 'Declined';
    }
  }
  return (
    <><Typography variant="h5" color="text.secondary" paragraph>
      {word} Booking Requests:
    </Typography><Container sx={{ py: 1 }} maxWidth="md">
        <Grid container spacing={4}>
          {bookings.map((book, idx) => {
            return (
              <Grid item key={idx} xs={12} sm={6} md={4.5}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography>
                      Date: {book.dateRange.start} to {book.dateRange.end}<br />
                      Total Price: ${book.totalPrice}<br />
                      Status: {book.status}<br />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container></>
  );
}

export function timeDiff (startTime: dayjs.Dayjs, endTime: dayjs.Dayjs) {
  let years = endTime.year() - startTime.year();
  let months = endTime.month() - startTime.month();
  let days = endTime.day() - startTime.day();
  let hours = endTime.hour() - startTime.hour();
  let minutes = endTime.minute() - startTime.minute();
  let seconds = endTime.second() - startTime.second();

  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const year = startTime.year();
  if (days < 0) {
    months -= 1;
    const months1 = [0, 2, 4, 6, 7, 9, 11];
    const months2 = [3, 5, 8, 10];
    if (months1.includes(startTime.month())) {
      days += 31;
    } else if (months2.includes(startTime.month())) {
      days += 30;
    } else if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
      days += 29;
    } else {
      days += 28;
    }
  }
  if (hours < 0) {
    days -= 1;
    hours += 24;
  }
  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }
  if (seconds < 0) {
    minutes -= 1;
    seconds += 60;
  }

  const stryears = numToString(years, 'Year');
  const strmonths = numToString(months, 'Month');
  const strdays = numToString(days, 'Day');
  const strhours = numToString(hours, 'Hour');
  const strminutes = numToString(minutes, 'Minute');
  const strseconds = numToString(seconds, 'Second');

  if (years !== 0) {
    return stryears + strmonths + strdays + strhours + strminutes + strseconds;
  } else if (months !== 0) {
    return strmonths + strdays + strhours + strminutes + strseconds;
  } else if (days !== 0) {
    return strdays + strhours + strminutes + strseconds;
  } else if (hours !== 0) {
    return strhours + strminutes + strseconds;
  } else if (minutes !== 0) {
    return strminutes + strseconds;
  } else {
    return strseconds;
  }
}

function numToString (num: number, str: string) {
  if (num === 1) {
    return num.toString() + ' ' + str + ' ';
  } else {
    return num.toString() + ' ' + str + 's ';
  }
}

export function BookedDays ({ bookings }: { bookings: Booking[] }) {
  if (bookings === undefined || bookings.length === 0) {
    return (
      <>
      </>
    )
  }

  const currTime = dayjs();
  const temp: Booking[] = bookings;
  let totaldays = 0;
  let totalprice = 0;
  for (const i in temp) {
    const entry = temp[i];
    if (entry) {
      const start = dayjs(entry.dateRange.start);
      const diff = currTime.year() - start.year();
      if (diff === 0) {
        const nights = dayjs(entry.dateRange.end).diff(dayjs(entry.dateRange.start), 'day');
        totaldays += nights;
        totalprice += Number(entry.totalPrice);
      }
    }
  }

  return (
    <>
      <Typography variant="h5" color="text.secondary" paragraph>
        Total Days Booked: {totaldays}
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        Total Profits: ${totalprice}
      </Typography>
    </>
  );
}
