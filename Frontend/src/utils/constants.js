// Vaccine schedule based on Bangladesh EPI
export const VACCINES = [
  { name: "BCG + OPV-0", months: 0 },
  { name: "Pentavalent-1 + OPV-1 + PCV-1", months: 1.5 },
  { name: "Pentavalent-2 + OPV-2 + PCV-2", months: 2.5 },
  { name: "Pentavalent-3 + OPV-3 + IPV", months: 3.5 },
  { name: "Measles-Rubella (MR) Dose 1", months: 9 },
  { name: "Measles-Rubella (MR) Dose 2", months: 15 },
];

// Symptom config for checker UI
export const SYMPTOMS_CONFIG = [
  { key: "fever", label: "Fever", desc: "High body temperature ≥38°C", emoji: "🌡️" },
  { key: "rash", label: "Rash", desc: "Red skin rash", emoji: "🔴" },
  { key: "redEyes", label: "Red Eyes", desc: "Conjunctivitis", emoji: "👁️" },
  { key: "cough", label: "Cough", desc: "Persistent cough", emoji: "😮‍💨" },
];

export const MOCK_CHILDREN = [
  {
    _id: "1",
    name: "Riya Akter",
    dateOfBirth: "2024-07-01",
    guardianPhone: "01712345678",
    createdAt: "2025-01-10",
  },
  {
    _id: "2",
    name: "Karim Hossain",
    dateOfBirth: "2024-08-15",
    guardianPhone: "01898765432",
    createdAt: "2025-01-18",
  },
  {
    _id: "3",
    name: "Nusrat Jahan",
    dateOfBirth: "2024-02-10",
    guardianPhone: "01612345678",
    createdAt: "2025-02-05",
  },
  {
    _id: "4",
    name: "Amir Talha",
    dateOfBirth: "2023-11-20",
    guardianPhone: "01512349876",
    createdAt: "2025-03-01",
  },
];