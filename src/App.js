import { useState, useEffect } from 'react';
import './App.css';
import crypto from 'crypto-js';
import iconv from 'iconv-lite';

function App() {
  const [textInput, setTextInput] = useState('');
  const [hexInput, setHexInput] = useState('');
  const [tempHexInput, setTempHexInput] = useState(''); // 임시 hex 입력값 저장

  // hex string이 유효한지 검사
  const isValidHex = (hex) => /^[0-9A-Fa-f]*$/.test(hex);

  // hex 값을 처리하고 모든 변환 수행
  const processHexInput = (hex) => {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
    setHexInput(cleanHex);
    
    if (cleanHex) {
      try {
        // Buffer.from()은 Node.js 환경에서만 사용 가능
        // 브라우저에서는 Buffer 대신 Uint8Array 사용
        const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const text = iconv.decode(bytes, 'cp949');
        setTextInput(text);
      } catch (e) {
        console.error('Hex decoding error:', e);
        // 유효하지 않은 hex 값일 경우 처리하지 않음
      }
    } else {
      setTextInput('');
    }
  };

  // text가 변경될 때 hex 업데이트
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setTextInput(newText);
    if (newText) {
      const buffer = iconv.encode(newText, 'cp949');
      setHexInput(buffer.toString('hex'));
      setTempHexInput(buffer.toString('hex'));
    } else {
      setHexInput('');
      setTempHexInput('');
    }
  };

  // hex 입력 처리
  const handleHexChange = (e) => {
    const newHex = e.target.value.replace(/[^0-9A-Fa-f\s]/g, ''); // 16진수와 공백만 허용
    setTempHexInput(newHex);
  };

  // hex 입력에서 키 입력 처리
  const handleHexKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 엔터 동작 방지
      const cleanHex = tempHexInput.replace(/[^0-9A-Fa-f]/g, '');
      if (cleanHex.length % 2 === 0) { // 16진수는 2자리씩 처리되어야 함
        processHexInput(cleanHex);
      }
    }
  };

  const encodeToHex = (text) => {
    if (!text) return '';
    const buffer = iconv.encode(text, 'cp949');
    return buffer.toString('hex');
  };

  const encodeToBase64 = (text) => {
    if (!text) return { base64: '', hex: '' };
    const buffer = iconv.encode(text, 'cp949');
    return {
      base64: buffer.toString('base64'),
      hex: buffer.toString('hex')
    };
  };

  const encodeToSHA256 = (text) => {
    if (!text) return '';
    return crypto.SHA256(text).toString();
  };

  const encodeToUTF8 = (text) => {
    if (!text) return { text: '', hex: '' };
    const buffer = iconv.encode(text, 'cp949');
    return {
      text: iconv.decode(buffer, 'utf8'),
      hex: buffer.toString('hex')
    };
  };

  const encodeToUTF8WithBOM = (text) => {
    if (!text) return '';
    const bom = 'efbbbf';
    const buffer = iconv.encode(text, 'cp949');
    return bom + buffer.toString('hex');
  };

  // Clear all inputs
  const handleClear = () => {
    setTextInput('');
    setHexInput('');
    setTempHexInput('');
  };

  return (
    <div className="App">
      <div className="encoder-container">
        <h1>온라인 인코딩 도구</h1>
        
        <div className="input-container">
          <div className="input-header">
            <h2>입력</h2>
            <button onClick={handleClear} className="clear-button">
              Clear All
            </button>
          </div>
          
          <div className="input-section">
            <div className="input-group">
              <h3>Text Input (CP949):</h3>
              <textarea
                value={textInput}
                onChange={handleTextChange}
                placeholder="텍스트를 입력하세요..."
              />
            </div>
            <div className="input-group">
              <h3>Hexadecimal Input:</h3>
              <textarea
                value={tempHexInput}
                onChange={handleHexChange}
                onKeyDown={handleHexKeyDown}
                placeholder="16진수를 입력하세요... (Enter를 누르면 변환)"
              />
            </div>
          </div>
        </div>

        <div className="results-container">
          <h2>변환 결과</h2>
          <div className="results-section">
            <div className="result-item">
              <h3>Hexadecimal:</h3>
              <pre>{encodeToHex(textInput)}</pre>
            </div>

            <div className="result-item">
              <h3>Base64:</h3>
              <pre>{encodeToBase64(textInput).base64}</pre>
              <h3>Base64 (Hex):</h3>
              <pre>{encodeToBase64(textInput).hex}</pre>
            </div>

            <div className="result-item">
              <h3>SHA256:</h3>
              <pre>{encodeToSHA256(textInput)}</pre>
            </div>

            <div className="result-item">
              <h3>UTF-8:</h3>
              <pre>{encodeToUTF8(textInput).text}</pre>
              <h3>UTF-8 (Hex):</h3>
              <pre>{encodeToUTF8(textInput).hex}</pre>
            </div>

            <div className="result-item">
              <h3>UTF-8 with BOM:</h3>
              <pre>{encodeToUTF8WithBOM(textInput)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
