CREATE TABLE team_members (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    rotation_order INT NOT NULL
);

CREATE TABLE leave_requests (
    id              BIGSERIAL PRIMARY KEY,
    team_member_id  BIGINT NOT NULL REFERENCES team_members(id),
    approver_id     BIGINT REFERENCES team_members(id),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    reason          TEXT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at     TIMESTAMPTZ,
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

CREATE TABLE leave_comments (
    id              BIGSERIAL PRIMARY KEY,
    leave_request_id BIGINT NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    author_id       BIGINT NOT NULL REFERENCES team_members(id),
    comment_text    TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leave_requests_member_dates
    ON leave_requests (team_member_id, start_date, end_date);

CREATE INDEX idx_leave_comments_request
    ON leave_comments (leave_request_id);

CREATE INDEX idx_leave_requests_status
    ON leave_requests (status);

INSERT INTO team_members (name, email, rotation_order) VALUES
    ('Alice',   'alice@team.com',   0),
    ('Bob',     'bob@team.com',     1),
    ('Charlie', 'charlie@team.com', 2),
    ('Diana',   'diana@team.com',   3);
