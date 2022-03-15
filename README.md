# kpc PACKAGE
[한국생산성본부] 경영지원시스템_

[![npm](https://img.shields.io/npm/v/@jr-cologne/create-gulp-starter-kit.svg)](https://github.com/jr-cologne/gulp-starter-kit)
> 본 패키지는 [Gulp Starter Kit](https://github.com/kimsangyunim/kpc/) (Gulp 4) 을 참고했습니다.

## Features / Use Cases
패키지 기능 목록은 다음과 같습니다 :  
- EJS template files(.ejs)을 컴파일 후 `dist`로 이동합니다.
- CSS preprocessor code(Sass/SCSS, Less, Stylus)를 컴파일 하며, 약속된 접두사를 자동 생성하고 압축 후 `dist`로 이동합니다.
- ES6+를 ES5로 컴파일하고 압축합니다.
- 이미지를 압축하여 `dist`로 이동합니다.
- `package.json`에 지정된 종속성 `src/node_modules`를 `dist/node_modules`로 복사합니다.
- 자동으로 `dist`를 삭제 및 생성하며 `http://localhost:3000`에서 로컬 개발 서버를 가동합니다.
<!-- - `ES6` 모듈을 사용하여 애플리케이션으로 종속성 가져옵니다. -->


## Requirements

본인 PC에 설치되어 있는지 확인하세요. 패키지를 시작하고 실행하기 위해 필요합니다.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (Required node version is >= 10.0)
- [Gulp 4](https://gulpjs.com/) (Gulp는 패키지에 포함되어 있습니다.)


## Getting Started

### git init
<!-- Example: -->
```bash
git init
git remote add origin https://github.com/kimsangyunim/kpc.git
git pull origin master
```

### npm intall
<!-- Example: -->
```bash
npm install
npm start
```
or :
```bash
npm run build
```

## Basic User Interface

`master branch`로 push 하면 렌더링 확인을 위한 `pages branch`로 자동 배포합니다.

gitHub Page [https://kimsangyunim.github.io/kpc/dist/](https://kimsangyunim.github.io/kpc/dist/)