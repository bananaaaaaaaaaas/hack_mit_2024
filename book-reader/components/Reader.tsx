import { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, Pressable } from 'react-native';
import FileUpload from './FileUpload';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const padNumber = (num: number) => num.toString().padStart(4, '0');

const AiChat = () => (
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

const ImageReader = ({ files, sendScreenshotData }: { files: { file: File; name: string }[], sendScreenshotData: (file: File) => void }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }]);

  const handleImageClick = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setPoints([{ x: locationX, y: locationY }, { x: 0, y: 0 }]);
  };

  const handleImagePressOut = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setPoints([points[0], { x: locationX, y: locationY }]);
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage < files.length ? prevPage + 1 : files.length));
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, files]);

  return (
    <ThemedView style={styles.imageReader}>
      <ThemedText type="title">Document Viewer - Page {currentPage}</ThemedText>
      <ScrollView style={styles.imageViewer} contentContainerStyle={{ flexGrow: 1 }}>
        <ScrollView>
          <Pressable onPressIn={handleImageClick} onPressOut={handleImagePressOut}>
            <View style={styles.imageViewer}>
              {files.length > 0 && (
                <Image source={{ uri: URL.createObjectURL(files[currentPage - 1].file) }} style={styles.documentImage} />
              )}
              {points.map((point, index) => (
                <View key={index} style={[styles.pointMarker, { left: point.x - 10, top: point.y - 10 }]} />
              ))}
            </View>
          </Pressable>
        </ScrollView>
      </ScrollView>

      <View style={styles.controls}>
        <Button title="Previous" onPress={handlePrevious} disabled={currentPage === 1} />
        <Button title="Next" onPress={handleNext} disabled={currentPage === files.length} />
      </View>

      <View style={styles.coordinates}>
        <Text>Point 1: X: {points[0].x}, Y: {points[0].y}</Text>
        <Text>Point 2: X: {points[1].x}, Y: {points[1].y}</Text>
      </View>

      <Button title="Send Screenshot" onPress={() => sendScreenshotData(files[currentPage - 1].file)} />
    </ThemedView>
  );
};

export default function Reader() {
  const [renamedFiles, setRenamedFiles] = useState<{ file: File; name: string }[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:3000'); // Change this URL to your server

    newSocket.onopen = () => console.log('WebSocket connection opened');
    newSocket.onmessage = (event) => console.log('Message from server:', event.data);
    newSocket.onerror = (error) => console.error('WebSocket error:', error);
    newSocket.onclose = () => console.log('WebSocket connection closed');

    setSocket(newSocket);

    // Cleanup WebSocket connection on component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const handleFilesUploaded = (files: File[]) => {
    const renamedFiles = files.map((file, index) => {
      const newName = `${padNumber(index + 1)}.png`;
      return { file, name: newName };
    });
    setRenamedFiles(renamedFiles);
  };

  const sendScreenshotData = (file: File) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection is not open.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;
      if (socket) {
        socket.send(fileData); // Send binary data via WebSocket
        console.log('File sent over WebSocket');
      }
    };
    reader.onerror = (error) => console.error('Error reading file:', error);

    reader.readAsArrayBuffer(file); // Read the file as binary data
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Image Reader with AI Assistant</ThemedText>
        <View style={styles.headerControls}>
          <FileUpload onFilesUploaded={handleFilesUploaded} />
          <Button title="Help" onPress={() => {}} />
        </View>
      </ThemedView>

      <View style={styles.bodyContainer}>
        <ImageReader files={renamedFiles} sendScreenshotData={sendScreenshotData} />
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
    color: '#fff',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  imageReader: {
    flex: 3,
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
  },
});
