import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  excludeEdges?: ("top" | "bottom" | "left" | "right")[];
}

/**
 * 안전 영역을 고려한 래퍼 컴포넌트입니다.
 * 각 화면에서 공통으로 사용할 수 있습니다.
 *
 * @param children 자식 컴포넌트
 * @param style 추가 스타일
 * @param excludeEdges 안전 영역에서 제외할 가장자리 (예: Bottom 탭이 있는 경우 'bottom' 제외)
 */
const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  excludeEdges = [],
}) => {
  const insets = useSafeAreaInsets();

  // 각 가장자리에 적용할 패딩 계산
  const padding = {
    paddingTop: excludeEdges.includes("top") ? 0 : insets.top,
    paddingBottom: excludeEdges.includes("bottom") ? 0 : insets.bottom,
    paddingLeft: excludeEdges.includes("left") ? 0 : insets.left,
    paddingRight: excludeEdges.includes("right") ? 0 : insets.right,
  };

  return <View style={[styles.container, padding, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default SafeAreaWrapper;
