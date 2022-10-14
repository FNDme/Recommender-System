npm init --yes
touch tsconfig.json
echo "{" >> tsconfig.json
echo "  \"compilerOptions\": {" >> tsconfig.json
echo "    \"target\": \"es2020\"," >> tsconfig.json
echo "    \"module\": \"commonjs\"," >> tsconfig.json
echo "    \"rootDir\": \"./src\"," >> tsconfig.json
echo "    \"outDir\": \"./dist\"," >> tsconfig.json
echo "    \"esModuleInterop\": true," >> tsconfig.json
echo "    \"forceConsistentCasingInFileNames\": true," >> tsconfig.json
echo "    \"strict\": true," >> tsconfig.json
echo "    \"skipLibCheck\": true," >> tsconfig.json
echo "    \"noEmit\": true," >> tsconfig.json
echo "  }," >> tsconfig.json
echo "}" >> tsconfig.json
npm install @types/node --save-dev
npm install eslint --save-dev
eslint --init