import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { ListingUserType } from '../Types';
import { getListings, getListingsId } from '../Helpers';
import { useState, useEffect } from 'react';
import loadListings, { privSort } from './Components/albumPusher';
import Search from './Components/search';

export default function Dashboard () {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState<ListingUserType[]>([]);
  const [reset, setReset] = useState<boolean>(false);
  const handleClickOpen = () => setOpen(true);

  useEffect(() => {
    const fetchy = async () => {
      getListings().then((listing) => {
        Promise.all(
          Object.keys(listing.listings).map((idx) => {
            return getListingsId(listing.listings[idx].id)
              .then((res) => {
                res.listing.id = listing.listings[idx].id;
                return res;
              });
          })
        ).then((out) => {
          const filteredListings: ListingUserType[] = out
            .filter((item) => item.listing.published === true)
            .map((item) => item.listing);
          privSort(filteredListings).then(() => setData(filteredListings));
        });
      });
    };
    fetchy();
  }, [reset]);

  return (
    <>
      <CssBaseline />
        <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
              Listings
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              All the people who let Belle store bathwater at their house < br />< br />
              <Button variant="contained" onClick={handleClickOpen}>
                Search pubished listings
              </Button>
            </Typography>
          </Container>
        </Box>
        {loadListings(data)}
      <Search open={open} setOpen={setOpen} listing={data} setListing={setData} reset={reset} setReset={setReset} />
    </>
  );
}
