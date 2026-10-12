import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { Dir, DIRS } from '../utils/grid';
import ArrowGlyph from './ArrowGlyph';

type StackProps = {
  dir: Dir;
  left: number;
  armed: boolean;
  onArm: (dir: Dir) => void;
};

function TileStack({ dir, left, armed, onArm }: StackProps) {
  const exhausted = left <= 0;
  const handle = useCallback(() => {
    onArm(dir);
  }, [onArm, dir]);

  return (
    <Pressable
      onPress={handle}
      disabled={exhausted}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.stack,
        armed ? styles.stackArmed : null,
        exhausted ? styles.stackOff : null,
      ]}>
      <ArrowGlyph dir={dir} size={26} color={theme.colors.textPrimary} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{left}</Text>
      </View>
    </Pressable>
  );
}

type Props = {
  counts: Record<Dir, number>;
  armed: Dir | null;
  onArm: (dir: Dir) => void;
};

/** The arrow tray. Plain Pressables — no gesture handler anywhere in this app. */
function TileTrayImpl({ counts, armed, onArm }: Props) {
  const visible = DIRS.filter(dir => counts[dir] > 0 || armed === dir);
  return (
    <View style={styles.row}>
      {visible.map(dir => (
        <TileStack
          key={dir}
          dir={dir}
          left={counts[dir]}
          armed={armed === dir}
          onArm={onArm}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stack: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: theme.colors.gold,
    borderWidth: 2,
    borderColor: theme.colors.goldDeep,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#322B3B',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  stackArmed: {
    borderWidth: 3,
    borderColor: theme.colors.accent,
    transform: [{ scale: 1.06 }],
  },
  stackOff: {
    opacity: 0.38,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.surface,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: theme.colors.white,
  },
});

export const TileTray = React.memo(TileTrayImpl);
export default TileTray;
