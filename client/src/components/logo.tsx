interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = false }: LogoProps) {
  return (
    <div className="flex items-center">
      <img 
        src="https://cloudsec.creantisworld.com/wp-content/uploads/2020/02/CloudSec.png" 
        alt="CloudSec Tech Logo" 
        className="h-12 w-auto" 
      />

      {showText && (
        <span className="ml-2 text-xl font-bold">CloudSec Tech</span>
      )}
    </div>
  );
}