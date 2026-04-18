
export const evaluateRisk = ({ fever, rash, redEyes }) => {
  if (fever && rash && redEyes) {
    return {
      risk: "High",
      level: 3,
      message:
        "High risk of measles. Seek immediate medical attention and isolate the child.",
    };
  }

  if (fever && rash) {
    return {
      risk: "Medium",
      level: 2,
      message:
        "Medium risk. Monitor closely and consult a doctor.",
    };
  }

  return {
    risk: "Low",
    level: 1,
    message:
      "Low risk. Continue monitoring and ensure vaccination is up to date.",
  };
};