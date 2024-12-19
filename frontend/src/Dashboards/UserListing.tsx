import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ListingUserType, Props } from '../Types';
import FormDialog from './Components/diaListing';
import { getListings, getListingsId } from '../Helpers';
import { useState, useEffect } from 'react';
import { loadUserListings } from './Components/albumPusher';

export default function UserListings (props: Props) {
  const [data, setData] = useState<ListingUserType[]>([]);
  const [trig, setTrig] = useState<boolean>(false);
  useEffect(() => {
    getListings()
      .then((listing) => {
        Promise.all(
          Object.keys(listing.listings).map((idx) => {
            return getListingsId(listing.listings[idx].id)
              .then((res) => {
                res.listing.id = listing.listings[idx].id;
                return res;
              });
          })).then((out) => {
          const filteredListings: ListingUserType[] = out
            .filter((item) => item.listing.owner === props.email)
            .map((item) => item.listing);
          setData(filteredListings);
        });
      });
  }, [trig]);

  return (
    <>
      <CssBaseline />
        <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, }}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
              Manage Listing
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Belle would like to find a home to store bathwater help her out?<br />
            </Typography>
            <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
              <FormDialog token={props.token} id='' setTrig={setTrig} trig={trig} />
            </Stack>
          </Container>
        </Box>
        {loadUserListings(data, setData, props.token)}
    </>
  );
}
