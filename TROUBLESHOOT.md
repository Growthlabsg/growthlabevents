# Troubleshooting Guide

If the site is not loading, try these steps:

## 1. Clear cache and reinstall
```bash
cd /Users/arulv97/luma-clone
rm -rf .next node_modules package-lock.json
npm install
```

## 2. Check for errors
```bash
npm run build
```

## 3. Start dev server
```bash
npm run dev
```

## 4. Check if port is available
```bash
lsof -ti:3000 | xargs kill -9
```

## 5. Common Issues:

### ThemeProvider Error
If you see "useTheme must be used within a ThemeProvider", make sure:
- ThemeProvider is in layout.tsx
- All pages using useTheme have 'use client' directive

### Build Errors
- Check TypeScript errors: `npx tsc --noEmit`
- Check for missing imports
- Verify all components have proper exports

### Port Already in Use
- Kill existing processes: `pkill -f "next dev"`
- Or use different port: `PORT=3001 npm run dev`

