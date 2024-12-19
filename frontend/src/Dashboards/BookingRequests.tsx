import * as React from 'react';
import { Booking, ListingUserType, Props } from '../Types';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { getBookings, getListingsId } from '../Helpers';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import dayjs from 'dayjs';
import { BookedDays, BookingRequests, PreviousRequests, timeDiff } from './Components/bookingManage';

export default function ManageBookings (props: Props) {
  const [trig, setTrig] = useState<boolean>(false);
  const { id } = useParams<{id?: string}>();
  const [currBook, setCurrBook] = useState<Booking[]>();
  const [acceptedBook, setAcceptedBook] = useState<Booking[]>();
  const [declinedBook, setDeclinedBook] = useState<Booking[]>();
  const [info, setInfo] = useState<ListingUserType>();
  const [time, setTime] = useState<string>();
  const [sectrig, setSecTrig] = useState<boolean>(false);

  useEffect(() => {
    getBookings(props.token as string)
      .then((bookings) => {
        const temp: Booking[] = bookings.bookings;
        const value1: Booking[] = [];
        const value2: Booking[] = [];
        const value3: Booking[] = [];
        for (const i in temp) {
          const entry = temp[i];
          if (entry) {
            if (entry.status === 'pending' && id === entry.listingId) {
              value1.push(entry);
            } else if (entry.status === 'accepted' && id === entry.listingId) {
              value2.push(entry);
            } else if (entry.status === 'declined' && id === entry.listingId) {
              value3.push(entry);
            }
          }
        }
        setCurrBook(value1);
        setAcceptedBook(value2);
        setDeclinedBook(value3);
      });

    getListingsId(id || '0')
      .then((listing) => {
        const value: ListingUserType = listing.listing;
        setInfo(value);
        setSecTrig(!sectrig);
      });
  }, [trig]);

  useEffect(() => {
    const currTime = dayjs();
    const startTime = dayjs(info?.postedOn);
    const returnTime = timeDiff(startTime, currTime);
    setTime(returnTime);
  }, [sectrig]);

  const navigate = useNavigate();
  if (props.token === null) {
    navigate('/');
  }

  if (info === undefined) {
    return (
      <ThemeProvider theme={createTheme()}>
      <CssBaseline />
        <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, }}>
          <Container maxWidth="md">
            <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
              Manage Bookings
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              No Bookings for this listing available.
            </Typography>
          </Container>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={createTheme()}>
    <CssBaseline />
      <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, }}>
        <Container maxWidth="md">
          <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
            Manage Booking {info.title}
          </Typography>
          <BookingRequests bookings={currBook as Booking[]} token={props.token} setTrig={setTrig} trig={trig}></BookingRequests>
          <PreviousRequests bookings={acceptedBook as Booking[]}></PreviousRequests>
          <PreviousRequests bookings={declinedBook as Booking[]}></PreviousRequests>
          <Typography variant="h5" color="text.secondary" paragraph>
            Listing has been online for {time}
          </Typography>
          <BookedDays bookings={acceptedBook as Booking[]}></BookedDays>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
