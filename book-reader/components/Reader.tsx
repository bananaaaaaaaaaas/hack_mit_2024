import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
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

const ImageReader = ({ files }: { files: { file: File; name: string }[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
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

      <View style={styles.controls}>
        <Button title="Previous" onPress={handlePrevious} disabled={currentPage === 1} />
        <Button title="Next" onPress={handleNext} disabled={currentPage === files.length} />
      </View>
    </ThemedView>
  );
};

const FileUploader = ({ onFilesUploaded }: { onFilesUploaded: (files: File[]) => void }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFilesUploaded(files);
  };

  return (
    <input type="file" multiple accept="image/*" onChange={handleFileChange} />
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
          {/* Move FileUploader into header */}
          <FileUploader onFilesUploaded={handleFilesUploaded} />
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
    flex: 2,
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
});
