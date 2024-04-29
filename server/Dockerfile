# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Nodemon globally
RUN npm install -g nodemon

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 8000

# Run the app using Nodemon
CMD ["nodemon", "app.js"]
