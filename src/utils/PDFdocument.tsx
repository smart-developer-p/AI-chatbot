import { Document, Page, Text, StyleSheet, View, Font } from '@react-pdf/renderer';

interface Message {
  role: string;
  text: string;
  timestamp: string;
}

interface PdfDocumentProps {
  content: {
    conversation_id: string;
    messages: Message[];
  };
}

Font.register({
  family: 'Courier',
  src: 'https://fonts.gstatic.com/s/courierprime/v1/u-450q2lgwslOqpF2pIMou3L3MBPgyo.ttf',
});

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  title: { fontSize: 24, marginBottom: 20 },
  messageContainer: { marginBottom: 10, padding: 10, borderRadius: 8 },
  userMessage: { backgroundColor: '#e3f2fd', alignSelf: 'flex-end' },
  modelMessage: { backgroundColor: '#f1f1f1', alignSelf: 'flex-start' },
  role: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  text: { fontSize: 12, marginBottom: 4 },
  boldText: { fontSize: 12, fontWeight: 'bold' },
  italicText: { fontSize: 12, fontStyle: 'italic' },
  codeBlock: {
    fontFamily: 'Courier',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    fontSize: 10,
  },
  timestamp: { fontSize: 8, color: '#888888', textAlign: 'right' },
});

const formatTimestamp = (timestamp: string) => new Date(timestamp).toLocaleString();

const parseMarkdown = (text: string) => {
  const elements: JSX.Element[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let lastIndex = 0;

  text.replace(regex, (match, bold, boldText, italic, italicText, inlineCode, codeText, index) => {
    if (index > lastIndex) {
      elements.push(<Text key={lastIndex} style={styles.text}>{text.slice(lastIndex, index)}</Text>);
    }

    if (bold) {
      elements.push(<Text key={index} style={styles.boldText}>{boldText}</Text>);
    } else if (italic) {
      elements.push(<Text key={index} style={styles.italicText}>{italicText}</Text>);
    } else if (inlineCode) {
      elements.push(<Text key={index} style={styles.codeBlock}>{codeText}</Text>);
    }

    lastIndex = index + match.length;
    return '';
  });

  if (lastIndex < text.length) {
    elements.push(<Text key={lastIndex} style={styles.text}>{text.slice(lastIndex)}</Text>);
  }

  return elements;
};

const parseMessage = (text: string) => {
  const segments = text.split(/(```[\w]*\n|```)/g); // Split by code block markers
  let isCode = false; // Track whether the current segment is code
  const parsedSegments: JSX.Element[] = [];

  segments.forEach((segment, index) => {
    if (segment.startsWith("```")) {
      isCode = !isCode; // Toggle code state on each code marker
    } else if (isCode) {
      parsedSegments.push(
        <Text key={index} style={styles.codeBlock}>{segment}</Text>
      );
    } else {
      parsedSegments.push(
        <View key={index}>{parseMarkdown(segment)}</View>
      );
    }
  });

  return parsedSegments;
};

const PdfDocument = ({ content }: PdfDocumentProps) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Chat History</Text>
      {content.messages.map((message, index) => (
        <View
          key={index}
          style={[
            styles.messageContainer,
            message.role === 'user' ? styles.userMessage : styles.modelMessage,
          ]}
        >
          <Text style={styles.role}>{message.role === 'model' ? 'Cerina' : 'User'}</Text>
          <View>{parseMessage(message.text)}</View>
          <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default PdfDocument;
