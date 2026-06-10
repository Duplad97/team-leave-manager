# Project Overview

This project simple web application where a team can manage leave requests and see who is on
call

The application should allow users to:
- View team members
- Create a leave request for a team member
- View leave requests in a list or calendar-style view
- Prevent overlapping leave requests for the same person
- Mark leave requests as one of:
  - Pending
  - Approved
  - Rejected
- View an on-call rotation schedule
- Show clearly when the on-call person is on leave

---

# Core Features

## Team Members
Prepopulated sample team members
No user registration or authentication is required.

## Leave Request Fields
Each leave request should include:
- Team member
- Start date
- End date
- Reason
- Status

## On-Call Rotation
Implement a simple weekly on-call rotation.
Example:
- Week 1: Alice
- Week 2: Bob
- Week 3: Charlie
- Week 4: Diana
- Then repeat

The application should show who is on call for each week.
If the on-call person has approved leave during that week, the UI should highlight this as a
conflict.

---

# Technical Stack

## Frontend

- React
- TypeScript

#### State Management

- Jotai

#### Styling

- Material UI (MUI) as UI library
- Clean and modern design

## Backend

#### API
- Java SpringBoot

#### Database
 - Supabase

Use Docker to containerize the project.

---

# Coding Guidelines

## TypeScript

- Use strict mode
- Avoid `any`
- Prefer explicit types

Good:

```ts
const landmarks: HandLandmark[] = [];
```

Bad:

```ts
const landmarks: any = [];
```

---

## React

Use:

- Functional components
- Custom hooks
- Composition

Avoid:

- Class components

---

# Development Philosophy

Focus on:

- Fast iteration
- Simple architecture
- Modular design

Build an MVP first.

Do not over-engineer.
