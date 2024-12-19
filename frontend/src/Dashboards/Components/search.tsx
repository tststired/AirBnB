import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import dayjs, { Dayjs } from 'dayjs';
import { ListingUserType, range, reviews } from '../../Types';

export default function Search (props: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  listing: ListingUserType[], setListing: React.Dispatch<React.SetStateAction<ListingUserType[]>>, reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>> }) {
  const handleClose = () => props.setOpen(false);
  const dict = { start: '', end: '' }
  const fields = [
    { id: 'Search', label: 'Search for matches in titles/addresses', val: '' },
    { id: 'PriceMin', label: 'Minimum Price', val: '' },
    { id: 'PriceMax', label: 'Maximum Price', val: '' },
    { id: 'BedroomsMin', label: 'Minimum Bedrooms', val: '' },
    { id: 'BedroomsMax', label: 'Maximum Bedrooms', val: '' },
  ];

  const handleResetSearch = () => {
    props.setReset(!props.reset);
    localStorage.setItem('gap', '0');
    handleClose();
  }

  const handleDatePickerChange = (value: Dayjs, ft: string) => {
    if (ft === 'f') dict.start = value.format('YYYY-MM-DD');
    else if (ft === 't') dict.end = value.format('YYYY-MM-DD');
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const search: FormDataEntryValue | null = data.get('Search');
    const priceMin: FormDataEntryValue | null = data.get('PriceMin');
    const priceMax: FormDataEntryValue | null = data.get('PriceMax');
    const bedroomsMin: FormDataEntryValue | null = data.get('BedroomsMin');
    const bedroomsMax: FormDataEntryValue | null = data.get('BedroomsMax');
    const reviews: FormDataEntryValue | null = data.get('row-radio-buttons-group');
    const start = dict.start;
    const end = dict.end;

    let cnull = 0;
    let c = 0;
    if (search !== '') {
      cnull++;
      c = 1;
    } if (priceMin !== '' || priceMax !== '') {
      cnull++;
      c = 2;
    } if (bedroomsMin !== '' || bedroomsMax !== '') {
      cnull++;
      c = 3;
    } if (start !== '' || end !== '') {
      cnull++;
      c = 4;
      if (start !== '' && end !== '') {
        const numberOfNights = dayjs(end).diff(dayjs(start), 'day');
        localStorage.setItem('gap', numberOfNights.toString());
      }
    } if (reviews !== null) {
      cnull++;
      c = 5;
    }

    const newListing: ListingUserType[] = props.listing;
    if (cnull !== 1) {
      alert('Please fill in only one type of fields');
    } else if (c === 1) {
      const filteredListing = newListing.filter((item: ListingUserType) => {
        return item.title.includes(search as string) || item.address.includes(search as string);
      });
      handleClose();

      props.setListing(filteredListing);
    } else if (c === 2) {
      const filteredListing = newListing.filter((item: ListingUserType) => {
        let min = 0;
        if (priceMin !== '') min = parseInt(priceMin as string);
        let max = Number.MAX_SAFE_INTEGER
        if (priceMax !== '') max = parseInt(priceMax as string);
        const price: number = item.price;
        return !isNaN(price) && price >= min && price <= max;
      });
      handleClose();
      props.setListing(filteredListing);
    } else if (c === 3) {
      const filteredListing = newListing.filter((item: ListingUserType) => {
        let min = 0;
        if (bedroomsMin !== '') min = parseInt(bedroomsMin as string);
        let max = Number.MAX_SAFE_INTEGER
        if (bedroomsMax !== '') max = parseInt(bedroomsMax as string);
        const bedrooms: number = item.metadata.bedrooms;
        return !isNaN(bedrooms) && bedrooms >= min && bedrooms <= max;
      });
      handleClose();
      props.setListing(filteredListing);
    } else if (c === 4) {
      const filteredListing = newListing.filter((item: ListingUserType) => {
        const arr: range[] = item.availability as range[];
        for (const i in arr) {
          const entry = arr[i];
          if (entry) {
            if ((dayjs(entry.start).isAfter(dayjs(start)) || dayjs(entry.start).isSame(dayjs(start))) &&
            (dayjs(entry.end).isBefore(dayjs(end)) || dayjs(entry.end).isSame(dayjs(end)))) {
              return true;
            }
          }
        } return false;
      });
      handleClose();
      props.setListing(filteredListing);
    } else if (c === 5) {
      const filteredListing = newListing.sort((a: ListingUserType, b: ListingUserType) => {
        const aCast = a.reviews as reviews[];
        const bCast = b.reviews as reviews[];
        let aAvg = aCast.reduce((acc, val) => Number(acc) + Number(val.score), 0) / a.reviews.length
        let bAvg = bCast.reduce((acc, val) => Number(acc) + Number(val.score), 0) / b.reviews.length
        if (isNaN(aAvg)) aAvg = 0;
        if (isNaN(bAvg)) bAvg = 0;
        if (reviews === 'Highest') {
          if (aAvg >= bAvg) return -1;
          else return 1;
        } else {
          if (aAvg <= bAvg) return -1;
          else return 1;
        }
      });
      handleClose();
      props.setListing(filteredListing);
    }
  }

  const handleReset = () => {
    const form = document.getElementById('searchForm') as HTMLFormElement;
    if (form) form.reset();
  }

  return (<React.Fragment>
    <Dialog open={props.open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit} id='searchForm' noValidate sx={{ mt: 1 }}>
        <DialogTitle>Search</DialogTitle>
        <DialogContent>
          <DialogContentText>
            **SEARCHES ARE CUUMULATIVE UNTIL RESET SEARCH**
          </DialogContentText>
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
              variant="standard"
            />
          ))}
          <DialogContent>
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
          </DialogContent>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Reviews</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="Highest" control={<Radio />} label="Highest" />
              <FormControlLabel value="Lowest" control={<Radio />} label="Lowest" />
            </RadioGroup>
          </FormControl>
          < br />< br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetSearch}>Reset Search</Button>
          <Button onClick={handleReset}>Clear Form</Button>
          <Button type='submit'>Search Listings</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Box>
    </Dialog>
  </React.Fragment>)
}
