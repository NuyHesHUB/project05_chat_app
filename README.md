# PROJECT 05 실시간 채팅 페이지 (Chat App)

> ## **프로젝트명**

- 실시간 채팅 페이지 Chat App (👨🏻‍💻 1인 프로젝트)

<br/>

> ## **프로젝트 미리보기**

<img src="https://github.com/NuyHesHUB/project01_suwon/assets/115362203/d6670d92-a37c-44d1-bd3e-2221ab7b2e31" alt="page"/>

<br/>
<br/>

> ## **프로젝트 링크**
 
- 배포링크 : <https://project-chat-app-8bf07.web.app/>
- 시연영상 : <https://www.youtube.com/watch?v=UPbLZrXIRAc>

<br/>

> ## **프로젝트의 설명**

- 이 프로젝트의 동기는 React를 활용하여 Firebase를 이용한 회원가입 및 실시간 동기화 데이터베이스 구축에 대한 흥미와 학습 욕구였습니다. React를 사용하고 Firebase의 실시간 데이터베이스 기능을 활용하여 실시간으로 데이터를 동기화하는 경험을 갖고 싶었습니다.
- 이 프로젝트를 통해 Firebase를 활용하여 실시간 동기화 데이터베이스를 구축하는 방법과 React-Hook-Form을 사용하여 유효성 체크를 구현하는 방법을 배웠습니다. 또한, Redux를 활용하여 유저 정보를 업데이트하는 방법을 익혔으며, 부트스트랩을 사용하여 스타일링하는 방법을 습득했습니다. 더불어 프로젝트 전체적인 아키텍처와 구현 과정에서의 문제 해결 능력을 향상시켰습니다.<br/><br/>
**특징** <br/>
1) Firebase를 이용하여 실시간 동기화 데이터베이스를 활용한 실시간 채팅 기능을 제공합니다. 사용자가 회원가입 시 React-Hook-Form을 통해 유효성을 체크하여 안정적인 데이터 입력을 가능하게 하고, Redux를 활용하여 유저 정보를 업데이트하는 기능을 제공합니다. <br/>
2) 부트스트랩을 사용하여 사전에 정의된 스타일과 구성 요소를 활용하여 웹 페이지를 빠르게 디자인했습니다. 부트스트랩을 사용함으로써 프로젝트에 일관된 디자인을 적용하고, 반응형 웹 디자인을 손쉽게 구현할 수 있었습니다.<br/>
3) Firebase 스토리지를 활용하여 사용자들이 이미지를 업로드하고 저장할 수 있도록 구현했습니다. 사용자가 이미지를 선택하면 해당 이미지를 Firebase 스토리지에 업로드하고, 업로드된 이미지의 URL을 데이터베이스에 저장하여 유저 간에 공유할 수 있게 했습니다. <br/>

<br/>

**어려웠던 점** <br/>
- Firebase 자체의 사용이 생소하고 어려웠습니다. Firebase는 다양한 기능을 포함한 플랫폼으로, 처음에는 Firebase의 다양한 용어와 개념들을 이해하는 데 어려움을 겪었습니다. 예를 들어, Firestore 데이터베이스, Firebase Authentication, Firebase 스토리지 등 각각의 기능을 이해하는 과정에서 어려움을 겪었습니다.
- Firebase를 사용하기 위해서는 프로젝트를 생성하고, 필요한 기능을 활성화하고, SDK를 초기화해야 했습니다. 이러한 설정과 초기화 과정에서 오류가 발생할 수 있고, 올바른 설정을 위해 Firebase 문서를 참고하고 따라가는 것이 필요했습니다.
- Firebase의 API 및 문서를 이해하는 것도 어려움을 겪었습니다. Firebase가 제공하는 다양한 기능과 메서드, 이벤트 처리 등을 이해하고 활용하는 과정에서 문서와 예제 코드를 참고하고 실험하는 과정이 필요했습니다. 특히, Firebase 스토리지의 업로드, 다운로드, 보안 규칙 설정 등의 기능을 정확히 이해하고 적용하기 위해 많은 시간과 노력이 필요했습니다.
- Firebase의 보안 규칙 설정 및 사용자 인증 과정에서 오류가 발생했고, 그로 인해 이미지 업로딩이 되지 않아 보안에 대한 이해도를 높이는 데 어려움을 겪었습니다.
<br/>
이로 인해Firebase를 기반으로 한 기초적인 기능들을 이해하고 구현함으로써 웹 애플리케이션에서 데이터 관리, 사용자 인증, 파일 업로드 등의 기능을 다룰 수 있게 되었습니다.
<br/>

> ## **프로젝트 기간**

- 5주

<br/>

> ## **프로젝트 주요기능**

- <strong>React-Hook-Form</strong> 유효성 체크 , <strong>FireBase</strong> 유저생성 회원가입
- <strong>Redux</strong> 스토어 데이터관리, <strong>FireBase</strong>의 테이블 생성하여 <strong>ChatRoom</strong> 생성
- <strong>FireBase</strong>스토리지에 이미지 업로드하여 채팅방 <strong>이미지</strong> 전송 기능 , 프로필 <strong>이미지</strong> 수정 기능
- <strong>유저</strong>가 <strong>타이핑</strong>할 때 상대방 알림
- <strong>채팅방</strong> 즐겨찾기 , 다이렉트 메세지 기능

<br/>

> ## **프로젝트 기술스택**

### ✔️ Front-end

<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"><img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">


<br/>

### ✔️ Library
<img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white"><img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"><img src="https://img.shields.io/badge/react_router_dom-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white"><img src="https://img.shields.io/badge/md5-black?style=for-the-badge&logo=0&logoColor=white"><img src="https://img.shields.io/badge/moment-gray?style=for-the-badge&logo=0&logoColor=white"><img src="https://img.shields.io/badge/react_icon-black?style=for-the-badge&logo=0&logoColor=white"><img src="https://img.shields.io/badge/react_hook_form-gray?style=for-the-badge&logo=0&logoColor=white">

<hr/>


