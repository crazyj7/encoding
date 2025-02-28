# Online Text Encoding Tool

온라인에서 사용할 수 있는 텍스트 인코딩 변환 도구입니다.

## 기능

### 한글 테스트 섹션
- CP949, UTF-8, UTF-8 with BOM 인코딩 지원
- 텍스트 입력과 16진수 입력 모두 지원
- 실시간 인코딩 변환
- 각 인코딩 간 자동 동기화

### 인코딩 변환 테스트 섹션
다양한 인코딩/해시 변환 지원:
- Text (CP949)
- Text (UTF-8)
- Text (UTF-8 with BOM)
- HTML Escape
- URL Encoding
- Base64
- Base64URL
- MD5
- SHA-1
- SHA-256
- SHA-512

## 사용 방법

1. 텍스트 입력:
   - 직접 텍스트 입력
   - 자동으로 모든 변환 결과 표시

2. 16진수 입력:
   - 16진수 값 입력 후 Enter 키 입력
   - 자동으로 모든 변환 결과 표시

## 기술 스택

- React
- crypto-js (해시 함수)
- iconv-lite (CP949 인코딩)

## 개발 환경 설정
- 의존성 설치
```
npm install
```
- 개발 서버 실행
```
npm start
```
- 프로덕션 빌드
```
npm run build
```
