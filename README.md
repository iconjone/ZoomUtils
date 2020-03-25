### Installation

- Please either clone this repository or download as a ZIP file.
- Extract the contents into your preferred working directory.
- Open your Google Chrome browser.
- Enter `chrome://extensions/` into the address bar.
- Ensure "Developer Mode" is ticked/enabled in the top right.
- Click on "Load unpacked extension...".
- Navigate to your extracted directory, and click "OK".
- Your basic extension template should now be alongside your address bar, showing the Google Chrome logo.

## Important Notes

Please note, the Bootstrap 3 CSS file has been modified to disable the standard responsive features Bootstrap 3 offers.  Since the maximum width an extension can be is 800px (without overflow), the content and navbar are shrunk into a mobile format when the extension is below 769px.  These changes disable this, to allow your extension to function properly whatever size you wish it to be.


## Usage

This package is standalone.  Please visit the Google Developer documentation if you wish to know more about Extension creating:

http://developer.chrome.com/extensions/getstarted.html
