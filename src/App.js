import { useState, useEffect } from 'react';
import './App.css';
import crypto from 'crypto-js';
import iconv from 'iconv-lite';

function App() {
  const [cp949TextInput, setCp949TextInput] = useState('');
  const [utf8TextInput, setUtf8TextInput] = useState('');
  const [cp949HexInput, setCp949HexInput] = useState('');
  const [utf8HexInput, setUtf8HexInput] = useState('');
  const [tempCp949HexInput, setTempCp949HexInput] = useState('');
  const [tempUtf8HexInput, setTempUtf8HexInput] = useState('');
  const [utf8BomTextInput, setUtf8BomTextInput] = useState('');
  const [utf8BomHexInput, setUtf8BomHexInput] = useState('');
  const [tempUtf8BomHexInput, setTempUtf8BomHexInput] = useState('');

  // 변환 결과 영역을 위한 상태들 수정
  const [resultHexInput, setResultHexInput] = useState('');
  const [tempResultHexInput, setTempResultHexInput] = useState('');
  const [resultTextCP949, setResultTextCP949] = useState('');
  const [resultTextUTF8, setResultTextUTF8] = useState('');
  const [resultTextUTF8Bom, setResultTextUTF8Bom] = useState('');
  const [resultHash, setResultHash] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });

  // 변환 결과 영역을 위한 상태들에 추가
  const [resultTextInput, setResultTextInput] = useState('');

  // CP949 text input handler
  const handleCp949TextChange = (e) => {
    const newText = e.target.value;
    setCp949TextInput(newText);
    if (newText) {
      const buffer = iconv.encode(newText, 'cp949');
      setCp949HexInput(buffer.toString('hex'));
      setTempCp949HexInput(buffer.toString('hex'));
      // Update UTF-8 input
      setUtf8TextInput(newText);
      const utf8Encoder = new TextEncoder();
      const utf8Bytes = utf8Encoder.encode(newText);
      setUtf8HexInput(Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
      setTempUtf8HexInput(Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join(''));

      // Update UTF-8 with BOM
      setUtf8BomTextInput(newText);
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const combinedBytes = new Uint8Array(bom.length + utf8Bytes.length);
      combinedBytes.set(bom);
      combinedBytes.set(utf8Bytes, bom.length);
      const bomHexString = Array.from(combinedBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      setUtf8BomHexInput(bomHexString);
      setTempUtf8BomHexInput(bomHexString);
    } else {
      clearInputs();
    }
  };

  // UTF-8 text input handler
  const handleUtf8TextChange = (e) => {
    const newText = e.target.value;
    setUtf8TextInput(newText);
    if (newText) {
      const utf8Encoder = new TextEncoder();
      const utf8Bytes = utf8Encoder.encode(newText);
      const hexString = Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      setUtf8HexInput(hexString);
      setTempUtf8HexInput(hexString);
      // Update CP949 input
      setCp949TextInput(newText);
      const cp949Buffer = iconv.encode(newText, 'cp949');
      setCp949HexInput(cp949Buffer.toString('hex'));
      setTempCp949HexInput(cp949Buffer.toString('hex'));

      // Update UTF-8 with BOM
      setUtf8BomTextInput(newText);
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const combinedBytes = new Uint8Array(bom.length + utf8Bytes.length);
      combinedBytes.set(bom);
      combinedBytes.set(utf8Bytes, bom.length);
      const bomHexString = Array.from(combinedBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      setUtf8BomHexInput(bomHexString);
      setTempUtf8BomHexInput(bomHexString);
    } else {
      clearInputs();
    }
  };

  // CP949 hex input handler
  const handleCp949HexChange = (e) => {
    const newHex = e.target.value.replace(/[^0-9A-Fa-f\s]/g, '');
    setTempCp949HexInput(newHex);
  };

  // UTF-8 hex input handler
  const handleUtf8HexChange = (e) => {
    const newHex = e.target.value.replace(/[^0-9A-Fa-f\s]/g, '');
    setTempUtf8HexInput(newHex);
  };

  // UTF-8 with BOM text input handler
  const handleUtf8BomTextChange = (e) => {
    const newText = e.target.value;
    setUtf8BomTextInput(newText);
    if (newText) {
      const utf8Encoder = new TextEncoder();
      const utf8Bytes = utf8Encoder.encode(newText);
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const combinedBytes = new Uint8Array(bom.length + utf8Bytes.length);
      combinedBytes.set(bom);
      combinedBytes.set(utf8Bytes, bom.length);
      const hexString = Array.from(combinedBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      setUtf8BomHexInput(hexString);
      setTempUtf8BomHexInput(hexString);
      
      // Update other inputs
      setUtf8TextInput(newText);
      setCp949TextInput(newText);
      updateOtherInputs(newText);
    } else {
      clearInputs();
    }
  };

  // UTF-8 with BOM hex input handler
  const handleUtf8BomHexChange = (e) => {
    const newHex = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
    setTempUtf8BomHexInput(newHex);
  };

  // Process CP949 hex input
  const processCp949HexInput = (hex) => {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
    setCp949HexInput(cleanHex);
    
    if (cleanHex && cleanHex.length % 2 === 0) {
      try {
        const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const text = iconv.decode(bytes, 'cp949');
        setCp949TextInput(text);
        setUtf8TextInput(text);
        
        // Update UTF-8 hex
        const utf8Encoder = new TextEncoder();
        const utf8Bytes = utf8Encoder.encode(text);
        const utf8HexString = Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        setUtf8HexInput(utf8HexString);
        setTempUtf8HexInput(utf8HexString);

        // Update UTF-8 with BOM
        setUtf8BomTextInput(text);
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const combinedBytes = new Uint8Array(bom.length + utf8Bytes.length);
        combinedBytes.set(bom);
        combinedBytes.set(utf8Bytes, bom.length);
        const bomHexString = Array.from(combinedBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        setUtf8BomHexInput(bomHexString);
        setTempUtf8BomHexInput(bomHexString);
      } catch (e) {
        console.error('CP949 Hex decoding error:', e);
      }
    }
  };

  // Process UTF-8 hex input
  const processUtf8HexInput = (hex) => {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
    setUtf8HexInput(cleanHex);
    
    if (cleanHex && cleanHex.length % 2 === 0) {
      try {
        const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(bytes);
        setUtf8TextInput(text);
        setCp949TextInput(text);
        
        // Update CP949 hex
        const cp949Buffer = iconv.encode(text, 'cp949');
        const cp949HexString = cp949Buffer.toString('hex');
        setCp949HexInput(cp949HexString);
        setTempCp949HexInput(cp949HexString);

        // Update UTF-8 with BOM
        setUtf8BomTextInput(text);
        const utf8Encoder = new TextEncoder();
        const utf8Bytes = utf8Encoder.encode(text);
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const combinedBytes = new Uint8Array(bom.length + utf8Bytes.length);
        combinedBytes.set(bom);
        combinedBytes.set(utf8Bytes, bom.length);
        const bomHexString = Array.from(combinedBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        setUtf8BomHexInput(bomHexString);
        setTempUtf8BomHexInput(bomHexString);
      } catch (e) {
        console.error('UTF-8 Hex decoding error:', e);
      }
    }
  };

  // Process UTF-8 with BOM hex input
  const processUtf8BomHexInput = (hex) => {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
    setUtf8BomHexInput(cleanHex);
    
    if (cleanHex && cleanHex.length % 2 === 0) {
      try {
        const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        // Skip BOM if present
        const textBytes = bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF 
          ? bytes.slice(3) 
          : bytes;
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(textBytes);
        setUtf8BomTextInput(text);
        setUtf8TextInput(text);
        setCp949TextInput(text);
        updateOtherInputs(text);
      } catch (e) {
        console.error('UTF-8 with BOM Hex decoding error:', e);
      }
    }
  };

  // Handle key press for hex inputs
  const handleCp949HexKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanHex = tempCp949HexInput.replace(/\s/g, '');
      if (cleanHex.length % 2 === 0) {
        processCp949HexInput(cleanHex);
      }
    }
  };

  const handleUtf8HexKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanHex = tempUtf8HexInput.replace(/\s/g, '');
      if (cleanHex.length % 2 === 0) {
        processUtf8HexInput(cleanHex);
      }
    }
  };

  const handleUtf8BomHexKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanHex = tempUtf8BomHexInput.replace(/\s/g, '');
      if (cleanHex.length % 2 === 0) {
        processUtf8BomHexInput(cleanHex);
      }
    }
  };

  // Clear all inputs
  const clearInputs = () => {
    setCp949TextInput('');
    setUtf8TextInput('');
    setCp949HexInput('');
    setUtf8HexInput('');
    setTempCp949HexInput('');
    setTempUtf8HexInput('');
    setUtf8BomTextInput('');
    setUtf8BomHexInput('');
    setTempUtf8BomHexInput('');
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

  // Helper function to update other inputs
  const updateOtherInputs = (text) => {
    // Update CP949 hex
    const cp949Buffer = iconv.encode(text, 'cp949');
    const cp949HexString = cp949Buffer.toString('hex');
    setCp949HexInput(cp949HexString);
    setTempCp949HexInput(cp949HexString);

    // Update UTF-8 hex
    const utf8Encoder = new TextEncoder();
    const utf8Bytes = utf8Encoder.encode(text);
    const utf8HexString = Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    setUtf8HexInput(utf8HexString);
    setTempUtf8HexInput(utf8HexString);
  };

  // 변환 결과 영역의 text 입력 처리
  const handleResultTextChange = (e) => {
    const newText = e.target.value;
    setResultTextInput(newText);
    
    if (newText) {
      // UTF-8로 인코딩하여 hex 값 생성
      const utf8Bytes = new TextEncoder().encode(newText);
      const hexString = Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      setTempResultHexInput(hexString);
      
      // 변환 결과 업데이트
      handleResultHexProcess(hexString);
    } else {
      // 입력이 비어있으면 모든 결과 초기화
      setTempResultHexInput('');
      setResultHash({
        md5: '',
        sha1: '',
        sha256: '',
        sha512: ''
      });
      setResultTextCP949('');
      setResultTextUTF8('');
      setResultTextUTF8Bom('');
    }
  };

  // hex 처리 로직을 별도 함수로 분리
  const handleResultHexProcess = (cleanHex) => {
    if (cleanHex.length % 2 === 0) {
      setResultHexInput(cleanHex);
      try {
        // 입력된 hex를 바이트 배열로 변환
        const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        
        // WordArray로 변환
        const words = [];
        for (let i = 0; i < bytes.length; i++) {
          words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
        }
        const wordArray = crypto.lib.WordArray.create(words, bytes.length);

        // 해시값 계산
        setResultHash({
          md5: crypto.MD5(wordArray).toString(),
          sha1: crypto.SHA1(wordArray).toString(),
          sha256: crypto.SHA256(wordArray).toString(),
          sha512: crypto.SHA512(wordArray).toString()
        });

        // CP949로 해석
        try {
          const cp949Text = iconv.decode(bytes, 'cp949');
          setResultTextCP949(cp949Text);
        } catch (e) {
          setResultTextCP949('(CP949 디코딩 실패)');
        }

        // UTF-8로 해석
        try {
          const decoder = new TextDecoder('utf-8');
          const utf8Text = decoder.decode(bytes);
          setResultTextUTF8(utf8Text);
          // Text Input도 업데이트
          setResultTextInput(utf8Text);
        } catch (e) {
          setResultTextUTF8('(UTF-8 디코딩 실패)');
        }

        // UTF-8 with BOM으로 해석
        try {
          const bomBytes = bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF 
            ? bytes.slice(3) 
            : bytes;
          const decoder = new TextDecoder('utf-8');
          const utf8BomText = decoder.decode(bomBytes);
          setResultTextUTF8Bom(utf8BomText);
        } catch (e) {
          setResultTextUTF8Bom('(UTF-8 with BOM 디코딩 실패)');
        }
      } catch (e) {
        console.error('Hex parsing error:', e);
        setResultTextCP949('(잘못된 hex 값)');
        setResultTextUTF8('(잘못된 hex 값)');
        setResultTextUTF8Bom('(잘못된 hex 값)');
        setResultHash({
          md5: '',
          sha1: '',
          sha256: '',
          sha512: ''
        });
      }
    }
  };

  // 변환 결과 영역의 hex 입력 처리
  const handleResultHexChange = (e) => {
    const newHex = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
    setTempResultHexInput(newHex);
  };

  // 변환 결과 영역의 hex 입력 엔터 처리
  const handleResultHexKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanHex = tempResultHexInput.replace(/\s/g, '');
      handleResultHexProcess(cleanHex);
    }
  };

  // Set document title
  useEffect(() => {
    document.title = "온라인 인코딩 도구 (CP949)";
  }, []);

  return (
    <div className="App">
      <div className="encoder-container">
        <h1>온라인 인코딩 도구</h1>
        
        <div className="input-container">
          <div className="input-header">
            <h2>한글 테스트</h2>
            <button onClick={clearInputs} className="clear-button">
              Clear All
            </button>
          </div>
          
          <div className="input-grid">
            <div className="input-row">
              <div className="input-group">
                <h3>Text Input (CP949):</h3>
                <textarea
                  value={cp949TextInput}
                  onChange={handleCp949TextChange}
                  placeholder="CP949 텍스트를 입력하세요..."
                />
              </div>
              <div className="input-group">
                <h3>Hexadecimal (CP949):</h3>
                <textarea
                  value={tempCp949HexInput}
                  onChange={handleCp949HexChange}
                  onKeyDown={handleCp949HexKeyDown}
                  placeholder="CP949 16진수를 입력하세요... (Enter를 누르면 변환)"
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <h3>Text Input (UTF-8):</h3>
                <textarea
                  value={utf8TextInput}
                  onChange={handleUtf8TextChange}
                  placeholder="UTF-8 텍스트를 입력하세요..."
                />
              </div>
              <div className="input-group">
                <h3>Hexadecimal (UTF-8):</h3>
                <textarea
                  value={tempUtf8HexInput}
                  onChange={handleUtf8HexChange}
                  onKeyDown={handleUtf8HexKeyDown}
                  placeholder="UTF-8 16진수를 입력하세요... (Enter를 누르면 변환)"
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <h3>Text Input (UTF-8 with BOM):</h3>
                <textarea
                  value={utf8BomTextInput}
                  onChange={handleUtf8BomTextChange}
                  placeholder="UTF-8 with BOM 텍스트를 입력하세요..."
                />
              </div>
              <div className="input-group">
                <h3>Hexadecimal (UTF-8 with BOM):</h3>
                <textarea
                  value={tempUtf8BomHexInput}
                  onChange={handleUtf8BomHexChange}
                  onKeyDown={handleUtf8BomHexKeyDown}
                  placeholder="UTF-8 with BOM 16진수를 입력하세요... (Enter를 누르면 변환)"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="results-container">
          <div className="results-header">
            <h2>인코딩 변환 테스트</h2>
            <div className="result-input-group">
              <h3>Text Input:</h3>
              <textarea
                value={resultTextInput}
                onChange={handleResultTextChange}
                placeholder="텍스트를 입력하면 자동으로 변환됩니다..."
                className="result-text-input"
              />
            </div>
            <div className="result-input-group">
              <h3>Hexadecimal Input:</h3>
              <textarea
                value={tempResultHexInput}
                onChange={handleResultHexChange}
                onKeyDown={handleResultHexKeyDown}
                placeholder="16진수를 입력하고 Enter를 누르면 변환됩니다..."
                className="result-hex-input"
              />
            </div>
          </div>

          <div className="results-section">
            <div className="result-item">
              <h3>Text (CP949):</h3>
              <pre>{resultTextCP949}</pre>
            </div>

            <div className="result-item">
              <h3>Text (UTF-8):</h3>
              <pre>{resultTextUTF8}</pre>
            </div>

            <div className="result-item">
              <h3>Text (UTF-8 with BOM):</h3>
              <pre>{resultTextUTF8Bom}</pre>
            </div>

            <div className="result-item">
              <h3>HTML Escape:</h3>
              <pre>
                {resultTextUTF8 && resultTextUTF8
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;')}
              </pre>
            </div>

            <div className="result-item">
              <h3>URL Encoding:</h3>
              <pre>{resultTextUTF8 && encodeURIComponent(resultTextUTF8)}</pre>
            </div>

            <div className="result-item">
              <h3>Base64:</h3>
              <pre>
                {resultTextUTF8 && btoa(unescape(encodeURIComponent(resultTextUTF8)))}
              </pre>
            </div>

            <div className="result-item">
              <h3>Base64URL:</h3>
              <pre>
                {resultTextUTF8 && btoa(unescape(encodeURIComponent(resultTextUTF8)))
                  .replace(/\+/g, '-')
                  .replace(/\//g, '_')
                  .replace(/=+$/, '')}
              </pre>
            </div>

            <div className="result-item">
              <h3>MD5:</h3>
              <pre>{resultHash?.md5}</pre>
            </div>

            <div className="result-item">
              <h3>SHA-1:</h3>
              <pre>{resultHash?.sha1}</pre>
            </div>

            <div className="result-item">
              <h3>SHA-256:</h3>
              <pre>{resultHash?.sha256}</pre>
            </div>

            <div className="result-item">
              <h3>SHA-512:</h3>
              <pre>{resultHash?.sha512}</pre>
            </div>
          </div>
        </div>

        <div className="copyright">
          made by crazyj7@gmail.com
        </div>
      </div>
    </div>
  );
}

export default App;
