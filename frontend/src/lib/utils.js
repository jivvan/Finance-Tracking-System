export function getColorPerProgress(progress, lower_better = false) {
  if (lower_better) {
    progress = 100 - progress;
  }
  if (progress >= 75) return "cyan";
  if (progress >= 50) return "green";
  if (progress >= 25) return "yellow";
  return "red";
}
