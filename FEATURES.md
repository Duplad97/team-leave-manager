# Team Leave Manager - Feature Implementation Guide

This document describes all the features that have been added to the Team Leave Manager project.

## Features Added

### 1. **Filtering by Team Member or Status**

#### Backend
- **Endpoint**: `GET /api/leave-requests?teamMemberId=1&status=PENDING`
- **Query Parameters**:
  - `teamMemberId` (optional): Filter by team member ID
  - `status` (optional): Filter by status (PENDING, APPROVED, REJECTED)
- **Database**: Added indexes for efficient filtering on `team_member_id` and `status`

#### Frontend
- **Component**: `LeaveRequestFilters` - Drop-down filters for team member and status
- **State**: Uses Jotai atoms (`filterByTeamMemberAtom`, `filterByStatusAtom`)
- **Location**: Displayed above leave requests list

**Usage:**
```tsx
<LeaveRequestFilters /> // Shows in LeaveRequestList
```

---

### 2. **Automatic On-Call Replacement Suggestions**

#### Backend
- **Service**: `OnCallReplacementSuggestionService`
- **Endpoint**: `GET /api/on-call/replacement-suggestions?onCallMemberId=1&startDate=2024-01-01&endDate=2024-01-07`
- **Logic**: 
  - Fetches all team members
  - Excludes the on-call member
  - Excludes members with approved leave during the period
  - Returns list of available members

#### Frontend
- **Component**: `ReplacementSuggestions` - Shows available replacements when on-call has conflict
- **Integration**: Appears in OnCallSchedule for weeks with conflicts
- **Features**:
  - Expandable list of suggestions
  - Shows member name and email
  - Only appears when conflict detected

**How it works:**
1. OnCallSchedule identifies weeks where on-call member has approved leave
2. Click "Suggested Replacements" to see available team members
3. Replacements are sorted by who doesn't have leave that week

---

### 3. **Leave Approval Workflow**

#### Backend Changes
- **Fields Added to LeaveRequest**:
  - `approver_id` (foreign key to team_member)
  - `approved_at` (timestamp when approved)
  
- **Update Endpoint**: `PATCH /api/leave-requests/{id}/status`
```json
{
  "status": "APPROVED",
  "approverId": 2
}
```

#### Frontend Changes
- **Approval Flow**:
  1. User clicks "Approve" button on pending leave request
  2. Current user is set as the approver
  3. `approved_at` timestamp is automatically set
  4. Request status changes to APPROVED

- **UI Elements**:
  - Approver name displayed in leave request details
  - Approval timestamp shown in request information

**LeaveRequestDto now includes:**
```typescript
approverId?: number;
approverName?: string;
approvedAt?: string;
```

---

### 4. **Comments on Leave Requests**

#### Backend
- **Models**:
  - `LeaveComment` entity with author, text, and timestamp
  - Relationship to `LeaveRequest` (one-to-many)

- **Endpoints**:
  - `GET /api/leave-requests/{leaveRequestId}/comments` - Get all comments
  - `POST /api/leave-requests/{leaveRequestId}/comments` - Add comment

- **Request Body**:
```json
{
  "leaveRequestId": 1,
  "authorId": 2,
  "commentText": "Approved for next week's project work"
}
```

#### Frontend
- **Component**: `CommentsPanel` - Display and add comments
- **Features**:
  - Shows all comments with author and date
  - Text area for adding new comments
  - Automatic refresh when new comment added
  - Sorted by most recent first

- **Component**: `LeaveRequestDetail` - Full details view with comments
- **Usage**:
```tsx
<CommentsPanel leaveRequest={leaveRequest} />
```

**Comment Display**:
- Author name with avatar initial
- Comment text
- Created date
- Author email available on hover

---

### 5. **Basic Automated Tests**

#### Backend Tests Created

**LeaveRequestServiceTest.java**
- `testGetAll()` - Fetch all leave requests
- `testCreateLeaveRequest_Success()` - Create valid leave request
- `testCreateLeaveRequest_InvalidDateRange()` - Validation error
- `testGetByTeamMember()` - Filter by team member
- `testGetByStatus()` - Filter by status
- `testUpdateStatus_Approve()` - Approve request with approver
- `testUpdateStatus_Reject()` - Reject request

**LeaveCommentServiceTest.java**
- `testGetCommentsByLeaveRequest()` - Fetch comments for request
- `testAddComment_Success()` - Add comment successfully
- `testAddComment_LeaveRequestNotFound()` - Error handling
- `testAddComment_AuthorNotFound()` - Error handling

**OnCallReplacementSuggestionServiceTest.java**
- `testGetSuggestedReplacements_AllAvailable()` - All members available
- `testGetSuggestedReplacements_SomeOnLeave()` - Some members have conflicts
- `testGetSuggestedReplacements_AllOnLeave()` - No available replacements

#### Running Tests
```bash
cd backend
mvn test
```

#### Test Coverage
- Service layer logic
- Error scenarios
- Edge cases
- Mocked dependencies

---

## Database Schema Changes

### New Table: `leave_comments`
```sql
CREATE TABLE leave_comments (
    id              BIGSERIAL PRIMARY KEY,
    leave_request_id BIGINT NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    author_id       BIGINT NOT NULL REFERENCES team_members(id),
    comment_text    TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Updated Table: `leave_requests`
```sql
ALTER TABLE leave_requests 
ADD COLUMN approver_id BIGINT REFERENCES team_members(id);
ADD COLUMN approved_at TIMESTAMPTZ;

CREATE INDEX idx_leave_requests_status ON leave_requests (status);
CREATE INDEX idx_leave_comments_request ON leave_comments (leave_request_id);
```

---

## API Changes Summary

### Updated Endpoints
| Method | Endpoint | Changes |
|--------|----------|---------|
| GET | `/api/leave-requests` | Now supports `teamMemberId` and `status` query params |
| PATCH | `/api/leave-requests/{id}/status` | Now accepts `approverId` in request body |

### New Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leave-requests/{id}/comments` | Get all comments for a leave request |
| POST | `/api/leave-requests/{id}/comments` | Add comment to a leave request |
| GET | `/api/on-call/replacement-suggestions` | Get available replacements for on-call |

---

## Frontend Component Architecture

```
App
├── LeaveRequestList
│   ├── LeaveRequestFilters
│   ├── LeaveActions (with approval workflow)
│   └── StatusChip
├── LeaveRequestForm
├── LeaveCalendar
├── OnCallSchedule
│   └── ReplacementSuggestions (per week with conflict)
└── LeaveRequestDetail (new - for modal/detail view)
    └── CommentsPanel
```

---

## Configuration & Environment

No new environment variables required. All features use existing infrastructure.

### Development
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
mvn spring-boot:run
```

### Testing
```bash
# Backend tests
cd backend
mvn test

# Frontend components would need Jest/Vitest setup (optional)
```

---

## User Guide

### For Managers/Approvers
1. **View leave requests**: Navigate to "Leave" tab
2. **Filter requests**: Use filters to find specific team members or pending requests
3. **Approve/Reject**: Click approve or reject buttons on pending requests
4. **Add comments**: Use the comments panel to add approval notes
5. **Check replacements**: Go to "On-Call" tab and click "Suggested Replacements" for conflicting weeks

### For Team Members
1. **Submit leave**: Fill form with dates, reason, and submit
2. **Check status**: View your requests with approval status and approver name
3. **See comments**: Read comments from managers/approvers
4. **Check on-call rotation**: View weekly on-call schedule and conflicts

---

## Performance Considerations

- **Database Indexes**: Added for filtering (status, team_member_id)
- **Eager Loading**: LeaveRequest loads approver and comments by default
- **API Response**: Comments included in LeaveRequest response (consider pagination for large datasets)

---

## Future Enhancements

1. **Pagination**: Add pagination for large comment threads
2. **Notifications**: Email/Slack notifications on status changes
3. **Audit Log**: Track all approvals and changes
4. **Advanced Filters**: Date range, combined filters, saved filters
5. **Bulk Operations**: Approve/reject multiple requests
6. **Mobile App**: Native mobile app for approvals
7. **Integrations**: Calendar sync, Slack/Teams integration

---

## Troubleshooting

### Comments not showing
- Clear browser cache
- Verify leave request ID in URL
- Check browser console for API errors

### Replacement suggestions empty
- Verify team members exist
- Check if they have approved leave for that period
- Ensure dates are correct

### Filter not working
- Refresh page to reset filters
- Check that team members are created
- Verify status values (PENDING, APPROVED, REJECTED)

---

## Support

For issues or questions:
1. Check console logs for errors
2. Verify database migrations ran successfully
3. Review test cases for expected behavior
4. Check API response codes (400, 404, 409, etc.)
