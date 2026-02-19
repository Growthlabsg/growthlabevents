# Quick Fix for Site Not Loading

## Try these steps in order:

### Step 1: Clean Install
```bash
cd /Users/arulv97/luma-clone
rm -rf .next node_modules package-lock.json
npm install
```

### Step 2: Start Server
```bash
npm run dev
```

Or use the startup script:
```bash
./start-dev.sh
```

### Step 3: Check Browser Console
Open http://localhost:3000 and check the browser console (F12) for any errors.

### Step 4: Check Terminal Output
Look for any error messages in the terminal where you ran `npm run dev`.

## Common Issues:

1. **Port 3000 already in use**: 
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **ThemeProvider error**: Already fixed - ThemeProvider is properly set up in layout.tsx

3. **Build errors**: Run `npm run build` to see detailed error messages

4. **TypeScript errors**: Run `npx tsc --noEmit` to check for type errors

## If still not working:

Share the error message from:
- Terminal output when running `npm run dev`
- Browser console (F12 → Console tab)
- Any build errors from `npm run build`

