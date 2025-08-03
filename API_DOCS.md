****# Kakao Tech Gift API 명세서

## 기본 정보

- **제목**: Kakao Tech Gift API
- **버전**: 1.0
- **기본 URL**: `http://localhost:3000`
- **문서 URL**: `/api-docs`

## 공통 응답 형식

### 성공 응답

```json
{
  "data": {
    // API별 응답 데이터
  }
}
```

### 에러 응답

```json
{
  "data": {
    "status": "ERROR_TYPE",
    "statusCode": 400,
    "message": "에러 메시지"
  }
}
```

## API 목록

### 1. 헬스체크 API

#### 1.1 서버 상태 확인

- **URL**: `/ping`
- **Method**: GET
- **설명**: 서버의 상태를 확인합니다.
- **성공 응답** (200):
  ```json
  {
    "data": "pong~!@#$%^&*()"
  }
  ```
- **Curl 예제**:
  ```bash
  curl -X GET http://localhost:3000/ping
  ```

### 2. 인증 API

#### 2.1 로그인

- **URL**: `/api/login`
- **Method**: POST
- **설명**: 이메일과 비밀번호로 로그인합니다.
- **요청 본문**:
  ```json
  {
    "email": "user@kakao.com",
    "password": "password123"
  }
  ```
- **요청 제약사항**:
  - email: @kakao.com 이메일 주소만 가능
  - password: 8자 이상
- **성공 응답** (200):
  ```json
  {
    "data": {
      "email": "user@kakao.com",
      "name": "user",
      "authToken": "dummy-token"
    }
  }
  ```
- **에러 응답** (400):
  - 잘못된 이메일 형식
  - 잘못된 비밀번호 형식
  - 필수 입력값 누락
- **Curl 예제**:
  ```bash
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "user@kakao.com",
      "password": "password123"
    }'
  ```

### 3. 테마 API

#### 3.1 테마 목록 조회

- **URL**: `/api/themes`
- **Method**: GET
- **설명**: 모든 테마의 기본 정보를 조회합니다.
- **성공 응답** (200):
  ```json
  {
    "data": [
      {
        "themeId": 1,
        "name": "테마명",
        "image": "이미지 URL"
      }
    ]
  }
  ```
- **Curl 예제**:
  ```bash
  curl -X GET http://localhost:3000/api/themes
  ```

#### 3.2 테마 상세 정보 조회

- **URL**: `/api/themes/:themeId/info`
- **Method**: GET
- **설명**: 특정 테마의 상세 정보를 조회합니다.
- **URL 파라미터**:
  - themeId: 테마 ID (number)
- **성공 응답** (200):
  ```json
  {
    "data": {
      "themeId": 1,
      "name": "테마명",
      "title": "테마 제목",
      "description": "테마 설명",
      "backgroundColor": "배경색 코드"
    }
  }
  ```
- **에러 응답** (404):
  - 해당 ID에 일치하는 데이터가 없는 경우
- **Curl 예제**:
  ```bash
  curl -X GET http://localhost:3000/api/themes/1/info
  ```

#### 3.3 테마별 상품 목록 조회

- **URL**: `/api/themes/:themeId/products`
- **Method**: GET
- **설명**: 특정 테마의 상품 목록을 페이지네이션으로 조회합니다.
- **URL 파라미터**:
  - themeId: 테마 ID (number)
- **쿼리 파라미터**:
  - cursor: 커서 (기본값: 0)
  - limit: 한 페이지당 조회할 상품 수 (기본값: 10)
- **성공 응답** (200):
  ```json
  {
    "data": {
      "list": [
        {
          "id": 11526198,
          "name": "상품명",
          "price": {
            "basicPrice": 39000,
            "sellingPrice": 39000,
            "discountRate": 0
          },
          "imageURL": "https://example.com/image.jpg",
          "brandInfo": {
            "id": 33,
            "name": "브랜드명",
            "imageURL": "https://example.com/brand.jpg"
          }
        }
      ],
      "cursor": 10,
      "hasMoreList": true
    }
  }
  ```
- **에러 응답** (404):
  - 해당 테마를 찾을 수 없는 경우
- **Curl 예제**:
  ```bash
  curl -X GET "http://localhost:3000/api/themes/1/products?cursor=0&limit=10"
  ```

### 4. 상품 API

#### 4.1 상품 기본 정보 조회

- **URL**: `/api/products/:productId`
- **Method**: GET
- **설명**: 특정 상품의 기본 정보를 조회합니다.
- **URL 파라미터**:
  - productId: 상품 ID (number)
- **성공 응답** (200):
  ```json
  {
    "data": {
      "id": 11526198,
      "name": "상품명",
      "price": {
        "basicPrice": 39000,
        "sellingPrice": 39000,
        "discountRate": 0
      },
      "imageURL": "https://example.com/image.jpg",
      "brandInfo": {
        "id": 33,
        "name": "브랜드명",
        "imageURL": "https://example.com/brand.jpg"
      }
    }
  }
  ```
- **에러 응답** (404):
  - 존재하지 않는 상품인 경우
- **Curl 예제**:
  ```bash
  curl -X GET http://localhost:3000/api/products/11526198
  ```

#### 4.2 상품 상세 정보 조회

- **URL**: `/api/products/:productId/detail`
- **Method**: GET
- **설명**: 특정 상품의 상세 정보를 조회합니다.
- **URL 파라미터**:
  - productId: 상품 ID (number)
- **성공 응답** (200):
  ```json
  {
    "data": {
      "description": "상품 상세 설명",
      "announcement": [
        {
          "name": "발행자",
          "value": "(주)카카오",
          "displayOrder": 1
        },
        {
          "name": "교환권 공급자",
          "value": "(주)섹타나인",
          "displayOrder": 2
        }
      ]
    }
  }
  ```
- **Curl 예제**:
  ```bash
  curl -X GET http://localhost:3000/api/products/11526198/detail
  ```

#### 4.3 상품 찜 정보 조회

- **URL**: `/api/products/:productId/wish`
- **Method**: GET
- **설명**: 특정 상품의 찜 정보를 조회합니다.
- **URL 파라미터**:
  - productId: 상품 ID (number)
- **성공 응답** (200):
  ```json
  {
    "data": {
      "wishCount": 123,
      "isWished": false
    }
  }
  ```
- **Curl 예제**:
  ```bash
  curl -X GET http://localhost:3000/api/products/11526198/wish
  ```

#### 4.4 상품 하이라이트 리뷰 조회

- **URL**: `/api/products/:productId/highlight-review`
- **Method**: GET
- **설명**: 특정 상품의 하이라이트 리뷰를 조회합니다.
- **URL 파라미터**:
  - productId: 상품 ID (number)
- **성공 응답** (200):
  ```json
  {
    "data": {
      "totalCount": 123,
      "reviews": [
        {
          "id": "683a610f618cb6387dd3d28d",
          "authorName": "다정한 어피치",
          "content": "넘맛나요. 두가지맛을 한번에 생일케익 으로 최고네요~~"
        },
        {
          "id": "684b7c63370ed53d817e4be9",
          "authorName": "let it be..!",
          "content": "반반하려다가..\n전부고구마로된 케익을 선택했는데..모두들 만족했답니다..!~^^"
        }
      ]
    }
  }
  ```
- **Curl 예제**:
  ```bash
  curl -X GET http://localhost:3000/api/products/11526198/highlight-review
  ```

#### 4.5 상품 요약 정보 조회

- **URL**: `/api/products/:productId/summary`
- **Method**: GET
- **설명**: 특정 상품의 요약 정보를 조회합니다.
- **URL 파라미터**:
  - productId: 상품 ID (number)
- **성공 응답** (200):
  ```json
  {
    "data": {
      "id": 11526198,
      "name": "스트로베리 초콜릿 생크림",
      "brandName": "투썸플레이스",
      "price": 39000,
      "imageURL": "https://example.com/image.jpg"
    }
  }
  ```
- **에러 응답** (404):
  - 현재 없는 상품인 경우
- **Curl 예제**:
  ```bash
  curl -X GET http://localhost:3000/api/products/11526198/summary
  ```

#### 4.6 상품 랭킹 조회

- **URL**: `/api/products/ranking`
- **Method**: GET
- **설명**: 상품 랭킹을 조회합니다.
- **쿼리 파라미터**:
  - targetType: 대상 타입 (기본값: "ALL")
    - ALL: 전체
    - FEMALE: 여성
    - MALE: 남성
    - TEEN: 10대
  - rankType: 랭킹 타입 (기본값: "MANY_WISH")
    - MANY_WISH: 많이 찜한
    - MANY_RECEIVE: 많이 받은
    - MANY_WISH_RECEIVE: 많이 찜하고 받은
- **성공 응답** (200):
  ```json
  {
    "data": [
      {
        "id": 11526198,
        "name": "스트로베리 초콜릿 생크림",
        "price": {
          "basicPrice": 39000,
          "sellingPrice": 39000,
          "discountRate": 0
        },
        "imageURL": "https://example.com/image.jpg",
        "brandInfo": {
          "id": 33,
          "name": "투썸플레이스",
          "imageURL": "https://example.com/brand.jpg"
        }
      }
    ]
  }
  ```
- **에러 응답** (400):
  - 잘못된 targetType 또는 rankType인 경우
- **Curl 예제**:
  ```bash
  curl -X GET "http://localhost:3000/api/products/ranking?targetType=ALL&rankType=MANY_WISH"
  ```

### 5. 주문 API

#### 5.1 주문 생성

- **URL**: `/api/order`
- **Method**: POST
- **설명**: 새로운 주문을 생성합니다.
- **헤더**:
  - Authorization: "dummy-token" (로그인 후 받은 토큰)
- **요청 본문**:
  ```json
  {
    "productId": 11526198,
    "message": "생일 축하해!",
    "messageCardId": "card123",
    "ordererName": "김주문",
    "receivers": [
      {
        "name": "홍길동",
        "phoneNumber": "010-1234-5678",
        "quantity": 1
      }
    ]
  }
  ```
- **요청 제약사항**:
  - productId: 양수
  - message: 필수 입력값
  - messageCardId: 필수 입력값
  - ordererName: 필수 입력값
  - receivers: 배열이며 최소 1개 이상
  - receivers.name: 필수 입력값
  - receivers.phoneNumber: 필수 입력값
  - receivers.quantity: 양수
- **성공 응답** (201):
  ```json
  {
    "data": {
      "success": true
    }
  }
  ```
- **에러 응답**:
  - 401: 로그인이 필요합니다 (토큰 누락 또는 잘못된 토큰)
  - 400: 받는 사람이 없습니다 (receivers 배열이 비어있는 경우)
  - 400: 유효성 검사 실패
- **Curl 예제**:
  ```bash
  curl -X POST http://localhost:3000/api/order \
    -H "Content-Type: application/json" \
    -H "Authorization: dummy-token" \
    -d '{
      "productId": 11526198,
      "message": "생일 축하해!",
      "messageCardId": "card123",
      "ordererName": "김주문",
      "receivers": [
        {
          "name": "홍길동",
          "phoneNumber": "010-1234-5678",
          "quantity": 1
        }
      ]
    }'
  ```

## 에러 코드

- **400**: 잘못된 요청 (BAD_REQUEST)
- **401**: 인증 실패 (UNAUTHORIZED)
- **403**: 접근 권한 없음 (FORBIDDEN)
- **404**: 리소스를 찾을 수 없음 (NOT_FOUND)
- **409**: 리소스 충돌 (CONFLICT)
- **500**: 서버 내부 오류 (INTERNAL_SERVER_ERROR)
