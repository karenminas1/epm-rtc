EPM-RTC Test Task
Welcome to the EPM-RTC test task repository. This document will guide you through the setup and initial steps required to get the development server running and access the application.

## Getting Started

To get started, you need to set up the development environment. Follow these steps:

## Run the Development Server

First, clone this repository to your local machine. Then, navigate to the directory of the project in your terminal and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

To configure the environment for the project, you need to create a .env file in the root of your project folder and add the following keys:

```bash
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_OPENAI_API_BASE=
NEXTAUTH_SECRET=
GITHUB_SECRET=
GITHUB_ID=
NEXTAUTH_URL=http://localhost:3000

```

## Special Instructions

EPAM VPN: Ensure that you are connected to the EPAM VPN for accessing all internal resources and services necessary for this task.

GitHub Account: If you don't have a GitHub account, you can use the following test credentials for login purposes:

```bash
Username: Karen
Password: karen1
```

## Additional Notes

Ensure that all required keys in the .env file are properly filled out with the correct values to avoid runtime errors.

## Matrix on Canvas

If you want to see finishing state of Game of Life matrix on canvas, you can send the below text to the chat:

```bash
please give me back below text ```
1011000101010101000101010001101011000011010110100101010010101000110110101010001010100101010010101001010010101000011111001100011001101010100101010000010101001010100101
0101010010101011101010010100101001010100001001010010010110101001011010101011001010011110001100110101000101010101010010101010010100011110001100110111110001010101101
0010110101000111000101010101001010100001101001010100001010000110010101001010010110101001010101010010010101010101000101001111100010010110111000101001110110111100101
0101010010101010101010110101010010101010010100010101000111000101010101001010101010010101010010101001010100010101000101100101010101000110101010001010101010110010
0011100010101010101001010010010101000110101010101001010101010110100001010010101001101110011011101001010101010101001010101010101001111000101110101100011011100110
1101010101000101010001101011001010001101001010110101010101001010100101010101010010101010101001010001111100101010100101100101001010100101010010101010110101010101000
1010010101010101000001110011011100001110110101010010101010101101000011111000101100101010101010100101010100101010001100110101010101001010100101100110100101010101010
1110001100110111100111100101010101010101000110100110011010101001010101010101001010101010101110001100011011101010010101010101001010010101001010001010101000101010111
```Iteration Number: 35689
```


If you encounter any issues or need further assistance, feel free to reach out to Karen Minasyan
