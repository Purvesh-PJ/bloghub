# Data Model

BlogHub stores its data in nine MongoDB collections, defined as Mongoose schemas. This document shows how they relate. For where the database sits in the system see [Architecture](ARCHITECTURE.md).

## Design choices worth knowing

- **Follows have no collection of their own.** Followers and followings are stored as arrays of user IDs on `UserProfile`, so a profile lookup needs only one query.
- **Likes cannot be duplicated.** `Like` has a unique index on `{ post, user }`. Even if someone double-clicks or two requests arrive at the same moment, the database rejects the second one.
- **`editedAt` is separate from `updatedAt`.** Mongoose changes `updatedAt` whenever anything changes, including a new like or comment. `editedAt` changes only when the author edits the post, so the "edited" label in the UI is truthful.

## Entity relationships

```mermaid
erDiagram
    USER ||--|| USER_PROFILE : "has profile"
    USER ||--|| USER_SETTING : "has settings"
    USER ||--o{ POST : "authors"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ LIKE : "gives"
    USER ||--o{ VIEW : "generates"
    USER ||--o{ READ : "completes"
    POST ||--o{ COMMENT : "contains"
    POST ||--o{ LIKE : "receives"
    POST ||--o{ VIEW : "accumulates"
    POST ||--o{ READ : "achieves"
    POST }o--o{ TAG : "tagged with"
    COMMENT ||--o{ COMMENT : "replies to (parent)"

    USER {
        ObjectId _id PK
        string username UK
        string email UK
        string password "Bcrypt hash (12 rounds)"
        string_array roles "['user', 'admin']"
        int tokenVersion "Session counter for instant revocation"
        boolean suspended "Administrative lock"
        date suspendedAt
        ObjectId profile FK
        ObjectId settings FK
        date createdAt
        date updatedAt
    }

    USER_PROFILE {
        ObjectId _id PK
        ObjectId user FK "Unique 1:1 ref"
        string fullName
        string bio
        string location
        string website
        ObjectId_array followers "User ID array"
        ObjectId_array followings "User ID array"
    }

    USER_SETTING {
        ObjectId _id PK
        ObjectId user FK "Unique 1:1 ref"
        string theme "'light' | 'dark' | 'system'"
        boolean emailNotifications
        boolean showEmail
        boolean showActivity
        string fontSize "'sm' | 'md' | 'lg'"
    }

    POST {
        ObjectId _id PK
        ObjectId user FK "Author ref"
        string title
        string slug UK "Collision-free unique slug"
        string visibility "'draft' | 'private' | 'public'"
        string content "Bounded Markdown text (<= 100k chars)"
        string imageURL
        ObjectId_array tags "Tag refs"
        date editedAt "Last manual author edit"
        date createdAt
        date updatedAt
    }

    TAG {
        ObjectId _id PK
        string name UK "Normalized lowercase"
        ObjectId_array posts "Post refs"
    }

    COMMENT {
        ObjectId _id PK
        ObjectId user FK "Author ref"
        ObjectId post FK "Post ref"
        ObjectId parent FK "Parent comment ref (null for top-level)"
        string message "Bounded text (<= 5k chars)"
        ObjectId_array likes "User refs"
        ObjectId_array dislikes "User refs"
        int replyCount
        date createdAt
    }

    LIKE {
        ObjectId _id PK
        ObjectId user FK "Compound UK {post: 1, user: 1}"
        ObjectId post FK "Compound UK {post: 1, user: 1}"
        date createdAt
    }

    VIEW {
        ObjectId _id PK
        ObjectId user FK "Optional (signed-in user)"
        ObjectId post FK "Post ref"
        string visitorKey "Index: {post: 1, visitorKey: 1, createdAt: -1}"
        date createdAt
    }

    READ {
        ObjectId _id PK
        ObjectId user FK "Optional (signed-in user)"
        ObjectId post FK "Post ref"
        string visitorKey "Index: {post: 1, visitorKey: 1, createdAt: -1}"
        date createdAt
    }
```