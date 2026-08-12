# RzWeb 🇰🇷 한국어版

Rizin을 WebAssembly로 컴파일하여 구동하는 브라우저 기반 리버스 엔지니어링 인터페이스입니다. 바이너리 파일을 앱에 드롭하기만 하면 브라우저에서 로컬로 분석할 수 있습니다. 지속적인 세션, 터미널 접근, 캐시된 재열기 기능, 그리고 주요 분석 화면을 위한 전용 뷰를 제공합니다.

> **원본 프로젝트:** [indalok/rzweb](https://github.com/indalok/rzweb) by [IndAlok](https://github.com/IndAlok)
>
> 본 저장소는 원본 rzweb을 한국어로 번역한 포크입니다.
>
> **배포 주소:** https://sigco3111.github.io/rzweb

## 스크린샷

**홈페이지**

![Homepage](public/Homepage.png)

**터미널**

![Terminal](public/Terminal.png)

**디스어셈블리**

![Disassembly](public/Disassembly.png)

**제어 흐름 그래프**

![Graph](public/Graph.png)

**헥스 덤프**

![Hex Dump](public/HexDump.png)

**문자열**

![Strings](public/Strings.png)

**임포트**

![Imports](public/Imports.png)

**익스포트**

![Exports](public/Exports.png)

**섹션**

![Sections](public/Sections.png)

**바이너리 정보**

![Binary Info](public/BinInfo.png)

## 주요 기능

- `rzwasi` 빌드를 통한 지속적인 Rizin 세션 — 분석 상태, 탐색 위치, 후속 명령어가 동일한 바이너리 세션 내에서 유지됩니다.
- 실시간 명령어 자동완성, `Tab` 완성, 방향키 선택, 최소 글자 수 및 최대 결과 수 설정이 가능한 터미널 접근.
- 디스어셈블리, 제어 흐름 그래프, 헥스, 문자열, 임포트, 익스포트, 섹션, 바이너리 정보를 위한 전용 뷰.
- 바이너리 해시 기반 분석 캐싱 — 캐시에 바이너리 데이터가 저장되어 있으면 홈페이지에서 직접 재열기 가능.
- 설정 가능한 명령어 출력 제한 및 대용량 바이너리나 잘린 메타데이터에 대한 경고 배너.
- 데스크톱과 모바일 사용에 최적화된 반응형 레이아웃.

## 지원 포맷

RzWeb은 번들된 Rizin 빌드가 지원하는 포맷을 따릅니다:

- ELF
- PE / PE+
- Mach-O
- Raw 펌웨어 및 바이트 덤프

## 사용 방법

1. 앱을 엽니다.
2. 바이너리를 드롭하거나 선택합니다.
3. 설정된 분석 깊이로 분석합니다.
4. 터미널과 구조화된 뷰 사이를 이동하거나, 나중에 홈페이지에서 캐시된 동일 바이너리를 다시 엽니다.

모든 작업은 브라우저에서 로컬로 실행됩니다. 파일은 기기에 남아 WebAssembly 메모리와 브라우저 저장소에만 로드됩니다.

## 프라이버시

RzWeb은 바이너리를 서버에 업로드하지 않습니다. 분석, 캐싱, 재열기는 모두 WebAssembly, IndexedDB, Emscripten이 제공하는 인메모리 파일시스템을 통해 브라우저 내에서만 이루어집니다.

## 브라우저 제약

- `ptrace`가 필요한 디버깅 기능은 브라우저 샌드박스에서 사용할 수 없습니다.
- 분석은 여전히 단일 스레드 WebAssembly 작업이므로 매우 큰 바이너리는 시간이 걸릴 수 있습니다.
- 사용 가능한 기능은 현재 `rzwasi` 빌드가 내보내는 기능에 따라 결정됩니다.

## 로컬 빌드

```bash
git clone https://github.com/sigco3111/rzweb
cd rzweb
npm install
npm run dev
```

## 아키텍처

프론트엔드는 React, TypeScript, Tailwind CSS, Zustand, xterm.js를 사용합니다. 리버스 엔지니어링 코어는 [rzwasi](https://github.com/IndAlok/rzwasi) 저장소에서 제공되며, Rizin을 WebAssembly로 빌드하고 기존 CLI 진입점과 RzWeb에서 사용하는 지속적인 `rzweb_*` 세션 API를 모두 노출합니다.

## 크레딧

- **원본 개발자:** [IndAlok](https://github.com/IndAlok) — [indalok/rzweb](https://github.com/indalok/rzweb)
- **한국어 번역:** [sigco3111](https://github.com/sigco3111)
- ** powered by [Rizin](https://rizin.re), 오픈소스 리버스 엔지니어링 프레임워크
