# Use the official Bun image as a base
FROM oven/bun:latest AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and bun.lockb ./
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the application
RUN bun run build

# Use a lightweight web server to serve the app
FROM nginx:alpine 

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

