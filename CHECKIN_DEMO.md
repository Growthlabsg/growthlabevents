# Check-in System Demo & Testing Guide

## 🎯 Overview
This guide demonstrates the complete check-in system for the GrowthLab Events platform, including how to test all features and see the check-in flow in action.

## 📋 Table of Contents
1. [GrowthLab Event Created](#growthlab-event)
2. [Check-in Flow](#check-in-flow)
3. [Testing Scenarios](#testing-scenarios)
4. [Pages to Test](#pages-to-test)

---

## 🎪 GrowthLab Event Created

### Event Details
- **Event ID**: `growthlab-1`
- **Title**: GrowthLab Startup Pitch Night
- **Date**: November 25, 2024
- **Time**: 7:00 PM
- **Location**: GrowthLab HQ, Marina Bay
- **Organizer**: GrowthLab Events
- **Capacity**: 170 attendees
- **Registered**: 135 attendees
- **Ticket Types**:
  - Early Bird: $25 (42/50 sold)
  - General Admission: $35 (78/100 sold)
  - VIP: $75 (15/20 sold)

### View the Event
Navigate to: **http://localhost:3000/events/growthlab-1**

---

## ✅ Check-in Flow

### 1. **Attendee QR Code Generation**
- Go to **Settings** page: `/settings`
- In the Account tab, you'll see your personal QR code
- QR Code format: `user:username:name`
- Example: `user:johndoe:John Doe`

### 2. **Host Check-in Management**
On the GrowthLab event page (`/events/growthlab-1`), hosts will see:
- **Check-in Management** section (only visible for GrowthLab Events)
- Manual check-in input field
- Real-time attendance statistics
- List of checked-in attendees
- Check-out functionality

### 3. **Check-in Methods**

#### Method 1: QR Code Scan
1. Go to `/checkin` page
2. Click "Scan QR Code" mode
3. Allow camera access
4. Scan attendee's QR code
5. System processes check-in automatically

#### Method 2: Manual Entry (Host)
1. On event page, scroll to "Check-in Management"
2. Enter QR code in format: `user:username:name`
   - Example: `user:sarahj:Sarah Johnson`
3. Or enter email address: `sarah.j@example.com`
4. Click "Check In" button
5. See success message and updated attendance list

#### Method 3: Direct API Call
```javascript
POST /api/events/growthlab-1/checkin
{
  "qrCode": "user:username:name",
  "email": "user@example.com",
  "attendeeName": "User Name",
  "action": "checkin"
}
```

### 4. **Check-out Process**
1. In Check-in Management section
2. Find attendee in "Checked In Attendees" list
3. Click "Check Out" button
4. Attendee moves to "Checked Out" list
5. Statistics update automatically

---

## 🧪 Testing Scenarios

### Scenario 1: Basic Check-in
1. Navigate to `/events/growthlab-1`
2. Scroll to "Check-in Management"
3. Enter: `user:sarahj:Sarah Johnson`
4. Click "Check In"
5. ✅ Verify: Sarah appears in checked-in list
6. ✅ Verify: Statistics update (Checked In: 1)

### Scenario 2: Check-in via Email
1. Enter email: `michael.chen@example.com`
2. Click "Check In"
3. ✅ Verify: Michael Chen appears in list
4. ✅ Verify: Email is displayed correctly

### Scenario 3: Duplicate Check-in Prevention
1. Check in: `user:emilyr:Emily Rodriguez`
2. Try to check in the same person again
3. ✅ Verify: Error message "Attendee is already checked in"

### Scenario 4: Check-out Flow
1. Check in an attendee
2. Click "Check Out" button
3. ✅ Verify: Attendee moves to "Checked Out" list
4. ✅ Verify: "Currently Present" count decreases
5. ✅ Verify: Check-in and check-out times are displayed

### Scenario 5: Real-time Updates
1. Open event page in two browser tabs
2. Check in an attendee in Tab 1
3. ✅ Verify: Tab 2 auto-refreshes and shows new attendee (within 5 seconds)

### Scenario 6: QR Code Scanner
1. Go to `/checkin`
2. Click "Scan QR Code"
3. Allow camera access
4. Enter QR code manually in "Manual Entry" mode
5. ✅ Verify: Check-in processes successfully

---

## 📄 Pages to Test

### 1. **Event Detail Page**
- **URL**: `/events/growthlab-1`
- **Features**:
  - Event information display
  - Ticket types and pricing
  - Registration button
  - Calendar export
  - Check-in Management (Host view)
  - Attendee Directory
  - Event Actions (Save, Share, Report)
  - Event Recommendations

### 2. **Check-in Page**
- **URL**: `/checkin`
- **Features**:
  - QR code scanner (camera-based)
  - Manual code entry
  - Check-in result display
  - Success/error messages

### 3. **Settings Page**
- **URL**: `/settings`
- **Features**:
  - Personal QR code display
  - QR code format: `user:username:name`
  - Link to check-in scanner

### 4. **Events List Page**
- **URL**: `/events`
- **Features**:
  - View all events including GrowthLab event
  - Search and filter
  - Grid/List/Timeline views
  - Featured events section

### 5. **Calendar Management**
- **URL**: `/calendar/manage/1/events`
- **Features**:
  - Event management
  - Newsletter drafts
  - People management
  - Settings

### 6. **Dashboard**
- **URL**: `/dashboard`
- **Features**:
  - Event analytics
  - Revenue tracking
  - Event management links

---

## 🎬 Complete Demo Flow

### Step-by-Step Walkthrough

1. **View GrowthLab Event**
   ```
   Navigate to: http://localhost:3000/events/growthlab-1
   ```
   - See event details
   - View ticket types and pricing
   - See 135 registered attendees

2. **Access Check-in Management**
   - Scroll down to "Check-in Management" section
   - This section only appears for GrowthLab Events (host view)

3. **Test Check-in**
   ```
   Enter QR code: user:sarahj:Sarah Johnson
   Click "Check In"
   ```
   - See success message
   - Sarah appears in checked-in list
   - Statistics update

4. **Test Multiple Check-ins**
   ```
   user:michaelc:Michael Chen
   user:emilyr:Emily Rodriguez
   user:davidk:David Kim
   ```
   - All appear in checked-in list
   - Statistics show correct count

5. **Test Check-out**
   - Click "Check Out" on Sarah Johnson
   - Verify she moves to "Checked Out" list
   - "Currently Present" decreases by 1

6. **Test Email Check-in**
   ```
   Enter: lisa.wang@example.com
   ```
   - System auto-generates name from email
   - Check-in succeeds

7. **View Attendee Directory**
   - Scroll to "Attendees" section
   - See list of all registered attendees
   - Search functionality works

8. **Test Check-in Scanner**
   ```
   Navigate to: http://localhost:3000/checkin
   ```
   - Switch to "Manual Entry" mode
   - Enter: `user:jamest:James Taylor`
   - Verify check-in success

---

## 🔍 API Endpoints

### Check-in API
```
POST /api/events/{eventId}/checkin
Body: {
  "qrCode": "user:username:name",
  "email": "user@example.com",
  "attendeeName": "User Name",
  "action": "checkin" | "checkout"
}
```

### Get Attendance
```
GET /api/events/{eventId}/checkin
Response: {
  "success": true,
  "data": {
    "checkedIn": [...],
    "checkedOut": [...],
    "totalCheckedIn": 5,
    "totalCheckedOut": 2
  }
}
```

---

## ✨ Features Demonstrated

✅ **QR Code Check-in** - Multiple formats supported  
✅ **Manual Entry** - Host can manually check in attendees  
✅ **Email Check-in** - Alternative identification method  
✅ **Check-out System** - Track when attendees leave  
✅ **Real-time Updates** - Auto-refresh every 5 seconds  
✅ **Statistics Dashboard** - Live attendance counts  
✅ **Attendee Management** - View all checked-in/out attendees  
✅ **Error Handling** - Prevents duplicate check-ins  
✅ **Host View** - Special check-in interface for organizers  

---

## 🎯 Quick Test Commands

### Test Check-in via Browser Console
```javascript
fetch('/api/events/growthlab-1/checkin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    qrCode: 'user:testuser:Test User',
    attendeeName: 'Test User',
    email: 'test@example.com',
    action: 'checkin'
  })
})
.then(r => r.json())
.then(console.log);
```

### View Current Attendance
```javascript
fetch('/api/events/growthlab-1/checkin')
.then(r => r.json())
.then(console.log);
```

---

## 📝 Notes

- Check-in data is stored in-memory (resets on server restart)
- QR codes follow format: `user:username:name`
- Email addresses can be used as alternative identifiers
- Check-in Management only visible for GrowthLab Events
- Real-time updates refresh every 5 seconds
- All check-in times are stored in ISO format

---

**Happy Testing! 🚀**

