-- S1mple Chat — Full Production Schema
-- Run this entire file in your Neon SQL Editor

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONVERSATIONS (supports 1-to-1 and group chats)
CREATE TABLE IF NOT EXISTS conversations (
  id                SERIAL PRIMARY KEY,
  is_group          BOOLEAN DEFAULT FALSE,
  group_name        VARCHAR(100),
  group_avatar_url  TEXT,
  group_description TEXT,
  group_created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONVERSATION MEMBERS
CREATE TABLE IF NOT EXISTS conversation_members (
  id                SERIAL PRIMARY KEY,
  conversation_id   INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id           INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(conversation_id, user_id)
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id                SERIAL PRIMARY KEY,
  conversation_id   INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content           TEXT NOT NULL,
  message_type      VARCHAR(20) DEFAULT 'text',   -- text | image | file | audio
  file_url          TEXT,
  file_name         TEXT,
  file_size         BIGINT,
  is_read           BOOLEAN DEFAULT FALSE,
  is_deleted        BOOLEAN DEFAULT FALSE,
  deleted_at        TIMESTAMP,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
