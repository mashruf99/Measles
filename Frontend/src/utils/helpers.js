import { VACCINES } from "./constants";
export const addMonths = (date, m) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + Math.floor(m));
  d.setDate(d.getDate() + Math.round((m % 1) * 30));
  return d;
};

export const isPast = (date) => {
  return new Date(date) < new Date();
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatShort = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

export const buildSchedule = (dob) => {
  return VACCINES.map(({ name, months }) => {
    const due = addMonths(dob, months);

    return {
      name,
      due,
      overdue: isPast(due),
    };
  });
};

export const ageLabel = (dob) => {
  const ms = Date.now() - new Date(dob).getTime();
  const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30.44));

  if (months < 12) return `${months}mo`;

  const years = Math.floor(months / 12);
  const remaining = months % 12;

  return remaining ? `${years}y ${remaining}mo` : `${years}y`;
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

const AVATAR_COLORS = [
  ["#dcf5e5", "#186844"],
  ["#dbeafe", "#1e40af"],
  ["#fce7f3", "#9d174d"],
  ["#fef3c7", "#92400e"],
  ["#ede9fe", "#5b21b6"],
];

export const getAvatarColor = (name) => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};