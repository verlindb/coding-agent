# Pluralsight MCP Server

A Model Context Protocol (MCP) server that provides integration with the Pluralsight API, allowing AI assistants to access Pluralsight's learning platform functionality.

## Features

- **Course Search**: Search for courses with filters by level, skill path, and tags
- **Course Details**: Get detailed information about specific courses
- **Learning Paths**: Access available learning paths and their contents
- **User Progress**: Track user progress across courses
- **Skill Assessment**: Get skill assessments and course recommendations
- **Dockerized**: Fully containerized for easy deployment

## Available Tools

### `search_courses`
Search for Pluralsight courses by query and optional filters.

**Parameters:**
- `query` (required): Search query for courses
- `level` (optional): Course difficulty level (Beginner, Intermediate, Advanced)
- `skillPath` (optional): Skill path to filter by
- `tag` (optional): Tag to filter by

### `get_course`
Get detailed information about a specific course.

**Parameters:**
- `courseId` (required): The ID of the course to retrieve

### `get_learning_paths`
Get available learning paths.

**Parameters:** None

### `get_user_progress`
Get user progress for courses.

**Parameters:**
- `userId` (required): The ID of the user

### `get_skill_assessment`
Get skill assessment information and recommendations.

**Parameters:**
- `skillName` (required): Name of the skill to assess

## Setup

### Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- Pluralsight API key (if available)

### Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PLURALSIGHT_API_KEY=your_pluralsight_api_key_here
PLURALSIGHT_BASE_URL=https://app.pluralsight.com/api
MCP_SERVER_PORT=3000
```

## Installation & Usage

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Run the server:
```bash
npm start
```

4. For development with auto-reload:
```bash
npm run dev
```

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Run in detached mode:
```bash
docker-compose up -d --build
```

3. View logs:
```bash
docker-compose logs -f
```

4. Stop the service:
```bash
docker-compose down
```

### Manual Docker Build

```bash
# Build the TypeScript code
npm run build

# Build Docker image
docker build -t pluralsight-mcp-server .

# Run container
docker run -p 3000:3000 --env-file .env pluralsight-mcp-server
```

## MCP Client Integration

This server implements the Model Context Protocol and can be used with any MCP-compatible client. The server communicates via stdio by default.

### Example Client Configuration

For Claude Desktop or other MCP clients, add this server to your configuration:

```json
{
  "mcpServers": {
    "pluralsight": {
      "command": "node",
      "args": ["/path/to/pluralsight-mcp-server/dist/index.js"],
      "env": {
        "PLURALSIGHT_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## API Integration

**Note**: This implementation includes mock data for demonstration purposes. To integrate with the real Pluralsight API, you would need:

1. Valid Pluralsight API credentials
2. Access to Pluralsight's developer API
3. Proper authentication setup

The current implementation gracefully falls back to mock data when real API calls fail, making it suitable for testing and development.

## Development

### Project Structure

```
src/
├── index.ts              # Main MCP server implementation
├── pluralsight-api.ts    # Pluralsight API client wrapper
├── types.ts              # TypeScript type definitions
dist/                     # Compiled JavaScript output
docker-compose.yml        # Docker Compose configuration
Dockerfile               # Container definition
package.json             # Node.js project configuration
tsconfig.json           # TypeScript configuration
```

### Adding New Tools

To add new MCP tools:

1. Add the tool definition in the `ListToolsRequestSchema` handler
2. Add the corresponding handler method
3. Implement the API integration in `pluralsight-api.ts`
4. Update this documentation

### Testing

The server includes mock data that allows testing all functionality without requiring actual API access:

```bash
# Test the build
npm run build

# Test the server (should start without errors)
npm start
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
