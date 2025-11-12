import { v4 as uuidv4 } from 'uuid';

export const getOrCreateGuestId = (req) => {
  let guestId = req.headers?.['guest-id'] || req.body?.guest_id;

  if (!guestId || guestId === 'undefined') {
    guestId = uuidv4();
    console.log("Generated guest ID:", guestId);
  } else {
    console.log("Existing guest ID:", guestId);
  }

  return guestId;
};
