# 온나 소셜 로그인 연결

2026-11-07 · Google, Facebook, Apple 모두 현재 연결 전입니다. 화면과 OAuth 호출은 구현했지만 실제 로그인 완료는 각 제공업체 설정 후 검증해야 합니다. 이메일·비밀번호 입력 화면은 제거했습니다. 기존 이메일 계정 자체를 삭제하거나 인증 설정을 비활성화하지는 않았습니다.

## 공통 주소

- 서비스 기준 주소: `https://blueit-link-preview.vercel.app`
- 제공업체에 등록할 콜백: `https://fzjdoeafuckadjlnjpkz.supabase.co/auth/v1/callback`
- Supabase Site URL: `https://blueit-link-preview.vercel.app`
- Supabase 허용 Redirect URL: `https://blueit-link-preview.vercel.app/` 및 `https://blueit-link-preview.vercel.app/#studio`
- 실제 서비스 도메인이 정해지면 각 콘솔과 Supabase에서 주소를 갱신합니다. 동적으로 바뀌는 배포 주소를 정식 로그인 주소로 쓰지 않습니다.

설정 위치: [Supabase 인증 제공업체](https://supabase.com/dashboard/project/fzjdoeafuckadjlnjpkz/auth/providers), [URL 설정](https://supabase.com/dashboard/project/fzjdoeafuckadjlnjpkz/auth/url-configuration).

현재 Vercel 배포 보호가 켜져 있어 미리보기 링크로 검토하는 단계입니다. 일반 사용자에게 열기 전, 기준 도메인에서 서비스와 로그인 복귀가 허용되는지 확인해야 합니다. 소셜 로그인 설정만으로 사이트가 공개되는 것은 아닙니다.

## 1. Google

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트를 생성합니다.
2. Google Auth Platform에서 앱 이름, 지원 이메일, 동의 화면을 구성합니다. 실제 서비스용 개인정보처리방침·이용약관 주소는 작성·게시 후 등록합니다.
3. 웹 애플리케이션용 OAuth 클라이언트를 생성합니다. JavaScript origin에는 서비스 기준 주소, 승인된 리디렉션 URI에는 위 Supabase 콜백을 입력합니다.
4. 발급된 Client ID와 Client Secret을 **Supabase Google 제공업체 설정에 직접 입력**하고 활성화합니다. 앱 코드나 채팅에 Secret을 넣지 않습니다.
5. 테스트 모드라면 테스트 사용자를 등록하고 로그인합니다. 일반 사용자 공개 전 Google의 게시·검증 요구를 확인합니다.

[공식 연결 안내](https://supabase.com/docs/guides/auth/social-sign-in/auth-google)

## 2. Facebook

1. [Meta for Developers](https://developers.facebook.com/)에서 앱을 생성하고 Facebook Login을 구성합니다.
2. 웹사이트 주소와 유효한 OAuth 리디렉션 URI에 위 주소를 등록합니다.
3. App ID와 App Secret을 **Supabase Facebook 제공업체 설정에 직접 입력**하고 활성화합니다.
4. 개발 모드에서는 앱 역할을 가진 테스트 계정으로 검증합니다. 공개 전 Meta의 앱 공개·검토, 개인정보처리방침과 데이터 삭제 안내 요구사항을 충족합니다.

[공식 연결 안내](https://supabase.com/docs/guides/auth/social-sign-in/auth-facebook)

## 3. Apple

1. [Apple Developer](https://developer.apple.com/account/)에서 Sign in with Apple을 사용할 개발자 계정과 App ID를 준비합니다.
2. 웹 로그인용 Services ID를 만들고 서비스 도메인과 위 Supabase 콜백을 등록합니다.
3. Sign in with Apple 키를 생성하고 Team ID, Key ID, Services ID와 비공개 키로 Supabase가 요구하는 OAuth Secret을 준비합니다. 키는 안전한 저장소에서 관리합니다.
4. **Supabase Apple 제공업체 설정에 직접 입력**하고 활성화합니다. Secret 만료와 갱신 일정을 관리합니다.
5. 실제 Apple 계정으로 로그인과 이메일 가리기 동작을 확인합니다.

[공식 연결 안내](https://supabase.com/docs/guides/auth/social-sign-in/auth-apple)

## 연결 후 확인

각 제공업체를 켜고 로그인 창을 다시 열거나 페이지를 새로고침하면 준비 중 표시가 사라집니다. 편집 → 소셜 로그인 → 같은 브라우저로 복귀 → 온라인 저장 → 공개 링크를 비로그인 브라우저에서 조회하는 순서로 검증합니다. 취소·재시도·로그아웃, 다른 계정으로 전환했을 때 데이터가 섞이지 않는지도 확인합니다.

사진: Unsplash 이미지 `photo-1534528741775-53994a69daeb`, `photo-1506794778202-cad84cf45f1d`. 예시 프로필 이름·소개는 가상의 데모이며 사진 인물의 추천이나 실제 계정을 의미하지 않습니다.
