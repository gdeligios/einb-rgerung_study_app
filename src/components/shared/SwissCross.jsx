export default function SwissCross({ size = 24, color = "#C8102E" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="3" fill={color}/>
      <rect x="10" y="5" width="4" height="14" fill="white"/>
      <rect x="5" y="10" width="14" height="4" fill="white"/>
    </svg>
  );
}
