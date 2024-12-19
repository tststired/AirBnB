import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Booking, MakeProps, reviews } from '../../Types';
import { getBookings, putListingsIdReviewBookId } from '../../Helpers';
import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Rating, TextField } from '@mui/material';

export function MakeReview (props: MakeProps) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = useState<Booking[]>();
  let bookingId = '-1';

  useEffect(() => {
    getBookings(props.token as string)
      .then((bookings: {bookings:Booking[]}) => {
        const value:Booking[] = bookings.bookings;
        setData(value);
      });
  }, [props.trig]);

  const fields = [
    { id: 'score', label: 'Score #', val: '' },
    { id: 'comment', label: 'Comment', val: '' },
  ];

  const cast = props.data.reviews as reviews[];
  const averageRating = cast.reduce((acc, val) => Number(acc) + Number(val.score), 0) / cast.length

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const score: FormDataEntryValue | null = data.get('score');
    const comment: FormDataEntryValue | null = data.get('comment');
    const body = {
      review: {
        score,
        comment,
      }
    }
    if (isNaN(Number(body.review.score))) {
      alert('Sore must be a number');
      return;
    }
    if (Number(body.review.score) > 5 || Number(body.review.score) < 0) {
      alert('Score must be between 0 and 5');
      return;
    }
    putListingsIdReviewBookId(props.id, bookingId, body, props.token as string).then(() => {
      alert('Reivew Sent');
      props.setTrig(!props.trig);
      handleClose();
    }).catch((e) => alert(e));
  }

  let exist = false;
  const arr: Booking[] = data as Booking[];
  for (const i in arr) {
    const entry = arr[i];
    if (entry) {
      if (entry.owner === props.email) {
        if (entry.status === 'accepted') {
          exist = true;
          bookingId = entry.id;
        }
      }
    }
  }

  if (props.data.owner === props.email || !exist) {
    return (
      <>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ mt: 2 }}>
        Reviews
        <p>Average Rating: {averageRating.toFixed(2)}</p>
        </Typography>
      </>
    )
  }

  return (
    <React.Fragment>
      <Typography variant="h5" color="text.secondary" paragraph>
        Reviews
        <p>
          <Rating name="half-rating-read" value={averageRating} defaultValue={0} precision={0.5} readOnly />
          &nbsp;Average Rating: {averageRating.toFixed(2)}
        </p>
      </Typography>
      <Button variant="outlined" onClick={handleClickOpen} sx={{ mb: 1 }}>
        Make Review
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, pr: 1, pl: 1 }}>
          <DialogTitle padding="-10px">Make Review</DialogTitle>
          <DialogContent>
            {fields.map((config) => (
              <TextField
                key={config.id}
                autoFocus
                margin="dense"
                id={config.id}
                name={config.id}
                label={config.label}
                defaultValue={config.val}
                type="text"
                fullWidth
                variant="standard"/>
            ))}
          </DialogContent>
          <DialogActions>
            <Button type='submit'>Make Review</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

export function Reviews ({ reviews }: { reviews: reviews[] }) {
  if (reviews === undefined) {
    return (
      <>
      </>
    )
  }

  return (
    <Container sx={{ py: 2 }} maxWidth="md">
    <Grid container spacing={4}>
      {reviews.map((review, idx) => {
        return (
          <Grid item key={idx} xs={12} sm={6} md={4.5}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography>
                  Score: {review.score}< br />
                  Comment: {review.comment}< br />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  </Container>
  );
}
