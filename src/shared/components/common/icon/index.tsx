import React from 'react';

const icons = import.meta.glob<{
  default: React.FC<React.SVGProps<SVGSVGElement>>;
}>('@/shared/assets/icons/*.svg', { eager: true });

const formattedIcons: Record<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {};

Object.entries(icons).forEach(([fullPath, module]) => {
  const iconName = fullPath.split('/').pop()?.replace('.svg', ''); // ✅ Fayl nomini olish
  if (iconName && module.default) {
    formattedIcons[iconName] = module.default;
  }
});

export type IconName = keyof typeof formattedIcons;

interface IconProps {
  size?: number;
  name: IconName;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  if (!(name in formattedIcons)) {
    console.error(`❌ Icon "${name}" not found!`);
    return null;
  }

  const SvgIcon = formattedIcons[name];

  return <SvgIcon width={size} height={size} className={className} />;
};

export default Icon;
