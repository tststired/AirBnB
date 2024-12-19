/* eslint-disable  @typescript-eslint/no-explicit-any */
function fileToDataUrl (file: any) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export default function imageWrapper (image: any) {
  return new Promise((resolve) => {
    try {
      fileToDataUrl(image).then((imageData) => {
        resolve(imageData);
      });
    } catch (e) {
      resolve(undefined);
    }
  });
}

const apiCallBase = (
  path: string,
  bdy: object,
  token: string,
  authed = false,
  method: string
): Promise<any> => {
  let options: object = {};
  if (method === 'GET') {
    options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: authed ? `Bearer ${token}` : undefined,
      },
    };
  } else {
    options = {
      method,
      body: JSON.stringify(bdy),
      headers: {
        'Content-type': 'application/json',
        Authorization: authed ? `Bearer ${token}` : undefined,
      },
    };
  }
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:5005/${path}`, options)
      .then((response) => response.json())
      .then((body) => {
        if (body.error) {
          reject(new Error(body.error));
        } else {
          resolve(body);
        }
      });
  });
};

const apiCallPost = (
  path: string,
  body: object,
  token: string,
  authed = false,
): Promise<any> => {
  return apiCallBase(path, body, token, authed, 'POST');
};

const apiCallPut = (
  path: string,
  body: object,
  token: string,
  authed = false,
): Promise<any> => {
  return apiCallBase(path, body, token, authed, 'PUT');
};

const apiCallGet = (
  path: string,
  body: object,
  token: string,
  authed = false,
): Promise<any> => {
  return apiCallBase(path, body, token, authed, 'GET');
};

const apiCallDelete = (
  path: string,
  body: object,
  token: string,
  authed = false,
): Promise<any> => {
  return apiCallBase(path, body, token, authed, 'DELETE');
};

// user
export const postUserAuthRegister = (body: object): Promise<any> => {
  return apiCallPost('user/auth/register', body, '', false);
};

export const postUserAuthLogin = (body: object): Promise<any> => {
  return apiCallPost('user/auth/login', body, '', false);
};

export const getUserAuthLogout = (token: string): Promise<any> => {
  return apiCallPost('user/auth/logout', {}, token, true);
};

// listing
export const getListings = (): Promise<any> => {
  return apiCallGet('listings', {}, '', false);
};

export const postListingsNew = (body: object, token: string): Promise<any> => {
  return apiCallPost('listings/new', body, token, true);
};

export const getListingsId = (id: string): Promise<any> => {
  return apiCallGet(`listings/${id}`, {}, '', false);
};

export const putListingsId = (
  id: string,
  body: object,
  token: string
): Promise<any> => {
  return apiCallPut(`listings/${id}`, body, token, true);
};

export const deleteListingsId = (id: string, token: string): Promise<any> => {
  return apiCallDelete(`listings/${id}`, {}, token, true);
};

export const putListingsPublishId = (
  id: string,
  body: object,
  token: string
): Promise<any> => {
  return apiCallPut(`listings/publish/${id}`, body, token, true);
};

export const putListingsUnpublishId = (
  id: string,
  token: string
): Promise<any> => {
  return apiCallPut(`listings/unpublish/${id}`, {}, token, true);
};

export const putListingsIdReviewBookId = (
  id: string,
  bookId: string,
  body: object,
  token: string
): Promise<any> => {
  return apiCallPut(`listings/${id}/review/${bookId}`, body, token, true);
};

// bookings
export const getBookings = (token: string): Promise<any> => {
  return apiCallGet('bookings', {}, token, true);
};

export const postBookingsNewId = (
  id: string,
  body: object,
  token: string
): Promise<any> => {
  return apiCallPost(`bookings/new/${id}`, body, token, true);
};

export const putBookingsAcceptId = (
  id: string,
  token: string
): Promise<any> => {
  return apiCallPut(`bookings/accept/${id}`, {}, token, true);
};

export const putBookingsDeclineId = (
  id: string,
  token: string
): Promise<any> => {
  return apiCallPut(`bookings/decline/${id}`, {}, token, true);
};

export const deleteBookingsId = (id: string, token: string): Promise<any> => {
  return apiCallDelete(`bookings/${id}`, {}, token, true);
};
