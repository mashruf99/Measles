import { addDays, isBefore, startOfDay } from 'date-fns';

// Standard schedule in days from birth
export const VACCINE_SCHEDULE = {
  bcg_opv0: 0,
  penta1: 42,   
  penta2: 70,  
  penta3: 98,   
  mr1: 270,    
  mr2: 450,     
};

export function calculateChildStatus(dob, prevVaccines = {}) {
  const birthDate = startOfDay(new Date(dob));
  const today = startOfDay(new Date());
  
  let overdueCount = 0;
  let upcomingCount = 0;
  let status = 'on-track';

  for (const [vaccine, days] of Object.entries(VACCINE_SCHEDULE)) {
    const dueDate = addDays(birthDate, days);
    if (!prevVaccines[vaccine]) {
      if (isBefore(dueDate, today)) {
        overdueCount++;
        status = 'overdue';
      } else {
        upcomingCount++;
      }
    }
  }

  if (overdueCount === 0 && upcomingCount > 0) status = 'upcoming';
  if (overdueCount === 0 && upcomingCount === 0) status = 'completed';

  return { status, overdueCount, upcomingCount };
}