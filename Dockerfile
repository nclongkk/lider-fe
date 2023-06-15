# Use an official Node.js image as the base
FROM node:16-alpine

# Install Yarn package manager
RUN npm install -g yarn --force

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the entire project to the working directory
COPY . .

# Build the React app
RUN yarn build

# Expose the port where the app will run (change if necessary)
EXPOSE 3000

# Define the command to run the app
CMD ["yarn", "start"]
