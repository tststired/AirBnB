export type Props = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
};

export type range = {
  start: string,
  end: string
}

export type reviews = {
  score: number,
  comment: string
}

export type ListingType = {
  id: string;
  title: string;
  owner: string;
  address: string;
  thumbnail: string;
  price: number;
  reviews: object[];
};

export type ListingUserType = {
  address: string;
  availability: object[];
  id: string;
  metadata: {
    type: string;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    amenities: string;
    beds: number;
    start: string;
  };
  owner: string;
  postedOn: string | null;
  price: number;
  published: boolean
  reviews: reviews[];
  thumbnail: string;
  title: string;
};

export type DiaProps = {
  token: string | null;
  id: string;
  trig: boolean;
  setTrig: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Booking = {
  id: string;
  owner: string; // customer email
  dateRange: range;
  totalPrice: number;
  listingId: string;
  status: string;
}

export type MakeProps = {
  token: string | null;
  email: string | null;
  id: string;
  data: ListingUserType;
  trig: boolean;
  setTrig: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ViewBookProps = {
  id: string;
  email: string | null;
  token: string | null;
  trig: boolean;
}

export type ManageBookProps = {
  token: string | null;
  bookings: Booking[];
  setTrig: React.Dispatch<React.SetStateAction<boolean>>;
  trig: boolean;
}
