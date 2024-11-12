const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');  // To generate unique IDs

// Function to generate unique string IDs for each coin
function generateUniqueId() {
  return crypto.randomBytes(8).toString('hex');
}

// Helper function to introduce a delay (2 seconds to respect 30 calls/minute rate limit)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Define an asynchronous function to fetch coin data with retries
async function fetchWithRetry(url, params, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`Rate limited. Retrying in ${delay / 1000} seconds...`);
        await sleep(delay);
        delay *= 4; // Exponential backoff in case of rate limits
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries reached');
}

// Modify the fetchCoinDetails function to use retry logic
async function fetchCoinDetails(id, retries = 5, initialDelay = 2000) {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
      const coinDetails = response.data;

      // Extract relevant details
      return {
        reddit: coinDetails.links.subreddit_url || '',
        telegram: coinDetails.links.telegram_channel_identifier ? `https://t.me/${coinDetails.links.telegram_channel_identifier}` : '',
        twitter: coinDetails.links.twitter_screen_name ? `https://twitter.com/${coinDetails.links.twitter_screen_name}` : '',
        insta: '',
        youtube: '',
        discord: coinDetails.links.chat_url ? coinDetails.links.chat_url.find(link => link.includes('discord')) || '' : '',
        description: coinDetails.description.en || 'No description available',
        homepage: coinDetails.links.homepage && coinDetails.links.homepage[0] ? coinDetails.links.homepage[0] : '',
        blockchain_site: coinDetails.links.blockchain_site && coinDetails.links.blockchain_site[0] ? coinDetails.links.blockchain_site[0] : '',
        image: coinDetails.image.large || '',
        market_cap_rank: coinDetails.market_cap_rank || '',
        coingecko_rank: coinDetails.coingecko_rank || '',
        coingecko_score: coinDetails.coingecko_score || '',
        developer_score: coinDetails.developer_score || '',
        community_score: coinDetails.community_score || '',
        liquidity_score: coinDetails.liquidity_score || '',
        public_interest_score: coinDetails.public_interest_score || '',
        market_data: {
          current_price: coinDetails.market_data.current_price.usd || 0,
          market_cap: coinDetails.market_data.market_cap.usd || 0,
          total_volume: coinDetails.market_data.total_volume.usd || 0,
          high_24h: coinDetails.market_data.high_24h.usd || 0,
          low_24h: coinDetails.market_data.low_24h.usd || 0,
          price_change_24h: coinDetails.market_data.price_change_24h || 0,
          price_change_percentage_24h: coinDetails.market_data.price_change_percentage_24h || 0,
          market_cap_change_24h: coinDetails.market_data.market_cap_change_24h || 0,
          market_cap_change_percentage_24h: coinDetails.market_data.market_cap_change_percentage_24h || 0,
          circulating_supply: coinDetails.market_data.circulating_supply || 0,
          total_supply: coinDetails.market_data.total_supply || 0,
          max_supply: coinDetails.market_data.max_supply || 0,
        },
        last_updated: coinDetails.last_updated || '',
        genesis_date: coinDetails.genesis_date || '',
        ico_data: coinDetails.ico_data || {},
        asset_platform_id: coinDetails.asset_platform_id || '',
        platforms: coinDetails.platforms || {},
      };
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`Rate limited when fetching details for coin ${id}. Retrying in ${delay / 1000} seconds...`);
        await sleep(delay);
        delay *= 2; // Exponential backoff
      } else {
        console.error(`Error fetching details for coin ${id}:`, error.message);
        return {
          reddit: '',
          telegram: '',
          twitter: '',
          insta: '',
          youtube: '',
          discord: '',
          description: 'No description available',
          homepage: '',
          blockchain_site: '',
          image: '',
          market_cap_rank: '',
          coingecko_rank: '',
          coingecko_score: '',
          developer_score: '',
          community_score: '',
          liquidity_score: '',
          public_interest_score: '',
          market_data: {
            current_price: 0,
            market_cap: 0,
            total_volume: 0,
            high_24h: 0,
            low_24h: 0,
            price_change_24h: 0,
            price_change_percentage_24h: 0,
            market_cap_change_24h: 0,
            market_cap_change_percentage_24h: 0,
            circulating_supply: 0,
            total_supply: 0,
            max_supply: 0,
          },
          last_updated: '',
          genesis_date: '',
          ico_data: {},
          asset_platform_id: '',
          platforms: {},
        };
      }
    }
  }
  console.error(`Max retries reached for coin ${id}`);
  return {
    reddit: '',
    telegram: '',
    twitter: '',
    insta: '',
    youtube: '',
    discord: '',
    description: 'No description available',
    homepage: '',
    blockchain_site: '',
    image: '',
    market_cap_rank: '',
    coingecko_rank: '',
    coingecko_score: '',
    developer_score: '',
    community_score: '',
    liquidity_score: '',
    public_interest_score: '',
    market_data: {
      current_price: 0,
      market_cap: 0,
      total_volume: 0,
      high_24h: 0,
      low_24h: 0,
      price_change_24h: 0,
      price_change_percentage_24h: 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: 0,
      total_supply: 0,
      max_supply: 0,
    },
    last_updated: '',
    genesis_date: '',
    ico_data: {},
    asset_platform_id: '',
    platforms: {},
  };
}

async function processCoinsSequentially(coins, startIndex = 0) {
  const coinData = {};
  for (let i = startIndex; i < coins.length; i++) {
    const coin = coins[i];
    const uniqueId = generateUniqueId();
    console.log(`Fetching details for ${coin.name} (${i + 1}/${coins.length})...`);
    const details = await fetchCoinDetails(coin.id);
    
    // Get all platform addresses
    const getAllPlatformAddresses = (platforms) => {
      if (!platforms || typeof platforms !== 'object') return {};
      
      // Filter out empty or invalid addresses
      const validPlatforms = {};
      for (const [platform, address] of Object.entries(platforms)) {
        if (address && typeof address === 'string') {
          validPlatforms[platform] = address;
        }
      }
      return validPlatforms;
    };

    coinData[uniqueId] = {
      name: coin.name || '',
      symbol: coin.symbol || '',
      price: details.market_data.current_price || '0',
      livePrice: {
        value: details.market_data.current_price || '0',
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd`
      },
      rank: details.market_cap_rank || '',
      cap: details.market_data.market_cap || '0',
      addedDate: Date.now().toString(),
      coinMarketCap: true,
      coingecko: true,
      chain: details.asset_platform_id || '', // Using asset_platform_id, defaulting to 'BSC' if not available
      launchDate: details.genesis_date || '',
      token: true, // This might need to be determined differently
      description: details.description,
      explorerLink: details.blockchain_site || '',
      address: getAllPlatformAddresses(details.platforms),
      website: details.homepage || '',
      reddit: details.reddit,
      telegram: details.telegram,
      twitter: details.twitter,
      insta: details.insta,
      youtube: details.youtube,
      discord: details.discord,
      coinLogo: details.image || '',
      coingecko_rank: details.coingecko_rank || '',
      coingecko_score: details.coingecko_score || '',
      developer_score: details.developer_score || '',
      community_score: details.community_score || '',
      liquidity_score: details.liquidity_score || '',
      public_interest_score: details.public_interest_score || '',
      total_volume: details.market_data.total_volume || 0,
      high_24h: details.market_data.high_24h || 0,
      low_24h: details.market_data.low_24h || 0,
      price_change_24h: details.market_data.price_change_24h || 0,
      price_change_percentage_24h: details.market_data.price_change_percentage_24h || 0,
      market_cap_change_24h: details.market_data.market_cap_change_24h || 0,
      market_cap_change_percentage_24h: details.market_data.market_cap_change_percentage_24h || 0,
      circulating_supply: details.market_data.circulating_supply || 0,
      total_supply: details.market_data.total_supply || 0,
      max_supply: details.market_data.max_supply || 0,
      last_updated: details.last_updated || '',
      platforms: getAllPlatformAddresses(details.platforms),
    };
    
    // Save progress after each coin
    fs.writeFileSync('customCoinDatat.json', JSON.stringify(coinData, null, 2));
    fs.writeFileSync('progress.json', JSON.stringify({ lastProcessedIndex: i }));
    
    // Add a delay between each coin to avoid rate limiting
    await sleep(15000); // 15 seconds delay between each coin
  }
  return coinData;
}

async function fetchCoinData() {
  try {
    let allCoins = [];
    const perPage = 150; //set the coins here
    let page = 1; 
    const maxPages = 1; //set the pages here

    while (page <= maxPages) {
      console.log(`Fetching page ${page}...`);
      const data = await fetchWithRetry('https://api.coingecko.com/api/v3/coins/markets', {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false
      });

      if (data.length === 0) {
        console.log(`No more data available. Stopping at page ${page - 1}.`);
        break;
      } else {
        allCoins = allCoins.concat(data);
        page++;

        if (page <= maxPages) {
          console.log('Waiting 30 seconds before next page request...');
          await sleep(30000);
        }
      }
    }

    console.log(`Processing ${allCoins.length} coins...`);
    
    // Check if there's a progress file
    let startIndex = 0;
    if (fs.existsSync('progress.json')) {
      const progress = JSON.parse(fs.readFileSync('progress.json', 'utf8'));
      startIndex = progress.lastProcessedIndex + 1;
      console.log(`Resuming from index ${startIndex}`);
    }
    
    const coinData = await processCoinsSequentially(allCoins, startIndex);

    fs.writeFileSync('customCoinData.json', JSON.stringify(coinData, null, 2));
    console.log(`Coin data for ${Object.keys(coinData).length} coins saved to customCoinData.json`);

  } catch (error) {
    console.error('Error fetching coin data:', error);
  }
}

// Call the function to fetch the coin data
fetchCoinData();
