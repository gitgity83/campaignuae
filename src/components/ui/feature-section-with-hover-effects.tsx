
import { cn } from "@/lib/utils";
import {
  Target,
  Users,
  BarChart3,
  Shield,
  Smartphone,
  Clock,
  Award,
  Heart,
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Campaign Management",
      description:
        "Create, manage, and track awareness campaigns with powerful tools designed for impact.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: "Volunteer Coordination",
      description:
        "Efficiently organize and manage volunteers across multiple campaigns and locations.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Real-time Analytics",
      description:
        "Track campaign performance, volunteer engagement, and community awareness metrics.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Data Security",
      description: "Enterprise-grade security to protect your campaign data and volunteer information.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Mobile-First Design",
      description: "Access your campaigns and coordinate activities from any device, anywhere.",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      title: "24/7 Support",
      description:
        "Get help when you need it with our dedicated campaign management support team.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Impact Measurement",
      description:
        "Measure the real-world impact of your awareness campaigns with detailed reporting.",
      icon: <Award className="w-6 h-6" />,
    },
    {
      title: "Community Engagement",
      description: "Build stronger connections with your community through targeted outreach tools.",
      icon: <Heart className="w-6 h-6" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-emerald-200 dark:border-emerald-800",
        (index === 0 || index === 4) && "lg:border-l border-emerald-200 dark:border-emerald-800",
        index < 4 && "lg:border-b border-emerald-200 dark:border-emerald-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-emerald-50 dark:from-emerald-900/20 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-emerald-50 dark:from-emerald-900/20 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-emerald-600 dark:text-emerald-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-emerald-300 dark:bg-emerald-700 group-hover/feature:bg-emerald-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-gray-800 dark:text-gray-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
