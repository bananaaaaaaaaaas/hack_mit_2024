import { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const AiChat = () => {
  return (
    <ThemedView style={styles.aiChat}>
      <ThemedText type="title">AI Assistant Chat</ThemedText>
      <View style={styles.chatHistory}>
        {/* Add chat history here */}
      </View>
      <View style={styles.chatInput}>
        <TextInput style={styles.input} placeholder="Ask AI..." />
        <Button title="Send" onPress={() => {}} />
      </View>
    </ThemedView>
  );
};

const ImageReader = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <ThemedView style={styles.imageReader}>
      <ThemedText type="title">Document Viewer - Page {currentPage}</ThemedText>
      <View style={styles.imageViewer}>
        <Image source={require('@/assets/images/2785.png')} style={styles.documentImage} />
      </View>
      <View style={styles.controls}>
        <Button title="Previous" onPress={() => setCurrentPage(Math.max(currentPage - 1, 1))} />
        <Button title="Next" onPress={() => setCurrentPage(currentPage + 1)} />
      </View>
    </ThemedView>
  );
};

export default function Reader() {
  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Image Reader with AI Assistant</ThemedText>
        <View style={styles.headerControls}>
          <Button title="Save" onPress={() => {}} />
          <Button title="Help" onPress={() => {}} />
        </View>
      </ThemedView>

      <View style={styles.bodyContainer}>
        {/* Left side: Image Reader */}
        <ImageReader />

        {/* Right side: AI Chat */}
        <AiChat />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#333',
    color: '#fff',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  imageReader: {
    flex: 2,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  imageViewer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  aiChat: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e9ecef',
    justifyContent: 'space-between',
  },
  chatHistory: {
    flex: 1,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    backgroundColor: '#fff',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 4
  },
});