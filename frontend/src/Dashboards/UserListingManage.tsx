import * as React from 'react';
import { Props } from '../Types';
import { useParams } from 'react-router-dom';
import FormDialog from './Components/diaListing';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import DateRangePickSE from './Components/datepickers';
import { useState } from 'react';
import { putListingsUnpublishId } from '../Helpers';

export default function UserListingsEdit (props: Props) {
  const [trig, setTrig] = React.useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const navigate = useNavigate();
  let id = '';
  const params = useParams();
  if (params && params.id) {
    id = params.id.toString();
  } else {
    navigate('/userListings');
  }
  let token = ''
  if (props.token !== null) {
    token = props.token;
  }

  const publish = () => {
    setShowDatePicker(true);
  }

  const unpublish = () => {
    putListingsUnpublishId(id, token)
      .then(() => {
        alert('Listing unpublished');
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
      <Container maxWidth="sm">
        {showDatePicker && <DateRangePickSE show={showDatePicker} setShow={setShowDatePicker} token={props.token} id={id} />}
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          Manage Listing
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            What do you want to do?<br />
          </Typography>
          <FormDialog token={props.token} id={id} setTrig={setTrig} trig={trig} />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
            <Button variant="contained" onClick={publish}>
              Publish listing, make me money!
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
            <Button variant="contained" onClick={unpublish}>
              UnPublish listing, make me poor
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="outlined" onClick={() => navigate('/userListings')}>
              Go back to all my listings.
            </Button>
          </div>
        </Typography>
      </Container>
  );
}
