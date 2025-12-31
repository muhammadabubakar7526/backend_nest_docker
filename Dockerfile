# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package.json yarn.lock ./

# 4. Install dependencies
RUN yarn install --frozen-lockfile

# 5. Copy source code
COPY . .

# 6. Build NestJS
RUN yarn build

# 7. Expose port
EXPOSE 3000

# 8. Start app
CMD ["node", "dist/main.js"]
