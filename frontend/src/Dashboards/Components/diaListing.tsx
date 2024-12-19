import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { DiaProps } from '../../Types';
import imageWrapper, { getListingsId, postListingsNew, putListingsId } from '../../Helpers';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

let fields = [
  { id: 'title', label: 'Listing Title', val: '' },
  { id: 'address', label: 'Listing Address', val: '' },
  { id: 'price', label: 'Listing Price (per night)', val: '' },
  { id: 'type', label: 'Property Type', val: '' },
  { id: 'bathrooms', label: 'Bathrooms #', val: '' },
  { id: 'bedrooms', label: 'Bedrooms #', val: '' },
  { id: 'beds', label: 'Beds #', val: '' },
  { id: 'amenities', label: 'Amenities', val: '' },
];

export default function FormDialog (props: DiaProps) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  if (props.id !== '') {
    getListingsId(props.id).then((res) => {
      fields = [
        { id: 'title', label: 'Listing Title', val: res.listing.title },
        { id: 'address', label: 'Listing Address', val: res.listing.address },
        { id: 'price', label: 'Listing Price (per night)', val: res.listing.price },
        { id: 'type', label: 'Property Type', val: res.listing.metadata.type },
        { id: 'bathrooms', label: 'Bathrooms #', val: res.listing.metadata.bathrooms },
        { id: 'bedrooms', label: 'Bedrooms #', val: res.listing.metadata.bedrooms },
        { id: 'beds', label: 'Beds #', val: res.listing.metadata.beds },
        { id: 'amenities', label: 'Amenities', val: res.listing.metadata.amenities },
      ]
    });
  }

  const handleNew = (body: object, token: string) => {
    postListingsNew(body, token).then(() => {
      alert('Listing created');
      props.setTrig(!props.trig);
      handleClose();
    }).catch((e) => alert(e));
  }

  const handleEdit = (body: object, token: string, id: string) => {
    putListingsId(id, body, token).then(() => {
      alert('Listing edited');
      handleClose();
    }).catch((e) => alert(e));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const files = event.currentTarget.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    const bathrooms: FormDataEntryValue | null = data.get('bathrooms');
    const bedrooms: FormDataEntryValue | null = data.get('bedrooms');
    const beds: FormDataEntryValue | null = data.get('beds');
    const price: FormDataEntryValue | null = data.get('price');
    const title: FormDataEntryValue | null = data.get('title');
    const address: FormDataEntryValue | null = data.get('address');
    const type: FormDataEntryValue | null = data.get('type');
    const amenities: FormDataEntryValue | null = data.get('amenities');
    const token = (props.token !== null) ? props.token : '';

    if (bathrooms !== null && bedrooms !== null && price !== null && title !== null &&
      address !== null && type !== null && amenities !== null && beds !== null) {
      if (isNaN(Number(bathrooms)) || isNaN(Number(bedrooms)) || isNaN(Number(beds))) {
        alert('Beds, Bathrooms and Bedrooms must be numbers');
        return;
      }
      if (bathrooms === '' || bedrooms === '' || beds === '' || price === '' || title === '' || address === '' || type === '' || amenities === '') {
        alert('All fields must be filled');
        return;
      }

      let body = {}
      if (props.id === '') {
        if (files[0] && files[0].files && files[0].files.length > 0) {
          console.log('thumbfound')
          imageWrapper(files[0].files[0]).then((imageData) => {
            body = {
              title,
              address,
              price,
              thumbnail: imageData,
              metadata: {
                type,
                bathrooms,
                bedrooms,
                amenities,
                beds,
              }
            };
            handleNew(body, token);
          });
        } else alert('Add a thumbnail');
      } else {
        if (files[0] && files[0].files && files[0].files.length > 0) {
          if (files[1] && files[1].files && files[1].files.length > 0) {
            Promise.all(
              Array.from(files[1].files).map((file) => {
                return imageWrapper(file);
              })
            ).then((imageData) => {
              if (files[0] && files[0].files && files[0].files.length > 0) {
                imageWrapper(files[0].files[0]).then((thumbData) => {
                  body = {
                    title,
                    address,
                    price,
                    thumbnail: thumbData,
                    metadata: {
                      images: imageData,
                      type,
                      bathrooms,
                      bedrooms,
                      amenities,
                      beds,
                    }
                  }
                  handleEdit(body, token, props.id);
                });
              }
            });
          } else alert('Add some images');
        } else alert('Add a thumbnail');
      }
    } else alert('All fields including images and thumbnails required');
  }

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        {props.id === '' ? 'Make Belle happy with your new listing' : 'Edit listing I\'m jacking up the price'}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit} id='userForm' noValidate sx={{ mt: 1 }}>
          <DialogTitle padding="-10px">{props.id === '' ? 'New Listing' : 'Edit Listing'}</DialogTitle>
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
            < br />
            <Button component="label" variant="contained" data-cy="thumbnail-upload" startIcon={<CloudUploadIcon />}>
              Upload Thumbnail
              <VisuallyHiddenInput type="file" />
            </Button>
            <br /><br />
            {props.id !== ''
              ? <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Upload Photos
              <VisuallyHiddenInput type="file" multiple />
            </Button>
              : <></>}
          </DialogContent>
          <DialogActions>
            <Button type='submit'>Create Listing</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
