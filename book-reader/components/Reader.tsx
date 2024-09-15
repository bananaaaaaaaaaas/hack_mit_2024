import { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, Pressable} from 'react-native';
import FileUpload from './FileUpload';
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

const sendScreenshotData = async (file: File) => {
  const [currentPage, setCurrentPage] = useState(1);
  if (!file) {
    console.error('No file selected.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('ws://localhost:/3000/upload_bulk', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'multipart/form-data',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('File upload successful', data);
    } else {
      console.error('File upload failed', response.statusText);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const ImageReader = ({ files }: { files: { file: File; name: string }[] }) => {
  // Initialize points with two default values of (0, 0)
  const [currentPage, setCurrentPage] = useState(1);
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }]);

  const resetPoints = () => {
    setPoints([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
  };

  const handleImageClick = (event: any) => {
    const { locationX, locationY } = event.nativeEvent; // Get coordinates relative to the image
    resetPoints();

    // Replace the first point and leave the second one unchanged
    setPoints([{ x: locationX, y: locationY }, { x: 0, y: 0 }]);
  };

  const handleImagePressOut = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    // Replace the second point and leave the first one unchanged
    setPoints([points[0], { x: locationX, y: locationY }]);
  };

  const sendScreenshotData = async () => {
    const formData = new FormData();
    const file = files[currentPage - 1].file; 
    formData.append('file', file); 
    try {
      const response = await fetch('http://localhost:/3000/upload_bulk', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'multipart/form-data',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('File upload successful', data);
      } else {
        console.error('File upload failed', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, files]);

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage < files.length ? prevPage + 1 : files.length));
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  return (
    <ThemedView style={styles.imageReader}>
      <ThemedText type="title">Document Viewer - Page {currentPage}</ThemedText>

      <ScrollView 
        style={styles.imageViewer} 
        horizontal={false} 
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ScrollView>
          <Pressable onPressIn={handleImageClick} onPressOut={handleImagePressOut}>
            <View style={styles.imageViewer}>
              {files.length > 0 && (
                <Image
                  source={{ uri: URL.createObjectURL(files[currentPage - 1].file) }}
                  style={styles.documentImage}
                />
              )}
              {/* Render the two points */}
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
        <Button title="Previous" onPress={handlePrevious} disabled={currentPage === 1} />
        <Button title="Next" onPress={handleNext} disabled={currentPage === files.length} />
      </View>

      {/* Display the coordinates of the two points */}
      <View style={styles.coordinates}>
        <Text>Point 1: X: {points[0].x}, Y: {points[0].y}</Text>
        <Text>Point 2: X: {points[1].x}, Y: {points[1].y}</Text>
      </View>
      <Button title="Send Screenshot" onPress={sendScreenshotData} />
    </ThemedView>
  );
};


export default function Reader() {
  const [renamedFiles, setRenamedFiles] = useState<{ file: File; name: string }[]>([]);

  const handleFilesUploaded = (files: File[]) => {
    const renamedFiles = files.map((file, index) => {
      const newName = `${padNumber(index + 1)}.png`;
      return { file, name: newName };
    });
    setRenamedFiles(renamedFiles);
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
        {/* Image reader for displaying the uploaded images */}
        <ImageReader files={renamedFiles} />

        {/* AI Chat section */}
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
    alignItems: 'center',  // Align upload button
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
    width: '100%', // Set large width
    height: 800, // Set large height
    resizeMode: 'contain', // Contain the image but let it scroll
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
