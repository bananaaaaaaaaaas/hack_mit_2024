import { useState, useEffect, useRef } from 'react';
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

const ImageReader = ({ files, sendScreenshotData }: { files: { file: File; name: string }[], sendScreenshotData: (file: Blob) => void }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [points, setPoints] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elementOffsetx, setElementOffsetx] = useState(0);
  const [elementOffsety, setElementOffsety] = useState(0);
  const [yGlobal, setyGlobal] = useState(0);
  const [xGlobal, setxGlobal] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  var offsetx= 0, offsety=0;
  const resetPoints = () => {
    setPoints([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
  };
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);
  };
  const handleMouseDown = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    resetPoints();
    setPoints([{ x: locationX, y: locationY }, { x: locationX, y: locationY }]); // Start the box
    setElementOffsety(yGlobal - locationY);
    setElementOffsetx(xGlobal - locationX)
    setIsDrawing(true); // Start drawing mode
  };

  const handleMouseMove = (event: any) => {
    const { clientX, clientY } = event.nativeEvent;
    setxGlobal(clientX);
    setyGlobal(clientY);
    if (!isDrawing) return;
    setPoints([points[0], { x: clientX -elementOffsetx, y: clientY  - elementOffsety }]); // Update the second point as the mouse moves
  };

  const handleMouseUp = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setPoints([points[0], { x: locationX, y: locationY }]); // Finalize the second point
    setIsDrawing(false); // End drawing mode
    cropAndSendImage();
  };

  const cropAndSendImage = () => {
    const imageFile = files[currentPage - 1].file;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new window.Image();
    img.src = URL.createObjectURL(imageFile);

    img.onload = () => {
      const cropX = Math.min(points[0].x, points[1].x);
      const cropY = Math.min(points[0].y, points[1].y);
      const cropWidth = Math.abs(points[1].x - points[0].x);
      const cropHeight = Math.abs(points[1].y - points[0].y);

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx?.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      console.log("did i do anything?");

      canvas.toBlob((blob) => {
        if (blob) sendScreenshotData(blob);
      }, 'image/png');
    };
  };

  const getBoxStyle = () => {
    const left = Math.min(points[0].x, points[1].x);
    const top = Math.min(points[0].y, points[1].y);
    const width = Math.abs(points[0].x - points[1].x);
    const height = Math.abs(points[0].y - points[1].y);
  
    return {
      left,
      top,
      width,
      height,
      borderColor: 'red',
      borderWidth: 2,
      position: 'absolute',
    };
  };

  return (
    <ThemedView style={styles.imageReader}>
      <ThemedText type="title">Document Viewer - Page {currentPage}</ThemedText>

      <ScrollView style={styles.imageViewer} horizontal={false}>
        <Pressable
          onPressIn={handleMouseDown}
          onPressOut={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <View style={styles.imageViewer}>
            {files.length > 0 && (
              <Image source={{ uri: URL.createObjectURL(files[currentPage - 1].file) }} style={styles.documentImage} />
            )}
            <View style={getBoxStyle()} />
          </View>
        </Pressable>

        {/* Hidden canvas for cropping the image */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </ScrollView>

      <View style={styles.controls}>
        <Button title="Previous" onPress={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)} />
        <Button title="Next" onPress={() => setCurrentPage(currentPage < files.length ? currentPage + 1 : currentPage)} />
      </View>

      <View style={styles.coordinates}>
        <Text>Point 1: X: {points[0].x}, Y: {points[0].y}</Text>
        <Text>Point 2: X: {points[1].x}, Y: {points[1].y}</Text>
      </View>
    </ThemedView>
  );
};

export default function Reader() {
  const [renamedFiles, setRenamedFiles] = useState<{ file: File; name: string }[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:3000'); // Replace with your WebSocket URL

    newSocket.onopen = () => console.log('WebSocket connection opened');
    newSocket.onmessage = (event) => console.log('Message from server:', event.data);
    newSocket.onerror = (error) => console.error('WebSocket error:', error);
    newSocket.onclose = () => console.log('WebSocket connection closed');

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handleFilesUploaded = (files: File[]) => {
    const renamedFiles = files.map((file, index) => ({ file, name: `${padNumber(index + 1)}.png` }));
    setRenamedFiles(renamedFiles);
  };

  const sendScreenshotData = (file: Blob) => {
    console.log(file);
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      socket?.send(reader.result as ArrayBuffer); // Send binary data
      console.log('File sent over WebSocket');
    };
    reader.onerror = (error) => console.error('Error reading file:', error);

    reader.readAsArrayBuffer(file);
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Image Reader with AI Assistant</ThemedText>
        <View style={styles.headerControls}>
          <FileUpload onFilesUploaded={handleFilesUploaded} />
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
  pageContainer: { flex: 1, flexDirection: 'column' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#333', color: '#fff' },
  bodyContainer: { flex: 1, flexDirection: 'row' },
  imageReader: { flex: 3, padding: 16, backgroundColor: '#f5f5f5' },
  imageViewer: { flex: 1, backgroundColor: '#fff' },
  documentImage: { width: '100%', height: 800, resizeMode: 'contain' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  aiChat: { flex: 1, padding: 16, backgroundColor: '#e9ecef', justifyContent: 'space-between' },
  coordinates: { marginTop: 16, padding: 10, backgroundColor: '#e9ecef', borderRadius: 4 },
});
