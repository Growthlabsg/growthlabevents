# Complete Feature Simulation & Testing Guide

## 🎯 Overview
This document provides a comprehensive guide to test all features across all pages of the GrowthLab Events platform.

---

## 📋 Quick Start

### 1. View GrowthLab Event
**URL**: http://localhost:3000/events/growthlab-1

This is the main demo event created for testing. It includes:
- Full event details
- Multiple ticket types (Early Bird, General, VIP)
- 135 registered attendees
- Check-in Management interface (Host view)

---

## 🎪 GrowthLab Event Details

### Event Information
- **Title**: GrowthLab Startup Pitch Night
- **Date**: November 25, 2024 at 7:00 PM
- **Location**: GrowthLab HQ, Marina Bay
- **Organizer**: GrowthLab Events
- **Status**: Upcoming
- **Capacity**: 170 attendees
- **Registered**: 135 attendees

### Ticket Types
1. **Early Bird** - $25 (42/50 sold)
2. **General Admission** - $35 (78/100 sold)
3. **VIP** - $75 (15/20 sold)

### Mock Attendees
- Sarah Johnson (sarah.j@example.com)
- Michael Chen (michael.chen@example.com)
- Emily Rodriguez (emily.r@example.com)
- David Kim (david.kim@example.com)
- Lisa Wang (lisa.wang@example.com)
- James Taylor (james.t@example.com)
- Sophie Brown (sophie.b@example.com)
- Alex Martinez (alex.m@example.com)

---

## ✅ Check-in System Demo

### Step 1: Access Check-in Management
1. Navigate to: http://localhost:3000/events/growthlab-1
2. Scroll down to find **"Check-in Management"** section
3. This section has a teal border and "Host View" badge

### Step 2: Test Manual Check-in
**Option A: QR Code Format**
```
Enter: user:sarahj:Sarah Johnson
Click: "Check In"
```
✅ Expected: Success message, Sarah appears in checked-in list

**Option B: Email Format**
```
Enter: michael.chen@example.com
Click: "Check In"
```
✅ Expected: Success message, Michael Chen appears in list

### Step 3: View Statistics
After checking in attendees, you'll see:
- **Checked In**: Number of people currently checked in
- **Checked Out**: Number of people who checked out
- **Currently Present**: Active attendees (Checked In - Checked Out)

### Step 4: Test Check-out
1. Find an attendee in "Checked In Attendees" list
2. Click "Check Out" button
3. ✅ Verify: Attendee moves to "Checked Out" list
4. ✅ Verify: Statistics update automatically

### Step 5: Test Real-time Updates
- The attendance list auto-refreshes every 5 seconds
- Open the page in multiple tabs to see updates sync

---

## 📄 Complete Page Testing Checklist

### 1. Home Page (`/`)
- [ ] Hero section displays
- [ ] Featured events carousel
- [ ] Navigation works
- [ ] Dark mode toggle works

### 2. Events List Page (`/events`)
- [ ] All events display (including GrowthLab event)
- [ ] Search functionality
- [ ] Filter by category
- [ ] Sort options (Date, Title, Popularity)
- [ ] View modes (Grid, List, Timeline)
- [ ] Featured events section
- [ ] "Going" button toggle
- [ ] Event cards link to detail pages

### 3. Event Detail Page (`/events/growthlab-1`)
- [ ] Event information displays correctly
- [ ] Ticket types and pricing
- [ ] Registration button
- [ ] **Check-in Management** section (Host view)
- [ ] Attendee Directory
- [ ] Calendar Export (Google, Outlook, iCal)
- [ ] Event Actions (Save, Share, Report)
- [ ] Event Recommendations
- [ ] Responsive design (mobile/desktop)

### 4. Check-in Page (`/checkin`)
- [ ] Mode toggle (Scan/Manual)
- [ ] Camera access request (Scan mode)
- [ ] Manual entry field
- [ ] QR code processing
- [ ] Success/error messages
- [ ] Check-in result display

### 5. Calendar Management (`/calendar/manage/1/events`)
- [ ] Events tab
- [ ] People tab (search, filter, add)
- [ ] Newsletters tab
  - [ ] Drafts section
  - [ ] "New Draft" button (visible in light theme)
  - [ ] Published section
- [ ] Payment tab
- [ ] Insights tab
- [ ] Settings tab
  - [ ] Display settings
  - [ ] Options
  - [ ] Admins
  - [ ] Tags
  - [ ] Embed
  - [ ] Send limit
  - [ ] Delete calendar functionality

### 6. Calendar Public View (`/calendar/[slug]`)
- [ ] Calendar widget displays
- [ ] Month navigation
- [ ] Date selection
- [ ] Event display by date
- [ ] Upcoming events preview
- [ ] Event filtering
- [ ] Calendar export

### 7. Settings Page (`/settings`)
- [ ] Profile tab
  - [ ] Profile picture upload
  - [ ] **QR Code display** (Check-in QR)
  - [ ] Personal information
- [ ] Account tab
  - [ ] Email management
  - [ ] Mobile number
- [ ] Notifications tab
- [ ] Privacy tab
- [ ] Billing tab

### 8. Dashboard (`/dashboard`)
- [ ] Revenue statistics
- [ ] Event analytics
- [ ] My Events list
- [ ] Quick actions
- [ ] Time range filter

### 9. Saved Events (`/events/saved`)
- [ ] Displays saved events
- [ ] Empty state when no saved events
- [ ] Link to browse events

### 10. Search Results (`/events/search?q=query`)
- [ ] Search functionality
- [ ] Results display
- [ ] Filter options
- [ ] Sort options

### 11. Category Pages (`/events/category/[category]`)
- [ ] Category filtering
- [ ] Event display
- [ ] Search within category

### 12. Event Analytics (`/events/analytics/[id]`)
- [ ] Registration rate
- [ ] Revenue tracking
- [ ] Waitlist count
- [ ] Ticket sales breakdown

### 13. Event Edit (`/events/edit/[id]`)
- [ ] Form pre-populated with event data
- [ ] All fields editable
- [ ] Validation
- [ ] Save functionality

---

## 🧪 Feature Testing Scenarios

### Scenario 1: Complete Check-in Flow
1. Go to `/events/growthlab-1`
2. Scroll to Check-in Management
3. Check in: `user:sarahj:Sarah Johnson`
4. Check in: `user:michaelc:Michael Chen`
5. Check in: `emily.r@example.com`
6. Verify all appear in checked-in list
7. Check out Sarah Johnson
8. Verify she moves to checked-out list
9. Verify statistics update correctly

### Scenario 2: Event Registration Flow
1. Go to `/events/growthlab-1`
2. View ticket types
3. Click "Register Now"
4. (In production, this would show registration form)

### Scenario 3: Event Actions
1. Go to `/events/growthlab-1`
2. Click "Save" button
3. Verify event saved
4. Go to `/events/saved`
5. Verify event appears in saved list
6. Click "Share" button
7. Test share options (Twitter, Facebook, LinkedIn, Copy Link)
8. Click "Report" button
9. Fill report form and submit

### Scenario 4: Calendar Export
1. Go to `/events/growthlab-1`
2. Scroll to Calendar Export section
3. Click "Google Calendar"
4. Verify opens Google Calendar with event details
5. Click "Outlook Calendar"
6. Verify opens Outlook Calendar
7. Click "Download iCal"
8. Verify .ics file downloads

### Scenario 5: Attendee Directory
1. Go to `/events/growthlab-1`
2. Scroll to Attendees section
3. Search for "Sarah"
4. Verify filtering works
5. Click "Connect" on an attendee
6. (In production, this would trigger contact exchange)

### Scenario 6: Event Recommendations
1. Go to `/events/growthlab-1`
2. Scroll to "Similar Events" section
3. Verify similar events display
4. Click on a recommended event
5. Verify navigation works

### Scenario 7: Featured Events
1. Go to `/events`
2. Look for "Featured Events" section
3. (Events need to be marked as featured first)
4. Verify featured badge displays
5. Click on featured event
6. Verify navigation works

### Scenario 8: Search & Filter
1. Go to `/events`
2. Enter search query: "GrowthLab"
3. Verify results filter
4. Change sort to "Popularity"
5. Switch to List view
6. Switch to Timeline view
7. Filter by category

---

## 🔍 API Testing

### Test Check-in API
```bash
# Check in an attendee
curl -X POST http://localhost:3000/api/events/growthlab-1/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "qrCode": "user:testuser:Test User",
    "attendeeName": "Test User",
    "email": "test@example.com",
    "action": "checkin"
  }'
```

### Get Attendance
```bash
curl http://localhost:3000/api/events/growthlab-1/checkin
```

### Get Attendees
```bash
curl http://localhost:3000/api/events/growthlab-1/attendees
```

### Get Analytics
```bash
curl http://localhost:3000/api/events/growthlab-1/analytics
```

---

## 📱 Mobile Testing

Test all pages on mobile viewport:
- [ ] Navigation menu works
- [ ] Touch targets are adequate
- [ ] Forms are usable
- [ ] Check-in interface works
- [ ] Event cards display properly
- [ ] Modals are responsive

---

## 🌓 Dark Mode Testing

Test all pages in dark mode:
- [ ] Toggle dark mode in navbar
- [ ] All components adapt to dark theme
- [ ] Text is readable
- [ ] Buttons are visible
- [ ] Forms are usable
- [ ] Check-in interface works

---

## ⚡ Performance Testing

- [ ] Page load times are acceptable
- [ ] Images load properly
- [ ] No console errors
- [ ] API calls complete successfully
- [ ] Real-time updates work smoothly

---

## 🐛 Known Issues & Notes

1. **Check-in Data**: Stored in-memory, resets on server restart
2. **QR Code Scanner**: Requires camera permissions (simulated in demo)
3. **Payment Processing**: Not implemented (Stripe integration needed)
4. **Email Notifications**: Not implemented
5. **Real Authentication**: Not implemented (using mock data)

---

## 🎬 Demo Script

### Quick 5-Minute Demo
1. **Show Homepage** (30s)
   - Navigate to `/`
   - Show featured events
   - Demonstrate navigation

2. **Show Events List** (1min)
   - Navigate to `/events`
   - Show search, filters, views
   - Click on GrowthLab event

3. **Show Event Detail** (2min)
   - Show event information
   - Demonstrate Check-in Management
   - Check in 2-3 attendees
   - Show check-out
   - Show statistics update
   - Show Attendee Directory
   - Show Calendar Export

4. **Show Check-in Page** (1min)
   - Navigate to `/checkin`
   - Show manual entry
   - Demonstrate check-in

5. **Show Settings** (30s)
   - Navigate to `/settings`
   - Show QR code generation

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Pages Tested:
[ ] Home
[ ] Events List
[ ] Event Detail (GrowthLab)
[ ] Check-in Page
[ ] Settings
[ ] Calendar Management
[ ] Dashboard
[ ] Saved Events

Features Tested:
[ ] Check-in System
[ ] Check-out System
[ ] Event Registration
[ ] Event Actions (Save/Share/Report)
[ ] Calendar Export
[ ] Attendee Directory
[ ] Event Recommendations
[ ] Search & Filter
[ ] Dark Mode
[ ] Mobile Responsive

Issues Found:
1. ___________
2. ___________
3. ___________

Overall Status: [ ] Pass [ ] Fail [ ] Needs Work
```

---

**Happy Testing! 🚀**

For detailed check-in flow, see `CHECKIN_DEMO.md`

