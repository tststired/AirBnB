/* eslint-disable */
import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ListingType, ListingUserType, reviews } from '../../Types';
import { useNavigate } from 'react-router';
import { deleteListingsId, getBookings } from '../../Helpers';
import Rating from '@mui/material/Rating';

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');

type booking = {
  id: string,
  owner: string,
}

export function privSort(listings: ListingType[]) {
  return new Promise((resolve) => {
    if (token !== null && email !== null) {
      getBookings(token).then((data) => {
        const arr: booking[] = [];
        for (const i of data.bookings) {
          if (i.owner === email) arr.push({ id: i.listingId, owner: i.owner });
        }
        listings.sort((a, b) => {
          for (const i of arr) {
            if (Number(i.id) === Number(a.id)) return -1
            else if (Number(i.id) === Number(b.id)) return 1
          }
          return (a.title < b.title) ? -1 : 1;
        });
        resolve(listings);
      });
    } else {
      listings.sort((a, b) => ((a.title < b.title) ? -1 : 1));
      resolve(listings);
    }
  });
}

export default function loadListings(listings: ListingType[]) {
  const navigate = useNavigate();
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container spacing={4}>
        {listings.map((listing, idx) => {
          const cast = listing.reviews as reviews[];
          const average = cast.reduce((acc, val) => Number(acc) + Number(val.score), 0) / cast.length
          return (
            <Grid item key={idx} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="div"sx={{pt: '56.25%'}} image={listing.thumbnail}/>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {listing.title} - ${listing.price}
                  </Typography>
                  <Typography>
                    ID: {listing.id}< br />
                    Address: {listing.address}< br />
                    Owner: {listing.owner}< br />
                    Review Count: {listing.reviews.length}< br />
                    Review Average: {average}< br />
                    <Rating name="half-rating-read" value={average} defaultValue={0} precision={0.5} readOnly />
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/viewListing/${listing.id}`)}>View</Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export function loadUserListings(listings: ListingUserType[],
  setData: React.Dispatch<React.SetStateAction<ListingUserType[]>>, token: string | null) {
  const navigate = useNavigate();
  const handleDelete = (idx: number) => {
    const listingId = listings[idx]?.id;
    if (token !== null && listings?.[idx]) {
      if (typeof listingId === 'number') {
        const updatedListings = [...listings.slice(0, idx), ...listings.slice(idx + 1)];
        setData(updatedListings);
        deleteListingsId(listingId, token);
      }
    }
  }
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container spacing={4}>
        {listings.map((listing, idx) => {
          const cast = listing.reviews as reviews[];
          const average = cast.reduce((acc, val) => Number(acc) + Number(val.score), 0) / cast.length
          return (
            <Grid item key={idx} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="div" sx={{pt: '56.25%'}} image={listing.thumbnail}/>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {listing.title} - ${listing.price}
                  </Typography>
                  <Typography>
                    Address: {listing.address}< br />
                    ID: {listing.id}< br />
                    Type: {listing.metadata.type}< br />
                    Beds: {listing.metadata.beds}< br />
                    Bedrooms: {listing.metadata.bedrooms}< br />
                    Bathrooms: {listing.metadata.bathrooms}< br />
                    Reviews: {listing.reviews.length}< br />
                    <Rating name="half-rating-read" value={average} defaultValue={0} precision={0.5} readOnly />
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleDelete(idx)}>Delete</Button>
                  <Button size="small" onClick={() => navigate(`/userListingsEdit/${listing.id}`)}>Manage</Button>
                  <Button size="small" onClick={() => navigate(`/manageBooking/${listing.id}`)}>Bookings</Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}
