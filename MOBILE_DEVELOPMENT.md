# Mobile Development Guide

This project has been configured with Capacitor to run as a mobile app on Android.

## Prerequisites

- Android Studio installed
- Android SDK configured
- An Android device or emulator

## Development Workflow

### 1. Build and Sync
After making changes to your React app, build and sync to the mobile project:

```bash
npm run cap:build
```

This command will:
- Build your React app (`npm run build`)
- Sync the built assets to the Android project (`npx cap sync`)

### 2. Open in Android Studio
```bash
npm run cap:open:android
```

### 3. Run on Device/Emulator
```bash
npm run cap:run:android
```

## Available Scripts

- `npm run cap:build` - Build and sync to mobile
- `npm run cap:sync` - Sync only (after manual build)
- `npm run cap:open:android` - Open Android project in Android Studio
- `npm run cap:run:android` - Run on connected device/emulator
- `npm run cap:build:android` - Build Android APK

## Project Structure

- `android/` - Android native project
- `dist/` - Built web assets (synced to mobile)
- `capacitor.config.ts` - Capacitor configuration

## Important Notes

1. **Always run `npm run cap:build` after making changes** to your React code
2. The Android project is in the `android/` folder
3. You can edit native Android code in Android Studio
4. The web assets are automatically copied to `android/app/src/main/assets/public/`

## Troubleshooting

If you encounter issues:

1. Make sure Android Studio is properly configured
2. Check that you have an Android device connected or emulator running
3. Try cleaning and rebuilding: `npx cap sync android`
4. Check the Android Studio logs for detailed error messages

## Next Steps

1. Test the app on a physical device or emulator
2. Add Capacitor plugins for native functionality (camera, geolocation, etc.)
3. Configure app icons and splash screens
4. Set up app signing for release builds 