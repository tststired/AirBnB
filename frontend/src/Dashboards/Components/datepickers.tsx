import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { putListingsPublishId, putListingsUnpublishId } from '../../Helpers';
import { range } from '../../Types';

const dict: { [key: number]: range } = {};

export const handleDatePickerChange = (value: Dayjs, index: number, ft: string) => {
  const entry = dict[index];
  if (entry) {
    if (ft === 'f') entry.start = value.format('YYYY-MM-DD');
    else entry.end = value.format('YYYY-MM-DD');
  } else {
    if (ft === 'f') dict[index] = { start: value.format('YYYY-MM-DD'), end: '' };
    else dict[index] = { start: '', end: value.format('YYYY-MM-DD') };
  }
}

export default function DateRangePickSE (props: { show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>, token: string | null, id: string }) {
  const [cnt, setCnt] = useState<number>(1);
  const handleClose = () => props.setShow(false)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const arr: range[] = []
    for (const i in Object.keys(dict)) {
      const entry = dict[i];
      if (entry) {
        if (entry.start !== '' && entry.end !== '') {
          if (dayjs(entry.start).isBefore(dayjs(entry.end))) {
            arr.push(entry);
          } else {
            alert('From date must be before to date');
            return;
          }
        } else {
          alert('Please fill in all the dates');
          return;
        }
      }
    }
    if (props.token === null) {
      alert('You must be logged in to do this');
    } else {
      const token = props.token;
      if (Object.keys(dict).length === 0) {
        alert('You must add at least one date');
      } else {
        putListingsUnpublishId(props.id, token).then(() => {
          putListingsPublishId(props.id, { availability: arr }, token);
        }).catch(() => {
          putListingsPublishId(props.id, { availability: arr }, token);
        });
        alert('dates published')
        handleClose();
      }
    }
  }

  return (
      <React.Fragment>
        <Dialog open={props.show} onClose={handleClose}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <DialogTitle>New published dates *overwrites current dates*</DialogTitle>
            {Array.from({ length: cnt }, (_, index) => (
              <DialogContent key={index}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label={`From ${index}`}
                      onChange={(value) => handleDatePickerChange(value as Dayjs, index, 'f')}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label={`To ${index}`}
                      onChange={(value) => handleDatePickerChange(value as Dayjs, index, 't')}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </DialogContent>
            ))}
            <DialogActions>
              <Button onClick={() => setCnt(cnt + 1)}>Add</Button>
              <Button onClick={() => {
                setCnt(0)
                for (const i in dict) delete dict[i];
              }}>Reset</Button>
              <Button type='submit'>Publish</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Box>
        </Dialog>
      </React.Fragment>
  );
}
