# Custom Home Page

## Overview

This project replaces the default 'new tab' page with a custom home page that displays weather conditions, an internet speed test, a clock, a to-do list, and notes. The project is built using HTML, CSS, and JavaScript, and leverages Tailwind CSS for styling.

## Features

- **Weather Information**: Displays current weather conditions using data from the Open-Meteo API.
- **Internet Speed Test**: Allows users to check their internet speed.
- **Clock**: Displays the current time and date.
- **To-Do List**: Users can add, edit, and remove tasks.
- **Notes**: Users can write and save notes.
- **Customizable Settings**: Users can customize the background color, widget colors, and other settings.

## File Structure
. ├── .dist/ ├── .vscode/ │ └── settings.json ├── Home.html ├── Home.js ├── imgs/ │ ├── icon16.png │ ├── icon48.png │ ├── icon128.png │ ├── logo.png │ └── sunny_cloudy.png ├── manifest.json ├── Tailwind-classes.js └── tailwindcsscdn.js


### Key Files

- **Home.html**: The main HTML file that defines the structure of the custom home page.
- **Home.js**: The main JavaScript file that contains the logic for the custom home page.
- **manifest.json**: The manifest file for the Chrome extension.
- **tailwindcsscdn.js**: A script that loads Tailwind CSS from a CDN.
- **Tailwind-classes.js**: A file containing Tailwind CSS classes.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/weroperking/Theme-Home-Page.git
    cd Theme-Home-Page
    ```

2. Load the extension in Chrome:
    - Open Chrome and navigate to [chrome://extensions/](http://_vscodecontentref_/5).
    - Enable "Developer mode" by clicking the toggle switch in the top right corner.
    - Click the "Load unpacked" button and select the directory where you cloned the repository.

## Usage

1. Open a new tab in Chrome to see the custom home page.
2. Use the settings button (cog icon) to customize the background color, widget colors, and other settings.
3. Add, edit, and remove tasks in the to-do list.
4. Write and save notes in the notes section.
5. Check the current weather conditions and internet speed.

## Customization

### Settings

The settings can be customized by clicking the settings button (cog icon) on the top right corner of the home page. The settings are saved in the browser's local storage and applied on page load.

### Tailwind CSS

The project uses Tailwind CSS for styling. You can customize the styles by editing the [tailwindcsscdn.js](http://_vscodecontentref_/6) file or by adding custom styles in the `<style>` section of [Home.html](http://_vscodecontentref_/7).

## API Integration

### Weather Information

The weather information is fetched from the Open-Meteo API. The API key and endpoint are specified in the [manifest.json](http://_vscodecontentref_/8) file under `host_permissions`.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch ([git push origin feature-branch](http://_vscodecontentref_/9)).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Author

Mohamed Khalid | [weroperking](https://github.com/weroperking)

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [Open-Meteo API](https://open-meteo.com/)
- [Font Awesome](https://fontawesome.com/)