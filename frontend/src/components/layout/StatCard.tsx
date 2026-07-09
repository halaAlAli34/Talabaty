import { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconType;
  bgColor?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  bgColor = "#2F67F6",
}: StatCardProps) => {
  return (
    <div className="stat-card card border-0 shadow-sm h-100">
      <div className="card-body">

        <div className="stat-card-top">

          <div
            className="stat-icon"
            style={{ backgroundColor: bgColor }}
          >
            <Icon />
          </div>

        </div>

        <div className="stat-card-content">

          <h6>{title}</h6>

          <h2>{value}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}

        </div>

      </div>
    </div>
  );
};

export default StatCard;