```markdown:cryptocurrency-scraper/README.md
# Cryptocurrency Data Crawler (Updates CustomCoinData.json Every 12 hours)

A robust Node.js script that fetches comprehensive cryptocurrency data from the CoinGecko API, including market data, social media links, and technical details for the top cryptocurrencies by market cap.

## Features

- Fetches detailed data for top 1500 cryptocurrencies (configurable)
- Implements rate limiting and retry mechanisms
- Saves progress for resume capability
- Generates unique IDs for each coin
- Includes comprehensive error handling
- Stores data in JSON format
- Supports multiple blockchain platforms
- Collects social media links and community metrics

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/genfuture/cryptocurrency-scraper.git
```

2. Install dependencies:
```bash
cd crypto-scraper
npm install
```

## Usage

Run the script using Node.js:
```bash
node coins.cjs
```

The script will:
1. Fetch data for the top 1500 cryptocurrencies (6 pages of 250 coins each) able to modify the number of coins per page
2. Save progress automatically after each coin
3. Generate a `customCoinData.json` file with the results

## Data Collection

The crawler collects the following data for each cryptocurrency:

### Basic Information
- Name and symbol
- Current price and market cap
- Rank and scores (CoinGecko rank, developer score, etc.)
- Launch date and genesis information

### Market Data
- 24h price changes and volumes
- Supply information (circulating, total, max)
- High/low prices
- Market cap changes

### Social Media Links
- Reddit
- Telegram
- Twitter
- Instagram
- YouTube
- Discord

### Technical Details
- Blockchain platforms and addresses
- Explorer links
- Website URLs
- Platform-specific addresses

## Rate Limiting

The script implements several measures to respect CoinGecko's API rate limits:
- 15-second delay between individual coin requests
- 30-second delay between page requests
- Exponential backoff for rate limit errors
- Maximum 5 retries per request

## Error Handling

The script includes robust error handling:
- Automatic retry mechanism for failed requests
- Progress saving for resume capability
- Default values for missing data
- Detailed error logging

## Output Format

Data is saved in JSON format with the following structure:
```json
{
  "uniqueId": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "price": "50000",
    "rank": "1",
    // ... additional fields
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for providing cryptocurrency data
- Contributors and maintainers of the project

## Contact

For questions, suggestions, or collaboration opportunities:

- **GitHub**: [genfuture](https://github.com/genfuture)
- **Email**: g.prem2349@gmail.com
- **LinkedIn**: [Prem](https://linkedin.com/in/g-prem)


Feel free to reach out for any inquiries or discussions about the project!

## Disclaimer

This tool is for educational and research purposes only. Always verify the data independently before making any financial decisions.
```

This README provides a comprehensive overview of your cryptocurrency data crawler, including installation instructions, features, usage guidelines, and important technical details. It's well-structured and should help users understand and use your tool effectively.
