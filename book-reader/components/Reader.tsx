<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';
=======
import { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

>>>>>>> 86154c0 (make scrolling kinda work)
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const padNumber = (num: number) => {
    return num.toString().padStart(4, '0');
};

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

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage < 999 ? prevPage + 1 : 999)); // Max limit is 999
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1)); // Min limit is 1
  };

  return (
    <ThemedView style={styles.imageReader}>
<<<<<<< HEAD
      <ThemedText type="title">Document Viewer - Page {padNumber(currentPage)}</ThemedText>
      <View style={styles.imageViewer}>
        <Image
          source={{ uri: `/assets/images/${padNumber(currentPage)}.png` }} // Dynamically load the image
          style={styles.documentImage}
        />
      </View>
=======
      <ThemedText type="title">Document Viewer - Page {currentPage}</ThemedText>

      {/* Wrap the image in a ScrollView to make it scrollable */}
      <ScrollView 
        style={styles.imageViewer} 
        horizontal={false}  // Allow horizontal scrolling
        contentContainerStyle={{ flexGrow: 1 }} // Ensures it can scroll vertically as well
      >
        <ScrollView>
          <Image 
            source={require('@/assets/images/2785.png')} 
            style={styles.documentImage} 
          />
        </ScrollView>
      </ScrollView>

>>>>>>> 86154c0 (make scrolling kinda work)
      <View style={styles.controls}>
        <Button title="Previous" onPress={handlePrevious} />
        <Button title="Next" onPress={handleNext} />
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
        <ImageReader />
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
<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
=======
    backgroundColor: '#fff',
  },
  documentImage: {
    width: '100%', // Set large width
    height: 800, // Set large height
    resizeMode: 'contain', // Contain the image but let it scroll
>>>>>>> 86154c0 (make scrolling kinda work)
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
    borderRadius: 4,
  },
});
