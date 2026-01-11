import { Chip } from "@material-ui/core";

export const getScoreChip = (score) => {
  if (score === undefined || score === null) return null;

  const percentage = Math.round(score * 100);
  let matchType = "";
  let chipColor = "#9e9e9e";

  if (score >= 0.8) {
    matchType = "Best Match for You";
    chipColor = "#4caf50";
  } else if (score >= 0.6) {
    matchType = "Quite Suitable for You";
    chipColor = "#8bc34a";
  } else if (score >= 0.3) {
    matchType = "Suitable for You";
    chipColor = "#ff9800";
  } else {
    matchType = "You Might Like";
    chipColor = "#607d8b";
  }

  const label = score < 0.2 ? matchType : `${percentage}% Match (${matchType})`;

  return (
    <Chip
      size="small"
      label={label}
      style={{
        backgroundColor: chipColor,
        color: "#ffffff",
        fontWeight: 600,
        fontSize: '0.75rem'
      }}
    />
  );
};

