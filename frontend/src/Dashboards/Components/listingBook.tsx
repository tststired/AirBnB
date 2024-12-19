import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Booking, MakeProps, range, ViewBookProps } from '../../Types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getBookings, postBookingsNewId } from '../../Helpers';
import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogTitle, Grid } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export function Bookings (props: ViewBookProps) {
  const [data, setData] = useState<Booking[]>();

  useEffect(() => {
    getBookings(props.token as string)
      .then((bookings: {bookings:Booking[]}) => {
        const temp: Booking[] = bookings.bookings;
        const value: Booking[] = [];
        for (const i in temp) {
          const entry = temp[i];
          if (entry) {
            if (entry.owner === props.email && props.id === entry.listingId) {
              value.push(entry);
            }
          }
        }
        setData(value);
      });
  }, [props.trig]);

  if (data === undefined || data.length === 0) {
    return (
      <>
      </>
    )
  }

  return (
    <><Typography variant="h5" color="text.secondary" paragraph>
      Bookings Made:
    </Typography><Container sx={{ py: 1 }} maxWidth="md">
        <Grid container spacing={4}>
          {data.map((book, idx) => {
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

export function MakeBooking (props: MakeProps) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const time = { start: '', end: '' }

  const handleDatePickerChange = (value: Dayjs, ft: string) => {
    if (ft === 'f') time.start = value.format('YYYY-MM-DD');
    else if (ft === 't') time.end = value.format('YYYY-MM-DD');
  }

  const handleSubmit = () => {
    const nights = dayjs(time.end).diff(dayjs(time.start), 'day');
    if (nights < 0) {
      alert('The From Date must be before the To date');
      return;
    }
    let exist = false;
    const arr: range[] = props.data.availability as range[];
    for (const i in arr) {
      const entry = arr[i];
      if (entry) {
        if ((dayjs(time.start).isAfter(dayjs(entry.start)) || dayjs(entry.start).isSame(dayjs(time.start))) &&
        (dayjs(time.end).isBefore(dayjs(entry.end)) || dayjs(entry.end).isSame(dayjs(time.end)))) {
          exist = true;
          break;
        }
      }
    }

    if (exist === false) {
      alert('Given date is not available');
      return;
    }
    const totalPrice = props.data.price * nights;
    const dateRange = {
      start: time.start,
      end: time.end,
    };
    const body = {
      dateRange,
      totalPrice,
    }
    postBookingsNewId(props.id, body, props.token as string).then(() => {
      alert('Booking Sent');
      props.setTrig(!props.trig);
      handleClose();
    }).catch((e) => alert(e));
  }

  if (props.data.owner === props.email) {
    return (
      <></>
    )
  }

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} sx={{ my: 3 }}>
        Make Booking
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, pr: 1, pl: 1 }}>
          <DialogTitle padding="-10px">Make Booking</DialogTitle>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label={'From'}
                    onChange={(value) => handleDatePickerChange(value as Dayjs, 'f')}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label={'To'}
                    onChange={(value) => handleDatePickerChange(value as Dayjs, 't')}
                  />
                </DemoContainer>
              </LocalizationProvider>
          <DialogActions>
            <Button type='submit'>Send Booking</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
