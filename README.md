# FPL Marginal Prices Firefox Extension

## TLDR

FPL Marginal Prices is a Firefox browser extension that adjusts player prices on the Fantasy Premier League website. It shows each players price relative to the cheapest possible player in their position.

![Extension Icon](icons/fpl-48.png)

## Description

To understand a player's relative value in FPL, the extension adjusts their price based on the cost of the cheapest defender in the game. For instance, if Ben Chilwell's current FPL price is 5.5m and the cheapest defender is priced at 4.0m, Chilwell's adjusted price becomes 1.5m. Should there be an overnight price drop, making the cheapest defender 3.9m, Chilwell's adjusted price would then be 1.6m.

<img src="images/fpl1.png" style="width: 600px" alt="fpl screenshot 2" width="600"/>

<img src="images/fpl3.png" style="width: 600px" alt="fpl screenshot 2" width="600"/>

## Explanation

Think of the cheapest defender's price as the "baseline cost" or "fixed cost" for acquiring any defender. The difference between this baseline and a player's actual price is the "marginal cost" – the extra amount you'd spend to acquire a premium player over the most affordable option.

For example:

Ben Chilwell's actual FPL price: 5.5m.
Baseline cost (cheapest defender): 4.0m.
Marginal cost for Chilwell: 1.5m (5.5m - 4.0m).
If the baseline drops to 3.9m (due to a price decrease for the cheapest defender), the marginal cost for Chilwell becomes 1.6m (5.5m - 3.9m).

This method highlights the additional amount you're investing in Chilwell over the base option. It offers a more transparent view of players' relative values, especially when weighing premium players against budget choices.

## Installation

1. Add the extension from the [Firefox Add-ons Store](https://addons.mozilla.org/en-US/firefox/addon/fpl-real-price/)
2. Click "Add to Firefox"
3. After installation, navigate to the Fantasy Premier League website to see the adjusted player prices.

## Usage

1. Once installed, navigate to the Fantasy Premier League website.
2. Player prices will be automatically adjusted based on the extension's criteria.

## Development

### Prerequisites

- Firefox browser
- Basic knowledge of JavaScript and browser extensions

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/cerico/fpl.git
   ```
2. Load the extension in Firefox:
   - Open Firefox
   - Navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the cloned repository

## Contributing

If you'd like to contribute to the development of FPL Marginal Prices, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Fantasy Premier League website for providing the platform.
- All player data and images are the property of the Premier League.

---
