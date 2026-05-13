/**
 * Fit Rat — Rat Avatar Component (Redesigned)
 * Uses real generated images instead of emojis
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

// Import rat images
const RAT_IMAGES = {
  beginner: require('@/assets/images/rat-beginner.png'),
  main: require('@/assets/images/rat-main.png'),
  legendary: require('@/assets/images/rat-legendary.png'),
};

interface RatAvatarProps {
  stage: { level: number; label: string; description: string };
  size?: 'small' | 'medium' | 'large' | 'hero';
  showInfo?: boolean;
}

function getRatImage(level: number) {
  if (level >= 15) return RAT_IMAGES.legendary;
  if (level >= 5) return RAT_IMAGES.main;
  return RAT_IMAGES.beginner;
}

function getGlowColor(level: number): string {
  if (level >= 15) return '#FFD700';
  if (level >= 10) return '#E53935';
  if (level >= 5) return '#FF6D00';
  return '#666666';
}

export function RatAvatar({ stage, size = 'medium', showInfo = true }: RatAvatarProps) {
  const image = getRatImage(stage.level);
  const glowColor = getGlowColor(stage.level);

  const dimensions = {
    small: 48,
    medium: 80,
    large: 110,
    hero: 160,
  }[size];

  return (
    <View style={styles.container}>
      {/* Glow ring */}
      <View
        style={[
          styles.glowRing,
          {
            width: dimensions + 16,
            height: dimensions + 16,
            borderRadius: (dimensions + 16) / 2,
            borderColor: glowColor,
            shadowColor: glowColor,
          },
        ]}
      >
        <View
          style={[
            styles.imageContainer,
            {
              width: dimensions,
              height: dimensions,
              borderRadius: dimensions / 2,
            },
          ]}
        >
          <Image
            source={image}
            style={[
              styles.image,
              {
                width: dimensions - 8,
                height: dimensions - 8,
                borderRadius: (dimensions - 8) / 2,
              },
            ]}
            contentFit="cover"
            transition={300}
          />
        </View>
      </View>

      {showInfo && size !== 'small' && (
        <View style={styles.infoContainer}>
          <Text style={styles.stageName}>{stage.label}</Text>
          {size === 'hero' || size === 'large' ? (
            <Text style={styles.stageDesc}>{stage.description}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  glowRing: {
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  imageContainer: {
    overflow: 'hidden',
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {},
  infoContainer: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  stageName: {
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  stageDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
});
