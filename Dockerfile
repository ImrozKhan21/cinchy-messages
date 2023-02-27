# Use an official node image as the base image
FROM node:16.13.0

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the containerd
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Angular application
RUN npm run build

# Expose the default port used by the Angular application
EXPOSE 4200

# Specify the command to run the Angular application
CMD ["npm", "start"]
