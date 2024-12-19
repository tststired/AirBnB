import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ListingUserType, Props } from '../Types';
import { getListingsId } from '../Helpers';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel'
import { CardMedia, Paper } from '@mui/material';
import { Bookings, MakeBooking } from './Components/listingBook';
import { MakeReview, Reviews } from './Components/listingReview';

export default function UserListings (props: Props) {
  const [data, setData] = useState<ListingUserType>();
  const [trig, setTrig] = useState<boolean>(false);

  const { id } = useParams<{id?: string}>();

  useEffect(() => {
    getListingsId(id || '0')
      .then((listing) => {
        const value:ListingUserType = listing.listing;
        setData(value);
      });
  }, [trig]);

  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
        <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, }}>
          <Container maxWidth="md">
            {data === undefined
              ? (<NotFoundPage />)
              : (<>
                <ListingDetails data={data}/>
                {(props.token !== null)
                  ? (<>
                    <Bookings id={id as string} email={props.email} token={props.token} trig={trig}></Bookings>
                    <MakeBooking token={props.token} id={id as string} data={data} email={props.email} trig={trig} setTrig={setTrig}/>
                    </>)
                  : (<></>)
                }
                <MakeReview token={props.token} id={id as string} data={data} email={props.email} trig={trig} setTrig={setTrig}/>
                <Reviews reviews={data.reviews}/>
              </>)}
          </Container>
        </Box>
    </ThemeProvider>
  );
}

function ListingDetails ({ data }: { data: ListingUserType }) {
  let nights = localStorage.getItem('gap');
  if (nights === undefined) {
    nights = '0';
  }
  return (
    <>
      <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
        {data.title}
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        {data.metadata.type} at {data.address}
      </Typography>
      <ImageList data={data} />
      <Typography variant="h5" color="text.secondary" paragraph>
        {data.metadata.beds} Beds, {data.metadata.bathrooms} Bathrooms, {data.metadata.bedrooms} Bedrooms
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        Available amenities: {data.metadata.amenities}
      </Typography>
      {nights === '0'
        ? (<Typography variant="h5" color="text.secondary" paragraph>
          Price for {nights} nights: ${Number(nights) * data.price}
        </Typography>)
        : (<Typography variant="h5" color="text.secondary" paragraph>
          Price per night: ${data.price}
        </Typography>)
      }
      <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
      </Stack>
    </>
  );
}

function NotFoundPage () {
  return (
    <>
    </>
  )
}

function ImageList ({ data }: { data: ListingUserType }) {
  let images: string[];
  if (data.metadata.images === undefined) {
    images = [data.thumbnail];
  } else {
    images = [data.thumbnail, ...data.metadata.images];
  }
  return (
    <Carousel autoPlay={ false } >
      {
        images !== undefined && (
          images.map(item => <SingleImage key={ '1' } imagedetails={item} />)
        )
      }
    </Carousel>
  );
}

function SingleImage ({ imagedetails }: { imagedetails: string }) {
  return (
    <Paper>
      <CardMedia component="div"sx={{ pt: '60%' }} image={imagedetails}/>
    </Paper>
  )
}
