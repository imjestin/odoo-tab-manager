# Odoo Tab Manager

A powerful Chrome extension for managing Odoo tabs with personalized new tab experience, mode switching, and Odoo detection features.

## Features

- **Personalized New Tab**: Beautiful, customizable new tab with dark theme
- **Mode Switching**: Switch between Developer, Consultant, User, and News modes
- **Odoo Detection**: Automatically detects Odoo websites and shows a floating action button
- **Theme Customization**: Apply custom color themes to Odoo interfaces
- **Quick Access**: Quick navigation to Frontend, Backend, and Database Manager
- **AI Services**: Quick access to trending AI services (Gemini, GPT, Claude, etc.)

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `my-newtab-extension` directory

## Development

### Build Commands

- `npm run build` - Build all TypeScript and CSS files
- `npm run build:ts` - Build TypeScript files only
- `npm run build:css` - Build CSS files only
- `npm run watch` - Watch for changes and rebuild automatically

### Project Structure

```
my-newtab-extension/
├── src/
│   ├── ts/          # TypeScript source files
│   └── input.css    # Tailwind CSS source
├── dist/            # Compiled output
├── icons/           # Extension icons
├── manifest.json    # Chrome extension manifest
├── newtab.html      # New tab page
└── popup.html       # Extension popup
```

## Usage

### New Tab Features

- Click on mode buttons (Developer, Consultant, User, News) to switch between different views
- Use the AI Services button to quickly access AI platforms
- Customize your top sites and preferences

### Odoo Integration

When visiting an Odoo website, a floating button appears in the bottom-right corner:

- **Frontend**: Navigate to the frontend
- **Backend**: Navigate to the backend
- **Database Manager**: Access the database manager
- **Theme**: Apply custom color themes to the Odoo interface

## Technologies

- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Chrome Extension API**: For browser integration

## License

MIT

