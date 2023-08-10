# City-Country Match Game

A memory card game where players match cities to their respective countries. This game is not only fun but also educational, helping players familiarize themselves with various cities and their countries.

## Table of Contents

- [Getting Started](#getting-started)
- [Game Instructions](#game-instructions)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Integration with Cloudflare Worker](#integration-with-cloudflare-worker)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari).
- A code editor (e.g., VSCode, Atom).
- Basic knowledge of HTML, CSS, and JavaScript.

### Installation

1. Clone the repository to your local machine:
2. Navigate to the project directory: cd city-country-match-game
3. Open the `index.html` file in your preferred browser to start the game.

## Game Instructions

1. Click on the "Yes" button on the welcome modal to start the game.
2. Flip over two cards at a time, trying to match the city with its country.
3. The game is completed when all pairs are matched.
4. Upon completion, a modal will prompt you to enter your name and email to receive information about discounted offers.
5. After submitting the form, a "Thank You" modal will appear. You can then choose to restart the game.

## Development

### Integration with Cloudflare Worker

The game is integrated with a Cloudflare Worker to send user data upon game completion. To set up your own Cloudflare Worker:

1. Visit Cloudflare Workers' official website and set up a new worker.
2. Replace the worker URL in the `script.js` file with your worker's URL.
3. Ensure your worker is set up to handle POST requests and save the data as required.

### Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests to us.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.