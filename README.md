CLI tool to optimize images by changing formats while keeping quality intact.
Built on top of [Sharp](https://sharp.pixelplumbing.com/), imgopti makes it dead simple to bulk-convert and optimize your image assets.

## Installation
```bash
git clone https://github.com/demss233/imgopti.git
cd imgopti
npm install -g
```

## Usage
```bash
tsc --build
node dist/bin/cli.js ./test/images ./test/usages --quality=80
```

> NOTE: --default-quality: 100
