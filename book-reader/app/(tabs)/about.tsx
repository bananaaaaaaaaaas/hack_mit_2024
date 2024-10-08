import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About</ThemedText>
      </ThemedView>
      <ThemedText>TangoRead is an AI-driven language learning platform that transforms the way users engage with written content. By utilizing advanced Optical Character Recognition (OCR) and Natural Language Processing (NLP) technologies, TangoRead offers interactive reading experiences with real-time translations and gamified retention tools.

Overview
Interactive Reading: Users can highlight text within materials such as manga and research papers to receive instant translations and context-aware explanations.
AI Assistant - Tango: Powered by LLaMa-based language models, Tango provides summaries and answers to user queries based on the recognized text.
Gamified Learning: At the end of each session, key linguistic elements are presented as flashcards to reinforce learning through engaging activities.
Modular Architecture: The system supports model swap-outs, allowing it to generalize to any legible written media type and language.
Inspiration
Learning languages with complex scripts can be challenging. Inspired by the Japanese word "tango" (単語), meaning "word," TangoRead aims to make language acquisition immersive and enjoyable. The platform combines the freshness of a tangerine with the dynamism of dance, symbolizing a vibrant and engaging learning journey.

Features
Advanced OCR: Accurately processes stylized and complex scripts found in various media.
Real-Time Translation: Provides immediate translations to enhance comprehension.
Contextual Explanations: Offers deeper insights into language usage and nuances.
Personalized Summaries: Generates end-of-session summaries highlighting key vocabulary and phrases.
Flashcards for Retention: Reinforces learning through interactive flashcards.
Scalable and Adaptable: Easily extends to support additional languages and media types.
What's Next
ASR Integration: Incorporate speech recognition to extract insights from audio media like videos and podcasts.
Expanded Language Support: Utilize the modular design to add more languages and scripts.
Enhanced Gamification: Introduce adaptive learning algorithms and progress tracking.
Mobile Optimization: Develop a mobile-friendly version for increased accessibility.
Embark on an engaging language learning adventure with TangoRead, where every word becomes a step towards mastery.</ThemedText>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
