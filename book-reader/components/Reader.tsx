import { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, Pressable} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const padNumber = (num) => {
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
  const [points, setPoints] = useState([]); // Store clicked points

  const handleImageClick = (event) => {
    const { locationX, locationY } = event.nativeEvent; // Get coordinates relative to the image
    if (points.length < 2) {
      setPoints([...points, { x: locationX, y: locationY }]); // Add up to two points
    }
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage < 999 ? prevPage + 1 : 999)); // Max limit is 999
    setPoints([]); // Reset points when page changes
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1)); // Min limit is 1
    setPoints([]); // Reset points when page changes
  };

  return (
    <ThemedView style={styles.imageReader}>
      <ThemedText type="title">Document Viewer - Page {padNumber(currentPage)}</ThemedText>

      <ScrollView 
        style={styles.imageViewer} 
        horizontal={false} 
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ScrollView>
          <Pressable onPressIn={handleImageClick} onPressOut={handleImageClick}>
            <View>
              <Image
                source={{ uri: `/assets/images/${padNumber(currentPage)}.png` }}
                style={styles.documentImage}
              />
              {/* Render the selected points */}
              {points.map((point, index) => (
                <View
                  key={index}
                  style={[
                    styles.pointMarker,
                    { left: point.x - 10, top: point.y - 10 },
                  ]}
                />
              ))}
            </View>
          </Pressable>
        </ScrollView>
      </ScrollView>

      <View style={styles.controls}>
        <Button title="Previous" onPress={handlePrevious} />
        <Button title="Next" onPress={handleNext} />
      </View>

      {/* Display the coordinates of the two points */}
      <View style={styles.coordinates}>
        {points.length > 0 && <Text>Point 1: X: {points[0].x}, Y: {points[0].y}</Text>}
        {points.length > 1 && <Text>Point 2: X: {points[1].x}, Y: {points[1].y}</Text>}
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
    backgroundColor: '#fff',
  },
  documentImage: {
    width: '100%', 
    height: 800, 
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
    borderRadius: 4,
  },
  pointMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    opacity: 0.7,
  },
  coordinates: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
  }
});
