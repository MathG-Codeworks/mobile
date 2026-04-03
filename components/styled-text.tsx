import { Text, TextProps } from 'react-native';

interface StyledTextProps extends TextProps {
  className?: string;
}

export function StyledText({ className, ...props }: StyledTextProps) {
  return <Text className={className} {...props} />;
}